# Governance Rules — Shared Reference

> **This is the single source of truth** for governance rules enforced by all AI tool adapters.
> Tool-specific adapter files (`.windsurfrules`, `.cursorrules`, `CLAUDE.md`, etc.) reference this file
> instead of duplicating its content. Each adapter adds only tool-specific behavioral instructions.

---

## Auto-Router: Intent Detection & Workflow Triggering

**On every user prompt**, analyze intent and auto-trigger the matching governance workflow.

### Intent → Policy Mapping

| Intent | Trigger Signals | Primary Policies |
|--------|----------------|-----------------|
| **Incident** | "outage", "down", "SEV", "production issue", "alerts firing", "error rate spike" | POL-010 → POL-008 |
| **Security Review** | "security", "vulnerability", "CVE", "injection", "XSS", "is this secure", "secrets exposed" | POL-006 → POL-013 → POL-017 |
| **Bug Fix** | "fix", "bug", "broken", "not working", "error", "crash", "regression", "fails when" | POL-004 → POL-005 → POL-015 |
| **Deploy** | "deploy", "release", "ship", "push to prod", "go live", "rollout" | POL-007 → POL-008 → POL-012 |
| **New Project** | "new project", "from scratch", "bootstrap", "scaffold", "init", "create a new app" | POL-001 → POL-002 → POL-004 → POL-005 → POL-006 → POL-007 |
| **Add Feature** | "add feature", "implement", "build", "create [endpoint/component/page]", "I need a", "integrate" | POL-001 → POL-003 → POL-005 → POL-004 → POL-006 |
| **Refactor** | "refactor", "clean up", "simplify", "extract", "DRY", "too complex", "tech debt" | POL-004 → POL-005 → POL-009 |
| **Code Review** | "review", "look at this code", "check this PR", "feedback on", "is this OK" | All applicable policies |
| **Commit Message** | "commit message", "commit", "summarize changes", "git commit" | Conventional commits format |
| **Clear Context** | "new task", "fresh start", "clear context", "start over", "different topic", "switch to" | Summarize → fresh start |

### Priority Order (highest first)

First identify the requested action. Explanations and quoted or historical incidents do not trigger operational work. Explicit task ordering and prerequisites take precedence over this tie-break order. Security adds controls to feature work; it does not replace the requested action.

1. **Incident** — production is down (urgency trumps all)
2. **Security Review** — vulnerability or security concern
3. **Bug Fix** — something broken that was working
4. **Deploy** — shipping to staging or production
5. **New Project** — starting from scratch
6. **Add Feature** — new functionality in existing codebase
7. **Refactor** — improving code without changing behavior
8. **Code Review** — reviewing changes
9. **Commit Message** — staged changes need a message
10. **Clear Context** — fresh start

### Announcement Format

When a workflow is detected, announce BEFORE executing:

```
📋 **Detected: [Workflow Name]** (governance workflow auto-triggered)
Following: [relevant policy IDs]

[One-line summary of what will happen next]

---
```

### Routing Rules

- **Incidents always win** — never ask for clarification, triage immediately
- **Security is second priority** — route to security review if security-related
- **Multiple intents** — execute primary fully, then transition to secondary
- **Ambiguous** — ask ONE clarifying question with top 2 options
- **Opt-out** — if user says "skip governance", respect it but still enforce hard security rules (POL-006, POL-017)

### Context Switch Detection

If the user's prompt is a completely different topic from the current conversation:
- Suggest starting fresh for better focus
- If confirmed, follow the clear-context workflow

Full routing details: `ai-governance/router/auto-router.md` and `ai-governance/router/intent-patterns.md`

---

## Hard Rules (Always Enforced, Even Without Workflow)

### Security (POL-006, POL-017)

- NEVER hardcode secrets, credentials, API keys, or tokens — use env vars or secret manager
- NEVER use string concatenation in SQL — parameterized queries only
- NEVER log PII (C3/C4 data) unmasked — use `j***@example.com` format
- NEVER use `eval()`, `exec()`, or `Function()` with user input
- NEVER skip input validation — use schema validation (zod, joi, etc.)
- NEVER skip authorization checks — default deny on all endpoints
- ALWAYS set security headers (HSTS, CSP, X-Frame-Options, etc.)

### Code Quality (POL-004)

- ALWAYS match existing code style and naming conventions
- Keep functions ≤ 50 lines as a guideline (80 hard limit); cyclomatic complexity ≤ 15
- ALWAYS use dependency injection over hard-coded dependencies
- NEVER leave `console.log`/`print()` in production code — use structured logger
- NEVER leave `TODO` without a ticket reference
- NEVER leave commented-out code — use git history
- NEVER introduce `any` type in TypeScript
- NEVER suggest packages that don't exist — verify first

