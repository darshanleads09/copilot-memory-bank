# Memory Bank .NET Demo

A .NET 10 inventory API used as a realistic workspace for demonstrating the Copilot Memory Bank VS Code extension. It is intentionally separate from the extension source and starts without a `memory-bank/` directory so initialization can be shown live.

## Solution

- `MemoryBank.Inventory.Domain`: inventory entity and business validation.
- `MemoryBank.Inventory.Application`: use-case service and repository contract.
- `MemoryBank.Inventory.Infrastructure`: EF Core SQLite persistence and demo seed data.
- `MemoryBank.Inventory.Api`: REST endpoints, OpenAPI, health endpoint, and Problem Details errors.
- `MemoryBank.Inventory.Tests`: unit tests for business rules and application behavior.

The API persists data in `src/MemoryBank.Inventory.Api/App_Data/inventory.db` and seeds three sample products on first run. It has no external database or service dependency. This is a demo baseline, not a production-ready inventory system: authentication/authorization and managed database migrations are intentionally out of scope.

## Run

Prerequisite: .NET 10 SDK.

From this directory:

```powershell
dotnet restore MemoryBank.Inventory.slnx
dotnet build MemoryBank.Inventory.slnx
dotnet test MemoryBank.Inventory.slnx
dotnet run --project src/MemoryBank.Inventory.Api --urls http://localhost:5072
```

Check `http://localhost:5072/health`, send the requests in `src/MemoryBank.Inventory.Api/MemoryBank.Inventory.Api.http`, or view `http://localhost:5072/openapi/v1.json` in the Development launch profile.

## Extension demo

Use [PRESENTATION-SCRIPT.md](PRESENTATION-SCRIPT.md) for the timed 10-minute talk and 10-minute demo narration. Use [DEMO-GUIDE.md](DEMO-GUIDE.md) for the setup checklist, live prompts, expected results, and fallback plan. The demo installs the packaged extension from the parent directory and initializes memory in this sample project, not in the extension source workspace.