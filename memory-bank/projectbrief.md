# Project brief: Copilot Memory Bank

Stable. Update only when scope or goals change.

## Purpose

This VS Code extension scaffolds a reviewable `memory-bank/` in a project so GitHub Copilot can use persistent project context across sessions. It also provides memory prompts, instructions, and optional agent hooks.

## Goals

- Make memory-bank setup available through a VS Code command.
- Provide prompt files, memory instructions, and optional session hooks.
- Preserve existing user files when initializing.

## Scope

- In scope: VS Code extension commands and settings, memory-bank templates, prompts, instructions, hooks, and scaffold tests.
- Out of scope: UNKNOWN - ask maintainer.

## Users and stakeholders

- Developers using GitHub Copilot Chat in VS Code.
- Extension maintainers and teammates sharing a project memory bank.

## Success criteria

- Initialization creates memory templates and optional hooks/recommendations as configured.
- Existing files remain unchanged; scaffold behavior is covered by Node tests.
