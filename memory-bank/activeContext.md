# Active context

Volatile. Overwrite each session; keep under ~60 lines. Last updated: 2026-11-02.

## Current focus

- Maintain the memory-bank extension and its presentation artifact.

## Recent changes

- Initialized Git metadata, preserved the remote's initial commit, and pushed the source to `main`.
- Added the README memory lifecycle as a rendered Mermaid slide in the STAR deck; pinned Mermaid 11.17.2 with verified SRI and confirmed local HTML rendering.
- Added a Mermaid memory lifecycle diagram to the README, covering setup, session context, task retrieval, updates, and optional hooks.
- Initialization now copies `templates/copilot-instructions.md` to `.github/copilot-instructions.md` without overwriting an existing file.
- All 9 scaffold tests pass; the 0.2.0 VSIX was rebuilt and archive entries verified.
- Removed the unused `btnNotes` binding from the STAR deck so its script can finish initialization.
- Updated the bundled instructions and STAR deck to match the files and hook behavior actually scaffolded.
- Added extension-developer attribution and an implementation-based feature overview to the STAR deck.
- Added cue-indexed task records and retrieval rules to the extension's scaffold, prompts, instructions, and documentation.
- Rewrote presentation copy in simpler English; checked all five slides for footer overlap in the browser.
- Shortened all six Result-slide bullets while keeping the benchmark numbers unchanged.
- Added representative VS Code workflow snapshots to the STAR deck, based on implemented extension behavior.
- Added a standalone .NET 10 inventory API demo solution and a Higher Management presentation runbook.
- Prepared a timed 10-minute talk and 10-minute live demo script for a mixed technical/non-technical audience.
- Improved contrast and legibility of the extension-snapshot slide labels and captions; verified the rendered layout.
- Updated README commands, task-memory workflow, settings, and hook behavior to match the current implementation.
- Configured `src/img/memory.png` as the extension icon and packaged version `0.3.0`.

## Next steps

- None.

## Open questions and blockers

- `npm test` still fails in this Windows environment because its file glob is passed literally; direct test invocation works.
- Git status, branch, and recent history remain unknown because this exported source folder has no `.git` metadata.
