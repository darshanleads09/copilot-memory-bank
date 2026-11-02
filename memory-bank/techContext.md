# Tech context

Stable. Update when the stack, tooling or environment changes.

## Stack

- Languages / runtimes: JavaScript (CommonJS), Node.js, VS Code extension API.
- Separate demonstration app: .NET 10 ASP.NET Core API with EF Core SQLite in `demo-dotnet/`.
- Frameworks / key libraries: VS Code API; `@vscode/vsce` for packaging.
- Data stores / external services: No application database is configured; the extension writes files into the selected workspace.

## Commands

- Install: `npm install` (README).
- Build: Not configured; `package.json` has no build script.
- Package: `npm run package` (README and `package.json`).
- Test: `npm test` is declared, but failed in this Windows environment because `test/*.test.js` was passed literally. Verified workaround: `node --test test/scaffold.test.js` (9 tests pass).
- Demo app: `dotnet build demo-dotnet/MemoryBank.Inventory.slnx` and `dotnet test demo-dotnet/MemoryBank.Inventory.slnx` (5 tests pass).
- Lint / format: Not configured in `package.json`; no CI configuration was found.
- Run locally: UNKNOWN - ask maintainer; no run script or launch configuration was found.

## Environment

- Required tools and versions: VS Code `^1.115.0` and GitHub Copilot Chat (README/package manifest); Node.js on PATH is required by the hooks. Exact Node.js version: UNKNOWN - ask maintainer.
- Config and env vars (names only, never values): No project environment variables identified. Optional hooks require VS Code `chat.useHooks` and a trusted workspace.

## Constraints

- Initialization writes into the workspace and requires trust; virtual workspaces are unsupported.
- Existing files are not overwritten. Hook installation and extension recommendations are configurable.
- No build, lint, or CI workflow was found in the repository snapshot.
