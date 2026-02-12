# Changelog

All notable changes to the AI Governance Framework are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Policy versions use [CalVer](https://calver.org/) (`YYYY.MM.patch`).

---

## [1.1.0] — 2026-02-11

### Added
- **`ai-governance/GOVERNANCE-RULES.md`** — single source of truth for auto-router, hard rules, self-alignment (eliminates duplication across 5 adapter files)

### Changed
- **`.windsurfrules`** — rewritten for Windsurf/Cascade: explicit `read_file` instructions to load shared rules and workflow files, Cascade tool usage guide (`code_search`, `edit`, `run_command`, `create_memory`), `// turbo` awareness. **Fixes auto-trigger issue.**
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
- 5 tool adapters (Windsurf, Cursor, Copilot, Claude Code, Aider)
- 10 Windsurf workflows
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
