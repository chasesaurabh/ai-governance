# AI Governance Framework

Local governance checks and verification for AI-assisted development. The framework resolves a requested task into compact instructions, applicable controls and an evidence checklist. Detailed policies remain available for human review.

**Instructions guide behavior. Tests, CI gates and reviewers verify it.** The runtime contains 28 curated controls spanning 17 policies; it does not certify complete organizational compliance.

## Start a daily workflow

Requires Node.js 22+ and Git. In your project:

```bash
npx ai-governance-setup@3.0.0 --tools copilot,claude,cursor,devin --save-dev .
npx ai-governance check
```

Setup detects project commands and preserves existing configuration. Review governance.config.json and your repository scripts before authorizing execution:

```bash
npx ai-governance trust --accept
npx ai-governance run --checks test
npx ai-governance summary
```

Checks explain dependency, test, authentication, API, database and CI changes. The runner records actual command exits and marks results stale when source or configuration changes. Missing tools remain unverified. Teams can adopt required checks gradually with pinned organization packs, package scopes and reviewed baselines.

[Quickstart](docs/QUICKSTART.md) · [Daily commands](docs/DAILY-WORK.md) · [AI integrations](docs/INTEGRATIONS.md) · [Organization packs](docs/ORGANIZATION-PACKS.md) · [Migration and release](docs/RELEASING.md)

Local commands do not upload source or prompts. Configured checks and npm installations can access the network.

## Install

Requires Node.js 22 or newer.

```bash
npx ai-governance-setup
npx ai-governance-setup --tools claude,cursor /path/to/project
npx ai-governance-setup --all /path/to/project
npx ai-governance-setup --core-only /path/to/project
```

For an unpublished local checkout, use `node bin/cli.js` with the same arguments. The local `install.sh` delegates to Node; it is not a curl-to-shell installer. Interactive setup needs the package dependencies installed (`npm ci` in a clone).

Preview before installation with `--dry-run`. Reruns update untouched upstream files and preserve modified files, reporting conflicts with exit code 1. Existing adapter instructions are integrated through managed blocks. Commit `.ai-governance-install.json` with the installed files to retain version and hash history. Pre-manifest customized core files require manual reconciliation; setup never silently replaces them. Removed upstream files are not automatically deleted.

```bash
npx ai-governance-setup --tools claude,cursor --dry-run /path/to/project
npx ai-governance-setup doctor /path/to/project
```

Doctor checks missing or modified tracked content. It does not verify tool activation, remote updates or CI configuration.

## Configure once

Setup creates a detected configuration when missing. Alternatively, copy `ai-governance/config.example.json` to `governance.config.json` in your project. Select library, CLI, web or service; choose a starter, team or regulated profile; and fill in verified test/lint/build/scanning commands. Configure risk path prefixes for sensitive modules. Missing commands are unavailable, never passing checks.

Validate with the `ai-governance check-config .` package binary. Without a global/local binary on PATH, use `npx --package ai-governance-setup ai-governance check-config .`. In this source checkout, use `node bin/governance.js check-config .`.

[Configuration reference](ai-governance/CONFIGURATION.md) defines defaults, precedence and protected controls. Project overrides belong in configuration; change the framework source when extending the catalog.

## Resolve a task

Create a JSON input file, for example:

```json
{
  "prompt": "Add a search endpoint",
  "files": ["src/api/search.js"],
  "risks": ["api"]
}
```

Run the installed binary (or `node bin/governance.js` in this checkout):

```bash
ai-governance packet --input task.json --project .
ai-governance packet --input task.json --project . --json
ai-governance checklist --input task.json --project .
ai-governance evidence-init --input task.json --project . > evidence.json
ai-governance evidence-check --input evidence.json --task task.json --project .
```

Packet and checklist commands write to stdout; they do not run project commands or modify your code. Route by requested action, add controls for risks, and preserve explicit task ordering. Inspect the result: routing is heuristic. Supply an explicit `action` when needed and additional `risks` when code inspection reveals them. Available actions are listed in [the index](ai-governance/INDEX.md).

Use the compact Markdown packet as model context. JSON includes verification methods and source references for tools and evidence processing. Detailed policy documents are loaded only when needed. Guided execution adds bounded steps and a repair limit without lowering safeguards.

## Evidence and exceptions

Each control starts as `not_run`. Record actual results as `passed`, `failed`, `not_run` or `not_applicable`, with evidence or a reason. Missing evidence cannot count as complete. Exceptions require an owner, approval reference, remediation, expiry and a matching task digest. Protected controls cannot be waived.

The validator checks structure and declared results; it does not authenticate reports or approvals. Pair it with actual CI checks and review. See [evidence documentation](ai-governance/EVIDENCE.md).

## Tool adapters

| Tool | Entry point | Activation |
|---|---|---|
| Claude Code | `CLAUDE.md` | Project instructions direct the assistant to the shared runtime |
| Cursor | `.cursor/rules/governance.mdc` | Project rule with frontmatter; `.cursorrules` retained as a compatibility pointer |
| GitHub Copilot | `.github/copilot-instructions.md` | Repository instructions; capabilities vary by host/mode |
| Devin | `AGENTS.md` | Repository instructions; verify loading in a real session |
| Aider | `.aider/conventions.md` | Attach conventions/shared instructions through the tool's context mechanism |

Verify activation in your selected host. Files alone do not prove instructions loaded. If file access or execution is unavailable, use the manual workflow fallback and report unverified checks. See [the compatibility matrix](GOVERNANCE-MATRIX.md).

## CI and evaluation

Installable [CI examples](examples/ci/README.md) include GitHub Actions, Azure DevOps and a coverage checker that rejects malformed/missing reports. Adapt commands and enable required branch checks. These examples do not configure your platform automatically.

For framework development:

```bash
npm ci
npm run generate
npm run check
npm run test:package
```

Checks cover routing, controls, evidence, installation and generated drift. Package smoke testing builds an archive, installs it into a temporary consumer, and exercises its binaries. CI defines Windows/Linux and Node 22/24 checks; a local pass is not a claim that remote CI has run.

`npm run evaluate` reports rule accuracy and approximate instruction sizes. [The evaluation protocol](eval/README.md) explains independently reviewed comparisons across models and reasoning settings. No provider benchmarks or token-billing savings are claimed from these static checks.

[Contributing](CONTRIBUTING.md) · [Policy index](ai-governance/INDEX.md) · [Changelog](CHANGELOG.md)

See [current tools and model selection](docs/TOOLS-AND-MODELS.md) for the dated provider reference.
