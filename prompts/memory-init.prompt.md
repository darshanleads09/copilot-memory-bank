---
name: memory-init
description: 'One-time: scan this repo and fill in the memory-bank files'
agent: agent
---
Initialize the project memory bank in `memory-bank/`.

1. If `memory-bank/` does not exist, tell me to run the command **Memory Bank: Initialize** (Command Palette) and stop.
2. Explore the repo: README, build manifests (package.json, pom.xml, *.csproj, pyproject.toml, etc.), CI config, top-level folders, and a sample of source and test files. Check `git log -20 --oneline` for recent direction.
3. Replace every `TODO` in `projectbrief.md`, `techContext.md` and `systemPatterns.md`. Record only what you verified in the repo. If unsure, write `UNKNOWN - ask maintainer` instead of guessing. Build, test and lint commands must come from real scripts or CI config.
4. Set `activeContext.md` and `progress.md` to the true current state (git status and branches help).
5. Keep each file under ~80 lines. Link to the README rather than copying it.
6. Never record secrets, tokens, connection strings or personal data.
7. Finish with a short list of files changed and everything you marked `UNKNOWN`.
