# Firestore Security Specification

## 1. Data Invariants
1. Every `proposals/{proposalId}` document MUST belong to an authenticated, email-verified user (`ownerId == request.auth.uid`).
2. Users may ONLY read (`get` / `list`), create, update, or delete their own `proposals` and their own `userSettings/{userId}` document (`userId == request.auth.uid`).
3. `ownerId` and `createdAt` are immutable after creation.
4. `createdAt` and `updatedAt` MUST match `request.time` (server timestamp).
5. `status` on a `Proposal` MUST be one of `['Draf', 'Dihantar', 'Diluluskan', 'Ditolak']`.
6. All document IDs (`proposalId`, `userId`) MUST pass `isValidId()` (`^[a-zA-Z0-9_\-]+$`, `<= 128` chars).
7. Every write MUST enforce strict allowed key sets (`hasAll` + `hasOnly` on create, `affectedKeys().hasOnly(...)` on update) and string/numeric bounds to prevent shadow fields and resource exhaustion.

## 2. Adversarial Test Matrix ("Dirty Dozen")
1. Unauthenticated `get`/`list` on `/proposals` -> `PERMISSION_DENIED`
2. Unauthenticated `create` on `/proposals` -> `PERMISSION_DENIED`
3. Cross-user `get` on another user's `/proposals/{id}` -> `PERMISSION_DENIED`
4. Cross-user `list` on `/proposals` without `where('ownerId', '==', uid)` -> `PERMISSION_DENIED`
5. Identity spoofing (`ownerId: 'other_uid'`) on `create` -> `PERMISSION_DENIED`
6. Unverified email (`email_verified: false`) attempting write -> `PERMISSION_DENIED`
7. Shadow field (`isAdmin: true`) injected on `create` or `update` -> `PERMISSION_DENIED`
8. Invalid `status` value (e.g. `'Hack'`) -> `PERMISSION_DENIED`
9. Client-forged `createdAt` or `updatedAt` not equal to `request.time` -> `PERMISSION_DENIED`
10. Mutating `ownerId` or `createdAt` during `update` -> `PERMISSION_DENIED`
11. Oversized document ID (`> 128` chars) or invalid characters -> `PERMISSION_DENIED`
12. Cross-user read/write on `/userSettings/{otherUserId}` containing PII (email/phone/address) -> `PERMISSION_DENIED`
