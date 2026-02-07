# Aider Conventions - Enterprise AI Governance

> 17 enforceable policies in `ai-governance/policies/`. All AI output subject to these rules.

## Automatic Workflow Detection (Auto-Router)

**ON EVERY USER PROMPT:** Analyze intent and auto-trigger the matching governance workflow.

| Intent | Signals | Policies |
|--------|---------|----------|
| **Incident** | "outage", "down", "SEV", "production issue" | POL-010 → POL-008 |
| **Security** | "security", "vulnerability", "CVE", "injection" | POL-006 → POL-013 → POL-017 |
| **Bug Fix** | "fix", "bug", "broken", "not working", "error" | POL-004 → POL-005 |
| **Deploy** | "deploy", "release", "ship to prod" | POL-007 → POL-012 |
| **New Project** | "new project", "from scratch", "scaffold" | POL-001 → POL-002 → POL-004 |
| **Add Feature** | "implement", "build", "create [thing]" | POL-001 → POL-003 → POL-005 → POL-004 |
| **Refactor** | "refactor", "clean up", "simplify" | POL-004 → POL-005 |
| **Code Review** | "review", "check this", "feedback on" | All applicable |
| **Commit** | "commit message", "summarize changes" | Conventional commits |
| **Clear Context** | "new task", "fresh start" | Summarize → use `/clear` |

Announce: `📋 Detected: [Name] — Following: [policies]` then follow workflow.
Ambiguous: Ask ONE question. Incidents: never ask, triage immediately.
Details: `ai-governance/router/auto-router.md`

## Hard Rules

### Security (POL-006, POL-017)
- Parameterized queries only—no SQL string concatenation
- Validate all inputs with schema validation
- No hardcoded secrets—use env vars or secret manager
- No PII in logs—mask C3/C4 data
- Authorization on every endpoint—default deny
- Set security headers on all responses

### Code Quality (POL-004)
- Match existing code style
- Functions ≤ 50 lines, complexity ≤ 15
- No `eval()`, no `console.log` in prod, no `TODO` without ticket
- No commented-out code—use git history
- Verify all imports exist before suggesting

### Testing (POL-005)
- Write tests alongside code (≥ 80% coverage target)
- AAA pattern: Arrange, Act, Assert
- No tautology tests—assert real behavior
- Test error/edge cases, use factories for data

### Data (POL-013)
- Annotate new data fields with classification (C1-C4)
- C3/C4: encrypted at rest, masked in logs, synthetic in tests
- Never send C3/C4 data to AI tools

### AI (POL-014)
- Verify packages exist before suggesting
- Verify API signatures against real documentation
- Complete error handling—cover all failure modes
- Disclose AI usage per `ai-governance/templates/ai-usage-disclosure.md`

## Commit Messages

Conventional commits:
```
<type>(<scope>): <description>

[body: what and why]

[footer: breaking changes, issue refs]
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Task Routing

| Task | Policies | Steps |
|------|----------|-------|
| Feature | POL-001→003→005→004→006 | Requirements → Design → Tests → Implement → Security |
| Bug fix | POL-004→005 | Reproduce → Regression test → Root cause fix |
| Architecture | POL-002→016 | ADR with ≥ 2 options → Review → Decide |
| Security | POL-006→013→017 | Threat model → Fix → Verify |

## Templates
- `ai-governance/templates/pr-checklist.md`
- `ai-governance/templates/adr-template.md`
- `ai-governance/templates/ai-usage-disclosure.md`
- `ai-governance/templates/threat-model-lite.md`

## Self-Alignment, Self-Healing & Self-Learning

**Self-Align:** Verify governance compliance before every response. Security rules (POL-006, POL-017) always enforced.

**Self-Heal:** On errors: acknowledge → root cause → correct → learn → verify. Never repeat same mistake.

**Self-Learn:** Observe user's code style, testing, commit format. Adapt to match. Persist via `.aider/conventions.md` additions with permission.

**Adaptive Governance:** Production=max, prototype=moderate, learning=min. Security floor never drops.

Details: `ai-governance/router/self-alignment.md`

## KPIs
See `ai-governance/kpis/governance-kpis.md`
