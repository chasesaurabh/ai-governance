import { mkdirSync, existsSync, readFileSync, writeFileSync, lstatSync, readlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { git, repository } from './git.js';
import { safePath } from './installer.js';
export const digest = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export function localPath(root, name) {
  const gitDir = resolve(root, git(root, ['rev-parse', '--absolute-git-dir']).trim());
  return safePath(gitDir, `ai-governance/${name}`);
}
export function readLocal(root, name, fallback = null) {
  const path = localPath(root, name);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
}
export function writeLocal(root, name, value) {
  const path = localPath(root, name);
  mkdirSync(resolve(path, '..'), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}
export function sourceFingerprint(root, config) {
  root = repository(root);
  const paths = [...new Set(git(root, ['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean))].sort();
  const hash = createHash('sha256').update(JSON.stringify(config));
  try { hash.update(git(root, ['rev-parse', '--verify', 'HEAD']).trim()); } catch { hash.update('unborn'); }
  hash.update(git(root, ['ls-files', '--stage', '-z']));
  for (const path of paths) {
    const full = join(root, path);
    hash.update(`\0${path}\0`);
    if (!existsSync(full)) { hash.update('missing'); continue; }
    if (lstatSync(full).isSymbolicLink()) { hash.update(`link:${readlinkSync(full)}`); continue; }
    if (lstatSync(full).isDirectory()) { hash.update('directory'); continue; }
    // Reject symlink ancestors rather than following them outside the repository.
    hash.update(readFileSync(safePath(root, path)));
  }
  return hash.digest('hex');
}
