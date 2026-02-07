---
description: Debug and fix bugs with proper process
---

# Fix Bug Workflow (Enterprise)

Systematic debugging with governance gates. Root cause first, minimal fix, regression test.

## Step 1: Reproduce & Classify

1. Get reproduction details:
   - Expected vs actual behavior
   - Steps to reproduce
   - Environment (browser, OS, version)
   - Affected users/scope

2. Classify severity per POL-010:
   - **SEV1**: Complete outage → immediate
   - **SEV2**: Major feature broken → < 30 min response
   - **SEV3**: Minor, workaround exists → < 4 hours
   - **SEV4**: Cosmetic → next business day

3. Reproduce locally before attempting any fix

## Step 2: Root Cause Investigation

Follow POL-004 debugging practices:

1. Check recent changes: `git log --since="3 days ago" --oneline`
2. Review error logs, stack traces, monitoring dashboards (POL-008)
3. Add diagnostic logging if needed (structured, no PII per POL-013)
4. Isolate: data-related? environment-specific? race condition? dependency issue?
5. **Document the root cause BEFORE writing any fix code**

## Step 3: Escape Analysis (POL-015)

Determine which quality gate SHOULD have caught this bug:
- Missing unit test? → Gate 2
- Missing integration test? → Gate 2
- Missing contract test? → Gate 2
- Missing E2E test? → Gate 3
- Missing monitoring? → Gate 5
- Document in PR description for KPI tracking

## Step 4: Write Regression Test (POL-005)

1. Write a test that reproduces the exact bug
2. Verify the test FAILS with current code (confirms it catches the bug)
3. Add tests at the appropriate gate level identified in Step 3

## Step 5: Implement Fix (POL-004)

1. Fix the ROOT CAUSE, not symptoms
2. Prefer minimal, single-purpose changes
3. Handle edge cases discovered during investigation
4. Follow coding standards (no banned patterns, proper error handling)

// turbo
5. Run full test suite — regression test should now PASS, nothing else should break

## Step 6: Security & Data Check

If bug involved auth, data handling, or external input:
- [ ] Input validation added/fixed (POL-006)
- [ ] No new secrets exposed (POL-017)
- [ ] Data classification maintained (POL-013)

## Step 7: Documentation & PR

1. PR description includes:
   - Root cause explanation
   - Fix description
   - Escape analysis (which gate should have caught it)
   - How to verify
2. Fill out PR checklist: `ai-governance/templates/pr-checklist.md`
3. AI disclosure if AI-assisted: `ai-governance/templates/ai-usage-disclosure.md`
4. Consider if runbook update needed (POL-011)

## Step 8: Post-Fix (SEV1/SEV2 only)

If SEV1 or SEV2 per POL-010:
1. Schedule post-mortem within 48 hours
2. Create action items to prevent recurrence
3. Update monitoring/alerting if gap identified

## Completion Checklist

- [ ] Bug reproduced locally
- [ ] Root cause identified and documented
- [ ] Escape analysis completed (which gate missed it)
- [ ] Regression test added and verified (fails without fix, passes with)
- [ ] Minimal fix implemented targeting root cause
- [ ] Full test suite passing
- [ ] Security review if applicable (POL-006)
- [ ] PR checklist and AI disclosure completed
- [ ] Post-mortem scheduled if SEV1/SEV2
