import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import type { EssayItem, EssayComment } from "./data/essays.ts";
import type { VaultItem } from "./components/SynapseVaultDrawer.tsx";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export async function signInScholarWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutScholar(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { User };

/**
 * Sanitizes and writes a created or updated blog monograph to Cloud Firestore (/blogs/{blogId})
 */
export async function saveBlogToFirestore(
  essay: EssayItem,
  authorUid: string,
  isExistingInCloud: boolean
): Promise<void> {
  const cleanId = essay.id.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const path = `blogs/${cleanId}`;
  const docRef = doc(db, "blogs", cleanId);

  const safeTags =
    essay.tags && essay.tags.length > 0
      ? essay.tags.slice(0, 10).map((t) => String(t).slice(0, 50))
      : ["Synthesis"];

  const recordData = {
    id: cleanId,
    authorUid,
    title: essay.title.slice(0, 300),
    subtitle: essay.subtitle.slice(0, 600),
    author: (essay.author || "Independent Scholar").slice(0, 120),
    pillar: essay.pillar,
    pillarLabel: essay.pillarLabel.slice(0, 60),
    sandboxType: essay.sandboxType,
    readingTimeMinutes: Math.max(1, Math.min(180, essay.readingTimeMinutes || 5)),
    xpReward: Math.max(0, Math.min(500, essay.xpReward || 50)),
    publishedDate: (essay.publishedDate || "Oct 29, 2026").slice(0, 60),
    tags: safeTags,
    isPublic: true,
    payload: {
      slug: essay.slug,
      isCustom: true,
      prerequisites: essay.prerequisites || ["First-Principles Inquiry"],
      content: essay.content,
      masteryQuiz: essay.masteryQuiz,
      ...(essay.sources ? { sources: essay.sources } : {}),
      ...(essay.editorialNote ? { editorialNote: essay.editorialNote } : {}),
    },
    ...(isExistingInCloud ? {} : { createdAt: serverTimestamp() }),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, recordData, { merge: isExistingInCloud });
  } catch (error) {
    handleFirestoreError(
      error,
      isExistingInCloud ? OperationType.UPDATE : OperationType.CREATE,
      path
    );
  }
}

