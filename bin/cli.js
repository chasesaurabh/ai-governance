#!/usr/bin/env node
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { adapters, planInstall, applyInstall, doctor, planUninstall, applyUninstall } from '../lib/installer.js';
import { installRuntime } from '../lib/npm.js';
import { discover } from '../lib/discovery.js';
import { safePath } from '../lib/installer.js';
import { existsSync, writeFileSync } from 'node:fs';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
async function main() {
  const args = process.argv.slice(2);
  let target = process.cwd(), tools, preview = false, command = 'install', explicitTarget = false, saveDev = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: ai-governance-setup [install|doctor|uninstall] [directory] [--all | --tools devin,cursor | --core-only] [--dry-run] [--save-dev]');
      return;
    }
    if (['doctor', 'install', 'uninstall'].includes(arg)) command = arg;
    else if (arg === '--save-dev') saveDev = true;
    else if (arg === '--dry-run') preview = true;
    else if (arg === '--all' || arg === '--core-only' || arg === '--tools') {
      if (tools !== undefined) throw new Error('Choose only one tool selection option');
      if (arg === '--tools') {
        if (!args[i + 1] || args[i + 1].startsWith('-')) throw new Error('--tools requires a comma-separated list');
        tools = args[++i].split(',').map(item => item.trim());
      } else tools = arg === '--all' ? Object.keys(adapters) : [];
    } else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else {
      if (explicitTarget) throw new Error('Only one target directory is allowed');
      target = resolve(arg); explicitTarget = true;
    }
  }
  if (command === 'doctor') {
    const result = doctor(target);
    result.forEach(item => console.log(`${item.status}: ${item.path}`));
    if (result.some(item => item.status !== 'ok')) process.exitCode = 1;
    return;
  }
  if (command === 'uninstall') {
    const plan = planUninstall(target);
    plan.changes.forEach(item => console.log(`${item.status}: ${item.path}`));
    if (!preview) applyUninstall(plan);
    console.log('Project settings, dependencies, evidence and edited files are preserved. Remove the npm dependency separately if no longer needed.');
    if (plan.changes.some(item => item.status === 'preserve')) process.exitCode = 1;
    return;
  }
  if (tools === undefined) {
    if (!process.stdin.isTTY) throw new Error('Non-interactive setup requires --all, --tools, or --core-only');
    const { default: inquirer } = await import('inquirer');
    const answer = await inquirer.prompt([
      { name: 'target', message: 'Install to directory:', default: target },
      { name: 'tools', type: 'checkbox', message: 'Select AI tools:', choices: Object.keys(adapters) },
    ]);
    target = resolve(answer.target); tools = answer.tools;
  }
  const plan = planInstall(source, target, tools);
  plan.changes.forEach(item => console.log(`${item.status}: ${item.path}`));
  if (!preview) {
    applyInstall(plan);
    const configPath = safePath(target, 'governance.config.json');
    if (!existsSync(configPath)) {
      writeFileSync(configPath, `${JSON.stringify(discover(target).config, null, 2)}\n`);
      console.log('Created project configuration from manifests. Review detected/suggested commands before execution.');
    }
  }
  if (saveDev && !preview) installRuntime(target, plan.manifest.version);
  if (saveDev && preview) console.log(`Would install exact development dependency ai-governance-setup@${plan.manifest.version}`);
  const conflicts = plan.changes.filter(item => item.status === 'conflict').length;
  console.log(`${preview ? 'Preview only' : 'Installation complete'}: ${target}; ${conflicts} conflicts preserved.`);
  if (!preview) console.log('Next: npx ai-governance check --staged (requires the local runtime or --save-dev).');
  if (conflicts) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
