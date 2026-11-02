# Copilot Memory Bank: 20-Minute Presentation Script

Audience: Higher Management, technical and non-technical  
Format: 10-minute presentation + 10-minute live demo  
Deck: `../artifacts/TechCommittee_LLM_Memory_Management_STAR.html`

## Rehearsal notes

- Aim for a calm pace of about 115-125 words per minute for the talk. The time windows include slide changes and short pauses. The demo slot includes interaction and Copilot response time; its spoken narration is intentionally brief.
- Text in quotation marks is spoken. Text in square brackets is a presenter action, not spoken.
- Keep the demo workspace open in VS Code before the meeting. Authenticate Copilot Chat and restore packages in advance.
- Rehearse the full live flow in a disposable copy. Keep that completed copy open as a fallback; the live workspace must remain clean so Initialize can be shown.
- Do not promise that AI is always correct or that the early benchmark results will repeat.

## Part 1: Presentation (10 minutes)

### 00:00-01:00 | Opening

[Show slide 1. Pause briefly before speaking.]

“Good morning. I’m going to show a practical way to help GitHub Copilot continue work across separate chats.

Think of a new chat as a new colleague joining halfway through a project. They can read the code, but they do not automatically know what the team decided yesterday, what is already complete, or what we plan to do next.

The Copilot Memory Bank extension gives that colleague a small, reviewable project notebook. I’ll explain the problem, show how the extension works, share an early measurement, and then demonstrate the workflow on a real .NET application.”

### 01:00-02:20 | Slide 1: The problem

[Point to the three cards.]

“Today, every new AI chat starts with little or no memory of the previous one. That creates three familiar problems.

First, we repeat ourselves. We explain the project, its structure, and the task again. Second, when context is missing, an AI can produce a confident answer based on an assumption. Third, during a long task, it can lose track of decisions or change more than we asked.

This is not a criticism of one model. It is a workflow gap: project knowledge is spread across source code, conversations, and individual developers’ memory. The question is whether we can preserve the useful context in a form the team can inspect.”

“For a developer, the cost is repeated orientation: finding the same files, checking the same conventions, and asking the same questions. For a manager, that can make estimates and handovers less predictable. The memory bank is aimed at reducing that repeated discovery, not at replacing a developer’s judgement or review.”

### 02:20-03:25 | Slide 2: The goal

[Advance to slide 2.]

“Our goal is deliberately modest. We are not retraining a model, and we are not introducing a memory server. We keep a set of ordinary text files with the project.

That gives us three outcomes: Copilot can pick up where work left off; it has written project facts to check instead of relying only on a fresh guess; and it can see the current task and project rules.

A useful comparison is a team notebook. It helps someone get oriented, but it does not overrule the source of truth. If a note conflicts with the code, we trust the code and correct the note.”

“The useful distinction is between a durable project fact, such as how to run tests, and a temporary personal note, such as what one developer is doing today. The extension supports both choices. Teams can share the stable context and decide whether current-work notes belong in version control. That gives the team control over what becomes shared knowledge.”

### 03:25-05:20 | Slide 3: What was built

[Advance to slide 3. Point to the memory tree, then the feature list.]

“I built the Copilot Memory Bank extension for VS Code. When a developer initializes a workspace, it creates a small set of Markdown files: a project brief, technical context, system patterns, current work, and progress. It also provides templates for task records and decision records.

The files are visible and reviewable. A team can commit shared context with the code. A developer can also choose to keep the fast-changing current-work file out of Git when that better fits how the team works.

The extension provides prompts for different moments. Memory Init asks Copilot to inspect the repository and fill in the notes from evidence. Task Start loads the relevant context and helps plan substantial work. Memory Update records what was actually completed and checked. Memory Prune helps remove stale notes.

There are also commands to initialize, open current context, and add a decision record. Optional hooks can load selected notes at session start and request a memory update after changes. Hooks are optional; the prompt workflow works without them.

This is project context, not model training. The extension writes files into the selected workspace. Copilot still needs the user’s normal VS Code and repository permissions.”

“From a governance point of view, the approach is intentionally visible. These are normal files, so existing repository access controls, reviews, and history apply. There is no separate memory service to provision. The team still needs to follow its rules for what can be sent to Copilot, and should not put secrets or personal data in these notes.”

### 05:20-06:25 | Slide 4: What it looks like

[Advance to slide 4. Point across the three representative views.]

“These are representative views of the workflow, not captured screenshots. First, the developer runs Initialize from the Command Palette. Second, the generated files appear beside the code. Third, Copilot Chat opens with the Memory Init prompt ready to run.

The human remains in control: review the generated notes, correct them, and decide what to commit. That review step matters as much as the automation.”

“The same transparency applies when the notes change. A reviewer can see whether the project summary, task record, or decision note changed, just as they can review a code change. If a note is no longer accurate, it can be corrected or removed. It is not a hidden state that only the AI can inspect.”

### 06:25-08:25 | Slide 5: Early result

[Advance to slide 5. State the caveat before the numbers.]

“I tested the same task and the same COSMOS repository once with the memory bank and once without it. These are early observations from two runs, not a controlled study, and they do not prove that memory alone caused the difference.

In the memory-bank run, the task took 3 minutes 13 seconds instead of 13 minutes 27 seconds. The AI used 14 turns instead of 48, 1.84 million tokens instead of 3.53 million, and 120 credits instead of about 156. Tool calls went from 69 to 27. Neither run reported errors.

For management, the direction is encouraging: less repeated discovery and fewer interactions in this example. The responsible conclusion is not ‘we will always save this amount.’ It is ‘this workflow is worth testing with more tasks and more runs.’

