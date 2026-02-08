#!/usr/bin/env node

import { existsSync, cpSync, mkdirSync, readFileSync, copyFileSync, readdirSync } from 'fs';
import { resolve, join, dirname, sep } from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, '..');
const IS_WIN = process.platform === 'win32';

// ── Colors (auto-disable on non-TTY or dumb terminals) ─────────────────────

const supportsColor = process.stdout.isTTY && process.env.TERM !== 'dumb';
const bold   = (s) => supportsColor ? `\x1b[1m${s}\x1b[0m` : s;
const green  = (s) => supportsColor ? `\x1b[32m${s}\x1b[0m` : s;
const blue   = (s) => supportsColor ? `\x1b[34m${s}\x1b[0m` : s;
const yellow = (s) => supportsColor ? `\x1b[33m${s}\x1b[0m` : s;
const cyan   = (s) => supportsColor ? `\x1b[36m${s}\x1b[0m` : s;
const dim    = (s) => supportsColor ? `\x1b[2m${s}\x1b[0m` : s;

// ── Adapter Definitions ─────────────────────────────────────────────────────

const ADAPTERS = {
  windsurf: {
    name: 'Windsurf (Cascade)',
    short: '.windsurfrules + 10 workflow files',
    files: [{ src: '.windsurfrules', dest: '.windsurfrules' }],
    dirs:  [{ src: '.windsurf', dest: '.windsurf' }],
  },
  cursor: {
    name: 'Cursor',
    short: '.cursorrules + rules/governance.md',
    files: [{ src: '.cursorrules', dest: '.cursorrules' }],
    dirs:  [{ src: '.cursor', dest: '.cursor' }],
  },
  copilot: {
    name: 'GitHub Copilot',
    short: '.github/copilot-instructions.md',
    files: [{ src: '.github/copilot-instructions.md', dest: '.github/copilot-instructions.md' }],
    dirs:  [],
  },
  claude: {
    name: 'Claude Code',
    short: 'CLAUDE.md',
    files: [{ src: 'CLAUDE.md', dest: 'CLAUDE.md' }],
    dirs:  [],
  },
  aider: {
    name: 'Aider',
    short: '.aider/conventions.md',
    files: [],
    dirs:  [{ src: '.aider', dest: '.aider' }],
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Display-friendly path (always forward slashes) */
function displayPath(p) {
  return IS_WIN ? p.replace(/\\/g, '/') : p;
}

/** Recursively merge src into dest, only adding files that don't exist yet.
 *  Returns { added: number, skipped: number }  */
function copyDirMerge(src, dest) {
  const stats = { added: 0, skipped: 0 };
  if (!existsSync(src)) return stats;
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath  = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      const sub = copyDirMerge(srcPath, destPath);
      stats.added   += sub.added;
      stats.skipped += sub.skipped;
    } else if (!existsSync(destPath)) {
      copyFileSync(srcPath, destPath);
      stats.added++;
    } else {
      stats.skipped++;
    }
  }
  return stats;
}

/** Copy a single file. Returns 'copied' | 'same' | 'exists' | 'missing'. */
function copyFileSafe(src, dest) {
  if (!existsSync(src)) return 'missing';
  mkdirSync(dirname(dest), { recursive: true });
  if (existsSync(dest)) {
    const srcBuf  = readFileSync(src);
    const destBuf = readFileSync(dest);
    return srcBuf.equals(destBuf) ? 'same' : 'exists';
  }
  copyFileSync(src, dest);
  return 'copied';
}

