# Changelog

## 0.3.0
- Add indexed task-memory files and bounded retrieval of relevant past work.
- Add the extension icon.

## 0.2.0
- Initialize now also writes agent hooks to `.github/hooks/`: SessionStart loads `activeContext.md` and `progress.md`; Stop asks the agent to update memory when code changed after memory was last updated (with loop guard). New setting `memoryBank.installHooks`.

## 0.1.0
- Initial release: five memory-bank templates, `/memory-init`, `/memory-update`, `/task-start`, `/memory-prune` prompts, always-on memory rules, and Initialize / Open Active Context / Add Decision Record commands.
