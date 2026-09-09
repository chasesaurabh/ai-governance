import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { discover } from '../lib/discovery.js';
test('discovery distinguishes manifest scripts from suggestions across stacks', t => {
  const root = mkdtempSync(join(tmpdir(), 'governance-discovery-')); t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node --test', lint: 'eslint .' }, dependencies: { react: '*' } }));
  for (const [name, manifest] of Object.entries({ python: 'pyproject.toml', java: 'pom.xml', go: 'go.mod', dotnet: 'App.csproj', gradle: 'build.gradle' })) {
    mkdirSync(join(root, name)); writeFileSync(join(root, name, manifest), '');
  }
  mkdirSync(join(root, 'node_modules')); writeFileSync(join(root, 'node_modules/package.json'), '{broken');
  const result = discover(root);
  assert.equal(result.packages.length, 6);
  assert.equal(result.config.projectType, 'web');
  assert.equal(result.config.commands.test, 'npm run test');
  assert.match(result.packages.find(p => p.stack === 'python').provenance.test, /suggested/);
  assert.equal(result.commandsExecuted, false);
});
