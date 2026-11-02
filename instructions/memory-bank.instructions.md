---
name: memory-bank-rules
description: 'Rules for reading and updating the project memory bank'
applyTo: '**'
---

# Memory bank rules

Applies only if `memory-bank/` exists in the workspace. If it does not, ignore this file.

## Reading (start of any non-trivial task)
1. Always read `memory-bank/activeContext.md` and `memory-bank/progress.md`.
2. If present, read `memory-bank/tasks/_index.md` and retrieve only task records relevant to the current request; read at most three matching records. Search older task records by cue when needed, but do not load all task history.
3. Read on demand: `projectbrief.md` for scope questions, `techContext.md` for setup, stack and commands, `systemPatterns.md` for design or refactoring, `decisions/*` before changing architecture.

## Writing (end of a task)
Update memory after you finish a feature or fix, make a design decision, discover a non-obvious gotcha, or when asked to "update memory".
- `activeContext.md`: current focus, recent changes, next steps. Overwrite, keep under ~60 lines.
- `progress.md`: move items between Done / In progress / Todo, record known issues.
- `tasks/TASK-YYYYMMDD-title.md`: for substantial implementation or debugging work, maintain a concise episode with the request, goal, relevant cues, key decisions, outcome, and verification. Keep its status and one-line retrieval cues in `tasks/_index.md`.
- `decisions/NNNN-title.md`: one file per significant decision (context, decision, alternatives, consequences).
- `systemPatterns.md` and `techContext.md`: only when architecture or stack actually changed.

## Rules
- Record facts and reasoning, not a narration of what you did.
- If a memory bank predates task records, ask the user to upgrade the extension and rerun **Memory Bank: Initialize**; initialization adds missing templates without overwriting existing files.
- Never store secrets, credentials, tokens or personal data.
- Do not duplicate what the code or README already says clearly; link instead.
- Task records preserve useful episodes, not full chat transcripts. Record verified reusable lessons, avoid speculative conclusions, and never store secrets or personal data.
- If memory contradicts the code, trust the code and fix the memory.
- Mark anything you could not verify as `UNKNOWN` rather than guessing.
