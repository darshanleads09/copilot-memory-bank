---
name: memory-prune
description: 'Condense stale memory-bank content to keep it small and accurate'
agent: agent
---
Prune the memory bank so it stays small and trustworthy.

1. Read `activeContext.md`, `progress.md`, `tasks/_index.md`, and the other memory files relevant to the cleanup. Do not read every task record by default.
2. In `activeContext.md` and `progress.md`, remove finished or obsolete items, merge duplicates, and keep the current state concise.
3. Verify claims in `techContext.md` and `systemPatterns.md` against the code. Fix or remove anything wrong or stale.
4. Keep task records as historical episodes; do not delete them just to reduce prompt context. Remove duplicated or sensitive content, and keep each record focused on request, decisions, outcome, verification, and reusable lessons.
5. Keep `_index.md` concise. If it becomes unwieldy, move older completed rows to `_archive_index.md`; retain their task record files and search them by cue when needed.
6. Leave `decisions/` records intact; if one is superseded, mark its status instead of deleting it.
7. Report what you removed or corrected, and anything you could not verify.
