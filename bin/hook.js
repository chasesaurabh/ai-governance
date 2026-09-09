#!/usr/bin/env node
import { hookResponse } from '../lib/integrations.js';
// Host payload is consumed but not persisted or trusted for filesystem selection.
let length = 0;
try {
  for await (const chunk of process.stdin) { length += chunk.length; if (length > 1024 * 1024) throw new Error('Hook input too large'); }
  console.log(JSON.stringify(hookResponse(process.argv[2], process.cwd())));
} catch { console.log('{}'); }
