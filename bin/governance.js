#!/usr/bin/env node
import { resolve } from 'node:path';
import { loadConfig, validateCatalog } from '../lib/config.js';

try {
  const [command, directory = '.'] = process.argv.slice(2);
  if (command === 'check-config') {
    validateCatalog();
    console.log(JSON.stringify(loadConfig(resolve(directory)), null, 2));
  } else {
    throw new Error('Usage: ai-governance check-config [directory]');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
