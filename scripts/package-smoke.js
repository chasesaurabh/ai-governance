import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = mkdtempSync(join(tmpdir(), 'governance-package-'));
const npm = process.env.npm_execpath;
if (!npm) throw new Error('Run through npm run test:package');
const run = (file, args, cwd = root) => execFileSync(file, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
try {
  const packed = JSON.parse(run(process.execPath, [npm, 'pack', '--json', '--pack-destination', root], process.cwd()))[0];
  if (packed.files.some(f => /MILESTONES\.local|\.git\//.test(f.path))) throw new Error('Local-only files entered package');
  for (const path of ['lib/config.js', 'lib/packet.js', 'lib/evidence.js', 'ai-governance/controls.json', '.cursor/rules/governance.mdc', 'examples/ci/check-coverage.cjs']) {
    if (!packed.files.some(f => f.path === path)) throw new Error(`Missing package file: ${path}`);
  }
  const consumer = join(root, 'consumer'); mkdirSync(consumer);
  writeFileSync(join(consumer, 'package.json'), '{"name":"governance-smoke","private":true}');
  run(process.execPath, [npm, 'install', join(root, packed.filename), '--ignore-scripts', '--no-audit', '--no-fund'], consumer);
  const installed = join(consumer, 'node_modules/ai-governance-setup');
  const target = join(root, 'target');
  run(process.execPath, [join(installed, 'bin/cli.js'), '--all', target]);
  run(process.execPath, [join(installed, 'bin/cli.js'), 'doctor', target]);
  const task = join(root, 'task.json'); writeFileSync(task, JSON.stringify({ prompt: 'Add search' }));
  const packet = JSON.parse(run(process.execPath, [join(installed, 'bin/governance.js'), 'packet', '--input', task, '--project', target, '--json']));
  if (packet.routing.sequence[0] !== 'feature' || !packet.controls.length) throw new Error('Installed packet generation failed');
  const evidence = run(process.execPath, [join(installed, 'bin/governance.js'), 'evidence-init', '--input', task, '--project', target]);
  writeFileSync(join(root, 'evidence.json'), evidence);
  let rejected = false;
  try { run(process.execPath, [join(installed, 'bin/governance.js'), 'evidence-check', '--input', join(root, 'evidence.json'), '--task', task, '--project', target]); }
  catch (error) { if (error.status === 1 && JSON.parse(error.stdout).ready === false) rejected = true; else throw error; }
  if (!rejected) throw new Error('Unverified evidence was accepted');
  // Exercise the daily workflow from the actual package, not source imports.
  run('git', ['init'], consumer);
  writeFileSync(join(consumer, '.gitignore'), 'node_modules/\n');
  writeFileSync(join(consumer, 'governance.config.json'), JSON.stringify({ commands: { test: 'node -e "process.exit(0)"' }, mode: 'enforce', requiredChecks: ['test'] }));
  const cli = join(installed, 'bin/governance.js');
  run(process.execPath, [cli, 'inspect', '--project', consumer, '--json']);
  run(process.execPath, [cli, 'init', '--project', consumer, '--tools', 'claude,cursor,copilot,devin', '--dry-run', '--json']);
  run(process.execPath, [cli, 'hooks', '--project', consumer, '--tools', 'claude,cursor']);
  run(process.execPath, [cli, 'hooks', '--project', consumer, '--tools', 'claude,cursor', '--remove']);
  let blocked = false;
  try { run(process.execPath, [cli, 'check', '--project', consumer, '--staged', '--json']); }
  catch (error) { if (error.status === 1 && JSON.parse(error.stdout).blocking) blocked = true; else throw error; }
  if (!blocked) throw new Error('Missing required verification did not block');
  run(process.execPath, [cli, 'trust', '--project', consumer, '--accept']);
  const observed = JSON.parse(run(process.execPath, [cli, 'run', '--project', consumer, '--checks', 'test']));
  if (!observed.complete) throw new Error('Packaged verification failed');
  const summary = JSON.parse(run(process.execPath, [cli, 'summary', '--project', consumer, '--json']));
  if (summary[0].status !== 'passed') throw new Error('Packaged summary failed');
  run(process.execPath, [cli, 'check', '--project', consumer, '--staged', '--json']);
  run(process.execPath, [join(installed, 'bin/cli.js'), 'uninstall', target]);
  console.log(`Package smoke passed: ${packed.files.length} packaged files; all adapters, doctor, packet and evidence commands verified.`);
} finally {
  // Delete only the directory allocated above, and never a computed workspace ancestor.
  if (resolve(root).startsWith(`${resolve(tmpdir())}${process.platform === 'win32' ? '\\' : '/'}governance-package-`)) rmSync(root, { recursive: true, force: true });
}
