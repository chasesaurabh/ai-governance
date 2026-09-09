#!/usr/bin/env node
import { resolve } from 'node:path';
import { loadConfig, validateCatalog } from '../lib/config.js';
import { readFileSync } from 'node:fs';
import { createPacket, renderPacket } from '../lib/packet.js';
import { createEvidence, checkEvidence, renderChecklist } from '../lib/evidence.js';
import { runDaily } from '../lib/daily-cli.js';

try {
  const [command, ...args] = process.argv.slice(2);
  if (await runDaily(command, args)) {
    // Dedicated daily-work command handled above.
  } else if (command === '--help' || !command) {
    console.log('Commands: init, inspect, check, explain, check-config, packet, checklist, evidence-init, evidence-check. Use init --project path --dry-run to preview onboarding.');
  } else if (command === 'check-config') {
    if (args.length > 1) throw new Error('check-config accepts one directory');
    validateCatalog();
    console.log(JSON.stringify(loadConfig(resolve(args[0] ?? '.')), null, 2));
  } else if (['packet', 'checklist', 'evidence-init', 'evidence-check'].includes(command)) {
    let input, project = '.', json = false, taskFile, exceptionsFile;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--json') json = true;
      else if (['--input', '--project', '--task', '--exceptions'].includes(args[i])) {
        const key = args[i];
        if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${key} requires a value`);
        const value = args[++i];
        if (key === '--input') input = value;
        else if (key === '--project') project = value;
        else if (key === '--task') taskFile = value;
        else exceptionsFile = value;
      } else throw new Error(`Unknown option: ${args[i]}`);
    }
    if (!input) throw new Error(`${command} requires --input`);
    if (command === 'evidence-check' && !taskFile) throw new Error('evidence-check requires --task task.json');
    if (command !== 'evidence-check' && (taskFile || exceptionsFile)) throw new Error('--task and --exceptions apply only to evidence-check');
    const task = JSON.parse(readFileSync(command === 'evidence-check' ? taskFile : input, 'utf8'));
    if (!task || Array.isArray(task) || typeof task !== 'object' || Object.keys(task).some(k => !['prompt', 'files', 'action', 'risks'].includes(k))) throw new Error('Invalid task input');
    const packet = createPacket(task.prompt, loadConfig(resolve(project)), task);
    if (command === 'packet') console.log(json ? JSON.stringify(packet, null, 2) : renderPacket(packet));
    else if (command === 'checklist') console.log(renderChecklist(packet));
    else if (command === 'evidence-init') console.log(JSON.stringify(createEvidence(packet), null, 2));
    else {
      const exceptions = exceptionsFile ? JSON.parse(readFileSync(exceptionsFile, 'utf8')) : [];
      const report = checkEvidence(packet, JSON.parse(readFileSync(input, 'utf8')), exceptions);
      console.log(JSON.stringify(report, null, 2));
      if (!report.ready || report.exceptionHealth.expired) process.exitCode = 1;
    }
  } else {
    throw new Error('Usage: ai-governance check-config [directory] | packet|checklist|evidence-init --input task.json [--project directory] | evidence-check --input evidence.json --task task.json [--exceptions exceptions.json] [--project directory]');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
