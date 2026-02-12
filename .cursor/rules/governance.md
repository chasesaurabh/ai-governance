# Cursor Governance — Mode-Specific Guide

> This file supplements `.cursorrules`. Shared rules are in `ai-governance/GOVERNANCE-RULES.md`.
> Do NOT duplicate rules from that file here — read it instead.

## Governance by Cursor Mode

Each Cursor mode has different capabilities. Use governance appropriately for each:

### Composer Mode (Agentic / Multi-File)

Composer can read files, edit files, run terminal commands, and make multi-step changes.

**Governance approach in Composer:**
1. Read `ai-governance/GOVERNANCE-RULES.md` at the start if not already loaded
2. When auto-router detects intent, read the relevant policy files from `ai-governance/policies/`
3. Follow the task routing steps (Requirements → Design → Tests → Implement → Security)
4. Run linter and tests via terminal after code changes
5. Use `ai-governance/templates/pr-checklist.md` before declaring work complete

**Example Composer workflow for "add feature":**
```
1. Read POL-001 → verify requirements and acceptance criteria
2. Read POL-003 → design interface first
3. Read POL-005 → write failing tests
4. Implement code following POL-004 standards
5. Run: npm test (verify tests pass)
6. Run: npm run lint (verify code quality)
7. Read POL-006 → security checklist
8. Output: AI disclosure from templates/ai-usage-disclosure.md
```

### Chat Mode (Conversation)

Chat is for discussion only — it cannot edit files or run commands directly.

**Governance approach in Chat:**
- Use Chat for: code review, security review, architecture decisions, incident triage
- Reference specific files with `@file` for focused discussion
- Reference directories with `@folder` for broader context
- Use `@codebase` for project-wide questions
- When reviewing code, structure feedback by policy area (security, testing, quality)
- For incident triage: ask for logs, metrics, recent changes — guide through POL-010 verbally

### Inline Edit (Cmd+K / Ctrl+K)

Inline edit is single-location, quick edits with minimal context.

**Governance approach in Inline:**
- Hard security rules still apply (no hardcoded secrets, parameterized queries)
- Match surrounding code style exactly
- Keep edits minimal and focused
- Not suitable for multi-step governance workflows

## Cursor-Specific Patterns

### File References in Chat
- `@ai-governance/GOVERNANCE-RULES.md` — load shared rules
- `@ai-governance/policies/POL-006-security-privacy.md` — load specific policy
- `@ai-governance/templates/pr-checklist.md` — load PR checklist

### Notecards / Rules Persistence
- User preferences learned during sessions should be suggested as `.cursor/rules/` files
- Example: `.cursor/rules/code-style.md` for team conventions
- Rules files are auto-loaded, so preferences persist across sessions

### Limitations to Be Honest About
- Cursor cannot run CI pipelines — recommend `examples/ci/` templates for enforcement
- Cursor's governance is advisory — it guides but doesn't block merges
- For true enforcement, pair with CI gates and branch protection
