---
description: Review code changes following governance standards
---

# Code Review Workflow (Enterprise)

Structured review enforcing all governance policies.

## Step 1: Context (2 min)

1. Read PR description: problem, approach, change classification (POL-012)
2. Check AI usage disclosure (POL-014) — if AI-assisted/generated, apply extra scrutiny
3. Review linked ticket for acceptance criteria (POL-001)
4. Note change type: Standard / Normal / Emergency / Major

## Step 2: Architecture & Design (POL-002, POL-003)

- [ ] Solution matches requirements and acceptance criteria
- [ ] No simpler approach exists
- [ ] ADR present if architecture-qualifying change
- [ ] API spec (OpenAPI) matches implementation if new endpoints
- [ ] Error taxonomy followed for new error types
- [ ] Data model changes have classification annotations (POL-013)

## Step 3: Code Quality (POL-004)

- [ ] Matches existing code style and naming conventions
- [ ] Functions focused, ≤ 50 lines, complexity ≤ 15
- [ ] No banned patterns: `eval`, `console.log`, `TODO` without ticket, commented-out code
- [ ] Explicit error handling — no swallowed exceptions
- [ ] Dependency injection used — no hard-coded dependencies
- [ ] New dependencies verified: exists, maintained, safe license, no known vulns

## Step 4: Security (POL-006, POL-017)

- [ ] All user inputs validated with schema validation
- [ ] Parameterized queries only (no SQL string concatenation)
- [ ] Output encoding (XSS prevention)
- [ ] Authorization checked on new/changed endpoints
- [ ] No hardcoded secrets or credentials
- [ ] PII (C3/C4) masked in logs
- [ ] Security headers configured
- [ ] SAST scan clean

## Step 5: Testing (POL-005)

- [ ] Tests cover new logic (unit ≥ 80% coverage)
- [ ] Tests assert real behavior (not tautologies)
- [ ] Edge cases tested: null, empty, boundaries, errors
- [ ] Contract tests updated if API changed
- [ ] Tests use factories, not raw fixtures
- [ ] No skipped tests without ticket reference

## Step 6: AI-Specific Checks (POL-014)

> If PR is AI-assisted or AI-generated:

- [ ] All imports verified to exist
- [ ] API signatures match real documentation
- [ ] No hallucinated packages or config options
- [ ] No hardcoded example/test values in prod code
- [ ] Error handling is complete (AI often misses edge cases)
- [ ] Full test suite run (not just new tests)
- [ ] Reviewer spent ≥ 1 min per 50 lines (anti-rubber-stamp)
- [ ] At least 1 substantive comment left

## Step 7: Performance & Operational

- [ ] No N+1 queries or obvious performance issues
- [ ] Database queries have appropriate indexes
- [ ] Caching strategy appropriate
- [ ] Health check endpoints work (POL-007)
- [ ] Structured logging added for new functionality (POL-008)

## Step 8: Documentation (POL-011)

- [ ] API docs updated if endpoints changed
- [ ] README updated if config/setup changed
- [ ] Runbook updated if operational behavior changed

## Feedback Format

Use prefixes to distinguish severity:
- `[must-fix]` — Blocking, must address before merge
- `[suggestion]` — Non-blocking improvement
- `[question]` — Needs clarification
- `[nit]` — Minor style preference

## Approval Criteria

Approve when ALL apply:
- [ ] No `[must-fix]` items remaining
- [ ] PR checklist complete (`ai-governance/templates/pr-checklist.md`)
- [ ] AI disclosure accurate (POL-014)
- [ ] Security concerns addressed (POL-006)
- [ ] Tests adequate and meaningful (POL-005)
- [ ] Definition of Done met (`ai-governance/templates/definition-of-done.md`)
