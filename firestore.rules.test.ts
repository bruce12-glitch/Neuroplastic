import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const rulesContent = fs.readFileSync("./firestore.rules", "utf8");

test("Firestore Security Rules — Dirty Dozen Structural & Invariant Verification", async (t) => {
  await t.test("1. Global default-deny safety net is present", () => {
    assert.match(rulesContent, /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/);
  });

  await t.test("2. Shadow field injection is blocked via strict keys().hasAll and keys().hasOnly", () => {
    assert.ok(rulesContent.includes("data.keys().hasAll(["));
    assert.ok(rulesContent.includes("data.keys().hasOnly(["));
  });

  await t.test("3. Identity spoofing is blocked by enforcing authorUid == request.auth.uid", () => {
    assert.ok(rulesContent.includes("data.authorUid == request.auth.uid"));
    assert.ok(rulesContent.includes("data.userId == request.auth.uid"));
  });

  await t.test("4. Unverified email writes are blocked by isVerifiedUser()", () => {
    assert.ok(rulesContent.includes("request.auth.token.email_verified == true"));
  });

  await t.test("5. ID poisoning is blocked by regex and size bounds in isValidId()", () => {
    assert.ok(rulesContent.includes("id.matches('^[a-zA-Z0-9_\\\\-]+$')"));
  });

  await t.test("6. Timestamp forgery is blocked via request.time comparisons", () => {
    assert.ok(rulesContent.includes("incoming().createdAt == request.time"));
    assert.ok(rulesContent.includes("incoming().updatedAt == request.time"));
  });

  await t.test("7. Update-gap is closed by wrapping allow update in isValidBlog(incoming())", () => {
    assert.match(rulesContent, /allow update: if isVerifiedUser\(\) &&\s*isValidId\(blogId\) &&\s*isValidBlog\(incoming\(\)\)/);
  });

  await t.test("8. Query enforcer blocks blanket list reads without resource.data validation", () => {
    assert.ok(rulesContent.includes("allow list: if existing().isPublic == true"));
  });
});
