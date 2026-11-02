'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const { scaffold, createDecision, nextDecisionNumber, slugify, TEMPLATE_FILES, HOOK_FILES } = require('../src/scaffold');

const templatesDir = path.join(__dirname, '..', 'templates');
const mk = () => fs.mkdtempSync(path.join(os.tmpdir(), 'mb-'));

test('scaffold creates all template files with variables rendered', async () => {
  const root = mk();
  const res = await scaffold({ templatesDir, workspaceRoot: root, projectName: 'demo', date: '2026-10-30', extensionId: 'o.x', recommendExtension: true, gitignoreActiveContext: true });
  for (const f of TEMPLATE_FILES) assert.ok(fs.existsSync(path.join(root, 'memory-bank', f)), f);
  assert.strictEqual(
    fs.readFileSync(path.join(root, '.github/copilot-instructions.md'), 'utf8'),
    fs.readFileSync(path.join(templatesDir, 'copilot-instructions.md'), 'utf8')
  );
  assert.match(fs.readFileSync(path.join(root, 'memory-bank/projectbrief.md'), 'utf8'), /# Project brief: demo/);
  assert.match(fs.readFileSync(path.join(root, 'memory-bank/activeContext.md'), 'utf8'), /2026-10-30/);
  assert.match(fs.readFileSync(path.join(root, 'memory-bank/tasks/_index.md'), 'utf8'), /Task index/);
  assert.match(fs.readFileSync(path.join(root, 'memory-bank/tasks/0000-template.md'), 'utf8'), /Reusable lessons/);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(root, '.vscode/extensions.json'), 'utf8')).recommendations, ['o.x']);
  assert.match(fs.readFileSync(path.join(root, '.gitignore'), 'utf8'), /memory-bank\/activeContext\.md/);
  assert.ok(res.created.length >= 7);
});

test('scaffold never overwrites existing files and is idempotent', async () => {
  const root = mk();
  fs.mkdirSync(path.join(root, 'memory-bank'));
  fs.writeFileSync(path.join(root, 'memory-bank/progress.md'), 'KEEP ME');
  fs.mkdirSync(path.join(root, '.github'));
  fs.writeFileSync(path.join(root, '.github/copilot-instructions.md'), 'KEEP INSTRUCTIONS');
  const opts = { templatesDir, workspaceRoot: root, projectName: 'p', date: 'd', extensionId: 'o.x', recommendExtension: true, gitignoreActiveContext: true };
  const first = await scaffold(opts);
  assert.strictEqual(fs.readFileSync(path.join(root, 'memory-bank/progress.md'), 'utf8'), 'KEEP ME');
  assert.ok(first.skipped.includes('memory-bank/progress.md'));
  assert.strictEqual(fs.readFileSync(path.join(root, '.github/copilot-instructions.md'), 'utf8'), 'KEEP INSTRUCTIONS');
  assert.ok(first.skipped.includes('.github/copilot-instructions.md'));
  assert.ok(fs.existsSync(path.join(root, 'memory-bank/tasks/_index.md')));
  assert.ok(fs.existsSync(path.join(root, 'memory-bank/tasks/0000-template.md')));
  const second = await scaffold(opts);
  assert.strictEqual(second.created.length, 0);
  const ignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  assert.strictEqual(ignore.match(/activeContext/g).length, 1);
});

test('existing extensions.json is merged, invalid JSON is left alone', async () => {
  const root = mk();
  fs.mkdirSync(path.join(root, '.vscode'));
  fs.writeFileSync(path.join(root, '.vscode/extensions.json'), JSON.stringify({ recommendations: ['a.b'] }));
  await scaffold({ templatesDir, workspaceRoot: root, projectName: 'p', date: 'd', extensionId: 'o.x', recommendExtension: true });
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(root, '.vscode/extensions.json'), 'utf8')).recommendations, ['a.b', 'o.x']);

  const root2 = mk();
  fs.mkdirSync(path.join(root2, '.vscode'));
  fs.writeFileSync(path.join(root2, '.vscode/extensions.json'), '{ // comment\n "recommendations": [] }');
  const res = await scaffold({ templatesDir, workspaceRoot: root2, projectName: 'p', date: 'd', extensionId: 'o.x', recommendExtension: true });
  assert.strictEqual(fs.readFileSync(path.join(root2, '.vscode/extensions.json'), 'utf8').includes('// comment'), true);
  assert.strictEqual(res.notes.length, 1);
});