“The measures tell us different things. Elapsed time is the end-to-end duration for this run. Turns and tool calls indicate how much interaction and repository discovery occurred. Tokens and credits are usage measures, but they are not a direct measure of code quality. A shorter run is only useful if it reaches a correct, reviewed result.”

The less easily measured benefit is continuity: context and decisions can be reviewed with the project rather than rediscovered in every conversation.”

### 08:25-09:20 | Slide 6: Evidence

[Advance to slide 6. Keep the details brief.]

“This backup slide shows the underlying run counts and the breakdown of calls avoided in the memory-bank run. The split is approximate and comes from the Copilot log review. The important point is that we can inspect the evidence rather than relying on a slogan or a single percentage.

We should repeat the comparison across representative tasks, track quality as well as time and usage, and include human review in the evaluation.”

“A sensible next evaluation would use several task types, repeat each condition, and record completion time, test outcomes, review findings, and usage. We should also capture cases where memory is stale or unhelpful. That would give us a better basis for deciding where this extension is useful and what team guidance it needs.”

### 09:20-10:00 | Close and transition

[Return to slide 1 or leave slide 6 visible.]

“To summarize: this extension gives Copilot a lightweight, team-visible notebook; it keeps code and human review in charge; and an initial comparison suggests it may reduce repeated work. We have also prepared a .NET demo so you can see the complete cycle, including a new task and a fresh chat picking up the result.

I’ll switch from the slides to the live demonstration now.”

## Part 2: Live demo (10 minutes)

### 00:00-01:00 | Orient the audience

[Switch to the `demo-dotnet/` VS Code workspace. Show the Explorer and solution.]

Say: “This is a small .NET 10 inventory API with a test project and local SQLite data. It is a realistic codebase, but it needs no external database or service. I have intentionally opened it without a memory bank so we can see setup rather than a pre-filled result.”

[Briefly point out the API, Domain, Application, Infrastructure, and Tests projects. If the API is already running, show `http://localhost:5072/api/inventory`. Do not start a build during this minute.]

### 01:00-02:00 | Initialize

[Press `Ctrl+Shift+P`; run **Memory Bank: Initialize**. Accept any folder selection prompt.]

Say: “Initialize creates the project notes and Copilot rules. It does not replace existing files. The extension can now open the repository-reading prompt for us.”

### 02:00-04:00 | Fill and inspect memory

[In Copilot Chat, send `/memory-init`. Let it inspect the project.]

Say while it works: “The prompt asks Copilot to use repository evidence, check the project files, and mark things it cannot verify instead of inventing details. The result is plain Markdown, so the team can review it.”

[Open `memory-bank/techContext.md` and `memory-bank/systemPatterns.md`. Point out the target framework, project boundaries, SQLite, and test command. Check that the generated details are accurate.]

Say: “This is our checkpoint: we verify the notes before depending on them. Memory should save rediscovery, not preserve an error.”

### 04:00-05:00 | Plan a new task

[Run `/task-start`. When prompted for the task, enter:]

> Plan only; do not edit application code yet. Add a low-stock inventory query. Return items whose quantity is at or below a caller-supplied threshold, defaulting to 5. Keep the existing project boundaries, validate negative thresholds, and add tests.

Say: “The task prompt retrieves only relevant past records, then asks for a plan. We can check the scope before asking Copilot to change code.”

### 05:00-07:30 | Implement with guardrails

[Review the plan. Then send this prompt:]

> Implement the agreed low-stock query across the existing application and API layers. Keep the response shape consistent with the existing inventory API, add tests for the default threshold, a custom threshold, and invalid input, and update the `.http` examples. Do not add dependencies.

Say: “The task has an explicit behavior, constraints, and tests. Copilot is working inside the architecture already recorded in the project notes. I will review the proposed changes; memory is context, not approval.”

[Inspect the changed files as they arrive. If implementation is still running at 06:30, switch to the prepared rehearsal copy and say: “To stay on time, I’m switching to the same workflow completed during rehearsal. I won’t present unfinished code as verified.”]

### 07:30-08:30 | Verify

[Run `dotnet build MemoryBank.Inventory.slnx` and `dotnet test MemoryBank.Inventory.slnx`. If time permits, check the low-stock request in the `.http` file or browser.]

Say: “We do not call the change done because the AI says it is done. We build it, run the tests, and inspect what changed. Here the tests cover the default threshold, a custom threshold, and invalid input.”

[If the tests fail, show the failure and ask Copilot to diagnose it; do not claim success.]

### 08:30-09:15 | Record verified progress

[Run `/memory-update`. Let it update the task record and current progress from the verified result.]

Say: “Now the notes record the outcome and the checks we actually ran. If part of the task is still open, it stays open in memory.”

### 09:15-10:00 | Show continuity

[Start a new Copilot Chat session and ask:]

> Summarize the low-stock task's verified implementation, tests, and any remaining work from this project's memory bank.

Say: “This new chat can orient itself from the project notes and relevant task record. We still confirm the answer against the code, but we do not have to reconstruct the whole conversation.”

[Finish:] “That is the full cycle: initialize, learn from the code, plan, implement, verify, record, and resume.”

## If the live demo runs late

- Rehearse the entire flow in a disposable copy before the meeting. Keep the completed copy ready in a second VS Code window; do not initialize the live workspace in advance.
- Protect the final three minutes for build/test, memory update, and the new-chat question. At 06:30, move to the rehearsed copy if implementation is unfinished.
- If `/memory-init` is slow, show the newly created file structure and use the rehearsed copy for the populated notes. State clearly that you are showing the rehearsal result.
- If Copilot proposes an incorrect fact or a failing change, show the correction or failure honestly. Never describe unverified output as a successful result.
- Questions can follow the 20-minute slot. If a question interrupts the talk, answer briefly and say you will return to it after the demo.
