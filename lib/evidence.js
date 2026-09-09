import { createHash } from 'node:crypto';
import { catalog } from './config.js';
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
export const packetDigest = packet => createHash('sha256').update(JSON.stringify(packet)).digest('hex');
export function createEvidence(packet) {
  return {
    schemaVersion: 1, packetDigest: packetDigest(packet),
    controls: packet.controls.map(c => ({ id: c.id, status: 'not_run', references: [], reason: 'Verification not yet performed', exception: null })),
  };
}
export function validateExceptions(exceptions = [], now = new Date()) {
  if (!Array.isArray(exceptions)) throw new Error('Exceptions must be an array');
  const ids = new Set();
  return exceptions.map(e => {
    if (!e || !nonempty(e.id) || ids.has(e.id)) throw new Error('Missing or duplicate exception ID');
    ids.add(e.id);
    const control = catalog.controls.find(c => c.id === e.control);
    if (!control || !control.exceptionAllowed) throw new Error(`Unknown or protected exception control: ${e.control}`);
    for (const field of ['owner', 'reason', 'remediation', 'approval']) if (!nonempty(e[field])) throw new Error(`Exception ${e.id} needs ${field}`);
    if (!/^[a-f0-9]{64}$/.test(e.packetDigest)) throw new Error(`Exception ${e.id} needs a scoped packetDigest`);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(e.expiresAt) || !Number.isFinite(Date.parse(e.expiresAt)) || new Date(e.expiresAt).toISOString().replace('.000Z', 'Z') !== e.expiresAt) throw new Error(`Exception ${e.id} needs a valid UTC expiry`);
    const remainingMs = Date.parse(e.expiresAt) - now.getTime();
    return { ...e, health: remainingMs <= 0 ? 'expired' : remainingMs <= 7 * 86400000 ? 'expiring' : 'active' };
  });
}
export function checkEvidence(packet, record, exceptions = [], now = new Date()) {
  const digest = packetDigest(packet);
  if (!record || record.schemaVersion !== 1 || record.packetDigest !== digest || !Array.isArray(record.controls)) throw new Error('Evidence does not match this task packet; regenerate for changed task/config/catalog');
  const exceptionList = validateExceptions(exceptions, now);
  const expected = new Map(packet.controls.map(c => [c.id, c]));
  const seen = new Set();
  const results = [];
  for (const item of record.controls) {
    const control = expected.get(item.id);
    if (!control || seen.has(item.id)) throw new Error(`Unknown or duplicate evidence control: ${item.id}`);
    seen.add(item.id);
    if (!['passed', 'failed', 'not_run', 'not_applicable'].includes(item.status)) throw new Error(`Invalid status: ${item.id}`);
    if (!Array.isArray(item.references) || item.references.some(ref => !nonempty(ref))) throw new Error(`Invalid references: ${item.id}`);
    if (item.status === 'passed' && !item.references.length) throw new Error(`Passing control needs evidence: ${item.id}`);
    if (item.status !== 'passed' && !nonempty(item.reason)) throw new Error(`Status needs a reason: ${item.id}`);
    if (item.status === 'not_applicable' && !control.exceptionAllowed) throw new Error(`Protected control cannot be marked not_applicable: ${item.id}`);
    let excepted = false;
    if (item.exception !== null && item.exception !== undefined) {
      const e = exceptionList.find(e => e.id === item.exception);
      if (!e || e.control !== item.id || e.packetDigest !== digest || e.health === 'expired') throw new Error(`Invalid, expired or out-of-scope exception: ${item.id}`);
      excepted = true;
    }
    const satisfied = ['passed', 'not_applicable'].includes(item.status);
    results.push({ id: item.id, status: item.status, excepted, blocking: control.severity === 'error' && !satisfied && !excepted });
  }
  for (const c of packet.controls) if (!seen.has(c.id)) results.push({ id: c.id, status: 'missing', excepted: false, blocking: c.severity === 'error' });
  const counts = Object.fromEntries(['passed', 'failed', 'not_run', 'not_applicable', 'missing'].map(status => [status, results.filter(r => r.status === status).length]));
  return {
    scope: 'Evidence structure and declared results only; references and approvals require independent verification.',
    ready: !packet.routing.needsClarification && !results.some(r => r.blocking),
    verificationComplete: !packet.routing.needsClarification && results.every(r => ['passed', 'not_applicable'].includes(r.status)),
    counts, exceptionCount: results.filter(r => r.excepted).length,
    exceptionHealth: Object.fromEntries(['active', 'expiring', 'expired'].map(health => [health, exceptionList.filter(e => e.health === health).length])),
    evidenceCompletionPercent: results.length ? Math.round(100 * results.filter(r => ['passed', 'not_applicable'].includes(r.status)).length / results.length) : 100,
    results,
  };
}
export function renderChecklist(packet) {
  return `# Task evidence checklist\n\nActions: ${packet.routing.sequence.join(' → ')}\nPacket: ${packetDigest(packet)}\n\n${packet.controls.map(c => `- [ ] ${c.id}: ${c.requirement}\n  Evidence needed: ${c.evidence}. Status: not_run.`).join('\n')}\n\nDo not mark complete without evidence. For structured validation, use evidence-init and evidence-check.\n`;
}
