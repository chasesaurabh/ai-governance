import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixture } from '../test-support/fixtures.js';
import { trustProject, runChecks, verificationSummary } from '../lib/runner.js';
test('runner requires trust, observes outcomes and invalidates changed source/config', async t => {
  const root = fixture(t);
  writeFileSync(join(root, 'governance.config.json'), JSON.stringify({ commands: { test: 'node -e "process.exit(0)"' } }));
  await assert.rejects(runChecks(root), /trust/);
  trustProject(root);
  assert.equal((await runChecks(root)).complete, true);
  assert.equal((await runChecks(root)).results[0].cached, true);
  writeFileSync(join(root, 'new.js'), '// changed');
  assert.equal(verificationSummary(root)[0].status, 'stale');
  writeFileSync(join(root, 'governance.config.json'), JSON.stringify({ commands: { test: 'node -e "process.exit(1)"' } }));
  await assert.rejects(runChecks(root), /trust/);
  trustProject(root); assert.equal((await runChecks(root)).results[0].status, 'failed');
});
test('runner terminates timed out processes and does not store stdout', async t => {
  const root = fixture(t);
  writeFileSync(join(root, 'governance.config.json'), JSON.stringify({ commands: { test: 'node -e "console.log(123);setTimeout(()=>{},5000)"' } }));
  trustProject(root);
  const result = await runChecks(root, { timeoutMs: 300 });
  assert.equal(result.results[0].status, 'timed_out');
  assert.equal(result.complete, false);
  assert.equal(result.results[0].stdout, undefined);
});
