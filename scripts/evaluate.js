import { readFileSync } from 'node:fs';
import { createPacket, renderPacket } from '../lib/packet.js';
import { resolveConfig } from '../lib/config.js';
const cases = JSON.parse(readFileSync('eval/router-cases.json', 'utf8'));
const config = resolveConfig({ projectType: 'web' });
const failures = [];
for (const item of cases) {
  const packet = createPacket(item.prompt, config);
  if (JSON.stringify(packet.routing.sequence) !== JSON.stringify(item.expected)) failures.push({ id: item.id, expected: item.expected, actual: packet.routing.sequence });
  for (const id of item.requiredControls ?? []) if (!packet.controls.some(c => c.id === id)) failures.push({ id: item.id, missingControl: id });
}
const estimate = text => Math.ceil(text.length / 4);
const bootstrap = estimate(readFileSync('ai-governance/GOVERNANCE-RULES.md', 'utf8'));
const adapter = estimate(readFileSync('CLAUDE.md', 'utf8'));
const packet = estimate(renderPacket(createPacket('Add a search endpoint', config)));
const result = { scope: 'Deterministic rule tests, not model performance. Token estimates use characters / 4.', cases: cases.length, failedChecks: failures.length, failures,
  estimatedTokens: { bootstrap, claudeAdapter: adapter, featurePacket: packet, combined: bootstrap + adapter + packet },
  budgets: { bootstrap: 550, claudeAdapter: 180, featurePacket: 1800 },
};
console.log(JSON.stringify(result, null, 2));
if (failures.length || bootstrap > 550 || adapter > 180 || packet > 1800) process.exitCode = 1;