export async function deleteBlogFromFirestore(blogId: string): Promise<void> {
  const cleanId = blogId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const path = `blogs/${cleanId}`;
  try {
    await deleteDoc(doc(db, "blogs", cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Converts a Firestore /blogs/{blogId} document snapshot back into an EssayItem
 */
export function mapFirestoreDocToEssay(data: Record<string, any>): EssayItem {
  const payload = data.payload || {};
  return {
    id: data.id,
    slug: payload.slug || data.id,
    title: data.title,
    subtitle: data.subtitle,
    author: data.author,
    isCustom: true,
    pillar: data.pillar,
    pillarLabel: data.pillarLabel,
    readingTimeMinutes: data.readingTimeMinutes || 6,
    xpReward: data.xpReward || 50,
    publishedDate: data.publishedDate || "Oct 29, 2026",
    tags: Array.isArray(data.tags) ? data.tags : ["Synthesis"],
    prerequisites: payload.prerequisites || ["First-Principles Inquiry"],
    socraticAnnotations: {},
    content: payload.content || {
      level1: { bullets: [data.subtitle], mentalModelTable: [] },
      level2: { sections: [{ heading: "01. Thesis", paragraphs: [data.subtitle] }] },
      level3: { formalProofTitle: data.title, latexFormulas: [], architecturalProof: [] },
    },
    masteryQuiz: payload.masteryQuiz || {
      question: `What is the central thesis of ${data.title}?`,
      scenario: "Dialectical verification",
      options: [
        { id: "opt-1", text: data.subtitle, isCorrect: true, explanation: "Correct." },
      ],
      hint: "Review Level 1.",
    },
    sandboxType: data.sandboxType || "epistemic",
    ...(Array.isArray(payload.sources) ? { sources: payload.sources } : {}),
    ...(typeof payload.editorialNote === "string" ? { editorialNote: payload.editorialNote } : {}),
  };
}

/**
 * Subscribes to public blogs in Cloud Firestore (/blogs where isPublic == true)
 */
export function subscribeToPublicBlogs(
  onUpdate: (essays: EssayItem[], cloudIds: Set<string>) => void
) {
  const q = query(collection(db, "blogs"), where("isPublic", "==", true));
  return onSnapshot(
    q,
    (snapshot) => {
      const essays: EssayItem[] = [];
      const cloudIds = new Set<string>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudIds.add(docSnap.id);
        essays.push(mapFirestoreDocToEssay(data));
      });
      onUpdate(essays, cloudIds);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "blogs");
    }
  );
}

/**
 * Saves a new comment to Cloud Firestore (/comments/{commentId})
 */
export async function saveCommentToFirestore(
  comment: EssayComment,
  authorUid: string
): Promise<void> {
  const cleanId = comment.id.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const cleanEssayId = comment.essayId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const path = `comments/${cleanId}`;
  try {
    await setDoc(doc(db, "comments", cleanId), {
      id: cleanId,
      essayId: cleanEssayId,
      authorUid,
      author: comment.author.slice(0, 100),
      role: (comment.role || "Scholar").slice(0, 100),
      stance: comment.stance,
      body: comment.body.slice(0, 4000),
      quotedPassage: (comment.quotedPassage || "").slice(0, 1500),
      upvotes: 1,
      isPublic: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function upvoteCommentInFirestore(
  commentId: string,
  nextUpvotes: number
): Promise<void> {
  const cleanId = commentId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const path = `comments/${cleanId}`;
  try {
    await updateDoc(doc(db, "comments", cleanId), {
      upvotes: nextUpvotes,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToPublicComments(
  onUpdate: (comments: EssayComment[], cloudCommentIds: Set<string>) => void
) {
  const q = query(collection(db, "comments"), where("isPublic", "==", true));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: EssayComment[] = [];
      const ids = new Set<string>();
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        ids.add(docSnap.id);
        list.push({
          id: d.id,
          essayId: d.essayId,
          author: d.author,
          role: d.role,
          stance: d.stance,
          quotedPassage: d.quotedPassage || undefined,
          body: d.body,
          createdAt: "Synced in Cloud",
          upvotes: typeof d.upvotes === "number" ? d.upvotes : 1,
          replies: [],
        });
      });
      onUpdate(list, ids);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "comments");
    }
  );
}

/**
 * Saves a personal quote highlight to /users/{userId}/vault/{vaultId}
 */
export async function saveVaultNoteToFirestore(
  item: VaultItem,
  userId: string
): Promise<void> {
  const cleanId = item.id.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const path = `users/${userId}/vault/${cleanId}`;
  try {
    await setDoc(doc(db, "users", userId, "vault", cleanId), {
      id: cleanId,
      userId,
      text: item.text.slice(0, 2000),
      pillar: item.pillar.slice(0, 60),
      essayTitle: item.essayTitle.slice(0, 300),
      userNote: (item.userNote || "").slice(0, 1500),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteVaultNoteFromFirestore(
  vaultId: string,
  userId: string
): Promise<void> {
  const cleanId = vaultId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 128);
  const path = `users/${userId}/vault/${cleanId}`;
  try {
    await deleteDoc(doc(db, "users", userId, "vault", cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserVault(
  userId: string,
  onUpdate: (items: VaultItem[]) => void
) {
  const q = query(
    collection(db, "users", userId, "vault"),
    where("userId", "==", userId)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: VaultItem[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        items.push({
          id: d.id,
          text: d.text,
          pillar: d.pillar,
          essayTitle: d.essayTitle,
          userNote: d.userNote || undefined,
          createdAt: new Date().toISOString(),
        });
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/vault`);
    }
  );
}