/** Check if an adapter is already installed in the target directory. */
function isAdapterInstalled(targetDir, adapterKey) {
  const adapter = ADAPTERS[adapterKey];
  const hasFiles = adapter.files.length === 0 ||
    adapter.files.some(f => existsSync(join(targetDir, f.dest)));
  const hasDirs  = adapter.dirs.length === 0 ||
    adapter.dirs.some(d => existsSync(join(targetDir, d.dest)));
  return hasFiles && hasDirs;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const cwd = process.cwd();

  console.log('');
  console.log(bold('  +---------------------------------------------------+'));
  console.log(bold('  |     AI Governance Framework  -  Setup Wizard      |'));
  console.log(bold('  +---------------------------------------------------+'));
  console.log('');
  console.log(dim('  17 enforceable policies | 7 templates | Auto-router'));
  console.log(dim('  Self-alignment | KPI dashboard | Red-team tested'));
  console.log('');

  // ── Detect re-run ─────────────────────────────────────────────────────

  const isRerun = existsSync(join(cwd, 'ai-governance'));

  if (isRerun) {
    console.log(blue('  i') + '  Existing governance installation detected.');
    console.log(dim('    Only missing files will be added. Your customizations are safe.'));
    console.log('');
  }

  // ── Question 1: Target directory ──────────────────────────────────────

  const { targetDir: rawTargetDir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetDir',
      message: 'Install to directory:',
      default: cwd,
      validate: (input) => {
        if (!input.trim()) return 'Please enter a path';
        return true;
      },
    },
  ]);

  const targetDir = resolve(rawTargetDir);

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
    console.log(green('  +') + `  Created ${displayPath(targetDir)}`);
  }

  // ── Question 2: Which IDE adapters ────────────────────────────────────

  console.log('');

  // Pre-check adapters that are already installed so user sees what they have
  const choices = Object.entries(ADAPTERS).map(([key, adapter]) => {
    const installed = isAdapterInstalled(targetDir, key);
    const label = installed
      ? `${adapter.name}  ${dim('- ' + adapter.short)}  ${green('[installed]')}`
      : `${adapter.name}  ${dim('- ' + adapter.short)}`;
    return {
      name:    label,
      value:   key,
      checked: installed,  // pre-check already installed adapters
    };
  });

  const { selectedTools } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedTools',
      message: 'Which AI coding tools do you use? ' + dim('(space = toggle, enter = confirm)'),
      choices,
    },
  ]);

  // ── Install Core ──────────────────────────────────────────────────────

  console.log('');
  console.log(bold('  Installing Core Governance...'));
  console.log('');

  const coreSrc  = join(PKG_ROOT, 'ai-governance');
  const coreDest = join(targetDir, 'ai-governance');

  if (existsSync(coreDest)) {
    const { added, skipped } = copyDirMerge(coreSrc, coreDest);
    if (added > 0) {
      console.log(green('  +') + `  ai-governance/ ${dim(`(${added} new files added, ${skipped} unchanged)`)}`);
    } else {
      console.log(green('  =') + '  ai-governance/ ' + dim('(already up to date)'));
    }
  } else {
    cpSync(coreSrc, coreDest, { recursive: true });
    console.log(green('  +') + '  ai-governance/');
  }

  const matrixResult = copyFileSafe(
    join(PKG_ROOT, 'GOVERNANCE-MATRIX.md'),
    join(targetDir, 'GOVERNANCE-MATRIX.md')
  );
  switch (matrixResult) {
    case 'copied':  console.log(green('  +') + '  GOVERNANCE-MATRIX.md'); break;
    case 'same':    console.log(green('  =') + '  GOVERNANCE-MATRIX.md ' + dim('(up to date)')); break;
    case 'exists':  console.log(yellow('  ~') + '  GOVERNANCE-MATRIX.md ' + dim('(customized, kept yours)')); break;
  }

  // ── Install Selected Adapters Only ────────────────────────────────────

  const newlyInstalled = [];
  const alreadyPresent = [];

  if (selectedTools.length > 0) {
    console.log('');
    console.log(bold('  Installing Adapters...'));
    console.log('');

    for (const toolKey of selectedTools) {
      const adapter = ADAPTERS[toolKey];
      let addedSomething = false;

      for (const file of adapter.files) {
        const src  = join(PKG_ROOT, file.src);
        const dest = join(targetDir, file.dest);
        const result = copyFileSafe(src, dest);
        const label = displayPath(file.dest);
        switch (result) {
          case 'copied':
            console.log(green('  +') + `  ${label}`);
            addedSomething = true;
            break;
          case 'same':
            console.log(green('  =') + `  ${label} ${dim('(up to date)')}`);
            break;
          case 'exists':
            console.log(yellow('  ~') + `  ${label} ${dim('(customized, kept yours)')}`);
            break;
        }
      }

      for (const dir of adapter.dirs) {
        const src  = join(PKG_ROOT, dir.src);
        const dest = join(targetDir, dir.dest);
        if (existsSync(dest)) {
          const { added, skipped } = copyDirMerge(src, dest);
          if (added > 0) {
            console.log(green('  +') + `  ${displayPath(dir.dest)}/ ${dim(`(${added} new, ${skipped} unchanged)`)}`);
            addedSomething = true;
          } else {
            console.log(green('  =') + `  ${displayPath(dir.dest)}/ ${dim('(up to date)')}`);
          }
        } else {
          cpSync(src, dest, { recursive: true });
          console.log(green('  +') + `  ${displayPath(dir.dest)}/`);
          addedSomething = true;
        }
      }

      if (addedSomething) {
        newlyInstalled.push(toolKey);
      } else {
        alreadyPresent.push(toolKey);
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────

  console.log('');
  console.log(bold('  +---------------------------------------------------+'));
  console.log(bold('  |             Installation Complete!                |'));
  console.log(bold('  +---------------------------------------------------+'));
  console.log('');

  console.log(blue('  Installed to: ') + displayPath(targetDir));
  console.log('');
  console.log('    Core:');
  console.log('    - ai-governance/policies/    17 enforceable policies');
  console.log('    - ai-governance/templates/   7 governance templates');
  console.log('    - ai-governance/router/      Auto-router + self-alignment');
  console.log('    - ai-governance/kpis/        Measurable targets');
  console.log('    - GOVERNANCE-MATRIX.md       Tool compatibility matrix');

  if (selectedTools.length > 0) {
    console.log('');
    console.log('    Adapters:');
    for (const toolKey of selectedTools) {
      const adapter = ADAPTERS[toolKey];
      const status = alreadyPresent.includes(toolKey) ? dim(' (was already installed)') : '';
      console.log(`    - ${adapter.name}: ${adapter.short}${status}`);
    }
  }

  // Show adapters NOT installed (available for future)
  const notInstalled = Object.keys(ADAPTERS).filter(k => !selectedTools.includes(k));
  if (notInstalled.length > 0) {
    console.log('');
    console.log(dim('    Not installed (run npx ai-governance-setup again to add):'));
    for (const toolKey of notInstalled) {
      console.log(dim(`    - ${ADAPTERS[toolKey].name}`));
    }
  }

  console.log('');
  console.log(bold('  Next steps:'));
  console.log('');
  console.log(`    1. ${bold('Start coding')} -- governance auto-loads in your IDE!`);
  console.log('       The auto-router detects intent from your prompts and');
  console.log('       triggers the right governance workflow automatically.');
  console.log('');
  console.log(`    2. ${bold('Customize')} policies in ai-governance/policies/ ${dim('(optional)')}`);
  console.log('');
  console.log(`    3. ${bold('Commit')} the governance files:`);
  console.log(cyan('       git add ai-governance/ GOVERNANCE-MATRIX.md'));

  for (const toolKey of selectedTools) {
    const adapter = ADAPTERS[toolKey];
    const paths = [
      ...adapter.files.map(f => displayPath(f.dest)),
      ...adapter.dirs.map(d => displayPath(d.dest) + '/'),
    ].join(' ');
    console.log(cyan(`       git add ${paths}`));
  }

  console.log(cyan('       git commit -m "chore: add AI governance framework"'));

  if (notInstalled.length > 0) {
    console.log('');
    console.log(dim(`    Need more adapters later? Just run: npx ai-governance-setup`));
  }

  console.log('');
  console.log(dim('  Docs: ai-governance/INDEX.md'));
  console.log('');
}

main().catch((err) => {
  if (err.name === 'ExitPromptError' || err.message?.includes('force closed')) {
    console.log('\n  Cancelled.\n');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
