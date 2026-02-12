# GitHub Copilot Instructions — AI Governance Framework

> These instructions are specific to **GitHub Copilot** (inline completions + Copilot Chat).
> Full shared governance rules are in `ai-governance/GOVERNANCE-RULES.md`.

## How Copilot Enforces Governance

GitHub Copilot works in two modes with different governance capabilities:

### Inline Completions (Tab-Complete)

Copilot's inline suggestions have **no conversation context** — they complete code based on the current file and open tabs.

**What inline completions MUST always do:**
- Match the existing code style exactly (naming, indentation, patterns)
- Use parameterized queries — never concatenate strings into SQL
- Use environment variables for secrets — never hardcode credentials
- Validate inputs with the project's validation library (zod, joi, etc.)
- Use structured logging — never `console.log` in production code
- Complete error handling — include catch blocks, error types, edge cases
- Use real, verified imports — never suggest packages that don't exist

**What inline completions MUST never do:**
- Suggest `eval()`, `exec()`, or `Function()` with any user-provided input
- Introduce `any` type in TypeScript
- Generate `TODO` without a ticket reference
- Leave commented-out code
- Include real PII or C3/C4 data in examples or test fixtures
- Hardcode API keys, tokens, passwords, or connection strings

### Copilot Chat (Conversational)

Copilot Chat supports `@workspace` queries and conversational assistance.

**In Copilot Chat, follow the auto-router:**

| Intent | Signals | Governance Action |
|--------|---------|------------------|
| **Incident** | "outage", "down", "SEV", "production issue" | Triage immediately — guide through POL-010 steps verbally |
| **Security** | "security", "vulnerability", "CVE", "injection" | Walk through POL-006 checklist, check for banned patterns |
| **Bug Fix** | "fix", "bug", "broken", "not working" | Guide: reproduce → root cause → regression test → fix |
| **Add Feature** | "implement", "build", "create", "add" | Guide: requirements → design → tests first → implement → security review |
| **Refactor** | "refactor", "clean up", "simplify" | Guide: verify tests exist → make changes → verify tests still pass |
| **Code Review** | "review", "check this", "feedback on" | Structure feedback by: security, testing, code quality, architecture |
| **Commit** | "commit message", "summarize changes" | Conventional commits: `type(scope): description` |

**Announce detected intent:** `📋 Detected: [Name] — Following: [policies]`

### Using @workspace for Governance

- `@workspace` can search across the project for context
- Use it to check for patterns: "Are there any hardcoded secrets in @workspace?"
- Use it to understand conventions: "What testing framework does @workspace use?"
- Reference governance files: "Check @workspace ai-governance/policies/POL-006 for security rules"

## Hard Rules (Always Apply)

Since Copilot cannot autonomously read other files, these rules are included directly:

### Security (POL-006, POL-017)
- NEVER hardcode secrets — use env vars or secret manager
- NEVER concatenate SQL strings — parameterized queries only
- NEVER log PII unmasked — mask C3/C4 data
- NEVER use eval()/exec() with user input
- ALWAYS validate inputs with schema validation
- ALWAYS set security headers on HTTP responses
- ALWAYS check authorization on endpoints — default deny

### Code Quality (POL-004)
- ALWAYS match existing code style
- Functions ≤ 50 lines, complexity ≤ 15
- No `console.log` in prod, no `TODO` without ticket, no commented-out code
- Verify all imports exist before suggesting

### Testing (POL-005)
- Write tests alongside code — AAA pattern (Arrange, Act, Assert)
- No tautology tests — assert real behavior
- Test edge cases: null, empty, boundaries, error conditions
- Target ≥ 80% unit coverage

### Data (POL-013)
- Annotate new data fields with classification (C1-C4)
- C3/C4: encrypted at rest, masked in logs, synthetic in tests

## Copilot-Specific Limitations

- **Cannot read files autonomously** — relies on open tabs and @workspace for context
- **Cannot run terminal commands** — suggest commands for the user to run manually
- **Cannot execute multi-step workflows** — guide the user through steps conversationally
- **No memory across sessions** — preferences don't persist; suggest adding to this file
- **Advisory only** — governance guides completions but cannot block commits; pair with CI gates

## Persistence (Self-Learn)

Copilot reads this file on every interaction. To persist preferences:
- Suggest the user append a `## Team Preferences` section to this file
- Include: code style, testing framework, architecture patterns, commit format
- This file is the only persistence mechanism for Copilot

## Quick Reference

- **Full shared rules:** `ai-governance/GOVERNANCE-RULES.md`
- **Policies:** `ai-governance/policies/POL-001` through `POL-017`
- **Templates:** `ai-governance/templates/`
- **CI enforcement:** `examples/ci/` (recommended to complement Copilot's advisory role)
