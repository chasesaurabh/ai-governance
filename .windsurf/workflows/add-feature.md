---
description: Add a new feature with proper governance and testing
---

# Add Feature Workflow (Enterprise)

Adds a feature with all governance gates enforced.

## Step 1: Verify Requirements (POL-001)

Read `ai-governance/policies/POL-001-requirements.md`:

1. Confirm the feature has:
   - Problem statement and business value
   - Acceptance criteria (Given/When/Then)
   - NFR targets if applicable (latency, throughput)
   - Data classification for any new data (C1-C4 per POL-013)
   - Out-of-scope list

2. If feature touches auth, payments, PII, or external integrations:
   - Complete `ai-governance/templates/threat-model-lite.md`
   - Label PR `security-review-required`

3. If requirements are unclear, ask clarifying questions before proceeding.

## Step 2: Design (POL-003)

Read `ai-governance/policies/POL-003-design.md`:

1. For new endpoints: draft OpenAPI spec or interface definition FIRST
2. For data model changes: document fields with classification tags, constraints, indexes, migration plan
3. Define error taxonomy for new error types
4. For architecture-qualifying changes: create ADR using `ai-governance/templates/adr-template.md`

## Step 3: Write Failing Tests (POL-005)

Read `ai-governance/policies/POL-005-testing.md`:

1. Write failing tests BEFORE implementation:
   - Unit tests for business logic (target ≥ 80% coverage)
   - Integration tests for new API endpoints
   - Contract tests if API consumed by other teams
   - Edge cases: null, empty, boundaries, error conditions

2. Verify tests fail (confirms they're testing the right thing)
3. Use test factories for data, not raw fixtures

## Step 4: Implementation (POL-004)

Read `ai-governance/policies/POL-004-coding-standards.md`:

1. Implement following coding standards:
   - Match existing code style and naming
   - Functions ≤ 50 lines, complexity ≤ 15
   - Explicit error handling with typed errors
   - Structured logging (not console.log)
   - Data classification annotations on new fields

2. Make all tests pass

// turbo
3. Run linter and formatter

## Step 5: Security Review (POL-006, POL-017)

Read `ai-governance/policies/POL-006-security-privacy.md`:

- [ ] All inputs validated with schema validation
- [ ] Parameterized queries (no SQL string concatenation)
- [ ] Authorization checked on new endpoints (default deny)
- [ ] No hardcoded secrets (env vars or secret manager)
- [ ] PII (C3/C4) masked in logs
- [ ] XSS prevention (output encoding)
- [ ] Security headers configured

## Step 6: Documentation (POL-011)

- [ ] OpenAPI spec updated if new/changed endpoints
- [ ] README updated if config/setup changed
- [ ] Runbook created if new operational behavior
- [ ] ADR filed if architecture decision made

## Step 7: AI Disclosure & PR Checklist (POL-014)

1. Complete AI usage disclosure: `ai-governance/templates/ai-usage-disclosure.md`
2. Fill out PR checklist: `ai-governance/templates/pr-checklist.md`
3. Verify Definition of Done: `ai-governance/templates/definition-of-done.md`

## Completion Checklist

- [ ] Requirements verified with acceptance criteria (POL-001)
- [ ] Design documented, interfaces defined first (POL-003)
- [ ] Tests written and passing (≥ 80% coverage) (POL-005)
- [ ] Code follows standards, lint passes (POL-004)
- [ ] Security review complete (POL-006)
- [ ] No secrets in code (POL-017)
- [ ] Data fields classified (POL-013)
- [ ] Documentation updated (POL-011)
- [ ] AI disclosure completed (POL-014)
- [ ] PR checklist filled out
