---
name: task-start
description: 'Load memory-bank context and plan a task before coding'
agent: agent
---
Task: ${input:task:What are you working on?}

Before writing code:
1. Read `memory-bank/activeContext.md`, `memory-bank/progress.md`, and `memory-bank/tasks/_index.md`, then other memory files relevant to the task. If the task index or `tasks/0000-template.md` is missing, ask the user to upgrade the extension and run **Memory Bank: Initialize** to add missing templates, then stop.
2. Match the task's goal, files, and cues against the task index. Read at most three relevant task records; search `memory-bank/tasks/` by cue for older records if needed. Do not load every past task.
3. Restate the task in one or two sentences, noting prior decisions, verified lessons, known issues, and in-flight work that affect it.
4. For substantial implementation or debugging work, create a task record from `memory-bank/tasks/0000-template.md` before coding. Name it `TASK-YYYYMMDD-short-title.md`; add a numeric suffix if that path already exists. Record a concise request, goal, acceptance criteria, cues, and plan, then add an `In progress` row to `_index.md`.
5. List the files you expect to touch and your step-by-step plan.
6. Ask me questions only if the requirements are genuinely ambiguous; otherwise proceed.

When the task is done, update its record and index with verified decisions, outcome, and checks. Keep reusable lessons concise; do not copy the full conversation or store secrets/personal data. Update the memory bank as described in the memory bank rules.
