# AI Governance Framework — Enterprise Edition

Enterprise-grade, enforceable governance for software engineers using AI coding assistants.

## What This Is

A **Core + Adapters** framework with 17 enforceable policies, 7 reusable templates, measurable KPIs, and native integrations for every major AI coding tool. Every policy has: **Objective**, **Enforcement mechanism**, **Evidence artifact**, **Owner**, and **Exception path**.

Red-teamed with 15 bypass attempts. All patches applied.

## Supported AI Tools

| Tool | Config File | Auto-loaded? |
|------|------------|-------------|
| **Windsurf** (Cascade) | `.windsurf/workflows/*.md` | Yes, via `/slash-commands` |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Yes |
| **Claude Code** | `CLAUDE.md` | Yes |
| **Cursor** | `.cursor/rules/governance.md` | Yes |
| **Aider** | `.aider/conventions.md` | Yes |

See `GOVERNANCE-MATRIX.md` for full enforcement compatibility matrix.

## Directory Structure

```
AIGovernance/
├── ai-governance/
│   ├── policies/                      # 17 enforceable policies (CORE)
│   │   ├── POL-001-requirements.md
│   │   ├── POL-002-architecture.md
│   │   ├── POL-003-design.md
│   │   ├── POL-004-coding-standards.md
│   │   ├── POL-005-testing.md
│   │   ├── POL-006-security-privacy.md
│   │   ├── POL-007-deployment.md
│   │   ├── POL-008-observability.md
│   │   ├── POL-009-maintenance.md
│   │   ├── POL-010-incident-response.md
│   │   ├── POL-011-documentation.md
│   │   ├── POL-012-change-management.md
│   │   ├── POL-013-data-classification.md    ← NEW
│   │   ├── POL-014-llm-risk-controls.md      ← NEW
│   │   ├── POL-015-quality-engineering.md     ← NEW
│   │   ├── POL-016-api-versioning.md          ← NEW
│   │   └── POL-017-secrets-management.md      ← NEW
│   ├── templates/                     # Reusable templates
│   │   ├── pr-checklist.md
│   │   ├── definition-of-ready.md
│   │   ├── definition-of-done.md
│   │   ├── adr-template.md
│   │   ├── risk-acceptance.md
│   │   ├── ai-usage-disclosure.md
│   │   └── threat-model-lite.md
│   ├── kpis/
│   │   └── governance-kpis.md         # Measurable targets
│   ├── red-team/
│   │   └── bypass-report.md           # 15 bypass attempts + patches
│   ├── exceptions-log.md              # Active exceptions register
│   └── INDEX.md                       # Navigation guide
├── GOVERNANCE-MATRIX.md               # Tool compatibility matrix
├── .windsurf/workflows/               # 10 Windsurf workflows (ADAPTER)
├── .github/copilot-instructions.md    # GitHub Copilot (ADAPTER)
├── .cursor/rules/governance.md        # Cursor (ADAPTER)
├── CLAUDE.md                          # Claude Code (ADAPTER)
├── .aider/conventions.md              # Aider (ADAPTER)
├── .windsurfrules                     # Windsurf auto-router (ADAPTER)
└── .cursorrules                       # Cursor auto-router (ADAPTER)
```

## Auto-Router: Zero-Config Workflow Detection

**Users don't need to pick workflows.** The AI automatically detects intent from the prompt and triggers the appropriate governance workflow.

```
User types: "The login page is broken, users get a 500 error"
   ↓
AI detects: Bug Fix intent
   ↓
📋 Detected: Bug Fix (governance workflow auto-triggered)
Following: POL-004 → POL-005 → POL-015
   ↓
Executes: reproduce → root cause → regression test → minimal fix
```

The auto-router is embedded in every tool adapter (`.windsurfrules`, `CLAUDE.md`, `.cursorrules`, etc.) and works automatically. No slash commands required—though they still work if you prefer them.

