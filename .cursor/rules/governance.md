# Cursor Rules - Enterprise AI Governance

> 17 enforceable policies in `ai-governance/policies/`. All AI output subject to these rules.

## Automatic Workflow Detection (Auto-Router)

**ON EVERY USER PROMPT:** Analyze intent and auto-trigger the matching governance workflow.

| Intent | Signals | Policies |
|--------|---------|----------|
| **Incident** | "outage", "down", "SEV", "production issue" | POL-010 → POL-008 |
| **Security** | "security", "vulnerability", "CVE", "injection" | POL-006 → POL-013 → POL-017 |
| **Bug Fix** | "fix", "bug", "broken", "not working", "error" | POL-004 → POL-005 → POL-015 |
| **Deploy** | "deploy", "release", "ship to prod" | POL-007 → POL-008 → POL-012 |
| **New Project** | "new project", "from scratch", "scaffold" | POL-001 → POL-002 → POL-004 → POL-007 |
| **Add Feature** | "implement", "build", "create [thing]" | POL-001 → POL-003 → POL-005 → POL-004 → POL-006 |
| **Refactor** | "refactor", "clean up", "simplify", "DRY" | POL-004 → POL-005 → POL-009 |
| **Code Review** | "review", "check this", "feedback on" | All applicable |
| **Commit** | "commit message", "summarize changes" | Conventional commits |
| **Clear Context** | "new task", "fresh start", "switch to" | Summarize → fresh start |

**Announce:** `📋 Detected: [Name] — Following: [policies]` then execute workflow steps.
**Ambiguous:** Ask ONE question with top 2 options.
**Incidents:** Never ask — triage immediately.
**Opt-out:** Respect "skip governance" but always enforce POL-006 + POL-017.

Details: `ai-governance/router/auto-router.md` and `ai-governance/router/intent-patterns.md`

## Hard Rules (Never Violate)

### Security (POL-006, POL-017)
- NEVER hardcode secrets, credentials, API keys, or tokens
- NEVER use string concatenation in SQL—parameterized queries only
- NEVER log PII (C3/C4 data) unmasked—use `j***@example.com` format
- NEVER use `eval()`, `exec()`, or `Function()` with user input
- NEVER skip input validation—use schema validation (zod, joi, etc.)
- NEVER skip authorization checks—default deny on all endpoints
- ALWAYS set security headers (HSTS, CSP, X-Frame-Options, etc.)

### Code Quality (POL-004)
- NEVER leave `console.log`/`print()` in production code—use structured logger
- NEVER leave `TODO` without a ticket reference
- NEVER leave commented-out code—use git history
- NEVER introduce `any` type in TypeScript
- NEVER suggest packages that don't exist—verify first
- ALWAYS match existing code style
- ALWAYS keep functions ≤ 50 lines, complexity ≤ 15
- ALWAYS use dependency injection over hard-coded deps

### Testing (POL-005)
- ALWAYS write tests alongside implementation
- ALWAYS use AAA: Arrange, Act, Assert
- NEVER write tautology tests (`expect(true).toBe(true)`)
- ALWAYS test error/edge cases, not just happy path
- ALWAYS use factories for test data, not raw fixtures
- Target ≥ 80% unit coverage

### Data (POL-013)
- ALWAYS annotate new data fields with classification (C1-C4)
- NEVER include real C3/C4 data in tests—use synthetic data
- NEVER send C3/C4 data to AI tools

### AI Output (POL-014)
- ALWAYS verify imports exist before suggesting
- ALWAYS verify API signatures against real docs
- ALWAYS remove hardcoded example values from prod code
- ALWAYS complete error handling—don't skip edge cases

## Task Routing

| Task | Primary Policies |
|------|-----------------|
| New feature | POL-001 → POL-003 → POL-005 → POL-004 → POL-006 |
| Bug fix | POL-004 → POL-005 (regression test first) |
| New project | POL-001 → POL-002 → POL-004 → POL-007 |
| Architecture decision | POL-002 (ADR required) → POL-016 (API versioning) |
| Deployment | POL-007 → POL-008 → POL-012 |
| Incident | POL-010 → POL-008 |
| Security review | POL-006 → POL-013 → POL-017 |
| Dependency update | POL-009 → POL-004 CTRL-004.3 |

## Templates

- `ai-governance/templates/pr-checklist.md` — PR gates
- `ai-governance/templates/adr-template.md` — Architecture decisions
- `ai-governance/templates/threat-model-lite.md` — Security assessment
- `ai-governance/templates/ai-usage-disclosure.md` — AI disclosure (required)
- `ai-governance/templates/definition-of-ready.md` — Sprint entry
- `ai-governance/templates/definition-of-done.md` — Completion criteria
- `ai-governance/templates/risk-acceptance.md` — Policy exceptions

## Self-Alignment, Self-Healing & Self-Learning

**Self-Align:** Before every response, verify governance compliance: workflow followed, security enforced, code matches user's style, no hallucinated imports/APIs.

**Self-Heal:** On errors: acknowledge → diagnose root cause → correct → learn → verify. Never repeat same mistake.

**Self-Learn:** Observe user's code style, architecture, testing, commit format, verbosity. Adapt to match. Persist by suggesting additions to `.cursor/rules/` files.

**Adaptive Governance:** Production=max, prototype=moderate, learning=min. Security floor never drops.

Details: `ai-governance/router/self-alignment.md`

## KPIs
See `ai-governance/kpis/governance-kpis.md` for targets.
