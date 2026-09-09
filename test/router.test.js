import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveConfig } from '../lib/config.js';
import { route } from '../lib/router.js';
import { createPacket, renderPacket } from '../lib/packet.js';
const config = resolveConfig();
test('action routing respects requested sequence, read-only requests and security as a risk', () => {
  for (const [prompt, sequence] of [
    ['Refactor the API then deploy', ['refactor', 'deploy']],
    ['Fix this bug and then deploy to staging', ['bugfix', 'deploy']],
    ['Add authentication', ['feature']],
    ['Explain our incident workflow', ['explain']],
    ['What does "site is down" mean?', ['explain']],
    ['Review the deployment documentation', ['review']],
    ['Add search, do not deploy', ['feature']],
    ['Something is off', ['clarify']],
  ]) assert.deepEqual(route(prompt, config).sequence, sequence, prompt);
});
test('risk paths select controls and HTTP controls do not apply to CLI projects', () => {
  const web = resolveConfig({ projectType: 'web', riskPaths: { security: ['src/auth/'], api: ['src/api/'] } });
  const packet = createPacket('Add a handler', web, { files: ['src/auth/handler.js', 'src/api/routes.js'] });
  assert.ok(packet.controls.some(c => c.id === 'CTRL-006.5'));
  assert.ok(packet.controls.some(c => c.id === 'CTRL-006.7'));
  assert.ok(!createPacket('Add an API client', resolveConfig({ projectType: 'cli' })).controls.some(c => c.id === 'CTRL-006.7'));
});
test('guided execution preserves controls and unavailable commands are explicit', () => {
  const normal = createPacket('Fix a bug', config);
  const guided = createPacket('Fix a bug', resolveConfig({ execution: 'guided' }));
  assert.deepEqual(normal.controls, guided.controls);
  assert.match(renderPacket(guided), /Missing commands are unavailable/);
  assert.match(renderPacket(guided), /two unsuccessful/);
  assert.equal(createPacket('Explain the code', config).controls.length, 2);
});
