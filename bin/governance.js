#!/usr/bin/env node
import { resolve } from 'node:path';
import { loadConfig, validateCatalog } from '../lib/config.js';
import { readFileSync } from 'node:fs';
import { createPacket, renderPacket } from '../lib/packet.js';

try {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'check-config') {
    if (args.length > 1) throw new Error('check-config accepts one directory');
    validateCatalog();
    console.log(JSON.stringify(loadConfig(resolve(args[0] ?? '.')), null, 2));
  } else if (command === 'packet') {
    let input, project = '.', json = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--json') json = true;
      else if (['--input', '--project'].includes(args[i])) {
        const key = args[i];
        if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${key} requires a value`);
        if (key === '--input') input = args[++i]; else project = args[++i];
      } else throw new Error(`Unknown option: ${args[i]}`);
    }
    if (!input) throw new Error('packet requires --input task.json');
    const task = JSON.parse(readFileSync(input, 'utf8'));
    if (!task || Array.isArray(task) || typeof task !== 'object' || Object.keys(task).some(k => !['prompt', 'files', 'action', 'risks'].includes(k))) throw new Error('Invalid task input');
    const packet = createPacket(task.prompt, loadConfig(resolve(project)), task);
    console.log(json ? JSON.stringify(packet, null, 2) : renderPacket(packet));
  } else {
    throw new Error('Usage: ai-governance check-config [directory] | packet --input task.json [--project directory] [--json]');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
