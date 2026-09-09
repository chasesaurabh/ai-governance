import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { safePath } from './installer.js';
export const git = (root, args, options = {}) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'], ...options });
export function repository(root) {
  return resolve(git(root, ['rev-parse', '--show-toplevel']).trim());
}
export function changes(root, { staged = false, base } = {}) {
  root = repository(root);
  if (staged && base) throw new Error('Choose --staged or --base, not both');
  let head = null;
  try { head = git(root, ['rev-parse', '--verify', 'HEAD']).trim(); } catch { /* Unborn repository. */ }
  let baseline = head;
  if (base) {
    const ref = git(root, ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`]).trim();
    if (!head) throw new Error('--base needs a committed HEAD');
    baseline = git(root, ['merge-base', ref, head]).trim();
  }
  const args = ['diff', '--no-ext-diff', '--no-textconv', '--name-status', '-z', '--find-renames'];
  if (staged || !head) args.push('--cached');
  if (baseline) args.push(baseline);
  args.push('--');
  const fields = git(root, args).split('\0');
  const files = [];
  for (let i = 0; i < fields.length && fields[i];) {
    const status = fields[i++], oldPath = fields[i++];
    const path = /^[RC]/.test(status) ? fields[i++] : oldPath;
    if (!path) throw new Error('Malformed Git change output');
    files.push({ path, oldPath, status });
  }
  if (!staged) {
    for (const path of git(root, ['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean)) files.push({ path, oldPath: path, status: '??' });
  }
  return { root, staged, baseline, head, files };
}
export function contentAt(snapshot, file, before = false) {
  if (before) {
    if (!snapshot.baseline || file.status === '??' || file.status.startsWith('A')) return '';
    return git(snapshot.root, ['show', `${snapshot.baseline}:${file.oldPath}`]);
  }
  if (file.status === 'D') return '';
  if (snapshot.staged) return git(snapshot.root, ['show', `:${file.path}`]);
  const path = safePath(snapshot.root, file.path);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
