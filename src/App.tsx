import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ESSAYS,
  INITIAL_COMMENTS,
  PILLAR_METADATA,
  EssayItem,
  EssayComment,
  PillarId,
} from "./data/essays.ts";
import { useTactileAudio } from "./hooks/useTactileAudio.ts";
import { NotionMascot } from "./components/NotionMascot.tsx";
import { NureoplasticLogo } from "./components/NureoplasticLogo.tsx";
import { SynapseGraph2D } from "./components/SynapseGraph2D.tsx";
import { ThreeSynapseScene } from "./components/ThreeSynapseScene.tsx";
import { CognitiveReader } from "./components/CognitiveReader.tsx";
import { SynapseVaultDrawer, VaultItem } from "./components/SynapseVaultDrawer.tsx";
import { BlogCreatorModal } from "./components/BlogCreatorModal.tsx";
import {
  auth,
  onAuthStateChanged,
  signInScholarWithGoogle,
  signOutScholar,
  saveBlogToFirestore,
  deleteBlogFromFirestore,
  subscribeToPublicBlogs,
  saveCommentToFirestore,
  upvoteCommentInFirestore,
  subscribeToPublicComments,
  saveVaultNoteToFirestore,
  deleteVaultNoteFromFirestore,
  subscribeToUserVault,
  User,
} from "./firebase.ts";
import {
  Search,
  Volume2,
  VolumeX,
  Bookmark,
  ArrowRight,
  Layers,
  Box,
  PenTool,
  MessageSquareQuote,
  LogIn,
  LogOut,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const audio = useTactileAudio();

  // Firebase Auth & Cloud Firestore Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [dbSyncStatus, setDbSyncStatus] = useState<"synced" | "saving" | "local">("synced");
  const cloudBlogIdsRef = useRef<Set<string>>(new Set());
  const cloudCommentIdsRef = useRef<Set<string>>(new Set());

  // Navigation & View state
  const [activeEssayId, setActiveEssayId] = useState<string | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [heroViewMode, setHeroViewMode] = useState<"2d" | "3d">("2d");

  // Custom & Updated Blogs State
  const [customEssays, setCustomEssays] = useState<EssayItem[]>(() => {
    try {
      const stored = localStorage.getItem("nureo_custom_essays");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Blog Creator / Customizer Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false);
  const [editingEssay, setEditingEssay] = useState<EssayItem | null>(null);

  // Interactive Comments State
  const [comments, setComments] = useState<EssayComment[]>(() => {
    try {
      const stored = localStorage.getItem("nureo_comments");
      return stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // XP Progress State
  const [totalXP, setTotalXP] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("nureo_xp") || "120", 10);
    } catch {
      return 120;
    }
  });

  // Mastered Essays
  const [masteredEssays, setMasteredEssays] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("nureo_mastered");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Synapse Vault items
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      const stored = localStorage.getItem("nureo_vault");
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: "init-1",
              text: "Attention mechanisms do not discriminate between semantic conviction and mere syntactical fluency.",
              pillar: "ai",
              essayTitle: "Entropy-Guided Context Pruning",
              userNote: "Thermodynamic pruning removes the noise while preserving the proposition.",
              createdAt: "2026-10-28T12:00:00Z",
            },
            {
              id: "init-2",
              text: "We do not confess our symptoms to the algorithm to be cured of them; we prompt the machine so our symptoms can be rendered in higher resolution.",
              pillar: "psychoanalysis",
              essayTitle: "The Algorithmic Unconscious & Digital Transference",
              userNote: "Lacanian mirror stage applied to transformer sycophancy.",
              createdAt: "2026-10-28T14:30:00Z",
            },
          ];
    } catch {
      return [];
    }
  });

  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);

  // 1. Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return () => unsub();
  }, []);

  // 2. Load from Server DB on initial mount so any previously saved blogs are available immediately
  useEffect(() => {
    fetch("/api/db/blogs")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.blogs && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setCustomEssays((prev) => {
            const map = new Map(prev.map((e) => [e.id, e]));
            for (const b of data.blogs) {
              map.set(b.id, b);
            }
            return Array.from(map.values());
          });
        }
        if (data?.comments && Array.isArray(data.comments) && data.comments.length > 0) {
          setComments((prev) => {
            const map = new Map(prev.map((c) => [c.id, c]));
            for (const c of data.comments) {
              map.set(c.id, c);
            }
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  // 3. Subscribe to Cloud Firestore real-time collections once Auth is ready
  useEffect(() => {
    if (!isAuthReady) return;

    const unsubBlogs = subscribeToPublicBlogs((cloudEssays, cloudIds) => {
      cloudBlogIdsRef.current = cloudIds;
      if (cloudEssays.length > 0) {
        setCustomEssays((prev) => {
          const map = new Map(prev.map((e) => [e.id, e]));
          for (const ce of cloudEssays) {
            map.set(ce.id, ce);
          }
          return Array.from(map.values());
        });
      }
      setDbSyncStatus("synced");
    });

    const unsubComments = subscribeToPublicComments((cloudComments, cloudIds) => {
      cloudCommentIdsRef.current = cloudIds;
      if (cloudComments.length > 0) {
        setComments((prev) => {
          const map = new Map(prev.map((c) => [c.id, c]));
          for (const cc of cloudComments) {
            const existing = map.get(cc.id);
            map.set(cc.id, {
              ...cc,
              replies: existing?.replies || cc.replies || [],
            });
          }
          return Array.from(map.values());
        });
      }
    });

    let unsubVault: (() => void) | undefined;
    if (currentUser) {
      unsubVault = subscribeToUserVault(currentUser.uid, (cloudVault) => {
        if (cloudVault.length > 0) {
          setVaultItems((prev) => {
            const map = new Map(prev.map((v) => [v.id, v]));
            for (const cv of cloudVault) {
              map.set(cv.id, cv);
            }
            return Array.from(map.values());
          });
        }
      });
    }

    return () => {
      unsubBlogs();
      unsubComments();
      if (unsubVault) unsubVault();
    };
  }, [isAuthReady, currentUser]);

  // Merge built-in ESSAYS with any user-created or user-customized essays from Database
  const allEssays = useMemo(() => {
    const customMap = new Map(customEssays.map((e) => [e.id, e]));
    const mergedBuiltIns = ESSAYS.map((builtIn) => customMap.get(builtIn.id) || builtIn);
    const purelyNewCustom = customEssays.filter(
      (ce) => !ESSAYS.some((b) => b.id === ce.id)
    );
    return [...purelyNewCustom, ...mergedBuiltIns];
  }, [customEssays]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem("nureo_xp", totalXP.toString());
      localStorage.setItem("nureo_mastered", JSON.stringify(masteredEssays));
      localStorage.setItem("nureo_vault", JSON.stringify(vaultItems));
      localStorage.setItem("nureo_custom_essays", JSON.stringify(customEssays));
      localStorage.setItem("nureo_comments", JSON.stringify(comments));
    } catch {}
  }, [totalXP, masteredEssays, vaultItems, customEssays, comments]);

  // Filtered essays
  const filteredEssays = useMemo(() => {
    return allEssays.filter((item) => {
      const matchesPillar = selectedPillar === "all" || item.pillar === selectedPillar;
      const matchesSearch =
        item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesPillar && matchesSearch;
    });
  }, [allEssays, selectedPillar, searchFilter]);

  const activeEssay = useMemo(() => {
    return allEssays.find((e) => e.id === activeEssayId) || null;
  }, [allEssays, activeEssayId]);

  const handleSelectEssay = (id: string) => {
    audio.playClick();
    setActiveEssayId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignInAndSync = async () => {
    audio.playClick();
    try {
      const user = await signInScholarWithGoogle();
      if (user && customEssays.length > 0) {
        setDbSyncStatus("saving");
        for (const essay of customEssays) {
          const isExisting = cloudBlogIdsRef.current.has(essay.id);
          await saveBlogToFirestore(essay, user.uid, isExisting);
          cloudBlogIdsRef.current.add(essay.id);
        }
        setDbSyncStatus("synced");
      }
    } catch (err) {
      console.error("Google Sign-In cancelled or failed:", err);
    }
  };

  const handleSaveCustomEssay = async (savedEssay: EssayItem) => {
    audio.playSuccessChord();
    setDbSyncStatus("saving");

    // 1. Update React state immediately
    setCustomEssays((prev) => {
      const exists = prev.some((e) => e.id === savedEssay.id);
      if (exists) {
        return prev.map((e) => (e.id === savedEssay.id ? savedEssay : e));
      }
      return [savedEssay, ...prev];
    });
    setTotalXP((prev) => prev + 30);
    setActiveEssayId(savedEssay.id);

    // 2. Persist to Server Database (/api/db/blogs)
    fetch("/api/db/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ essay: savedEssay }),
    }).catch(() => {});

    // 3. Persist to Cloud Firestore (/blogs/{blogId}) if authenticated
    if (currentUser) {
      try {
        const isExisting = cloudBlogIdsRef.current.has(savedEssay.id);
        await saveBlogToFirestore(savedEssay, currentUser.uid, isExisting);
        cloudBlogIdsRef.current.add(savedEssay.id);
        setDbSyncStatus("synced");
      } catch {
        setDbSyncStatus("local");
      }
    } else {
      setDbSyncStatus("synced");
    }
  };

  const handleDeleteCustomEssay = async (essayId: string) => {
    audio.playClick();
    setCustomEssays((prev) => prev.filter((e) => e.id !== essayId));
    if (activeEssayId === essayId) {
      setActiveEssayId(null);
    }

    fetch(`/api/db/blogs/${encodeURIComponent(essayId)}`, {
      method: "DELETE",
    }).catch(() => {});

    if (currentUser && cloudBlogIdsRef.current.has(essayId)) {
      try {
        await deleteBlogFromFirestore(essayId);
        cloudBlogIdsRef.current.delete(essayId);
      } catch {}
    }
  };

  const handleAddComment = async (
    newComment: Omit<EssayComment, "id" | "createdAt" | "upvotes" | "replies">
  ) => {
    const commentObj: EssayComment = {
      ...newComment,
      id: `cmt-${Date.now()}`,
      createdAt: "Just now",
      upvotes: 1,
      replies: [],
    };
    setComments((prev) => [commentObj, ...prev]);
    setTotalXP((prev) => prev + 15);

    fetch("/api/db/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: commentObj }),
    }).catch(() => {});

    if (currentUser) {
      try {
        await saveCommentToFirestore(commentObj, currentUser.uid);
        cloudCommentIdsRef.current.add(commentObj.id);
      } catch {}
    }
  };

  const handleReplyComment = (commentId: string, author: string, role: string, body: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const updated = {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: `rep-${Date.now()}`,
              author,
              role,
              body,
              createdAt: "Just now",
            },
          ],
        };
        fetch("/api/db/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: updated }),
        }).catch(() => {});
        return updated;
      })
    );
  };

  const handleUpvoteComment = async (commentId: string) => {
    let nextVotes = 1;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        nextVotes = c.upvotes + 1;
        const updated = { ...c, upvotes: nextVotes };
        fetch("/api/db/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: updated }),
        }).catch(() => {});
        return updated;
      })
    );

    if (currentUser && cloudCommentIdsRef.current.has(commentId)) {
      try {
        await upvoteCommentInFirestore(commentId, nextVotes);
      } catch {}
    }
  };

  const handleSaveToVault = async (item: {
    text: string;
    pillar: string;
    essayTitle: string;
    userNote?: string;
  }) => {
    const newItem: VaultItem = {
      id: `vault-${Date.now()}`,
      text: item.text,
      pillar: item.pillar,
      essayTitle: item.essayTitle,
      userNote: item.userNote,
      createdAt: new Date().toISOString(),
    };
    setVaultItems((prev) => [newItem, ...prev]);

    if (currentUser) {
      try {
        await saveVaultNoteToFirestore(newItem, currentUser.uid);
      } catch {}
    }
  };

  const handleDeleteVaultItem = async (id: string) => {
    audio.playClick();
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
    if (currentUser) {
      try {
        await deleteVaultNoteFromFirestore(id, currentUser.uid);
      } catch {}
    }
  };

  const handleCompleteMastery = (essayId: string, xp: number) => {
    if (!masteredEssays.includes(essayId)) {
      setMasteredEssays((prev) => [...prev, essayId]);
      setTotalXP((prev) => prev + xp);
    }
  };

  // If viewing an essay in the Cognitive Reader:
  if (activeEssay) {
    return (
      <>
        <CognitiveReader
          essay={activeEssay}
          onBack={() => {
            audio.playClick();
            setActiveEssayId(null);
          }}
          onEditEssay={(essayToEdit) => {
            setEditingEssay(essayToEdit);
            setIsCreatorOpen(true);
          }}
          onSaveToVault={handleSaveToVault}
          onCompleteMastery={handleCompleteMastery}
          isMastered={masteredEssays.includes(activeEssay.id)}
          savedAnnotationIds={vaultItems.map((v) => v.id)}
          comments={comments}
          onAddComment={handleAddComment}
          onReplyComment={handleReplyComment}
          onUpvoteComment={handleUpvoteComment}
          audio={audio}
        />

        <BlogCreatorModal
          isOpen={isCreatorOpen}
          onClose={() => {
            setIsCreatorOpen(false);
            setEditingEssay(null);
          }}
          onSaveEssay={handleSaveCustomEssay}
          onDeleteEssay={handleDeleteCustomEssay}
          initialEssay={editingEssay}
          onPlayClick={() => audio.playClick()}
        />
      </>
    );
  }

  const pillarList: { id: "all" | PillarId; label: string; symbol?: string; btnClass?: string }[] = [
    { id: "all", label: `All Synapses (${allEssays.length})` },
    { id: "worldview", label: "World View", symbol: "Ω", btnClass: "duo-btn-world" },
    { id: "psychology", label: "Psychology", symbol: "Ψ", btnClass: "duo-btn-bio" },
    { id: "philosophy", label: "Philosophy", symbol: "Φ", btnClass: "duo-btn-phil" },
    { id: "ai", label: "AI Research", symbol: "λ", btnClass: "duo-btn-ai" },
    { id: "psychoanalysis", label: "Psychoanalysis", symbol: "Δ", btnClass: "duo-btn-psycho" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#191919] font-ui antialiased flex flex-col">
      {/* Top Institutional & Tactile Command Bar */}
      <header className="sticky top-0 z-40 bg-[#F7F6F3]/95 backdrop-blur-xs border-b-2 border-[#191919] px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Identity with Sculpted Woven-Mind Logo */}
          <div className="flex items-center gap-3.5">
            <NureoplasticLogo
              variant="mark"
              size={44}
              onClick={() => audio.playClick()}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-[#191919]">
                  Nureoplastic
                </span>
                <span className="text-[11px] font-code text-[#5A5955]">
                  · {dbSyncStatus === "saving" ? "Syncing..." : "Database Active"}
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-ui text-[#5A5955] -mt-0.5">
                World View · Psychology · Philosophy · AI Research · Psychoanalysis
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Primary Write Blog Button */}
            <button
              onClick={() => {
                audio.playClick();
                setEditingEssay(null);
                setIsCreatorOpen(true);
              }}
              className="duo-btn duo-btn-phil text-xs font-ui font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Write Blog</span>
            </button>

            {/* Cloud Firestore Google Auth Sync Button */}
            {currentUser ? (
              <button
                onClick={() => {
                  audio.playClick();
                  signOutScholar();
                }}
                className="duo-btn text-xs font-ui font-extrabold px-3 py-2 rounded-xl bg-[#ECF9E0] text-[#191919] flex items-center gap-1.5"
                title={`Signed in as ${currentUser.displayName || currentUser.email} — Click to sign out`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#439C00]" />
                <span className="hidden lg:inline">
                  {currentUser.displayName?.split(" ")[0] || "Cloud Synced"}
                </span>
                <LogOut className="w-3 h-3 text-[#5A5955]" />
              </button>
            ) : (
              <button
                onClick={handleSignInAndSync}
                className="duo-btn text-xs font-ui font-extrabold px-3 py-2 rounded-xl bg-white text-[#191919] flex items-center gap-1.5"
                title="Sign in with Google to sync blogs across devices via Cloud Firestore"
              >
                <LogIn className="w-3.5 h-3.5 text-[#1CB0F6]" />
                <span className="hidden lg:inline">Cloud Sync</span>
              </button>
            )}

            {/* Synapse Vault Trigger */}
            <button
              onClick={() => {
                audio.playClick();
                setIsVaultOpen(true);
              }}
              className="duo-btn text-xs font-ui font-extrabold px-3 py-2 rounded-xl bg-white text-[#191919] flex items-center gap-1.5"
              title="Open Synapse Vault"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#191919]" />
              <span className="hidden sm:inline">Vault</span>
              <span className="font-code text-[11px] text-[#5A5955]">({vaultItems.length})</span>
            </button>

            {/* Audio Mute Switch */}
            <button
              onClick={audio.toggleMute}
              className="duo-btn p-2 rounded-xl bg-white text-[#191919]"
              title={audio.isMuted ? "Unmute procedural Web Audio sounds" : "Mute sounds"}
            >
              {audio.isMuted ? (
                <VolumeX className="w-4 h-4 text-[#FF4B4B]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#58CC02]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Editorial Proposition, Interwoven Mind Brand Emblem & Symposium Stage */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: High-Craft Editorial Typography & Woven-Mind Emblem */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-code font-bold uppercase tracking-widest text-[#5A5955]">
              INTERACTIVE DIGITAL GARDEN · FIVE INTELLECTUAL DOMAINS
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[50px] font-bold text-[#191919] leading-[1.06] tracking-tight">
              Where World View, Psyche &amp; Neural Architecture Converge.
            </h1>

            {/* Signature Nureoplastic Interwoven Mind Horizon Emblem */}
            <NureoplasticLogo
              variant="scene"
              onClick={() => audio.playClick()}
            />

            <p className="text-base font-editorial text-[#5A5955] leading-relaxed">
              An interactive monograph studio and cognitive reader exploring{" "}
              <strong className="text-[#191919] font-semibold">World View</strong>,{" "}
              <strong className="text-[#191919] font-semibold">Psychology</strong>,{" "}
              <strong className="text-[#191919] font-semibold">Philosophy</strong>,{" "}
              <strong className="text-[#191919] font-semibold">AI Research</strong>, and{" "}
              <strong className="text-[#191919] font-semibold">Psychoanalysis</strong> through live mathematical sandboxes, database-persisted monographs, and scholarly discourse.
            </p>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5955]" />
              <input
                type="text"
                placeholder="Search essays, thinkers, or concepts (e.g. 'Socrates', 'Lacan', 'entropy')..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs sm:text-sm font-ui pl-10 pr-4 py-3 rounded-2xl border-2 border-[#191919] bg-white shadow-[0_4px_0_0_#191919] focus:outline-none"
              />
            </div>

            {/* Stage Mode & Authoring CTA */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audio.playToggle();
                    setHeroViewMode("2d");
                  }}
                  className={`duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                    heroViewMode === "2d" ? "bg-[#191919] text-white" : "bg-white text-[#191919]"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Classical Symposium</span>
                </button>

                <button
                  onClick={() => {
                    audio.playToggle();
                    setHeroViewMode("3d");
                  }}
                  className={`duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                    heroViewMode === "3d"
                      ? "bg-[#1CB0F6] text-white duo-btn-ai"
                      : "bg-white text-[#191919]"
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Brass Orrery</span>
                </button>
              </div>

              <button
                onClick={() => {
                  audio.playClick();
                  setEditingEssay(null);
                  setIsCreatorOpen(true);
                }}
                className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>+ Publish Own Blog</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Classical Symposium or 3D Brass Orrery */}
          <div className="lg:col-span-7 min-w-0 min-h-[460px]">
            {heroViewMode === "2d" ? (
              <SynapseGraph2D
                essays={allEssays}
                onSelectEssay={handleSelectEssay}
                masteredEssays={masteredEssays}
              />
            ) : (
              <ThreeSynapseScene
                onSelectNode={(name) => {
                  audio.playClick();
                  if (name.includes("Philosophy")) handleSelectEssay("directionless-philosopher");
                  else if (name.includes("AI")) handleSelectEssay("entropy-pruning");
                  else if (name.includes("Psychology")) handleSelectEssay("attractor-escape");
                  else if (name.includes("Psychoanalysis")) handleSelectEssay("algorithmic-unconscious");
                  else if (name.includes("World View")) handleSelectEssay("polycrisis-cartography");
                }}
                activePillarFilter={selectedPillar}
              />
            )}
          </div>
        </div>
      </section>

      {/* 5-Field Domain Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-4 w-full">
        <div className="p-3 bg-white border-2 border-[#191919] shadow-[0_4px_0_0_#191919] rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {pillarList.map((item) => {
              const isSelected = selectedPillar === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    audio.playToggle();
                    setSelectedPillar(item.id);
                  }}
                  className={`duo-btn text-xs font-ui font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? item.btnClass || "bg-[#191919] text-white"
                      : "bg-[#F7F6F3] text-[#191919] hover:bg-[#EFECE6]"
                  }`}
                >
                  {item.symbol && <span className="font-code font-bold">{item.symbol}</span>}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-code text-[#5A5955]">
            {filteredEssays.length} MONOGRAPHS IN DATABASE
          </div>
        </div>
      </section>

      {/* Editorial Bento Essay Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEssays.map((essay, index) => {
            const isFeatured = index === 0 && selectedPillar === "all" && !searchFilter;
            const isMastered = masteredEssays.includes(essay.id);
            const meta = PILLAR_METADATA[essay.pillar] || PILLAR_METADATA.philosophy;
            const essayCommentCount = comments.filter((c) => c.essayId === essay.id).length;

            return (
              <article
                key={essay.id}
                onClick={() => handleSelectEssay(essay.id)}
                className={`group bg-white border-2 border-[#191919] shadow-[0_6px_0_0_#191919] hover:translate-y-[-2px] hover:shadow-[0_8px_0_0_#191919] rounded-3xl p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1"
                }`}
              >
                <div>
                  {/* Clean Editorial Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E2E0DC] text-[11px] font-code">
                    <div className="flex flex-wrap items-center gap-1.5 text-[#191919] font-bold uppercase tracking-wider">
                      <span
                        className="w-2.5 h-2.5 rounded-xs border border-[#191919] inline-block"
                        style={{ backgroundColor: meta.surfaceColor }}
                      />
                      <span>
                        {meta.symbol} {essay.pillarLabel}
                      </span>
                      <span className="text-[#5A5955]">·</span>
                      <span className="text-[#5A5955] font-normal">
                        {essay.readingTimeMinutes} MIN
                      </span>
                      {essay.isCustom && (
                        <>
                          <span className="text-[#5A5955]">·</span>
                          <span className="text-[#439C00] font-bold">DB STORED</span>
                        </>
                      )}
                      {isMastered && (
                        <>
                          <span className="text-[#5A5955]">·</span>
                          <span className="text-[#439C00] font-bold">✓ MASTERED</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[#5A5955]">
                      <span className="flex items-center gap-1" title="Dialectical Discourse Count">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        <span>{essayCommentCount}</span>
                      </span>
                      <span>·</span>
                      <span className="font-bold text-[#191919]">+{essay.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Classical Thinker Medallion Stage */}
                  <div
                    className="my-3 flex items-center justify-between px-5 py-3 rounded-2xl border-2 border-[#191919]"
                    style={{ backgroundColor: meta.tintColor }}
                  >
                    <div className="space-y-1 pr-3">
                      <span className="text-[10px] font-code font-bold uppercase tracking-widest text-[#5A5955] block">
                        {meta.description}
                      </span>
                      <div className="text-xs font-ui font-bold text-[#191919]">
                        By {essay.author || "Nureoplastic Editorial"} · {essay.publishedDate}
                      </div>
                    </div>
                    <NotionMascot
                      variant={meta.mascot}
                      mood="curious"
                      size={isFeatured ? 92 : 82}
                      interactiveEyes={false}
                    />
                  </div>

                  {/* Title & Thesis */}
                  <h3
                    className={`font-display ${
                      isFeatured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
                    } font-bold text-[#191919] group-hover:underline decoration-2 underline-offset-4 leading-snug mt-4 mb-2.5`}
                  >
                    {essay.title}
                  </h3>

                  <p className="font-editorial text-sm sm:text-base text-[#5A5955] leading-relaxed line-clamp-3 mb-5">
                    {essay.subtitle}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-[#E2E0DC] flex items-center justify-between gap-2">
                  <div className="text-[11px] font-code text-[#5A5955] truncate">
                    {essay.tags.map((t) => `#${t}`).join(" · ")}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-ui font-black text-[#191919] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Monograph</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t-2 border-[#191919] bg-white py-10 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <NureoplasticLogo variant="mark" size={48} onClick={() => audio.playClick()} />
            <div>
              <div className="font-display font-bold text-base text-[#191919]">
                Nureoplastic Interactive Monograph Studio
              </div>
              <p className="text-xs font-ui text-[#5A5955]">
                Backed by Cloud Firestore &amp; Persistent Monograph Storage · 5 Intellectual Domains
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-ui font-bold text-[#5A5955]">
            <button
              onClick={() => {
                audio.playClick();
                setEditingEssay(null);
                setIsCreatorOpen(true);
              }}
              className="hover:text-[#191919] hover:underline"
            >
              Publish Custom Monograph
            </button>
            <span>·</span>
            <button
              onClick={() => {
                audio.playClick();
                setIsVaultOpen(true);
              }}
              className="hover:text-[#191919] hover:underline"
            >
              Synapse Vault ({vaultItems.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-Over Synapse Vault Drawer */}
      <SynapseVaultDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        vaultItems={vaultItems}
        onDeleteItem={handleDeleteVaultItem}
      />

      {/* Interactive Blog Creator & Customizer Studio Modal */}
      <BlogCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setEditingEssay(null);
        }}
        onSaveEssay={handleSaveCustomEssay}
        onDeleteEssay={handleDeleteCustomEssay}
        initialEssay={editingEssay}
        onPlayClick={() => audio.playClick()}
      />
    </div>
  );
}
