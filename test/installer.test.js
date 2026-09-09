import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { planInstall, applyInstall, doctor } from '../lib/installer.js';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'governance-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = join(root, 'source'), target = join(root, 'target');
  mkdirSync(join(source, 'ai-governance'), { recursive: true });
  mkdirSync(join(source, 'examples/ci'), { recursive: true });
  writeFileSync(join(source, 'package.json'), '{"version":"1.0.0"}');
  writeFileSync(join(source, 'ai-governance/core.md'), 'original');
  writeFileSync(join(source, 'GOVERNANCE-MATRIX.md'), 'matrix');
  writeFileSync(join(source, 'examples/ci/check.cjs'), 'helper');
  writeFileSync(join(source, 'CLAUDE.md'), 'adapter');
  return { source, target };
}
test('preview is read-only; install and rerun preserve files; upgrades replace only upstream content', t => {
  const { source, target } = fixture(t);
  const plan = planInstall(source, target, ['claude']);
  assert.equal(existsSync(target), false);
  applyInstall(plan);
  assert.ok(doctor(target).every(item => item.status === 'ok'));
  assert.ok(planInstall(source, target).changes.every(item => item.status === 'unchanged'));
  writeFileSync(join(source, 'ai-governance/core.md'), 'updated');
  applyInstall(planInstall(source, target));
  assert.equal(readFileSync(join(target, 'ai-governance/core.md'), 'utf8'), 'updated');
  writeFileSync(join(target, 'ai-governance/core.md'), 'customized');
  writeFileSync(join(source, 'ai-governance/core.md'), 'new upstream');
  const conflict = planInstall(source, target);
  assert.equal(conflict.changes.find(item => item.path.endsWith('core.md')).status, 'conflict');
  applyInstall(conflict);
  assert.equal(readFileSync(join(target, 'ai-governance/core.md'), 'utf8'), 'customized');
});
test('adapter integration preserves user text and detects modified managed blocks', t => {
  const { source, target } = fixture(t);
  mkdirSync(target);
  writeFileSync(join(target, 'CLAUDE.md'), 'My instructions');
  applyInstall(planInstall(source, target, ['claude']));
  writeFileSync(join(source, 'CLAUDE.md'), 'new adapter');
  applyInstall(planInstall(source, target));
  const path = join(target, 'CLAUDE.md');
  assert.match(readFileSync(path, 'utf8'), /^My instructions/);
  assert.match(readFileSync(path, 'utf8'), /new adapter/);
  writeFileSync(path, readFileSync(path, 'utf8').replace('new adapter', 'custom adapter'));
  assert.equal(planInstall(source, target).changes.find(item => item.path === 'CLAUDE.md').status, 'conflict');
});
test('invalid tools and source target are rejected before writes', t => {
  const { source, target } = fixture(t);
  assert.throws(() => planInstall(source, target, ['unknown']), /Unknown tool/);
  assert.throws(() => planInstall(source, source), /framework source/);
  assert.equal(existsSync(target), false);
});
