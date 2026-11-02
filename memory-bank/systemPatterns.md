# System patterns

Semi-stable. Update when architecture or conventions change.

## Architecture overview

`package.json` declares the VS Code extension entry point and contributions. `src/extension.js` handles VS Code commands and lifecycle; `src/scaffold.js` contains filesystem logic that can be tested without VS Code. Templates, prompts, and instructions are packaged as repository files.

## Key components

| Component | Location | Responsibility |
| --- | --- | --- |
| Extension activation and commands | `src/extension.js` | Registers commands, prompts for initialization, and refreshes context. |
| Workspace scaffolding | `src/scaffold.js` | Renders templates and optionally installs hooks, recommendations, and gitignore entries. |
| Memory and hook templates | `templates/` | Source files copied/rendered into initialized workspaces, including task index and task-record templates. |
| Copilot prompts and rules | `prompts/`, `instructions/` | Guide memory initialization, updates, pruning, and task starts. |
| Scaffold tests | `test/scaffold.test.js` | Node built-in tests for scaffold and hook behavior. |
| .NET extension demo | `demo-dotnet/` | Standalone layered inventory API and guided scenario for demonstrating memory across Copilot chats. |

## Patterns and conventions

- Keep filesystem/scaffold logic independent from the VS Code API so Node tests can exercise it.
- Initialization skips existing files; optional integration files are written only when enabled.
- Task memory uses one concise record per substantial task plus a cue-based index; prompts retrieve only relevant episodes instead of loading the full history.
- Tests use `node:test` and temporary directories.

## Data and control flow

- A VS Code command selects a workspace folder and passes its path, template path, settings, and project metadata to `scaffold`.
- The scaffolder renders core memory, task-index, and task-record templates; copies `templates/copilot-instructions.md` to `.github/copilot-instructions.md` if absent; and conditionally installs hooks or updates workspace configuration files.
- SessionStart hooks inject active context and progress; the Stop hook can request a memory update after code changes.
- `/task-start` records substantial work and searches task history by cues; `/memory-update` closes the episode with verified outcomes and updates the index.

## Gotchas

- In this Windows environment, the declared `npm test` glob is not expanded and fails; direct invocation of `node --test test/scaffold.test.js` passes.
- Hooks require `chat.useHooks`, a trusted workspace, and Node.js on PATH; the Stop hook skips non-Git folders (README).
- This source snapshot has no `.git` metadata or CI workflow, so branch, worktree status, and recent history are UNKNOWN.
