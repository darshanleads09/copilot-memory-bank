# Copilot Memory Bank Demo Guide

Audience: Higher Management  
Run time: 10 minutes  
Demo workspace: this `demo-dotnet/` folder

For the word-for-word 10-minute presentation and timed 10-minute demo, see [PRESENTATION-SCRIPT.md](PRESENTATION-SCRIPT.md).

## Outcome to demonstrate

Copilot starts with no project memory, learns verified context from a real .NET solution, uses that context to plan and implement a scoped change, and records the result so another chat can continue. The extension stores reviewable Markdown in the project; the source code remains the source of truth.

## Before the meeting

1. Install VS Code 1.115 or later, GitHub Copilot Chat, and the .NET 10 SDK. Sign in to Copilot Chat.
2. Install `copilot-memory-bank-0.3.0.vsix` from the parent folder using **Extensions > ... > Install from VSIX...**. The CLI alternative, from this folder, is `code --install-extension ..\copilot-memory-bank-0.3.0.vsix`.
3. Open this folder as its own VS Code workspace. Confirm there is no `memory-bank/` folder yet.
4. Run `dotnet build MemoryBank.Inventory.slnx` and `dotnet test MemoryBank.Inventory.slnx` once. Both should pass before the live demo.
5. Optionally run `git init` and make a baseline commit if you want `/memory-init` to read actual Git history. Without Git history, tell Copilot to record that fact as unknown rather than inventing it.
6. Keep the STAR deck open in a separate window. Start the API only if you want to show live requests: `dotnet run --project src/MemoryBank.Inventory.Api --urls http://localhost:5072`.

Do not pre-create the sample's memory bank. For a reliable meeting, test the extension installation and Copilot sign-in in advance, then remove only the sample's generated `memory-bank/`, `.github/copilot-instructions.md`, and optional hook files before the presentation. Keep the source code and SQLite database intact.

## Live walkthrough

### 1. Show the real project (about 1 minute)

Point out the API, domain, application, infrastructure, and test projects. Mention that the solution runs locally with SQLite and has no external service dependency. Optionally show the passing test command and `GET /api/inventory` in the `.http` file.

### 2. Initialize the memory bank (about 1 minute)

1. Open the Command Palette with `Ctrl+Shift+P` and run **Memory Bank: Initialize**.
2. Show that it creates the memory files and Copilot instructions without replacing existing files.
3. Copilot Chat should open with `/memory-init` prefilled. Send it.

Suggested narration: “The extension provides the structure; Copilot fills it from repository evidence. The notes are ordinary project files that the team can review.”

### 3. Review what Copilot learned (about 1 minute)

Open `memory-bank/techContext.md`, `systemPatterns.md`, and `activeContext.md`. Check that the generated notes accurately describe .NET 10, the layered projects, SQLite, tests, and current project state. Correct inaccuracies before continuing. Call out any `UNKNOWN` entries rather than guessing.

### 4. Start a scoped change with prior context (about 2 minutes)

In Copilot Chat, run `/task-start` and use this task description:

> Plan only; do not edit application code yet. Add a low-stock inventory query. Return items whose quantity is at or below a caller-supplied threshold, defaulting to 5. Keep the existing project boundaries, validate negative thresholds, and add tests.

Let Copilot read the indexed memory and create an in-progress task record. Review the plan, then ask it to implement the agreed change. Suggested implementation prompt:

> Implement the agreed low-stock query across the existing application and API layers. Keep the response shape consistent with the existing inventory API, add tests for the default threshold, a custom threshold, and invalid input, and update the `.http` examples. Do not add dependencies.

### 5. Verify behavior and capture the outcome (about 2 minutes)

1. Run `dotnet test MemoryBank.Inventory.slnx` and inspect the changed files.
2. If the API is running, try `GET http://localhost:5072/api/inventory/low-stock` and `GET http://localhost:5072/api/inventory/low-stock?threshold=3`. The seeded data includes items at quantities 4 and 3.
3. Run `/memory-update`. Show the task record moving to completed and `activeContext.md` / `progress.md` recording verified results, not just intended work.

### 6. Demonstrate continuity (about 1 minute)

Start a new Copilot Chat session and ask:

> Summarize the low-stock task's verified implementation, tests, and any remaining work from this project's memory bank.

Show that the response can resume from the recorded state. If optional hooks are enabled, mention that they can load current notes at session start and request a memory update; the manual prompts work without hooks.

## Close

Emphasize three points: the memory is plain text in the project, it is checked against code and reviewed like code, and it helps a new chat continue without treating old notes as unquestionable truth. The benchmark slide is an early one-run comparison, not a guarantee of savings.

## Fallbacks

- If automatic chat opening does not happen, open Copilot Chat and type `/memory-init`.
- If the first response invents repository details, stop and correct the memory files before the task demo.
- If live code generation runs long, show the `/task-start` record and existing tests, then explain that `/memory-update` records only completed, verified work. Do not present an untested change as complete.
- If the HTTP file cannot be sent from VS Code, use `http://localhost:5072/openapi/v1.json` or skip the live API call; the memory workflow is the point of the demo.

## Reset after rehearsal

Stop the API. Remove only generated demo state if you want to rehearse from a clean slate: `memory-bank/`, `.github/copilot-instructions.md`, `.github/hooks/`, and `src/MemoryBank.Inventory.Api/App_Data/`. Do not remove the solution or source files.