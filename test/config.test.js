import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { catalog, validateCatalog, resolveConfig } from '../lib/config.js';
test('catalog references real policy controls across all 17 policies', () => {
  validateCatalog();
  assert.equal(new Set(catalog.controls.map(c => c.policy)).size, 17);
  for (const control of catalog.controls) {
    assert.ok(existsSync(control.source));
    assert.ok(readFileSync(control.source, 'utf8').includes(`### ${control.id}:`));
  }
});
test('profile defaults and explicit project overrides have deterministic precedence', () => {
  assert.equal(resolveConfig().thresholds.coverage, 80);
  assert.equal(resolveConfig({ profile: 'starter' }).thresholds.coverage, 60);
  assert.equal(resolveConfig({ profile: 'team', thresholds: { coverage: 85 } }).thresholds.coverage, 85);
  assert.deepEqual(resolveConfig().commands, {});
});
test('invalid configuration and weakened safeguards are rejected', () => {
  for (const config of [
    { profile: 'unknown' }, { typo: true }, { thresholds: { coverage: 101 } },
    { commands: { deploy: 'something' } }, { commands: { test: '' } },
    { overrides: { 'CTRL-999.1': { severity: 'warning' } } },
    { overrides: { 'CTRL-017.1': { severity: 'warning' } } },
    { riskPaths: { security: ['../secrets'] } },
    { profile: 'regulated', thresholds: { coverage: 20 } },
  ]) assert.throws(() => resolveConfig(config));
});
