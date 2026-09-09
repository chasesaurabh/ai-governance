import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync } from 'node:fs';
import { discover } from './discovery.js';
import { planInstall, applyInstall, safePath } from './installer.js';
import { installRuntime } from './npm.js';
export function parseOptions(args, values = [], flags = []) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (Object.hasOwn(result, key)) throw new Error(`Duplicate option: ${key}`);
    if (flags.includes(key)) result[key] = true;
    else if (values.includes(key) && args[i + 1] && !args[i + 1].startsWith('--')) result[key] = args[++i];
    else throw new Error(`Unknown option or missing value: ${key}`);
  }
  return result;
}
export async function runDaily(command, args) {
  if (!['init', 'inspect'].includes(command)) return false;
  const opts = parseOptions(args, ['--project', '--tools'], ['--dry-run', '--save-dev', '--json']);
  const root = resolve(opts['--project'] ?? '.');
  const discovery = discover(root);
  const configPath = safePath(root, 'governance.config.json');
  const result = { ...discovery, configStatus: existsSync(configPath) ? 'preserved existing config' : 'proposed config' };
  if (command === 'init') {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const plan = planInstall(source, root, opts['--tools'] ? opts['--tools'].split(',') : discovery.tools);
    result.installation = plan.changes.map(({ path, status }) => ({ path, status }));
    if (!opts['--dry-run']) {
      applyInstall(plan);
      if (!existsSync(configPath)) writeFileSync(configPath, `${JSON.stringify(discovery.config, null, 2)}\n`);
      if (opts['--save-dev']) installRuntime(root, plan.manifest.version);
    }
    if (plan.changes.some(c => c.status === 'conflict')) process.exitCode = 1;
  }
  if (opts['--json']) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`${command === 'inspect' || opts['--dry-run'] ? 'Preview' : 'Initialized'}: ${root}`);
    for (const p of discovery.packages) console.log(`${p.path}: ${p.stack}; ${Object.entries(p.commands).map(([k, v]) => `${k}=${v} (${p.provenance[k]})`).join('; ') || 'no commands detected'}`);
    console.log(`Adapters: ${discovery.tools.join(', ') || 'none detected; use --tools'}. ${result.configStatus}.`);
    discovery.notes.forEach(note => console.log(note));
  }
  return true;
}
