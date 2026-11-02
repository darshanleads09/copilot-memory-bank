# Progress

Volatile. Move items between sections as work moves. Last updated: 2026-11-02.

## Done

- Added the Mermaid lifecycle diagram to the STAR deck; verified the local HTML renders it as SVG and navigation shows 7 slides. Pinned the CDN asset with verified SRI.
- Added a Mermaid flow diagram to the README showing memory setup, session context injection, bounded task retrieval, manual updates, and optional Stop-hook reminders.
- Initialized the five core memory files with repository-verified information.
- Verified all 9 tests pass via `node --test test/scaffold.test.js`.
- Initialization installs the bundled Copilot instructions without overwriting an existing workspace file.
- Rebuilt the 0.2.0 VSIX and verified it contains the instructions template and updated scaffolder.
- Removed the unused `btnNotes` event binding from the presentation; confirmed no references remain.
- Aligned the presentation and bundled instructions with the scaffolded memory structure; qualified benchmark results as preliminary.
- Expanded the Action slide with the extension's setup, prompts, commands, hooks, and team settings.
- Added task index/record templates, task lifecycle prompts, bounded retrieval guidance, upgrade backfill note, and scaffold coverage; all 9 tests pass.
- Simplified STAR deck language and confirmed all slides fit above the footer in the browser.
- Shortened the Result-slide bullets; verified the updated slide has no overflow or footer overlap.
- Added a representative extension workflow slide showing initialization, scaffolded memory files, and the prefilled `/memory-init` prompt.
- Confirmed the new slide renders without overlap and is navigable as slide 4 of 6 in the browser.
- Improved snapshot label/caption contrast and text size; confirmed slide 4 remains unclipped in the browser.
- Added `demo-dotnet/`: layered .NET 10 inventory API, SQLite persistence, tests, and a 10-minute extension demo guide.
- Verified full solution build, all 5 tests, API health/list/create, 409 duplicate-SKU response, 400 validation response, and Development OpenAPI.
- Added `demo-dotnet/PRESENTATION-SCRIPT.md` with a timed, word-for-word 10-minute talk and minute-by-minute 10-minute live demo for mixed technical/non-technical management.
- Updated README feature and setup details; verified with the 9-test scaffold suite.
- Set the extension icon, aligned package and lockfile version at `0.3.0`, and verified the rebuilt VSIX includes the manifest reference and PNG.

## In progress

- None.

## Todo

- Verify branch, worktree status, and recent history from a Git clone.
- Confirm the intended Windows-compatible test command and supported Node.js version.

## Known issues

- `npm test` failed in this Windows environment because the test glob was treated as a literal path.
- No `.git` metadata or CI configuration is present in this source snapshot.
