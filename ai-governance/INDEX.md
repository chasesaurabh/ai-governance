# AI Governance Index — Enterprise Edition

Navigation for all governance documents. Policies are in `ai-governance/policies/`, templates in `ai-governance/templates/`.

---

## Policies by SDLC Phase

### Planning
| Policy | ID | When to Use |
|--------|----|-------------|
| [Requirements](./policies/POL-001-requirements.md) | POL-001 | Starting any new work item |
| [Architecture](./policies/POL-002-architecture.md) | POL-002 | New services, technology choices, ADRs |
| [Design](./policies/POL-003-design.md) | POL-003 | API design, data models, interfaces |

### Implementation
| Policy | ID | When to Use |
|--------|----|-------------|
| [Coding Standards](./policies/POL-004-coding-standards.md) | POL-004 | Writing or reviewing any code |
| [Testing](./policies/POL-005-testing.md) | POL-005 | Writing tests, coverage gates |
| [Security & Privacy](./policies/POL-006-security-privacy.md) | POL-006 | Auth, input validation, data handling |
| [Data Classification](./policies/POL-013-data-classification.md) | POL-013 | Any new data fields or stores |
| [Secrets Management](./policies/POL-017-secrets-management.md) | POL-017 | Credentials, API keys, certificates |

### Release
| Policy | ID | When to Use |
|--------|----|-------------|
| [Deployment](./policies/POL-007-deployment.md) | POL-007 | Deploying to any environment |
| [Change Management](./policies/POL-012-change-management.md) | POL-012 | Change classification, freeze windows, feature flags |
| [Quality Engineering](./policies/POL-015-quality-engineering.md) | POL-015 | Quality gates, contract tests, synthetic monitors |
| [API Versioning](./policies/POL-016-api-versioning.md) | POL-016 | Breaking changes, deprecation |

### Operations
| Policy | ID | When to Use |
|--------|----|-------------|
| [Observability](./policies/POL-008-observability.md) | POL-008 | Metrics, logs, traces, alerts, SLOs |
| [Maintenance](./policies/POL-009-maintenance.md) | POL-009 | Dependencies, tech debt, capacity |
| [Incident Response](./policies/POL-010-incident-response.md) | POL-010 | Production incidents, DR |
| [Documentation](./policies/POL-011-documentation.md) | POL-011 | README, API docs, runbooks |

### AI Governance
| Policy | ID | When to Use |
|--------|----|-------------|
| [LLM Risk Controls](./policies/POL-014-llm-risk-controls.md) | POL-014 | Using any AI coding assistant |

---

## Task-Based Quick Reference

| I want to... | Policies | Workflow |
|--------------|----------|----------|
| Start a new project | POL-001 → 002 → 004 → 005 → 006 → 007 | `/new-project` |
| Add a feature | POL-001 → 003 → 005 → 004 → 006 | `/add-feature` |
| Fix a bug | POL-004 → 005 → 015 | `/fix-bug` |
| Deploy to production | POL-007 → 008 → 012 → 015 | `/deploy` |
| Handle an incident | POL-010 → 008 | `/incident` |
| Review a PR | All applicable | `/code-review` |
| Security audit | POL-006 → 013 → 014 → 017 | `/security-review` |
| Refactor safely | POL-004 → 005 → 009 | `/refactor` |
| Make architecture decision | POL-002 → 016 | Use ADR template |
| Update dependencies | POL-009 → 004 (CTRL-004.3) | — |
| Classify data | POL-013 | — |
| Manage secrets | POL-017 | — |

---

## Templates

| Template | Purpose | Used By |
|----------|---------|---------|
| [PR Checklist](./templates/pr-checklist.md) | Structured PR review gates | Every PR |
| [Definition of Ready](./templates/definition-of-ready.md) | Sprint entry criteria | Backlog refinement |
| [Definition of Done](./templates/definition-of-done.md) | Completion criteria | Every work item |
| [ADR Template](./templates/adr-template.md) | Architecture decision records | POL-002 |
| [Risk Acceptance](./templates/risk-acceptance.md) | Policy exception documentation | All policies |
| [AI Usage Disclosure](./templates/ai-usage-disclosure.md) | AI tool usage tracking | POL-014, every PR |
| [Threat Model Lite](./templates/threat-model-lite.md) | Lightweight threat assessment | POL-001, POL-006 |

---

## Auto-Router (Zero-Config Workflow Detection)

The auto-router automatically detects user intent and triggers the appropriate governance workflow—no slash commands needed.

| Resource | Purpose |
|----------|---------|
| [Auto-Router](./router/auto-router.md) | Core routing logic, announcement format, opt-out rules |
| [Intent Patterns](./router/intent-patterns.md) | Detailed signal patterns for each intent type |
| [Self-Alignment](./router/self-alignment.md) | Self-align, self-heal, self-learn capabilities |

The router is embedded in every tool adapter:
- **Windsurf**: `.windsurfrules` (global rules, always active)
- **Cursor**: `.cursorrules` + `.cursor/rules/governance.md`
- **Copilot**: `.github/copilot-instructions.md`
- **Claude Code**: `CLAUDE.md`
- **Aider**: `.aider/conventions.md`

---

## Other Resources

| Resource | Purpose |
|----------|---------|
| [KPIs Dashboard](./kpis/governance-kpis.md) | 60+ measurable targets across all policies |
| [Exceptions Log](./exceptions-log.md) | Active policy exceptions register + exception proposal process |
| [Governance Matrix](../GOVERNANCE-MATRIX.md) | Tool compatibility and enforcement layers |
| [Router Test Suite](../examples/router-tests.md) | 50-prompt intent classification validation |
| [Workflow Examples](../examples/) | Evaluable walkthroughs (feature, bugfix, security, incident) |
| [CI Templates](../examples/ci/) | GitHub Actions + Azure DevOps governance gates |
| [Changelog](../CHANGELOG.md) | Version history and change log |

