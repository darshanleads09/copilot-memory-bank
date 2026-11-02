# TASK-20261102: .NET extension demo solution

- Status: Completed
- Started: 2026-11-02
- Updated: 2026-11-02
- Cues: demo-dotnet, .NET 10, inventory API, SQLite, Higher Management guide

## Request
Create a robust .NET solution in a new folder and a step-by-step guide for demonstrating Copilot Memory Bank to Higher Management.

## Goal and acceptance criteria
- Provide an independently runnable .NET demo workspace with a realistic task suitable for a memory-continuity walkthrough.
- Include setup, live prompts, expected checks, and fallback instructions for the presentation.
- Keep the demo workspace without a pre-created memory bank so extension initialization can be shown live.

## Relevant context
- The extension package `copilot-memory-bank-0.3.0.vsix` exists in the repository root.
- The extension's `/task-start` records substantial tasks before coding; `/memory-update` records verified outcomes.

## Plan
- Create a layered .NET 10 inventory API with local SQLite persistence and tests.
- Add local setup instructions, a management runbook, and a timed presentation/demo script.
- Build, test, and smoke-test the API routes.

## Decisions and rationale
- Use EF Core SQLite so the sample persists real data without requiring an external database.
- Keep the exercise scoped to a low-stock endpoint that Copilot can add during the presentation.
- Keep authentication and managed database migrations out of the demo baseline; state these limits explicitly.

## Outcome
- Added `demo-dotnet/` with Domain, Application, Infrastructure, API, and Tests projects, seeded SQLite data, CRUD endpoints, validation, Problem Details, health and OpenAPI endpoints.
- Added `README.md` and `DEMO-GUIDE.md` with prerequisites, installation, live workflow, sample prompts, and fallback guidance.
- Added `PRESENTATION-SCRIPT.md` with a 1,163-word talk, slide cues, a timed 10-minute demo, and live-latency fallback.
- Kept generated memory files out of the sample until the presenter runs Initialize.

## Verification
- `dotnet build demo-dotnet/MemoryBank.Inventory.slnx`: passed with warnings treated as errors.
- `dotnet test demo-dotnet/MemoryBank.Inventory.slnx`: 5 passed.
- HTTP smoke checks: health and list succeeded; create succeeded; duplicate SKU returned 409; invalid quantity returned 400.
- Development OpenAPI document served inventory routes.
- Presentation script timing check: 1,163 spoken words; both 10-minute sections are present.

## Reusable lessons
- A solution-level `dotnet test` only builds projects in test dependency graphs; separately build the full solution when API projects are not referenced by tests.

## References
- `demo-dotnet/README.md`
- `demo-dotnet/DEMO-GUIDE.md`
