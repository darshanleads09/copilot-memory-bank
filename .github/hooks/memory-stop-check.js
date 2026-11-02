// Copilot Memory Bank: Stop hook.
// If code changed after memory was last updated, keep the agent running once
// so it can update memory-bank/ before finishing.
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8')); } catch { /* no stdin */ }

if (input.stop_hook_active) process.exit(0); // loop guard: never block twice

const cwd = input.cwd || process.cwd();
const mem = path.join(cwd, 'memory-bank', 'activeContext.md');
if (!fs.existsSync(mem)) process.exit(0);

let status = '';
try {
  status = cp.execSync('git status --porcelain', { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
} catch {
  process.exit(0); // not a git repo: skip
}

const memTime = fs.statSync(mem).mtimeMs;
const memoryStale = status
  .split(/\r?\n/)
  .filter(Boolean)
  .map((l) => l.slice(3).replace(/^"|"$/g, ''))
  .filter((f) => !f.startsWith('memory-bank/'))
  .some((f) => {
    try { return fs.statSync(path.join(cwd, f)).mtimeMs > memTime; } catch { return false; }
  });

if (!memoryStale) process.exit(0); // memory is current: let the agent stop

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'Stop',
    decision: 'block',
    reason: 'Files changed since memory was last updated. Update memory-bank/activeContext.md and progress.md (add a decisions/ record if a design choice was made), then finish.'
  }
}));
