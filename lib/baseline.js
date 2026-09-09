import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { contentAt, changes } from './git.js';
import { safePath } from './installer.js';
const protectedRules = new Set(['AUTH-001', 'CI-001', 'DB-001']);
export function baselineKey(report, finding, snapshot) {
  const file = report.files.find(f => f.path === finding.path);
  return createHash('sha256').update(JSON.stringify({ rule: finding.rule, path: finding.path, content: contentAt(snapshot, file), ruleVersion: 1 })).digest('hex');
}
export function createBaseline(root, report, options) {
  const snapshot = changes(root, options);
  return { schemaVersion: 1, entries: report.findings.filter(f => !protectedRules.has(f.rule) && f.severity !== 'info').map(f => ({ key: baselineKey(report, f, snapshot), rule: f.rule, path: f.path })) };
}
export function applyBaseline(root, report, options) {
  const path = safePath(root, 'governance.baseline.json');
  if (!existsSync(path)) return report;
  const baseline = JSON.parse(readFileSync(path, 'utf8'));
  if (baseline.schemaVersion !== 1 || !Array.isArray(baseline.entries) || baseline.entries.some(e => !e || typeof e.key !== 'string' || !/^[a-f0-9]{64}$/.test(e.key))) throw new Error('Invalid baseline');
  const snapshot = changes(root, options);
  return { ...report, findings: report.findings.map(f => ({ ...f, baselined: !protectedRules.has(f.rule) && baseline.entries.some(e => e.key === baselineKey(report, f, snapshot)) })) };
}
