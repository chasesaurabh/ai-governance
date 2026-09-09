import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
export const catalog = JSON.parse(readFileSync(fileURLToPath(new URL('../ai-governance/controls.json', import.meta.url)), 'utf8'));
export const actions = ['explain', 'docs', 'review', 'security-review', 'feature', 'bugfix', 'refactor', 'new-project', 'deploy', 'incident', 'commit', 'clear-context', 'dependencies', 'architecture', 'clarify'];
export const risks = ['security', 'data', 'migration', 'production', 'api', 'dependencies'];
const profiles = {
  starter: { coverage: 60, reviewers: 1 },
  team: { coverage: 80, reviewers: 1 },
  regulated: { coverage: 90, reviewers: 2 },
};
const commandKeys = ['test', 'lint', 'build', 'coverage', 'secrets', 'sast', 'audit'];
function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${name} must be an object`);
}
function keys(value, allowed, name) {
  object(value, name);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) throw new Error(`Unknown ${name} key: ${key}`);
}
export function validateCatalog(value = catalog) {
  if (value.schemaVersion !== 1 || !Array.isArray(value.controls)) throw new Error('Invalid catalog');
  const ids = new Set();
  for (const c of value.controls) {
    if (!/^CTRL-\d{3}\.\d+$/.test(c.id) || ids.has(c.id)) throw new Error(`Invalid or duplicate control: ${c.id}`);
    ids.add(c.id);
    if (c.policy !== `POL-${c.id.slice(5, 8)}`) throw new Error(`Policy mismatch: ${c.id}`);
    for (const field of ['requirement', 'verification', 'evidence', 'source']) if (typeof c[field] !== 'string' || !c[field].trim()) throw new Error(`Missing ${field}: ${c.id}`);
    if (!['error', 'warning'].includes(c.severity) || typeof c.floor !== 'boolean' || typeof c.exceptionAllowed !== 'boolean') throw new Error(`Invalid severity or exception: ${c.id}`);
    if (c.floor && (c.severity !== 'error' || c.exceptionAllowed)) throw new Error(`Invalid security floor: ${c.id}`);
    object(c.applies_when, 'applies_when');
    for (const [key, allowed] of [['actions', actions], ['risks', risks], ['projectTypes', ['library', 'cli', 'web', 'service']]]) {
      if (!Array.isArray(c.applies_when[key]) || c.applies_when[key].some(v => !allowed.includes(v))) throw new Error(`Invalid applicability: ${c.id}`);
    }
  }
  return value;
}
export function resolveConfig(input = {}) {
  keys(input, ['schemaVersion', 'profile', 'projectType', 'commands', 'thresholds', 'riskPaths', 'overrides', 'execution'], 'config');
  if (input.schemaVersion !== undefined && input.schemaVersion !== 1) throw new Error('Unsupported config schemaVersion');
  const profile = input.profile ?? 'team';
  if (!Object.hasOwn(profiles, profile)) throw new Error(`Unknown profile: ${profile}`);
  const projectType = input.projectType ?? 'library';
  if (!['library', 'cli', 'web', 'service'].includes(projectType)) throw new Error(`Unknown projectType: ${projectType}`);
  const execution = input.execution ?? 'standard';
  if (!['standard', 'guided'].includes(execution)) throw new Error('execution must be standard or guided');
  const commands = input.commands ?? {};
  keys(commands, commandKeys, 'commands');
  for (const value of Object.values(commands)) if (value !== null && (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value))) throw new Error('Commands must be nonempty single-line strings or null');
  keys(input.thresholds ?? {}, ['coverage', 'reviewers', 'functionLines', 'complexity'], 'thresholds');
  const thresholds = { ...profiles[profile], functionLines: 80, complexity: 15, ...input.thresholds };
  for (const [key, value] of Object.entries(thresholds)) {
    if (!Number.isFinite(value) || value < (key === 'coverage' ? 0 : 1) || (key === 'coverage' && value > 100) || (key !== 'coverage' && !Number.isInteger(value))) throw new Error(`Invalid threshold: ${key}`);
  }
  if (profile === 'regulated' && (thresholds.coverage < 90 || thresholds.reviewers < 2)) throw new Error('Regulated profile minimums cannot be reduced');
  const riskPaths = input.riskPaths ?? {};
  keys(riskPaths, risks, 'riskPaths');
  for (const paths of Object.values(riskPaths)) {
    if (!Array.isArray(paths) || paths.some(p => typeof p !== 'string' || !p || p.startsWith('/') || p.includes('..') || /[:\\*]/.test(p))) throw new Error('Risk paths must be relative forward-slash prefixes without wildcards');
  }
  const overrides = input.overrides ?? {};
  object(overrides, 'overrides');
  for (const [id, override] of Object.entries(overrides)) {
    const control = catalog.controls.find(c => c.id === id);
    if (!control) throw new Error(`Unknown control: ${id}`);
    keys(override, ['severity'], 'override');
    if (!['error', 'warning'].includes(override.severity)) throw new Error(`Invalid severity: ${id}`);
    if (control.floor && override.severity !== 'error') throw new Error(`Security floor cannot be weakened: ${id}`);
    if (profile === 'regulated' && override.severity !== 'error') throw new Error('Regulated controls must remain blocking');
  }
  return { schemaVersion: 1, profile, projectType, execution, commands, thresholds, riskPaths, overrides };
}
export function loadConfig(root) {
  const path = join(root, 'governance.config.json');
  return resolveConfig(existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {});
}
validateCatalog();
