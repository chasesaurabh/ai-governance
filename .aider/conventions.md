# Aider Conventions — AI Governance Framework

> These conventions are specific to **Aider**. Full shared governance rules are in
> `ai-governance/GOVERNANCE-RULES.md`. Use `/add ai-governance/GOVERNANCE-RULES.md` to load them.

## How Aider Executes Governance

Aider is a **CLI-based, git-aware** coding assistant that auto-commits changes.

### Auto-Router (On Every Prompt)

Analyze the user's intent and follow the matching governance workflow:

| Intent | Signals | Action |
|--------|---------|--------|
| **Incident** | "outage", "down", "SEV", "production issue" | Triage immediately — never ask for clarification |
| **Security** | "security", "vulnerability", "CVE", "injection" | Security review per POL-006 checklist |
| **Bug Fix** | "fix", "bug", "broken", "not working" | Reproduce → regression test → root cause fix |
| **Add Feature** | "implement", "build", "create", "add" | Requirements → tests first → implement → security |
| **Refactor** | "refactor", "clean up", "simplify" | Tests first → atomic changes → verify |
| **Code Review** | "review", "check this", "feedback on" | Structured review by policy area |
| **Commit** | "commit message", "summarize changes" | Conventional commits format |
| **Clear Context** | "new task", "fresh start" | Summarize → `/clear` |

**Announce:** `📋 Detected: [Name] — Following: [policies]`

### Loading Governance Context

Aider doesn't auto-read referenced files. Use `/add` to load what you need:

```
/add ai-governance/GOVERNANCE-RULES.md          # Full shared rules
/add ai-governance/policies/POL-006-security-privacy.md  # Specific policy
/add ai-governance/templates/pr-checklist.md     # PR checklist
```

Suggest `/add` commands to the user when a workflow requires reading a policy file.

## Aider-Specific Capabilities

### Git-Aware Auto-Commit
- Aider auto-commits changes with generated messages
- Commit messages MUST follow conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Aider uses `--auto-commits` by default — each edit gets its own commit
- For multi-step workflows, this means atomic, reviewable commits per step

### Aider Commands for Governance

| Command | Governance Use |
|---------|---------------|
| `/add <file>` | Load policy files, templates, or source files into context |
| `/drop <file>` | Remove files from context when switching tasks |
| `/run <cmd>` | Run linter, tests, build — verify after code changes |
| `/test <cmd>` | Run test suite — Aider will auto-fix if tests fail |
| `/lint <cmd>` | Run linter — Aider will auto-fix lint errors |
| `/clear` | Clear context for new task (maps to Clear Context intent) |
| `/architect` | Switch to architect mode for design-first discussions |
| `/ask` | Ask questions without making code changes (good for reviews) |

### Architect Mode
- Use `/architect` for design-first workflows (new features, architecture decisions)
- Architect mode discusses design, then hands off to coder mode for implementation
- Maps well to the governance pattern: design (POL-003) → implement (POL-004)

### Verification Pattern
After making code changes, always suggest:
```
/run npm test          # or pytest, go test, etc.
/run npm run lint      # or eslint, ruff, etc.
/run npm run build     # verify build succeeds
```

## Hard Rules (Always Apply)

Since Aider doesn't auto-read governance files, essential rules are included here:

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
- Never send C3/C4 data to AI tools

## Aider-Specific Limitations

- **No file browsing** — must use `/add` to load files into context; suggest this to the user
- **No browser preview** — cannot visually verify web UI; suggest manual checking
- **Auto-commits may need squashing** — for multi-step workflows, suggest `git rebase -i` to clean up
- **LLM backend varies** — behavior depends on which model (GPT-4, Claude, etc.) the user configured
- **Advisory only** — governance guides code generation but doesn't block pushes; pair with CI gates

## Persistence (Self-Learn)

Aider reads this file on every session start. To persist preferences:
- Suggest appending a `## Team Preferences` section to this file
- Include: code style, testing framework, architecture patterns, commit format
- Always ask permission before suggesting changes to this file

## Quick Reference

- **Full shared rules:** `ai-governance/GOVERNANCE-RULES.md` (use `/add` to load)
- **Policies:** `ai-governance/policies/POL-001` through `POL-017`
- **Templates:** `ai-governance/templates/`
- **CI enforcement:** `examples/ci/` (recommended to complement Aider's advisory role)