test('decision records get sequential numbers and slugs', async () => {
  const root = mk();
  await scaffold({ templatesDir, workspaceRoot: root, projectName: 'p', date: 'd' });
  assert.strictEqual(await nextDecisionNumber(root), '0001');
  const f1 = await createDecision({ templatesDir, workspaceRoot: root, title: 'Use PostgreSQL!', date: '2026-10-30' });
  assert.match(path.basename(f1), /^0001-use-postgresql\.md$/);
  assert.match(fs.readFileSync(f1, 'utf8'), /# 0001\. Use PostgreSQL!/);
  const f2 = await createDecision({ templatesDir, workspaceRoot: root, title: 'Second', date: 'd' });
  assert.match(path.basename(f2), /^0002-second\.md$/);
});

test('scaffold writes hook files only when installHooks is set, never overwrites', async () => {
  const root = mk();
  await scaffold({ templatesDir, workspaceRoot: root, projectName: 'p', date: 'd' });
  assert.ok(!fs.existsSync(path.join(root, '.github/hooks')));

  const root2 = mk();
  fs.mkdirSync(path.join(root2, '.github/hooks'), { recursive: true });
  fs.writeFileSync(path.join(root2, '.github/hooks/memory-bank.json'), 'MINE');
  const res = await scaffold({ templatesDir, workspaceRoot: root2, projectName: 'p', date: 'd', installHooks: true });
  assert.strictEqual(fs.readFileSync(path.join(root2, '.github/hooks/memory-bank.json'), 'utf8'), 'MINE');
  assert.ok(res.skipped.includes('.github/hooks/memory-bank.json'));
  for (const h of HOOK_FILES.slice(1)) assert.ok(fs.existsSync(path.join(root2, h.dest)), h.dest);
});

function runHook(script, root, stdin) {
  const r = cp.spawnSync(process.execPath, [path.join(root, '.github/hooks', script)], { cwd: root, input: JSON.stringify(stdin), encoding: 'utf8' });
  return { code: r.status, out: r.stdout ? JSON.parse(r.stdout) : null };
}

test('SessionStart hook injects memory; silent without a memory bank', async () => {
  const bare = mk();
  await scaffold({ templatesDir, workspaceRoot: bare, projectName: 'p', date: 'd', installHooks: true });
  fs.rmSync(path.join(bare, 'memory-bank'), { recursive: true });
  const none = cp.spawnSync(process.execPath, [path.join(bare, '.github/hooks/memory-session-start.js')], { cwd: bare, input: '{}', encoding: 'utf8' });
  assert.strictEqual(none.status, 0);
  assert.strictEqual(none.stdout, '');

  const root = mk();
  await scaffold({ templatesDir, workspaceRoot: root, projectName: 'p', date: 'd', installHooks: true });
  fs.writeFileSync(path.join(root, 'memory-bank/activeContext.md'), 'FOCUS: ship the widget');
  const { code, out } = runHook('memory-session-start.js', root, { cwd: root });
  assert.strictEqual(code, 0);
  assert.strictEqual(out.hookSpecificOutput.hookEventName, 'SessionStart');
  assert.match(out.hookSpecificOutput.additionalContext, /FOCUS: ship the widget/);
});

test('Stop hook blocks once when code is newer than memory, allows otherwise', async () => {
  const root = mk();
  const git = (...a) => cp.execFileSync('git', a, { cwd: root, stdio: 'ignore' });
  git('init', '-q');
  await scaffold({ templatesDir, workspaceRoot: root, projectName: 'p', date: 'd', installHooks: true });
  const mem = path.join(root, 'memory-bank/activeContext.md');
  const old = new Date(Date.now() - 60000);
  fs.utimesSync(mem, old, old);

  // no code change besides memory/hooks scaffolding that is older? create fresh code file => stale
  fs.writeFileSync(path.join(root, 'app.js'), 'console.log(1)');
  const blocked = runHook('memory-stop-check.js', root, { cwd: root, stop_hook_active: false });
  assert.strictEqual(blocked.out.hookSpecificOutput.decision, 'block');

  const guarded = runHook('memory-stop-check.js', root, { cwd: root, stop_hook_active: true });
  assert.strictEqual(guarded.out, null);

  const now = new Date(Date.now() + 5000);
  fs.utimesSync(mem, now, now);
  const fresh = runHook('memory-stop-check.js', root, { cwd: root, stop_hook_active: false });
  assert.strictEqual(fresh.out, null);
});

test('Stop hook is silent outside a git repo', async () => {
  const root = mk();
  await scaffold({ templatesDir, workspaceRoot: root, projectName: 'p', date: 'd', installHooks: true });
  const r = runHook('memory-stop-check.js', root, { cwd: root });
  assert.strictEqual(r.out, null);
});

test('slugify handles odd input', () => {
  assert.strictEqual(slugify('  Hello, World / v2  '), 'hello-world-v2');
  assert.strictEqual(slugify('!!!'), 'decision');
});
