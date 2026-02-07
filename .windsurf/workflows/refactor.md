---
description: Refactor code safely with proper testing
---

# Refactor Workflow (Enterprise)

Safe refactoring with test coverage gates and no behavior change.

## Step 1: Define Scope & Measure

1. Clarify the refactoring goal:
   - What code smell / tech debt item? (reference debt register per POL-009)
   - What's the measurable desired outcome? (complexity reduction, duplication %, etc.)
   - What MUST NOT change? (behavior, API contracts, performance)

2. Classify change per POL-012:
   - Most refactors = "Standard" (1 reviewer)
   - Large refactors crossing service boundaries = "Normal" (2 reviewers)
   - Framework migration = "Major" (ADR required per POL-002)

## Step 2: Ensure Test Coverage (POL-005)

1. Check existing test coverage for ALL affected code
2. If coverage < 80%, add characterization tests FIRST:
   - Tests verify current behavior exactly as-is
   - Tests MUST pass before any refactoring begins

// turbo
3. Run existing tests to establish baseline (pass/fail + performance)

## Step 3: Plan Atomic Steps

Break refactoring into small, independently committable steps:
- Each step keeps tests passing
- Each step is easy to review (< 200 lines changed)
- Each step can be reverted independently

## Step 4: Execute (POL-004)

1. Make ONE change at a time
2. After each change:
   - Run tests — all MUST pass
   - Verify no behavior change
   - Commit if green

// turbo
3. Run linter and formatter after changes

## Step 5: Verify Zero Behavior Change

- [ ] ALL existing tests pass unchanged
- [ ] No new functionality added (that's a feature, not refactor)
- [ ] Performance not degraded (benchmark if performance-sensitive)
- [ ] API contracts unchanged (contract tests pass per POL-005)
- [ ] No new dependencies introduced (unless replacing deprecated ones)

## Step 6: Measure Improvement

Document measurable improvement in PR description:
- Cyclomatic complexity: before → after
- Duplication: before → after
- File/function length: before → after
- Dependency count: before → after

## Step 7: PR & Disclosure (POL-014)

1. Fill out PR checklist: `ai-governance/templates/pr-checklist.md`
2. AI disclosure if AI-assisted
3. PR description includes: goal, measurement, approach, verification

## Completion Checklist

- [ ] Tests existed or were added BEFORE refactoring (POL-005)
- [ ] All tests pass (no behavior change)
- [ ] Performance not degraded
- [ ] Contract tests pass (POL-005)
- [ ] Measurable improvement documented in PR
- [ ] Lint/format clean (POL-004)
- [ ] PR checklist and AI disclosure complete (POL-014)
- [ ] Tech debt register updated if applicable (POL-009)
