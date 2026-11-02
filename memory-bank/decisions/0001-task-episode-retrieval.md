# 0001. Use cue-indexed task episodes for project memory

- Status: accepted
- Date: 2026-11-01

## Context
Project summaries preserve stable facts but can lose the rationale and outcomes of individual work. Loading every past task into each new session would increase context cost and surface stale or irrelevant decisions.

## Decision
Keep a concise record for each substantial task and a compact index with status, summary, cues, and record path. At task start, retrieve at most three relevant records; search older records by cue when needed. Store verified outcomes and reusable lessons, not full conversation transcripts.

## Alternatives considered
- Load all task history at startup: rejected because most past work is irrelevant to a new task and consumes context.
- Keep only a rolling project summary: rejected because it loses task-specific decisions and verification.

## Consequences
Task-start and memory-update prompts maintain records and the index. Reusable lessons should be promoted into stable project memory or decision records. Existing installations can rerun initialization to add the new templates without overwriting existing files.