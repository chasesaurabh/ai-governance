---
description: Generate git commit message from staged changes
---

# Git Staged Summary Workflow (Enterprise)

Generate a well-formatted commit message with governance compliance from staged changes.

## Step 1: Get Staged Changes

// turbo
1. Run `git diff --cached --stat` to see what files changed

// turbo
2. Run `git diff --cached` to see the actual changes

## Step 2: Analyze Changes

1. Identify the **type** of change:
   - `feat`: New feature (POL-001, POL-003)
   - `fix`: Bug fix (POL-004, POL-005)
   - `docs`: Documentation only (POL-011)
   - `style`: Formatting, no code change (POL-004)
   - `refactor`: Code change that neither fixes nor adds (POL-004)
   - `test`: Adding or updating tests (POL-005)
   - `chore`: Build process, dependencies (POL-009)
   - `security`: Security fix or improvement (POL-006)
   - `perf`: Performance improvement (POL-015)

2. Identify the **scope** (component/area affected)

3. Check for governance-relevant flags:
   - Breaking change? → Requires `BREAKING CHANGE:` footer (POL-016)
   - Security fix? → Tag with `security` type
   - AI-generated code? → Note in commit body

## Step 3: Generate Commit Message

Follow conventional commits format:

```
<type>(<scope>): <short description (≤72 chars)>

<body: what changed and WHY, not how>

<footer: breaking changes, issue refs, AI disclosure>
```

Rules:
- Subject line ≤ 72 characters
- Body wraps at 80 characters
- Explain **what** and **why**, not **how**
- Reference ticket/issue number
- Breaking changes MUST have `BREAKING CHANGE:` footer

### Examples

**Feature:**
```
feat(auth): add password reset via email link

Users can now reset their password through a time-limited email link.
Tokens use crypto-random generation and expire after 24 hours.
Rate limited to 3 requests per hour per email.

Closes #123
AI-assisted: Copilot (completion suggestions)
```

**Bug fix:**
```
fix(api): handle null email in user response serializer

Previously, null email addresses caused a 500 error during JSON
serialization. Now returns empty string with appropriate logging.
Root cause: missing null check in UserSerializer.toJSON().

Fixes #456
Escape-analysis: Missing unit test (Gate 2)
```

**Security fix:**
```
security(auth): enforce parameterized queries in user lookup

Replaced string interpolation with parameterized query in
findUserByEmail() to prevent SQL injection.

Fixes #789
Severity: High (OWASP A03)
```

**Breaking change (POL-016):**
```
feat(api)!: restructure user endpoint response format

BREAKING CHANGE: User endpoint now returns nested profile object.
Migration: access user.profile.name instead of user.name.
Deprecation notice sent 90 days ago per POL-016.

Consumer migration guide: docs/migrations/user-v2.md
```

**Refactor:**
```
refactor(orders): extract validation into dedicated module

Reduces cyclomatic complexity in OrderService from 23 to 8.
No behavior change — all existing tests pass unchanged.

Tech-debt: TD-042
```

## Step 4: Present to User

1. Show the generated commit message
2. Ask if they want to:
   - Use as-is
   - Modify the message
   - Regenerate with different focus
3. If AI was used in the changes, remind about AI disclosure:
   - Add `AI-assisted: [tool]` to commit footer if applicable
