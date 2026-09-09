import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { safePath } from './installer.js';
const read = path => JSON.parse(readFileSync(path, 'utf8'));
export function mergeSettings(base, override) {
  const result = { ...base, ...override };
  for (const key of ['commands', 'thresholds', 'riskPaths', 'overrides', 'owners']) result[key] = { ...base[key], ...override[key] };
  result.requiredChecks = [...new Set([...(base.requiredChecks ?? []), ...(override.requiredChecks ?? [])])];
  return result;
}
export function readPacks(root, specs = [], requireLock = true) {
  if (!Array.isArray(specs)) throw new Error('packs must be an array');
  const lockPath = safePath(root, 'governance.packs.lock.json');
  const lock = existsSync(lockPath) ? read(lockPath) : { schemaVersion: 1, packs: [] };
  if (lock.schemaVersion !== 1 || !Array.isArray(lock.packs)) throw new Error('Invalid pack lock');
  const seen = new Set();
  return specs.map(spec => {
    if (!spec || typeof spec.path !== 'string' || !spec.path || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(spec.version) || Object.keys(spec).some(k => !['path', 'version'].includes(k)) || seen.has(spec.path)) throw new Error('Packs require unique paths and exact versions');
    seen.add(spec.path);
    const pkgPath = safePath(root, `${spec.path}/package.json`), dataPath = safePath(root, `${spec.path}/governance-pack.json`);
    const pkg = read(pkgPath), data = read(dataPath);
    if (pkg.version !== spec.version || typeof pkg.name !== 'string') throw new Error(`Pack version mismatch: ${spec.path}`);
    if (data.schemaVersion !== 1 || !data.config || typeof data.config !== 'object' || Array.isArray(data.config)) throw new Error('Invalid governance pack');
    if (Object.keys(data).some(k => !['schemaVersion', 'config', 'minimums', 'protectedControls', 'owner', 'escalation'].includes(k))) throw new Error('Unknown pack field');
    if (['packs', 'scopes'].some(k => Object.hasOwn(data.config, k))) throw new Error('Nested packs/scopes are not allowed in pack defaults');
    for (const field of ['owner', 'escalation']) if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`Pack needs ${field}`);
    const integrity = `sha256-${createHash('sha256').update(readFileSync(pkgPath)).update('\0').update(readFileSync(dataPath)).digest('hex')}`;
    if (requireLock && !lock.packs.some(p => p.path === spec.path && p.version === spec.version && p.integrity === integrity)) throw new Error(`Unpinned or modified policy pack: ${spec.path}; review pack-lock --write`);
    return { path: spec.path, name: pkg.name, version: pkg.version, integrity, data };
  });
}
export function enforcePackMinimums(config, packs, controlIds) {
  for (const { data } of packs) {
    const minimums = data.minimums ?? {};
    if (!minimums || typeof minimums !== 'object' || Array.isArray(minimums)) throw new Error('Invalid pack minimums');
    for (const [key, min] of Object.entries(minimums)) {
      if (!['coverage', 'reviewers'].includes(key) || !Number.isFinite(min) || min < 0 || (key === 'coverage' && min > 100) || (key === 'reviewers' && (!Number.isInteger(min) || min < 1))) throw new Error(`Invalid pack minimum: ${key}`);
      if (config.thresholds[key] < min) throw new Error(`Organization minimum ${key} is ${min}`);
    }
    if (!Array.isArray(data.protectedControls ?? [])) throw new Error('Invalid protectedControls');
    for (const id of data.protectedControls ?? []) {
      if (!controlIds.includes(id)) throw new Error(`Unknown organization control: ${id}`);
      if (config.overrides[id]?.severity === 'warning') throw new Error(`Organization control cannot be weakened: ${id}`);
    }
    if (['discover', 'assist', 'enforce'].indexOf(config.mode) < ['discover', 'assist', 'enforce'].indexOf(data.config.mode ?? 'discover')) throw new Error('Organization enforcement mode cannot be weakened');
  }
}
