'use strict';
const vscode = require('vscode');
const path = require('path');
const fsp = require('fs').promises;
const { MEMORY_DIR, ACTIVE_CONTEXT, scaffold, createDecision } = require('./scaffold');

const CONTEXT_KEY = 'memoryBank.initialized';
const DISMISS_KEY = 'memoryBank.promptDismissed';

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function fileExists(p) {
  try {
    await fsp.access(p);
    return true;
  } catch {
    return false;
  }
}

async function pickFolder() {
  const folders = vscode.workspace.workspaceFolders || [];
  if (folders.length === 0) return undefined;
  if (folders.length === 1) return folders[0];
  return vscode.window.showWorkspaceFolderPick({ placeHolder: 'Select the folder to create the memory bank in' });
}

function activate(context) {
  const log = vscode.window.createOutputChannel('Memory Bank');
  const templatesDir = path.join(context.extensionPath, 'templates');
  context.subscriptions.push(log);

  async function isInitialized() {
    for (const f of vscode.workspace.workspaceFolders || []) {
      if (await fileExists(path.join(f.uri.fsPath, MEMORY_DIR, ACTIVE_CONTEXT))) return true;
    }
    return false;
  }

  async function refreshContext() {
    await vscode.commands.executeCommand('setContext', CONTEXT_KEY, await isInitialized());
  }

  async function initialize() {
    const folder = await pickFolder();
    if (!folder) {
      vscode.window.showWarningMessage('Memory Bank: open a folder first.');
      return;
    }
    const cfg = vscode.workspace.getConfiguration('memoryBank');
    try {
      const result = await scaffold({
        templatesDir,
        workspaceRoot: folder.uri.fsPath,
        projectName: path.basename(folder.uri.fsPath),
        date: today(),
        extensionId: context.extension.id,
        installHooks: cfg.get('installHooks', true),
        recommendExtension: cfg.get('recommendExtension', true),
        gitignoreActiveContext: cfg.get('gitignoreActiveContext', false)
      });
      result.created.forEach((f) => log.appendLine('created  ' + f));
      result.skipped.forEach((f) => log.appendLine('exists   ' + f + ' (left unchanged)'));
      result.notes.forEach((n) => log.appendLine('note     ' + n));
      await refreshContext();

      if (result.created.length === 0) {
        vscode.window.showInformationMessage('Memory Bank already exists; nothing was overwritten.');
        return;
      }
      vscode.window.showInformationMessage('Memory Bank created (' + result.created.length + ' items). Run /memory-init in Copilot Chat to fill it from your code.');
      if (cfg.get('runInitPromptAfterScaffold', true)) {
        try {
          await vscode.commands.executeCommand('workbench.action.chat.open', { query: '/memory-init', isPartialQuery: true });
        } catch (err) {
          log.appendLine('Could not open chat automatically: ' + err);
        }
      }
    } catch (err) {
      log.appendLine('ERROR ' + (err && err.stack ? err.stack : err));
      vscode.window.showErrorMessage('Memory Bank: initialization failed. See the "Memory Bank" output channel.');
    }
  }

  async function openActiveContext() {
    const folder = await pickFolder();
    if (!folder) return;
    const file = path.join(folder.uri.fsPath, MEMORY_DIR, ACTIVE_CONTEXT);
    if (!(await fileExists(file))) {
      const choice = await vscode.window.showInformationMessage('No memory bank in this folder yet.', 'Initialize');
      if (choice === 'Initialize') await initialize();
      return;
    }
    await vscode.window.showTextDocument(vscode.Uri.file(file));
  }

  async function addDecision() {
    const folder = await pickFolder();
    if (!folder) return;
    if (!(await fileExists(path.join(folder.uri.fsPath, MEMORY_DIR)))) {
      vscode.window.showWarningMessage('Memory Bank: run "Memory Bank: Initialize" first.');
      return;
    }
    const title = await vscode.window.showInputBox({ prompt: 'Decision title', placeHolder: 'Use PostgreSQL for persistence' });
    if (!title) return;
    const dest = await createDecision({ templatesDir, workspaceRoot: folder.uri.fsPath, title, date: today() });
    await vscode.window.showTextDocument(vscode.Uri.file(dest));
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('memoryBank.initialize', initialize),
    vscode.commands.registerCommand('memoryBank.openActiveContext', openActiveContext),
    vscode.commands.registerCommand('memoryBank.addDecision', addDecision)
  );

  const watcher = vscode.workspace.createFileSystemWatcher('**/' + MEMORY_DIR + '/' + ACTIVE_CONTEXT);
  context.subscriptions.push(
    watcher,
    watcher.onDidCreate(refreshContext),
    watcher.onDidDelete(refreshContext),
    vscode.workspace.onDidChangeWorkspaceFolders(refreshContext)
  );

  (async () => {
    await refreshContext();
    const cfg = vscode.workspace.getConfiguration('memoryBank');
    const hasFolder = (vscode.workspace.workspaceFolders || []).length > 0;
    if (!hasFolder || !cfg.get('promptOnOpen', true)) return;
    if (await isInitialized()) return;
    if (context.workspaceState.get(DISMISS_KEY)) return;
    if (!vscode.workspace.isTrusted) return;

    const choice = await vscode.window.showInformationMessage(
      'Set up a Copilot memory bank for this project? It gives Copilot persistent context across sessions.',
      'Initialize',
      'Not now',
      "Don't ask again here"
    );
    if (choice === 'Initialize') await initialize();
    else if (choice === "Don't ask again here") await context.workspaceState.update(DISMISS_KEY, true);
  })().catch((err) => log.appendLine('startup error: ' + err));
}

function deactivate() {}

module.exports = { activate, deactivate };
