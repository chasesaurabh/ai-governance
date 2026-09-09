import { readFileSync } from 'node:fs';
import { scoreRuns } from '../lib/model-evaluation.js';
try {
  if (!process.argv[2]) throw new Error('Usage: node scripts/score-model-runs.js reviewed-runs.json');
  console.log(JSON.stringify(scoreRuns(JSON.parse(readFileSync(process.argv[2], 'utf8')), JSON.parse(readFileSync('eval/router-cases.json', 'utf8'))), null, 2));
} catch (error) { console.error(error.message); process.exitCode = 1; }
