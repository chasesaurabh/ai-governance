import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPacket } from '../lib/packet.js';
import { resolveConfig } from '../lib/config.js';
import { scoreRuns } from '../lib/model-evaluation.js';
const cases = JSON.parse(readFileSync('eval/router-cases.json', 'utf8'));
for (const item of cases) test(`routing evaluation: ${item.id}`, () => {
  const packet = createPacket(item.prompt, resolveConfig({ projectType: 'web' }));
  assert.deepEqual(packet.routing.sequence, item.expected, item.prompt);
  for (const id of item.requiredControls ?? []) assert.ok(packet.controls.some(c => c.id === id));
});
test('external scoring counts all token costs and rejects unreviewed or invalid results', () => {
  const run = { runId: '1', caseId: 'edge-6', model: 'test-model', reasoning: 'low', variant: 'compact', inputTokens: 100, outputTokens: 50, clarifications: 0, success: true, reviewed: true, sequence: ['feature'], metControls: ['CTRL-006.5', 'CTRL-017.1'] };
  const groups = scoreRuns([run, { ...run, runId: '2', metControls: [] }], cases);
  assert.equal(groups[0].successfulTasks, 1);
  assert.equal(groups[0].tokensPerSuccessfulTask, 300);
  assert.equal(groups[0].missedControlRuns, 1);
  assert.throws(() => scoreRuns([{ ...run, reviewed: false }], cases));
  assert.throws(() => scoreRuns([{ ...run, inputTokens: NaN }], cases));
});
