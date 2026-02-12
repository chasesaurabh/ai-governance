# Claude Code — AI Governance Framework

> These instructions are specific to **Claude Code** (CLI). Shared governance rules live in
> `ai-governance/GOVERNANCE-RULES.md` — read that file for the full auto-router,
> hard rules, and self-alignment instructions.

## MANDATORY: Load Governance on Start

On your **first response in any session**, read:
1. `ai-governance/GOVERNANCE-RULES.md` — auto-router, hard rules, self-alignment

Then follow the auto-router on every subsequent prompt.

## How Claude Code Executes Governance

Claude Code is a **CLI-based agentic tool** that can read files, write files, and run bash commands.

When the auto-router (from GOVERNANCE-RULES.md) detects an intent:

1. **Announce** the detected workflow (format in GOVERNANCE-RULES.md)
2. **Read the relevant policy files** using the Read tool:
   - e.g., `cat ai-governance/policies/POL-006-security-privacy.md`
3. **Follow the task routing steps** defined in GOVERNANCE-RULES.md
4. **Execute** using Claude Code's capabilities (file editing, bash commands)

### Intent → Policy Files to Read

| Intent | Read These Policies |
|--------|-------------------|
| Incident | `ai-governance/policies/POL-010-incident-response.md`, `POL-008-observability.md` |
| Security Review | `POL-006-security-privacy.md`, `POL-013-data-classification.md`, `POL-017-secrets-management.md` |
| Bug Fix | `POL-004-coding-standards.md`, `POL-005-testing.md` |
| Deploy | `POL-007-deployment.md`, `POL-012-change-management.md` |
| New Project | `POL-001-requirements.md`, `POL-002-architecture.md`, `POL-004-coding-standards.md` |
| Add Feature | `POL-001-requirements.md`, `POL-003-design.md`, `POL-005-testing.md`, `POL-004-coding-standards.md`, `POL-006-security-privacy.md` |
| Refactor | `POL-004-coding-standards.md`, `POL-005-testing.md` |
| Code Review | All applicable |

## Claude Code-Specific Capabilities

### File Operations
- **Read files** to understand codebase before making changes
- **Write/edit files** for implementation — prefer targeted edits over full rewrites
- **Create new files** when workflows require new artifacts (tests, configs, docs)

### Bash Commands
- Run tests: `npm test`, `pytest`, `go test ./...`, etc.
- Run linter: `npm run lint`, `eslint .`, `ruff check .`, etc.
- Check for secrets: `grep -r "AKIA\|password\s*=" --include="*.ts" --include="*.js" .`
- Check git status: `git diff --cached` (for commit message workflow)
- Build project: `npm run build`, `cargo build`, etc.

### Context Management
- Use `#` to add specific files to context when you need them
- Use `/clear` to reset context when switching tasks (maps to Clear Context intent)
- Use `/compact` to summarize and compress long conversations
- Use `!` prefix to run inline bash commands for quick checks

### CLAUDE.md Tree (Subdirectory Instructions)
- Claude Code reads `CLAUDE.md` from the project root AND from subdirectories
- Subdirectory `CLAUDE.md` files can contain module-specific governance notes
- Example: `src/auth/CLAUDE.md` could contain "All files here handle C3/C4 data — POL-013 applies strictly"

## Persistence (Self-Learn)

Claude Code persists preferences via `CLAUDE.md` additions:
- When you learn significant user preferences, suggest appending a `## User Preferences` section
- Example preferences: code style, testing framework, commit format, governance strictness
- Always ask permission before modifying `CLAUDE.md`
- Subdirectory `CLAUDE.md` files can store module-specific preferences

## Workflow Execution Pattern

Since Claude Code has no workflow file system, follow this pattern:

```
1. Auto-router detects intent from user prompt
2. Announce: "📋 Detected: [Name] — Following: [policies]"
3. Read relevant policy files from ai-governance/policies/
4. Execute task routing steps:
   a. Read/verify prerequisites (requirements, design)
   b. Make code changes (write files)
   c. Run verification (tests, lint, build)
   d. Security check (grep for banned patterns)
   e. Output governance artifacts (AI disclosure, PR checklist)
```

## Claude Code-Specific Limitations

- **No browser preview** — cannot visually verify web UI changes; suggest the user check manually
- **No memory across sessions** — preferences persist only via `CLAUDE.md` file
- **No IDE integration** — cannot see cursor position or open files; ask if context is unclear
- **Advisory only** — governance guides but doesn't block git operations; pair with CI gates for enforcement

## Quick Reference

- **Shared rules:** `ai-governance/GOVERNANCE-RULES.md` (MUST read on start)
- **Policies:** `ai-governance/policies/POL-001` through `POL-017`
- **Templates:** `ai-governance/templates/`
- **Router details:** `ai-governance/router/auto-router.md`
