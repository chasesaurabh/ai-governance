import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveConfig } from './config.js';
const excluded = new Set(['node_modules', '.git', '.venv', 'venv', 'vendor', 'target', 'build', 'dist', '.ai-governance', 'ai-governance']);
export function discover(root) {
  const packages = [], notes = [], tools = [];
  let visited = 0;
  function scan(dir, prefix = '', depth = 0) {
    if (++visited > 500) return;
    const entries = readdirSync(dir, { withFileTypes: true }).filter(e => !e.isSymbolicLink());
    const names = entries.filter(e => e.isFile()).map(e => e.name);
    const has = name => names.includes(name);
    const commands = {}, provenance = {};
    let stack, projectType = 'library', manager;
    if (has('package.json')) {
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      manager = has('pnpm-lock.yaml') ? 'pnpm' : has('yarn.lock') ? 'yarn' : has('bun.lock') || has('bun.lockb') ? 'bun' : 'npm';
      stack = 'node';
      const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
      projectType = pkg.bin ? 'cli' : dependencies.next || dependencies.react || dependencies.vue ? 'web' : dependencies.express || dependencies.fastify ? 'service' : 'library';
      for (const key of ['test', 'lint', 'build', 'coverage', 'secrets', 'sast', 'audit']) {
        const script = key === 'coverage' && pkg.scripts?.['test:coverage'] ? 'test:coverage' : key;
        if (typeof pkg.scripts?.[script] === 'string' && !pkg.scripts[script].includes('no test specified')) {
          commands[key] = `${manager} run ${script}`; provenance[key] = 'detected script; not executed';
        }
      }
    } else if (has('pyproject.toml') || has('requirements.txt')) {
      stack = 'python'; commands.test = 'python -m pytest'; provenance.test = 'suggested; verify pytest is installed';
    } else if (has('pom.xml')) {
      stack = 'maven'; commands.test = 'mvn test'; commands.build = 'mvn package -DskipTests';
    } else if (has('build.gradle') || has('build.gradle.kts')) {
      stack = 'gradle'; commands.test = 'gradle test'; commands.build = 'gradle build';
    } else if (has('go.mod')) {
      stack = 'go'; commands.test = 'go test ./...'; commands.build = 'go build ./...';
    } else if (names.some(name => /\.(csproj|fsproj|sln|slnx)$/.test(name))) {
      stack = 'dotnet'; commands.test = 'dotnet test'; commands.build = 'dotnet build';
    }
    if (stack) {
      for (const key of Object.keys(commands)) provenance[key] ??= 'suggested from manifest; not executed';
      packages.push({ path: prefix || '.', stack, manager, projectType, commands, provenance });
    }
    if (depth < 3) for (const e of entries) if (e.isDirectory() && !excluded.has(e.name) && !e.name.startsWith('.')) scan(join(dir, e.name), prefix ? `${prefix}/${e.name}` : e.name, depth + 1);
  }
  scan(root);
  if (visited > 500) notes.push('Discovery stopped after 500 directories; deeper workspaces need explicit configuration.');
  const toolFiles = { claude: 'CLAUDE.md', cursor: '.cursor', copilot: '.github/copilot-instructions.md', windsurf: '.windsurfrules', aider: '.aider' };
  for (const [tool, file] of Object.entries(toolFiles)) if (existsSync(join(root, file))) tools.push(tool);
  const primary = packages.find(p => p.path === '.');
  const config = resolveConfig({ projectType: primary?.projectType ?? 'library', commands: primary?.commands ?? {} });
  if (!primary) notes.push('No supported root manifest found; configure commands explicitly or initialize a package directory.');
  return { packages, tools, config, notes, commandsExecuted: false };
}
