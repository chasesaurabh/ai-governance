import { existsSync, readFileSync, readdirSync, lstatSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname, relative, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';

export const adapters = {
  windsurf: ['.windsurfrules', '.windsurf'],
  cursor: ['.cursorrules', '.cursor'],
  copilot: ['.github/copilot-instructions.md'],
  claude: ['CLAUDE.md'],
  aider: ['.aider'],
};
const statePath = '.ai-governance-install.json';
const start = '<!-- ai-governance: start -->';
const end = '<!-- ai-governance: end -->';
const hash = value => createHash('sha256').update(value).digest('hex');
const read = path => readFileSync(path, 'utf8');
function safePath(root, name) {
  const path = resolve(root, name);
  const rel = relative(root, path);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`Path escapes installation: ${name}`);
  for (let p = path; ; p = dirname(p)) {
    if (existsSync(p) && lstatSync(p).isSymbolicLink()) throw new Error(`Symlink not supported: ${p}`);
    if (p !== path && existsSync(p) && !lstatSync(p).isDirectory()) throw new Error(`Parent is not a directory: ${p}`);
    if (p === dirname(p)) break;
  }
  return path;
}
function walk(root, name) {
  const path = safePath(root, name);
  if (!existsSync(path)) throw new Error(`Missing package file: ${name}`);
  return lstatSync(path).isDirectory()
    ? readdirSync(path).sort().flatMap(child => walk(root, `${name}/${child}`)) : [name];
}
function loadState(target) {
  const path = safePath(target, statePath);
  if (!existsSync(path)) return { schemaVersion: 1, tools: [], files: {} };
  const state = JSON.parse(read(path));
  if (state.schemaVersion !== 1 || !Array.isArray(state.tools) || !state.files || typeof state.files !== 'object') throw new Error('Invalid installation manifest');
  return state;
}
function blockContent(value) {
  if (!value.includes(start) && !value.includes(end)) return null;
  if (value.split(start).length !== 2 || value.split(end).length !== 2 || value.indexOf(end) < value.indexOf(start)) throw new Error('Malformed governance managed block');
  return value.slice(value.indexOf(start), value.indexOf(end) + end.length);
}
export function planInstall(source, target, tools = []) {
  source = resolve(source); target = resolve(target);
  if (source === target) throw new Error('Choose a target other than the framework source');
  for (const tool of tools) if (!Object.hasOwn(adapters, tool)) throw new Error(`Unknown tool: ${tool}`);
  safePath(target, statePath);
  const state = loadState(target);
  const selected = [...new Set([...state.tools, ...tools])];
  for (const tool of selected) if (!Object.hasOwn(adapters, tool)) throw new Error(`Unknown installed tool: ${tool}`);
  const core = ['ai-governance', 'GOVERNANCE-MATRIX.md', 'examples/ci'];
  const adapterFiles = new Set(selected.flatMap(tool => adapters[tool].flatMap(name => walk(source, name))));
  const files = [...new Set([...core.flatMap(name => walk(source, name)), ...adapterFiles])];
  const records = { ...state.files };
  const changes = files.map(name => {
    const dest = safePath(target, name);
    const upstream = read(safePath(source, name));
    const current = existsSync(dest) ? read(dest) : null;
    const previous = state.files[name];
    const managed = adapterFiles.has(name) && !name.startsWith('.windsurf/') && !name.startsWith('.cursor/');
    let content = upstream;
    let status = current === null ? 'add' : 'conflict';
    let tracked;
    if (managed) {
      const block = `${start}\n${upstream.trim()}\n${end}`;
      const old = current === null ? null : blockContent(current);
      tracked = block;
      if (current === null) content = `${block}\n`;
      else if (old === block) { status = 'unchanged'; content = current; }
      else if (old && previous?.hash === hash(old)) { status = 'update'; content = current.replace(old, block); }
      else if (!old && !previous) { status = 'integrate'; content = `${current.trimEnd()}\n\n${block}\n`; }
    } else {
      tracked = upstream;
      if (current === upstream) status = 'unchanged';
      else if (current !== null && previous?.hash === hash(current)) status = 'update';
    }
    if (status !== 'conflict') records[name] = { hash: hash(tracked), managed };
    return { path: name, status, content };
  });
  const version = JSON.parse(read(join(source, 'package.json'))).version;
  return { target, changes, manifest: { schemaVersion: 1, version, tools: selected, files: records } };
}
export function applyInstall(plan) {
  for (const change of plan.changes) {
    if (['conflict', 'unchanged'].includes(change.status)) continue;
    const dest = safePath(plan.target, change.path);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, change.content);
  }
  mkdirSync(plan.target, { recursive: true });
  writeFileSync(safePath(plan.target, statePath), `${JSON.stringify(plan.manifest, null, 2)}\n`);
}
export function doctor(target) {
  target = resolve(target);
  if (!existsSync(safePath(target, statePath))) throw new Error('No installation manifest; run setup first');
  const state = loadState(target);
  return Object.entries(state.files).map(([name, record]) => {
    const path = safePath(target, name);
    if (!existsSync(path)) return { path: name, status: 'missing' };
    const value = read(path);
    const tracked = record.managed ? blockContent(value) : value;
    return { path: name, status: tracked !== null && hash(tracked) === record.hash ? 'ok' : 'modified' };
  });
}
