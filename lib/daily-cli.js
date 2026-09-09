import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync } from 'node:fs';
import { discover } from './discovery.js';
import { planInstall, applyInstall, safePath } from './installer.js';
import { installRuntime } from './npm.js';
import { checkChanges, renderCheck, findingRules } from './check.js';
import { trustProject, runChecks, verificationSummary } from './runner.js';
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
  if (['trust', 'run', 'summary'].includes(command)) {
    const opts = parseOptions(args, ['--project', '--checks', '--timeout'], ['--accept', '--force', '--json']);
    const root = resolve(opts['--project'] ?? '.');
    if (command === 'trust') {
      if (!opts['--accept']) throw new Error('Review configuration and repository code, then use trust --accept to authorize its configured commands.');
      trustProject(root); console.log('Trusted configured commands for this repository. They can execute repository code and access the network.');
    } else if (command === 'run') {
      const controller = new AbortController(), cancel = () => controller.abort();
      process.once('SIGINT', cancel);
      try {
        const result = await runChecks(root, { selected: opts['--checks']?.split(','), timeoutMs: opts['--timeout'] ? Number(opts['--timeout']) : undefined, signal: controller.signal, force: !!opts['--force'] });
        console.log(JSON.stringify(result, null, 2)); if (!result.complete) process.exitCode = 1;
      } finally { process.removeListener('SIGINT', cancel); }
    } else {
      const result = verificationSummary(root);
      console.log(opts['--json'] ? JSON.stringify(result, null, 2) : `Verification for current changes:\n${result.map(r => `- ${r.key}: ${r.status}${r.observedAt ? ` (${r.observedAt})` : ''}`).join('\n')}\nHuman approvals remain separate; these statuses describe observed command exits.`);
    }
    return true;
  }
  if (command === 'explain') {
    const rule = args[0]?.split(':')[0];
    if (args.length !== 1 || !findingRules[rule]) throw new Error('Use explain with a finding rule ID, such as DEP-001');
    console.log(JSON.stringify(findingRules[rule], null, 2)); return true;
  }
  if (command === 'check') {
    const opts = parseOptions(args, ['--project', '--base'], ['--staged', '--json']);
    const report = checkChanges(resolve(opts['--project'] ?? '.'), { staged: !!opts['--staged'], base: opts['--base'] });
    console.log(opts['--json'] ? JSON.stringify(report, null, 2) : renderCheck(report)); return true;
  }
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
      try { result.firstCheck = checkChanges(root); }
      catch { result.notes.push('First change check unavailable outside a Git repository. Run check after initializing Git.'); }
    }
    if (plan.changes.some(c => c.status === 'conflict')) process.exitCode = 1;
  }
  if (opts['--json']) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`${command === 'inspect' || opts['--dry-run'] ? 'Preview' : 'Initialized'}: ${root}`);
    for (const p of discovery.packages) console.log(`${p.path}: ${p.stack}; ${Object.entries(p.commands).map(([k, v]) => `${k}=${v} (${p.provenance[k]})`).join('; ') || 'no commands detected'}`);
    console.log(`Adapters: ${discovery.tools.join(', ') || 'none detected; use --tools'}. ${result.configStatus}.`);
    discovery.notes.forEach(note => console.log(note));
    if (result.firstCheck) console.log(renderCheck(result.firstCheck));
  }
  return true;
}
