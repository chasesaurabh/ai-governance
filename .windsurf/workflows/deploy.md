---
description: Deploy with safety checks and proper process
---

# Deploy Workflow (Enterprise)

Safe deployment with all POL-007 gates enforced.

## Step 1: Pre-Deployment Gates (POL-007, POL-015)

Verify ALL gates pass before proceeding:

- [ ] All CI gates green (lint, tests, SAST, dependency scan, coverage)
- [ ] Code reviewed and approved (1 reviewer standard, 2 for security-sensitive)
- [ ] Change classification correct per POL-012 (Standard/Normal/Emergency/Major)
- [ ] NOT in freeze window per POL-012 (no Friday deploys, no holidays)
- [ ] No active SEV1/SEV2 incidents

Check current system health:
- [ ] Monitoring dashboards normal (POL-008)
- [ ] Error budget not exhausted
- [ ] Dependencies healthy

## Step 2: Database Migrations (POL-012)

If migrations exist:

1. Review migration safety:
   - [ ] Backward compatible (old code works with new schema)
   - [ ] Expand-contract pattern for breaking changes
   - [ ] Tested on staging with production-scale data
   - [ ] Online DDL for large tables (pt-online-schema-change, gh-ost)
   - [ ] Lock monitoring configured (alert on > 30s)

// turbo
2. Run migrations on staging first

3. Verify staging healthy after migration

## Step 3: Staging Deployment

1. Deploy to staging
2. Run E2E test suite (Gate 3 per POL-015)
3. Verify:
   - [ ] `/health/live` returns 200
   - [ ] `/health/ready` returns 200 with all dependencies
   - [ ] Critical user flows working
   - [ ] No new errors in structured logs
   - [ ] Metrics baseline looks normal

4. Staging soak: 15-minute observation (error rate < baseline + 0.1%)

## Step 4: Production Deployment (POL-007 CTRL-007.3)

Progressive rollout (canary is default):

```
5% traffic  → 5 min observe → errors OK? → proceed
25% traffic → 5 min observe → errors OK? → proceed
50% traffic → 5 min observe → errors OK? → proceed
100% traffic → 15 min observation window
```

Automated rollback triggers:
- Error rate increase > 0.5% above baseline
- P99 latency increase > 50% above baseline
- 2+ consecutive health check failures

## Step 5: Post-Deployment Verification (POL-008)

15-minute observation window:

- [ ] Error rate within normal range
- [ ] Latency p50/p95/p99 within SLO
- [ ] No new alerts firing
- [ ] Smoke tests passing (automated)
- [ ] Synthetic monitors green
- [ ] Business metrics normal (if applicable)

## Step 6: Rollback (if needed)

If any verification fails, per POL-010:

1. **Decide**: Rollback vs fix-forward (rollback if unsure)
2. **Execute**: `kubectl rollout undo deployment/app` (or equivalent)
3. **Verify**: Service health restored, error rate normal
4. **Communicate**: Post update to team channel
5. **Document**: Create incident record, schedule post-mortem if user-impacting

## Step 7: Completion

1. Mark deployment complete in deployment log
2. Notify team in channel
3. Close related tickets
4. Continue monitoring for 24 hours
5. Feature flags: gradual user rollout if applicable (POL-012)

## Deployment Checklist Summary

**Pre-deploy:**
- [ ] All CI gates green (POL-015)
- [ ] Code reviewed (POL-004)
- [ ] Change classified (POL-012)
- [ ] Not in freeze window (POL-012)
- [ ] Migrations safe and tested (POL-012)
- [ ] Rollback plan documented (POL-007)

**Post-deploy:**
- [ ] Health checks passing (POL-007)
- [ ] Error rate and latency normal (POL-008)
- [ ] Smoke tests and synthetic monitors green (POL-015)
- [ ] No new alerts (POL-008)
- [ ] Team notified
