import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { checkCoverage } = createRequire(import.meta.url)('../examples/ci/check-coverage.cjs');
test('coverage rejects absent, malformed and below-threshold evidence', () => {
  for (const pct of [undefined, null, '90', NaN, -1, 101, 79]) {
    assert.throws(() => checkCoverage({ total: { lines: { pct } } }, 80));
  }
  assert.throws(() => checkCoverage({}, 80));
  assert.throws(() => checkCoverage({ total: { lines: { pct: 90 } } }, NaN));
  assert.equal(checkCoverage({ total: { lines: { pct: 80 } } }, 80), 80);
});
test('CI templates preserve untrusted text as data and require successful gates', () => {
  const yaml = readFileSync('examples/ci/github-actions/governance-gates.yml', 'utf8');
  assert.ok(!yaml.includes('PR_BODY="${{'));
  assert.match(yaml, /PR_BODY: \$\{\{ github.event.pull_request.body \}\}/);
  assert.equal((yaml.match(/!= "success"/g) || []).length, 5);
  assert.ok(!yaml.includes('|| true'));
});
