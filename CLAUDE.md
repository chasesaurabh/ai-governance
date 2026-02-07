# AI Governance Instructions for Claude Code

> Enterprise-grade governance framework. All AI-generated code is subject to these policies.

## Automatic Workflow Detection (Auto-Router)

**YOU MUST DO THIS ON EVERY USER PROMPT:** Before responding, analyze the user's intent and auto-trigger the matching governance workflow.

| Intent | Trigger Signals | Action |
|--------|----------------|--------|
| **Incident** | "outage", "down", "incident", "SEV", "production issue" | Triage immediately per POL-010. Never ask for clarification. |
| **Security** | "security", "vulnerability", "CVE", "injection", "XSS" | Follow security-review steps per POL-006 |
| **Bug Fix** | "fix", "bug", "broken", "not working", "error", "crash" | Reproduce → root cause → regression test → fix per POL-004/005 |
| **Deploy** | "deploy", "release", "ship", "push to prod" | Follow deployment gates per POL-007 |
| **New Project** | "new project", "from scratch", "bootstrap", "scaffold" | Full setup per POL-001→002→004→005→006→007 |
| **Add Feature** | "add feature", "implement", "build", "create [thing]" | Requirements → design → tests → implement per POL-001→003→005→004→006 |
| **Refactor** | "refactor", "clean up", "simplify", "extract", "DRY" | Tests first → atomic changes → measure improvement per POL-004/005 |
| **Code Review** | "review", "check this code", "feedback on" | Structured review per all applicable policies |
| **Commit** | "commit message", "summarize changes" | Conventional commits format |
| **Clear Context** | "new task", "fresh start", "different topic" | Summarize session, suggest `/clear` |

**When detected**, announce before executing:
```
📋 **Detected: [Workflow Name]** (governance workflow auto-triggered)
Following: [policy IDs]
[One-line summary]
---
```

**If ambiguous**: Ask ONE clarifying question with top 2 options.
**If user says "skip governance"**: Respect it, but still enforce POL-006 and POL-017 hard rules.

Full routing details: `ai-governance/router/auto-router.md` and `ai-governance/router/intent-patterns.md`

## Policy Framework

Enforceable policies live in `ai-governance/policies/`:

| Policy | ID | Scope |
|--------|----|-------|
| Requirements | POL-001 | Structured intake, acceptance criteria, threat pre-screen |
| Architecture | POL-002 | ADRs, API versioning, technology radar, fitness functions |
| Design | POL-003 | Interface-first, data model review, error taxonomy |
| Coding Standards | POL-004 | Lint, complexity, dependency hygiene, banned patterns |
| Testing | POL-005 | Layered tests, contracts, mutation testing, quality gates |
| Security & Privacy | POL-006 | SAST, auth, input validation, injection prevention |
| Deployment | POL-007 | Pipeline-only, progressive rollout, health checks |
| Observability | POL-008 | Metrics/logs/traces, SLOs, alerting, dashboards |
| Maintenance | POL-009 | Dependency updates, tech debt, capacity planning |
| Incident Response | POL-010 | Severity classification, response protocol, post-mortems |
| Documentation | POL-011 | Minimum doc set, API docs, runbooks, freshness |
| Change Management | POL-012 | Classification, freeze windows, feature flags |
| Data Classification | POL-013 | C1-C4 levels, handling rules, AI data controls |
| LLM Risk Controls | POL-014 | Hallucination detection, prompt injection, disclosure |
| Quality Engineering | POL-015 | Quality gates, contract testing, synthetic monitoring |
| API Versioning | POL-016 | Versioning scheme, breaking change detection, deprecation |
| Secrets Management | POL-017 | Storage, scanning, rotation, access control |

## Mandatory Rules When Generating Code

### Code Quality (POL-004)
- Match existing code style and naming conventions
- Keep cyclomatic complexity ≤ 15 per function
- No banned patterns: `eval()`, `console.log` in prod, `TODO` without ticket, commented-out code
- All imports must exist—verify before suggesting

### Security (POL-006, POL-017)
- Validate ALL user inputs with schema validation
- Parameterized queries only—never string concatenation for SQL
- Encode all outputs to prevent XSS
- Authorization checks on every endpoint
- No hardcoded secrets—use environment variables or secret manager
- Sensitive data (C3/C4) never logged—mask PII in logs

### Testing (POL-005)
- Write tests alongside code, not after
- Unit tests for business logic (≥ 80% coverage target)
- Integration tests for API endpoints
- Tests must actually assert behavior—no tautologies
- Edge cases and error conditions tested
- AAA pattern: Arrange, Act, Assert

### Data Classification (POL-013)
- New data fields MUST have classification annotations (C1-C4)
- C3/C4 data: encrypted at rest, masked in logs, synthetic in tests
- Never include C3/C4 data in AI prompts or examples

### AI-Specific (POL-014)
- Verify all suggested imports/packages actually exist
- Verify API signatures match actual documentation
- No hardcoded test/example values in production code
- Disclose AI usage in PR using `ai-governance/templates/ai-usage-disclosure.md`

## Task Workflows

### New Feature
1. Verify requirements meet POL-001 (acceptance criteria, NFRs, data classification)
2. Design interfaces first per POL-003 (OpenAPI spec, error taxonomy)
3. Write failing tests per POL-005
4. Implement per POL-004 coding standards
5. Security review per POL-006 checklist
6. Update docs per POL-011

### Bug Fix
1. Reproduce → identify root cause (not symptoms)
2. Write regression test first (POL-005)
3. Minimal fix targeting root cause
4. Verify full test suite passes
5. Document root cause in PR

### Architecture Decision
1. Use ADR template: `ai-governance/templates/adr-template.md`
2. Minimum 2 options considered with trade-offs
3. Include cost, security, and compliance impact
4. Requires 2-reviewer sign-off

## Templates

Reference these for structured output:
- `ai-governance/templates/pr-checklist.md` — PR review checklist
- `ai-governance/templates/definition-of-ready.md` — Sprint entry criteria
- `ai-governance/templates/definition-of-done.md` — Completion criteria
- `ai-governance/templates/adr-template.md` — Architecture decisions
- `ai-governance/templates/threat-model-lite.md` — Security assessment
- `ai-governance/templates/risk-acceptance.md` — Policy exceptions
- `ai-governance/templates/ai-usage-disclosure.md` — AI usage tracking

## Self-Alignment, Self-Healing & Self-Learning

**Self-Align:** Before every response, verify: workflow steps followed, security rules enforced (POL-006, POL-017), code matches user's style, no hallucinated imports/APIs, AI disclosure ready (POL-014).

**Self-Heal:** On user correction or build failure: acknowledge → diagnose root cause → correct → learn pattern → verify. Never repeat the same mistake in a session.

**Self-Learn:** Observe user's code style, architecture preferences, testing approach, commit format, verbosity. Adapt to match. Confirm significant adaptations: "📝 I notice you prefer [X]. I'll use that going forward." Suggest appending preferences to `CLAUDE.md` for persistence.

**Adaptive Governance:** Production=max strictness, prototype=moderate, learning=min. Security floor never drops (no hardcoded secrets, no injection, no eval with user input, no PII in logs).

Details: `ai-governance/router/self-alignment.md`

## KPIs

See `ai-governance/kpis/governance-kpis.md` for measurable targets across all policies.