### Testing (POL-005)

- ALWAYS write tests alongside implementation (not after)
- ALWAYS use AAA pattern: Arrange, Act, Assert
- ALWAYS test error/edge cases, not just happy path
- ALWAYS use factories for test data, not raw fixtures
- NEVER write tautology tests (`expect(true).toBe(true)`)
- Target ≥ 80% unit test coverage

### Data Classification (POL-013)

- ALWAYS annotate new data model fields with classification (C1-C4)
- NEVER include real C3/C4 data in tests or examples — use synthetic data
- NEVER send C3/C4 data to AI tools
- C3/C4 data: encrypted at rest, masked in logs, synthetic in test environments

### AI Output Safety (POL-014)

- ALWAYS verify imports/packages exist before suggesting
- ALWAYS verify API signatures match actual documentation
- ALWAYS remove hardcoded example values from production code
- ALWAYS complete error handling — cover all failure modes
- New dependencies must be checked: exists, maintained, safe license
- Disclose AI usage per `ai-governance/templates/ai-usage-disclosure.md`

---

## Task Routing — Policy Chains

| Task | Primary Policies | Steps |
|------|-----------------|-------|
| **New feature** | POL-001 → POL-003 → POL-005 → POL-004 → POL-006 | Requirements → Design → Tests → Implement → Security |
| **Bug fix** | POL-004 → POL-005 → POL-015 | Reproduce → Regression test → Root cause fix |
| **New project** | POL-001 → POL-002 → POL-004 → POL-005 → POL-006 → POL-007 | Requirements → Architecture → Standards → Deployment |
| **Architecture decision** | POL-002 → POL-016 | ADR with ≥ 2 options → Review → Decide |
| **Deployment** | POL-007 → POL-008 → POL-012 | Pipeline → Health checks → Progressive rollout |
| **Incident** | POL-010 → POL-008 | Triage → Mitigate → Root cause → Post-mortem |
| **Security review** | POL-006 → POL-013 → POL-017 | Threat model → Fix → Verify |
| **Dependency update** | POL-009 → POL-004 (CTRL-004.3) | Audit → Update → Test → Deploy |

---

## Self-Alignment, Self-Healing & Self-Learning

### Self-Align (Every Response)

Before finalizing any response, verify:
- Active workflow steps followed in order
- Hard security rules enforced (POL-006, POL-017)
- Code matches user's established style and conventions
- No hallucinated imports, APIs, or packages
- AI disclosure ready if applicable (POL-014)

### Self-Heal (On Errors)

When errors are detected (build failures, user corrections, hallucinations):
1. **Detect** the error
2. **Acknowledge** briefly (no lengthy apologies)
3. **Diagnose** root cause (not symptoms)
4. **Correct** with minimal fix
5. **Learn** the pattern — avoid repeating in this session
6. **Verify** the correction works

### Self-Learn (Per Session)

Observe and adapt to the user's patterns:
- **Code style** — naming, indentation, quotes, imports
- **Architecture** — preferred patterns, file organization
- **Testing** — framework, assertion style, coverage targets
- **Error handling** — try/catch vs Result types, message format
- **Commit style** — format, scope, emoji usage
- **Verbosity** — concise vs detailed responses

For significant adaptations, briefly confirm: "📝 I notice you prefer [X]. I'll use that going forward."

### Adaptive Governance

| Context | Strictness | Adjustment |
|---------|-----------|------------|
| **Production code** | Maximum | All gates enforced, security review required |
| **Prototype / POC** | Moderate | Security enforced, testing relaxed with disclaimer |
| **Learning / exploration** | Minimum | Hard security only, suggestions framed as educational |
| **Incident response** | Maximum (speed-focused) | All gates but prioritize speed, defer docs |

**Security floor NEVER drops:** no hardcoded secrets, no injection vectors, no eval with user input, no PII in logs.

Details: `ai-governance/router/self-alignment.md`

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

## Governance Documentation

- **Policies:** `ai-governance/policies/POL-001` through `POL-017`
- **KPIs:** `ai-governance/kpis/governance-kpis.md`
- **Router:** `ai-governance/router/auto-router.md`
- **Intent patterns:** `ai-governance/router/intent-patterns.md`
- **Self-alignment:** `ai-governance/router/self-alignment.md`
- **Exceptions:** `ai-governance/exceptions-log.md`
