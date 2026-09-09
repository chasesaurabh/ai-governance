import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { safePath } from './installer.js';
import { checkChanges } from './check.js';
const definitions = {
  claude: { path: '.claude/settings.json', event: 'UserPromptSubmit', entry: { hooks: [{ type: 'command', command: 'node node_modules/ai-governance-setup/bin/hook.js claude', timeout: 10 }] } },
  cursor: { path: '.cursor/hooks.json', event: 'sessionStart', entry: { command: 'node node_modules/ai-governance-setup/bin/hook.js cursor' } },
};
export function configureHooks(root, tools, { remove = false, preview = false } = {}) {
  const changes = [];
  if (!remove && !existsSync(safePath(root, 'node_modules/ai-governance-setup/bin/hook.js'))) throw new Error('Install the pinned local runtime before configuring hooks');
  for (const tool of tools) {
    const d = definitions[tool];
    if (!d) throw new Error(`Hooks supported for claude/cursor, not ${tool}; use repository instructions for Copilot/Devin`);
    const path = safePath(root, d.path);
    const config = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
    if (!config || Array.isArray(config) || typeof config !== 'object') throw new Error(`Invalid ${d.path}`);
    config.hooks ??= {};
    if (typeof config.hooks !== 'object' || Array.isArray(config.hooks)) throw new Error(`Invalid hooks in ${d.path}`);
    const entries = config.hooks[d.event] ?? [];
    if (!Array.isArray(entries)) throw new Error(`Invalid hook event in ${d.path}`);
    const command = tool === 'claude' ? d.entry.hooks[0].command : d.entry.command;
    const contains = entry => tool === 'claude' ? entry.hooks?.some(h => h.command === command) : entry.command === command;
    if (remove) {
      config.hooks[d.event] = entries.flatMap(entry => {
        if (!contains(entry)) return [entry];
        if (tool === 'cursor') return JSON.stringify(entry) === JSON.stringify(d.entry) ? [] : [entry];
        const hooks = entry.hooks.filter(h => JSON.stringify(h) !== JSON.stringify(d.entry.hooks[0]));
        return hooks.length ? [{ ...entry, hooks }] : [];
      });
    } else if (!entries.some(contains)) config.hooks[d.event] = [...entries, d.entry];
    if (tool === 'cursor') {
      if (config.version !== undefined && config.version !== 1) throw new Error('Unsupported Cursor hook schema version');
      config.version = 1;
    }
    changes.push({ path: d.path, content: `${JSON.stringify(config, null, 2)}\n` });
  }
  if (!preview) for (const c of changes) { const path = safePath(root, c.path); mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, c.content); }
  return changes;
}
export function hookResponse(tool, root) {
  if (!definitions[tool]) throw new Error('Unknown hook host');
  let context;
  try {
    const report = checkChanges(root);
    // Use fixed rule descriptions and counts; never elevate repository-controlled paths or file text into instructions.
    const rules = [...new Set(report.findings.map(f => f.rule))];
    context = `Governance: ${report.files.length} changed files. Review categories: ${rules.join(', ') || 'none'}. Run ai-governance check for file-level details. No project commands were executed; this is advisory and does not grant permissions.`;
  } catch { context = 'Governance change inspection unavailable. Use the CLI manually; do not claim checks passed.'; }
  return tool === 'claude' ? { hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context } } : { additional_context: context };
}
