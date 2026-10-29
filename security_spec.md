# Nureoplastic Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Identity Integrity (`BlogMonograph`)**: A blog document at `/blogs/{blogId}` can only be created or updated if `authorUid == request.auth.uid`, `request.auth.token.email_verified == true`, and `blogId` matches `^[a-zA-Z0-9_\-]+$`.
2. **Immortal Ownership & Creation Time**: During updates to `/blogs/{blogId}` or `/comments/{commentId}`, `authorUid`, `id`, and `createdAt` must remain strictly immutable (`incoming().authorUid == existing().authorUid && incoming().createdAt == existing().createdAt`).
3. **Temporal Integrity**: Every `create` operation must set `createdAt == request.time` (and `updatedAt == request.time`), and every `update` operation must set `updatedAt == request.time`.
4. **Query Enforcer (No Blanket Reads)**: `list` and `get` queries on `/blogs/{blogId}` and `/comments/{commentId}` must explicitly verify `resource.data.isPublic == true || (isSignedIn() && resource.data.authorUid == request.auth.uid)`.
5. **Private Vault Isolation**: `/users/{userId}/vault/{vaultId}` is strictly isolated to `isSignedIn() && request.auth.uid == userId && resource.data.userId == request.auth.uid`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on `/blogs/{blogId}`**: Adding `"isAdmin": true` alongside valid fields — rejected by `.keys().hasOnly(...)`.
2. **Identity Spoofing on `/blogs/{blogId}`**: Authenticated user `uid_A` setting `authorUid: "uid_B"` — rejected by `data.authorUid == request.auth.uid`.
3. **Unverified Email Write**: Authenticated token with `email_verified: false` attempting `create` on `/blogs/{blogId}` — rejected by `isVerifiedUser()`.
4. **Oversized String Denial-of-Wallet**: Sending a 50,000-char `title` to `/blogs/{blogId}` — rejected by `data.title.size() <= 300`.
5. **ID Poisoning Attack**: Creating a document with path ID containing spaces or special characters — rejected by `isValidId(blogId)`.
6. **Timestamp Forgery**: Client passing a past or future `createdAt` timestamp instead of `serverTimestamp()` — rejected by `incoming().createdAt == request.time`.
7. **Ownership Hijack on Update**: Updating `authorUid` on an existing `/blogs/{blogId}` document — rejected by `affectedKeys().hasOnly(...)` and immutability check.
8. **Tag Array Explosion**: Passing 50 tags in `tags` array — rejected by `data.tags.size() <= 10`.
9. **Arbitrary Upvote Inflation on `/comments/{commentId}`**: Incrementing `upvotes` by +100 in a single update — rejected by `incoming().upvotes == existing().upvotes + 1`.
10. **Cross-User Vault Read**: User `uid_A` attempting `get` or `list` on `/users/uid_B/vault` — rejected by `request.auth.uid == userId && resource.data.userId == request.auth.uid`.
11. **Invalid Enum Value**: Setting `pillar: "astrology"` on `/blogs/{blogId}` — rejected by `data.pillar in ['worldview', 'psychology', 'philosophy', 'ai', 'psychoanalysis']`.
12. **Update-Gap Type Poisoning**: Updating `title` on `/blogs/{blogId}` to a boolean `true` — rejected because `isValidBlog(incoming())` wraps the entire `allow update` expression.
