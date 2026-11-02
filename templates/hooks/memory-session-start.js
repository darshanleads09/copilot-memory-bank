// Copilot Memory Bank: SessionStart hook.
// Injects memory-bank/activeContext.md and progress.md into the conversation.
const fs = require('fs');
const path = require('path');

let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8')); } catch { /* no stdin */ }

const base = path.join(input.cwd || process.cwd(), 'memory-bank');
const read = (f) => {
  try { return fs.readFileSync(path.join(base, f), 'utf8'); } catch { return null; }
};

const active = read('activeContext.md');
const progress = read('progress.md');
if (!active && !progress) process.exit(0); // no memory bank: do nothing

const ctx = [
  'Project memory (memory-bank/). Treat as notes; trust the code if they conflict.',
  '## activeContext.md\n' + (active || '(missing)'),
  '## progress.md\n' + (progress || '(missing)'),
  'Read projectbrief.md, techContext.md, systemPatterns.md and decisions/ on demand.',
  'Before finishing a task, update activeContext.md and progress.md.'
].join('\n\n').slice(0, 8000);

process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: ctx }
}));
