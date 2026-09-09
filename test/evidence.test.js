import test from 'node:test';
import assert from 'node:assert/strict';
import { createPacket } from '../lib/packet.js';
import { resolveConfig } from '../lib/config.js';
import { createEvidence, checkEvidence, validateExceptions } from '../lib/evidence.js';
const packet = createPacket('Fix a bug', resolveConfig());
function complete() {
  const record = createEvidence(packet);
  record.controls.forEach(c => { c.status = 'passed'; c.references = ['ci://run/123/check']; c.reason = ''; });
  return record;
}
test('missing and unverified evidence never counts as complete', () => {
  assert.equal(checkEvidence(packet, createEvidence(packet)).ready, false);
  const record = complete();
  assert.equal(checkEvidence(packet, record).verificationComplete, true);
  record.controls.pop();
  assert.equal(checkEvidence(packet, record).ready, false);
  record.controls[0].references = [];
  assert.throws(() => checkEvidence(packet, record), /needs evidence/);
});
test('task/config changes and duplicate or fabricated control IDs invalidate evidence', () => {
  assert.throws(() => checkEvidence(createPacket('Deploy', resolveConfig()), complete()), /does not match/);
  assert.throws(() => checkEvidence(createPacket('Fix a different bug', resolveConfig()), complete()), /does not match/);
  const record = complete(); record.controls.push(record.controls[0]);
  assert.throws(() => checkEvidence(packet, record), /duplicate/);
});
test('exceptions are scoped, expiring and cannot waive protected controls', () => {
  const record = complete();
  const control = record.controls.find(c => c.id === 'CTRL-004.1');
  control.status = 'not_run'; control.reason = 'Tool unavailable'; control.exception = 'EX-1';
  const exception = { id: 'EX-1', control: control.id, packetDigest: record.packetDigest, owner: 'Team lead', reason: 'Migration underway', remediation: 'issue/42', approval: 'review/12', expiresAt: '2030-01-10T00:00:00Z' };
  const result = checkEvidence(packet, record, [exception], new Date('2030-01-01'));
  assert.equal(result.ready, true); assert.equal(result.verificationComplete, false);
  assert.throws(() => checkEvidence(packet, record, [exception], new Date('2030-02-01')), /expired/);
  assert.throws(() => validateExceptions([{ ...exception, control: 'CTRL-017.1' }]), /protected/);
  assert.throws(() => validateExceptions([{ ...exception, owner: '' }]), /owner/);
  assert.throws(() => validateExceptions([{ ...exception, expiresAt: '2030-02-30T00:00:00Z' }]), /expiry/);
});
