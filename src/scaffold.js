'use strict';
// Pure Node logic (no vscode import) so it can be unit tested.
const path = require('path');
const fsp = require('fs').promises;

const MEMORY_DIR = 'memory-bank';
const ACTIVE_CONTEXT = 'activeContext.md';
const TEMPLATE_FILES = [
  'projectbrief.md',
  'techContext.md',
  'systemPatterns.md',
  'activeContext.md',
  'progress.md',
  'tasks/_index.md',
  'tasks/0000-template.md',
  'decisions/0000-template.md'
];

// Hook files are copied verbatim (no template variables) into .github/hooks/.
const HOOK_FILES = [
  { src: 'hooks/memory-bank.json', dest: '.github/hooks/memory-bank.json' },
  { src: 'hooks/memory-session-start.js', dest: '.github/hooks/memory-session-start.js' },
  { src: 'hooks/memory-stop-check.js', dest: '.github/hooks/memory-stop-check.js' }
];
const COPILOT_INSTRUCTIONS = {
  src: 'copilot-instructions.md',
  dest: '.github/copilot-instructions.md'
};

function render(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : ''));
}

async function exists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
}

function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'decision';
}

async function nextDecisionNumber(workspaceRoot) {
  const dir = path.join(workspaceRoot, MEMORY_DIR, 'decisions');
  let max = 0;
  try {
    for (const name of await fsp.readdir(dir)) {
      const m = /^(\d{4})-/.exec(name);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
  } catch {
    /* folder does not exist yet */
  }
  return String(max + 1).padStart(4, '0');
}

async function addToExtensionsJson(workspaceRoot, extensionId, notes) {
  const file = path.join(workspaceRoot, '.vscode', 'extensions.json');
  let data = { recommendations: [] };
  if (await exists(file)) {
    try {
      data = JSON.parse(await fsp.readFile(file, 'utf8'));
    } catch {
      notes.push('.vscode/extensions.json has comments or invalid JSON; add "' + extensionId + '" to recommendations manually.');
      return false;
    }
  }
  if (!Array.isArray(data.recommendations)) data.recommendations = [];
  if (data.recommendations.includes(extensionId)) return false;
  data.recommendations.push(extensionId);
  await fsp.mkdir(path.dirname(file), { recursive: true });
  await fsp.writeFile(file, JSON.stringify(data, null, 2) + '\n');
  return true;
}

async function addToGitignore(workspaceRoot) {
  const file = path.join(workspaceRoot, '.gitignore');
  const line = MEMORY_DIR + '/' + ACTIVE_CONTEXT;
  let current = '';
  if (await exists(file)) current = await fsp.readFile(file, 'utf8');
  if (current.split(/\r?\n/).some((l) => l.trim() === line)) return false;
  const prefix = current && !current.endsWith('\n') ? '\n' : '';
  await fsp.writeFile(file, current + prefix + '# Per-developer session state\n' + line + '\n');
  return true;
}

async function scaffold(opts) {
  const { templatesDir, workspaceRoot, projectName, date, extensionId } = opts;
  const vars = { DATE: date, PROJECT_NAME: projectName, NUMBER: '0000', TITLE: 'Decision title (template)' };
  const created = [];
  const skipped = [];
  const notes = [];

  for (const rel of TEMPLATE_FILES) {
    const dest = path.join(workspaceRoot, MEMORY_DIR, rel);
    const label = MEMORY_DIR + '/' + rel;
    if (await exists(dest)) {
      skipped.push(label);
      continue;
    }
    const src = await fsp.readFile(path.join(templatesDir, rel), 'utf8');
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    await fsp.writeFile(dest, render(src, vars));
    created.push(label);
  }

  const instructionsDest = path.join(workspaceRoot, COPILOT_INSTRUCTIONS.dest);
  if (await exists(instructionsDest)) {
    skipped.push(COPILOT_INSTRUCTIONS.dest);
  } else {
    await fsp.mkdir(path.dirname(instructionsDest), { recursive: true });
    await fsp.copyFile(path.join(templatesDir, COPILOT_INSTRUCTIONS.src), instructionsDest);
    created.push(COPILOT_INSTRUCTIONS.dest);
  }

  if (opts.installHooks) {
    for (const h of HOOK_FILES) {
      const dest = path.join(workspaceRoot, h.dest);
      if (await exists(dest)) {
        skipped.push(h.dest);
        continue;
      }
      await fsp.mkdir(path.dirname(dest), { recursive: true });
      await fsp.copyFile(path.join(templatesDir, h.src), dest);
      created.push(h.dest);
    }
  }

  if (opts.recommendExtension && extensionId) {
    if (await addToExtensionsJson(workspaceRoot, extensionId, notes)) created.push('.vscode/extensions.json (recommendation)');
  }
  if (opts.gitignoreActiveContext) {
    if (await addToGitignore(workspaceRoot)) created.push('.gitignore (activeContext.md)');
  }
  return { created, skipped, notes };
}

async function createDecision({ templatesDir, workspaceRoot, title, date }) {
  const number = await nextDecisionNumber(workspaceRoot);
  const src = await fsp.readFile(path.join(templatesDir, 'decisions', '0000-template.md'), 'utf8');
  const dest = path.join(workspaceRoot, MEMORY_DIR, 'decisions', number + '-' + slugify(title) + '.md');
  await fsp.mkdir(path.dirname(dest), { recursive: true });
  await fsp.writeFile(dest, render(src, { DATE: date, NUMBER: number, TITLE: title }));
  return dest;
}

module.exports = { MEMORY_DIR, ACTIVE_CONTEXT, TEMPLATE_FILES, HOOK_FILES, scaffold, createDecision, nextDecisionNumber, slugify, render };
