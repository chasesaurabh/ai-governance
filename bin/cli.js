#!/usr/bin/env node
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { adapters, planInstall, applyInstall, doctor } from '../lib/installer.js';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
async function main() {
  const args = process.argv.slice(2);
  let target = process.cwd(), tools, preview = false, command = 'install', explicitTarget = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      console.log('Usage: ai-governance-setup [install|doctor] [directory] [--all | --tools windsurf,cursor | --core-only] [--dry-run]');
      return;
    }
    if (arg === 'doctor' || arg === 'install') command = arg;
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
  if (!preview) applyInstall(plan);
  const conflicts = plan.changes.filter(item => item.status === 'conflict').length;
  console.log(`${preview ? 'Preview only' : 'Installation complete'}: ${target}; ${conflicts} conflicts preserved.`);
  if (conflicts) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
