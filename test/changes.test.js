import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { git, changes } from '../lib/git.js';
import { checkChanges } from '../lib/check.js';
export function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'governance-git-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, ['init']); git(root, ['config', 'user.email', 'test@example.invalid']); git(root, ['config', 'user.name', 'Test']);
  writeFileSync(join(root, 'package.json'), '{"name":"fixture"}'); git(root, ['add', '.']); git(root, ['commit', '-m', 'initial']);
  return root;
}
test('staged checks use index content rather than unstaged dependency edits', t => {
  const root = fixture(t);
  writeFileSync(join(root, 'package.json'), '{"name":"fixture","dependencies":{"example":"1"}}'); git(root, ['add', '.']);
  writeFileSync(join(root, 'package.json'), '{"name":"fixture"}');
  assert.ok(checkChanges(root, { staged: true }).findings.some(f => f.rule === 'DEP-001'));
  assert.ok(!checkChanges(root).findings.some(f => f.rule === 'DEP-001'));
});
test('untracked files, documentation, renames and unsafe refs are handled', t => {
  const root = fixture(t);
  writeFileSync(join(root, 'a file.md'), 'docs');
  assert.equal(checkChanges(root).findings[0].rule, 'DOC-001');
  assert.equal(checkChanges(root, { staged: true }).files.length, 0);
  git(root, ['add', '.']); git(root, ['commit', '-m', 'docs']); git(root, ['mv', 'a file.md', 'renamed file.md']);
  assert.match(changes(root, { staged: true }).files[0].status, /^R/);
  assert.throws(() => changes(root, { base: '--help' }));
  assert.throws(() => changes(root, { base: 'HEAD', staged: true }));
});
