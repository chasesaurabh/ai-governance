import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
export function npmCommand() {
  const candidates = [process.env.npm_execpath, join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'), '/usr/share/nodejs/npm/bin/npm-cli.js'];
  const path = candidates.find(path => path && existsSync(path) && path.endsWith('npm-cli.js'));
  if (!path) throw new Error('Cannot locate npm CLI. Run through npm exec or npx.');
  return path;
}
export function installRuntime(target, version, packageSpec = `ai-governance-setup@${version}`) {
  execFileSync(process.execPath, [npmCommand(), 'install', '--save-dev', '--save-exact', '--ignore-scripts', '--no-audit', '--no-fund', packageSpec], { cwd: target, stdio: 'inherit', timeout: 180000 });
}
