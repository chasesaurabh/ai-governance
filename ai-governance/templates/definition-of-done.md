# Definition of Done (DoD)

> A work item is "Done" when ALL applicable criteria below are met. Items not meeting DoD MUST NOT be merged or released.

## Universal Criteria (All Work Items)

| # | Criterion | Evidence |
|---|-----------|---------|
| 1 | **All acceptance criteria met** | Reviewer verifies each criterion |
| 2 | **Code reviewed and approved** (1 reviewer standard, 2 for security-sensitive) | PR approval in VCS |
| 3 | **All CI gates pass** (lint, type-check, unit, integration, SAST) | Green CI pipeline |
| 4 | **No critical/high SAST findings** | SAST report clean |
| 5 | **No critical/high dependency vulnerabilities** introduced | Dependency scan clean |
| 6 | **PR checklist completed** (ai-governance/templates/pr-checklist.md) | Checklist in PR description |
| 7 | **AI usage disclosed** (if applicable) | AI disclosure section completed |

## Feature-Specific Criteria

| # | Criterion | Evidence |
|---|-----------|---------|
| 8 | **Unit test coverage ≥ 80%** for new code | CI coverage report |
| 9 | **Integration tests** for new endpoints/services | CI test results |
| 10 | **Contract tests** updated if API changed | Contract test pass |
| 11 | **API documentation** updated (OpenAPI spec) | Spec file in PR |
| 12 | **Feature flag** configured and tested (on/off) | Flag verified in staging |
| 13 | **Monitoring** configured (metrics, alerts, dashboard) | Dashboard URL, alert config |
| 14 | **Runbook** created/updated (if new operational behavior) | Runbook file in PR |
| 15 | **README** updated (if setup/config changed) | README changes in PR |
| 16 | **Data classification** annotations on new fields | Annotations in code |
| 17 | **Performance** verified (no regression beyond 10%) | Performance test or benchmark |

## Bug Fix-Specific Criteria

| # | Criterion | Evidence |
|---|-----------|---------|
| 8 | **Regression test** added that reproduces the bug | Test that fails without fix, passes with |
| 9 | **Root cause** documented in PR/ticket | Description in PR |
| 10 | **Similar occurrences** checked across codebase | Reviewer confirms |

## Hotfix-Specific Criteria

| # | Criterion | Evidence |
|---|-----------|---------|
| 8 | All standard DoD items completed (or exception documented) | PR checklist |
| 9 | **Backfill items** ticketed (tests, docs deferred under emergency) | Follow-up tickets linked |
| 10 | **Post-mortem** scheduled (if SEV1/SEV2) | Calendar invite |

## Refactor-Specific Criteria

| # | Criterion | Evidence |
|---|-----------|---------|
| 8 | **No behavior change** (unless explicitly scoped) | Existing tests pass unchanged |
| 9 | **Performance not degraded** | Benchmark comparison |
| 10 | **Measurable improvement** documented (complexity, duplication, etc.) | Metrics in PR description |

---

## Process

1. **Author** self-reviews against DoD before requesting review
2. **Reviewer** verifies DoD criteria during review
3. **CI** enforces automated criteria (tests, lint, SAST, coverage)
4. **Merge** only when all criteria met
5. **Exception**: Engineering Manager can approve merge with documented gaps and remediation tickets (max 1-sprint SLA to close gaps)

## DoD Violations

If a violation is discovered post-merge:
1. Create remediation ticket immediately
2. Prioritize in next sprint (or current sprint if security-related)
3. Retrospective item to prevent recurrence
