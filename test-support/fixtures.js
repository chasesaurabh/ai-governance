import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { git } from '../lib/git.js';
export function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'governance-git-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, ['init']); git(root, ['config', 'user.email', 'test@example.invalid']); git(root, ['config', 'user.name', 'Test']);
  writeFileSync(join(root, 'package.json'), '{"name":"fixture"}'); git(root, ['add', '.']); git(root, ['commit', '-m', 'initial']);
  return root;
}
