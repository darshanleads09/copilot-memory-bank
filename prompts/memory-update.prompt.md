---
name: memory-update
description: 'Update the memory bank from this session and the working tree'
agent: agent
---
Update the memory bank to reflect what happened in this session.

1. Review this conversation and the working tree (`git status`, `git diff`).
2. Update `memory-bank/activeContext.md` (current focus, recent changes, next steps) and `memory-bank/progress.md` (Done / In progress / Todo / Known issues), following the memory bank rules.
3. If this session has a task record, update its status, verified outcome, decisions, checks, and reusable lessons; update its row in `memory-bank/tasks/_index.md`. Do not copy the full conversation.
4. Promote a lesson into `systemPatterns.md`, `techContext.md`, or a decision record only when it is reusable beyond this task and verified.
5. If a significant design decision was made, add `memory-bank/decisions/NNNN-title.md` using the next free number and the template in `0000-template.md`.
6. Do not store secrets or personal data. Do not narrate; record concise facts and reasoning.
7. Show me a brief summary of what you changed in memory.
