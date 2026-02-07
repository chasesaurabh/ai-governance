# GitHub Copilot Instructions

> Enterprise-grade AI governance framework. All suggestions subject to these policies.

## Automatic Workflow Detection (Auto-Router)

**ON EVERY USER PROMPT:** Analyze intent and auto-trigger the matching governance workflow.

| Intent | Signals | Workflow |
|--------|---------|---------|
| **Incident** | "outage", "down", "SEV", "production issue" | Triage immediately (POL-010) |
| **Security** | "security", "vulnerability", "CVE", "injection" | Security review (POL-006) |
| **Bug Fix** | "fix", "bug", "broken", "not working", "error" | Root cause → test → fix (POL-004/005) |
| **Deploy** | "deploy", "release", "ship to prod" | Deployment gates (POL-007) |
| **New Project** | "new project", "from scratch", "scaffold" | Full setup (POL-001→007) |
| **Add Feature** | "implement", "build", "create [thing]", "add" | TDD workflow (POL-001→006) |
| **Refactor** | "refactor", "clean up", "simplify", "DRY" | Tests first → measure (POL-004/005) |
| **Code Review** | "review", "check this", "feedback on" | Structured review (all policies) |
| **Commit** | "commit message", "summarize changes" | Conventional commits |
| **Clear Context** | "new task", "fresh start", "switch to" | Summarize → fresh start |

Announce detected workflow: `📋 Detected: [Name] — Following: [policies]`
If ambiguous: ask ONE question. Incidents: never ask, just triage.
Details: `ai-governance/router/auto-router.md`

## Policy Framework

17 enforceable policies in `ai-governance/policies/POL-001` through `POL-017` covering:
requirements, architecture, design, coding, testing, security, deployment, observability,
maintenance, incident response, documentation, change management, data classification,
LLM risk controls, quality engineering, API versioning, and secrets management.

## Mandatory Rules for Code Generation

### Code Quality (POL-004)
- Match existing code style and naming conventions
- Cyclomatic complexity ≤ 15 per function, length ≤ 50 lines guideline
- No banned patterns: `eval()`, `console.log` in prod, `TODO` without ticket, commented-out code, `any` type
- All imports MUST exist—verify packages are real before suggesting
- Use dependency injection, not hard-coded dependencies

### Security (POL-006, POL-017)
- Validate ALL user inputs with schema validation (zod, joi, etc.)
- Parameterized queries ONLY—never concatenate strings into SQL
- Encode outputs to prevent XSS
- Authorization checks on every endpoint—default deny
- No hardcoded secrets—use env vars or secret manager
- PII (C3/C4 data) never logged unmasked
- Security headers on all HTTP responses

### Testing (POL-005)
- Write tests alongside code (unit ≥ 80% coverage target)
- AAA pattern: Arrange, Act, Assert
- Tests must assert real behavior—no tautologies (`expect(true).toBe(true)`)
- Test edge cases: null, empty, boundaries, concurrent access, error conditions
- Use test factories for data, not raw fixtures

### Data Classification (POL-013)
- New data model fields MUST have classification annotations (C1-C4)
- C3/C4 data: encrypted at rest, masked in logs, synthetic in test environments
- Never include real C3/C4 data in examples or test fixtures

### AI-Specific (POL-014)
- All suggested imports verified to exist in ecosystem
- API signatures match actual current documentation
- No hardcoded example values left in production code
- Error handling must be complete—cover all failure modes
- New dependencies must be checked: exists, maintained, safe license

### Architecture (POL-002)
- New services/databases require ADR (`ai-governance/templates/adr-template.md`)
- API versioning required for all public APIs (POL-016)
- Breaking changes require new major version + 90-day deprecation

## Task Patterns

### New Feature
1. Requirements with acceptance criteria (POL-001)
2. Interface-first design with OpenAPI spec (POL-003)
3. Write failing tests (POL-005)
4. Implement (POL-004)
5. Security check (POL-006)

### Bug Fix
1. Reproduce → root cause (not symptoms)
2. Regression test first
3. Minimal targeted fix
4. Full test suite passes

## Templates
- `ai-governance/templates/pr-checklist.md` — PR review gates
- `ai-governance/templates/adr-template.md` — Architecture decisions
- `ai-governance/templates/threat-model-lite.md` — Security assessment
- `ai-governance/templates/ai-usage-disclosure.md` — AI disclosure (required for all PRs)

## Self-Alignment, Self-Healing & Self-Learning

**Self-Align:** Before every response, verify governance compliance: workflow steps followed, security enforced, code matches user's style, no hallucinated imports.

**Self-Heal:** On errors: acknowledge → diagnose root cause → correct → learn → verify. Never repeat same mistake.

**Self-Learn:** Observe user's code style, testing approach, commit format, verbosity. Adapt to match. Persist preferences by suggesting additions to `.github/copilot-instructions.md`.

**Adaptive Governance:** Production=max, prototype=moderate, learning=min. Security floor never drops.

Details: `ai-governance/router/self-alignment.md`

## KPIs
See `ai-governance/kpis/governance-kpis.md` for measurable targets.