| User Says | AI Detects | Workflow Triggered |
|-----------|-----------|-------------------|
| "Create a new e-commerce app" | New Project | Full project setup with governance |
| "Add user authentication" | Add Feature | TDD with security gates |
| "The API returns 500 on /users" | Bug Fix | Root cause → regression test → fix |
| "Deploy to production" | Deploy | Progressive rollout with all gates |
| "Site is down!" | Incident | Immediate triage (no questions asked) |
| "Review this code" | Code Review | Structured review with AI checks |
| "Is this SQL query safe?" | Security Review | Full security audit |
| "This function is too complex" | Refactor | Tests first, measure improvement |
| "Commit message" | Commit | Conventional commits format |
| "New task, different topic" | Clear Context | Summarize → fresh start |

Details: `ai-governance/router/auto-router.md` and `ai-governance/router/intent-patterns.md`

## Quick Start

1. **Copy to your project**: Copy `ai-governance/`, adapter files, and `GOVERNANCE-MATRIX.md`
2. **Copy the auto-router** for your tool: `.windsurfrules`, `.cursorrules`, `CLAUDE.md`, etc.
3. **Just start typing** — the AI auto-detects intent and follows the governance workflow
4. **Configure CI**: Implement enforcement gates per `GOVERNANCE-MATRIX.md`
5. **Slash commands still work**: `/new-project`, `/add-feature`, `/fix-bug`, etc.

## Windsurf Workflows

| Command | Purpose | Key Policies |
|---------|---------|-------------|
| `/new-project` | Full project setup with governance | POL-001→004→005→006→007 |
| `/add-feature` | Feature with TDD and security gates | POL-001→003→005→004→006 |
| `/fix-bug` | Root cause, regression test, escape analysis | POL-004→005→015 |
| `/deploy` | Progressive rollout with all gates | POL-007→008→012→015 |
| `/incident` | Full incident response protocol | POL-010→008 |
| `/code-review` | Structured review with AI checks | All policies |
| `/security-review` | Comprehensive security audit | POL-006→013→014→017 |
| `/refactor` | Safe refactoring with coverage gates | POL-004→005→009 |
| `/clear-context` | Summarize session, start fresh | — |
| `/git-staged-summary-global` | Generate commit message | — |

## Policy Standards

Every policy includes:

| Field | Purpose |
|-------|---------|
| **Objective** | What we're trying to achieve |
| **Mandatory Controls** | Specific enforceable rules with CTRL-NNN.N IDs |
| **Enforcement** | How it's enforced (IDE rules, CI gates, PR checks, runtime) |
| **Evidence Artifact** | What proves compliance |
| **Owner** | Who's accountable |
| **Exception Path** | How to get a documented, time-bound exception |
| **KPI Linkage** | Measurable targets tied to governance-kpis.md |

## Advanced Areas

| Area | Policy | Key Controls |
|------|--------|-------------|
| **Data Classification** | POL-013 | C1-C4 levels, handling rules, AI data controls |
| **LLM Risk Controls** | POL-014 | Hallucination detection, prompt injection, disclosure |
| **Quality Engineering** | POL-015 | 5-gate pipeline, contract tests, mutation testing |
| **API Versioning** | POL-016 | Breaking change detection, 90-day deprecation |
| **Secrets Management** | POL-017 | Scanning, rotation, access control, AI prompt safety |

## KPIs

Executive dashboard and 60+ detailed KPIs in `ai-governance/kpis/governance-kpis.md`.

Key targets:
- **Deployment frequency**: ≥ 1/day/service
- **Change failure rate**: < 5%
- **MTTR**: < 15 min
- **Escaped defects**: < 3/quarter/service
- **Critical vulns in prod**: 0
- **AI hallucination escape rate**: < 1%

## Red Team

15 bypass attempts tested against this framework. All patches applied. See `ai-governance/red-team/bypass-report.md`.

## Philosophy

- **Enforceable over aspirational** — every control has an enforcement mechanism
- **Core + Adapters** — tool-agnostic policies with native tool integrations
- **Defense in depth** — 6 enforcement layers from IDE to runtime
- **Practical over academic** — written for engineers, not auditors
- **Measurable** — if you can't measure it, you can't enforce it
- **Zero-config** — auto-router detects intent, no slash commands needed
