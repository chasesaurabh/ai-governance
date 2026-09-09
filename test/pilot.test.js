import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from '../test-support/fixtures.js';
import { readLocal } from '../lib/local-state.js';
import { startPilot, stopPilot, pilotEvent, summarizePilot } from '../lib/pilot.js';
test('pilot is opt-in, keeps only allowed metrics and can be disabled', t => {
  const root = fixture(t);
  pilotEvent(root, 'check', { durationMs: 10 }); assert.equal(readLocal(root, 'pilot.json'), null);
  startPilot(root, 'devin');
  pilotEvent(root, 'check', { durationMs: 20, findings: 1, missingTools: 0 });
  pilotEvent(root, 'feedback', { rule: 'TEST-001', rating: 'useful' });
  assert.throws(() => pilotEvent(root, 'check', { source: 'private code' }));
  const report = summarizePilot(readLocal(root, 'pilot.json'));
  assert.equal(report.checks, 1); assert.equal(report.usefulFindings, 1); assert.equal(report.averageCheckMs, 20);
  stopPilot(root); pilotEvent(root, 'check', { durationMs: 10 });
  assert.equal(summarizePilot(readLocal(root, 'pilot.json')).checks, 1);
});
