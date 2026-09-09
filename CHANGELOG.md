# 2.0.2 — Runtime and dependency updates

- Update Inquirer to 14.2.2 and refresh its dependency tree. Node.js 22 now requires 22.13 or newer; Node.js 24 LTS is the recommended default.
- Test Node 22.13, latest 22/24 and current Node 26 on Windows and Linux.
- Update checkout/setup-node, CodeQL and Gitleaks actions; use Node 24 in GitHub and Azure examples.

# 2.0.1 — Devin integration and current tool guidance

- Use Devin as the supported adapter name and AGENTS.md as its entry point. Remove redundant host-specific workflow copies; shared task workflows remain available.
- Refresh Claude, Cursor and Devin model selection and enterprise data guidance from official documentation checked 2026-09-09.
- Preserve existing files when updating manifests that contain adapters outside the current supported set. Explicit unknown tool selections still fail.

# 2.0.0 — Enterprise daily workflow

- Add project discovery, change checks, explicit command trust, revision-bound verification and summaries.
- Add Claude/Cursor hooks, Copilot scoped instructions and Devin repository instructions.
- Add pinned data-only organization packs, scoped settings, adoption modes and content-bound baselines.
- Add a self-service quickstart for four AI tools.
- Add exact runtime installation, safe uninstall and a tested npm release workflow.

## Configurable execution layer

- Add versioned installation, preview, managed adapter blocks, safe updates and doctor. Require Node.js 22+.
- Add 28 structured controls across 17 policies, project profiles, configurable commands and protected safeguards.
- Generate compact adapters and workflows; separate actions from risks and preserve task order.
- Add task-specific checklists, evidence statuses, scoped expiring exceptions and completion metrics.
- Add executable routing cases, instruction budgets, external model-result scoring and package smoke checks.
- Fix unsafe CI text interpolation, coverage validation and mandatory gate result handling.
- Replace shell-only installation logic with a shared Node entry point. No publication is implied by these source changes.

# Changelog

All notable changes to the AI Governance Framework are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Policy versions use [CalVer](https://calver.org/) (`YYYY.MM.patch`).

---

## [1.1.0] — 2026-02-11

### Added
- **`ai-governance/GOVERNANCE-RULES.md`** — single source of truth for auto-router, hard rules, self-alignment (eliminates duplication across 5 adapter files)

### Changed
- **`.cursorrules`** — rewritten for Cursor: references shared rules, mode-specific guidance (Composer / Chat / Inline edit), `@` mention patterns, `.cursor/rules/` persistence
- **`.cursor/rules/governance.md`** — rewritten as Cursor mode-specific supplement (no longer duplicates `.cursorrules`)
- **`CLAUDE.md`** — rewritten for Claude Code CLI: references shared rules, bash commands for verification, `#` file references, `/clear` and `/compact` commands, `CLAUDE.md` tree for subdirectory instructions
- **`.github/copilot-instructions.md`** — rewritten for GitHub Copilot: inline completion rules (do/don't), Copilot Chat auto-router, `@workspace` guidance. Hard rules kept inline (Copilot can't auto-read files)
- **`.aider/conventions.md`** — rewritten for Aider CLI: `/add` to load policies, `/run`/`/test`/`/lint` for verification, `/architect` for design-first, git-aware auto-commit guidance. Hard rules kept inline
- README.md — updated Supported Tools table with tool-specific descriptions
- CONTRIBUTING.md — added Adapter Architecture section, updated framework structure tree
- GOVERNANCE-MATRIX.md — updated auto-router section and tool adapter table for shared rules architecture, updated Quick Setup
- `ai-governance/INDEX.md` — added `GOVERNANCE-RULES.md` to auto-router section, added adapter architecture table

### Architecture
- **Before:** 5 adapter files contained near-identical copies of auto-router, hard rules, and self-alignment (~100 lines duplicated per file)
- **After:** Shared rules in one file + 5 lean tool-specific adapters. Each adapter contains only instructions relevant to that tool's actual capabilities and limitations

---

## [1.0.1] — 2026-02-08

### Added
- **examples/** folder with evaluable workflow demonstrations (feature, bugfix, security-review, incident)
- **examples/router-tests.md** — 50 prompts with expected intent classifications for router validation
- **examples/ci/** — CI/CD pipeline templates (GitHub Actions + Azure DevOps) for governance enforcement
- **CHANGELOG.md** — this file
- **Enforcement Model** section in README — honest note about adapters (advisory) vs CI (enforcement)
- Exception proposal process documented in `ai-governance/exceptions-log.md`

### Changed
- README: clarified interactive CLI, added `--all`/`--core-only` flags note
- README + GOVERNANCE-MATRIX.md: fixed `cd` directory to match git clone output (`ai-governance`)
- CLI banner: replaced "Red-team tested" with "CI-ready"
- fix-bug.md: removed stray `// turbo` comment

---

## [1.0.0] — 2026-02-06

### Added
- 17 enforceable policies (POL-001 to POL-017)
- 7 templates (PR checklist, definition of done/ready, ADR, risk acceptance, AI disclosure, threat model)
- Auto-router with 10 intent types and priority ordering
- Self-alignment system (self-align, self-heal, self-learn)
- KPI dashboard with 60+ measurable targets
- 5 tool adapters (Devin, Cursor, Copilot, Claude Code, Aider)
- 10 Devin workflows
- Node CLI (`npx ai-governance-setup`) and shell installer
- GOVERNANCE-MATRIX.md with enforcement mapping

---

## Versioning Policy

- **Framework version**: SemVer (`MAJOR.MINOR.PATCH`) in `package.json`
- **Policy versions**: CalVer dates in each policy's "Last Reviewed" field
- **Breaking changes**: MAJOR bump — policy removals, control renumbering, adapter format changes
- **New content**: MINOR bump — new policies, templates, examples, CI templates
- **Fixes**: PATCH bump — typos, clarifications, broken links

## How to Propose Changes

1. Open an issue describing the change and which policies are affected
2. For policy exceptions, follow the process in `ai-governance/exceptions-log.md`
3. Submit a PR with changes and update this CHANGELOG
4. Policy changes require review by the governance owner listed in each policy
