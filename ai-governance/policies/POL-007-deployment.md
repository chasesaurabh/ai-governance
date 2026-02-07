# POL-007: Deployment & Release Management

| Field | Value |
|-------|-------|
| **Policy ID** | POL-007 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Platform / DevOps Lead |
| **Approval** | Engineering Manager |

---

## Objective

Ensure every production deployment is automated, observable, reversible, and gated by quality checks. Eliminate manual deployment steps, reduce blast radius, and guarantee rollback capability within minutes.

## Scope

Applies to: all deployments to staging and production environments including application code, infrastructure-as-code, database migrations, and configuration changes.

---

## Mandatory Controls

### CTRL-007.1: Pipeline-Only Deployments

| Rule | Requirement |
|------|-------------|
| Manual deployments | Prohibited for staging and production |
| Pipeline definition | Committed to repo as code (`.github/workflows/`, `Jenkinsfile`, etc.) |
| Artifact immutability | Same artifact through all environments |
| Environment promotion | dev → staging → production (no skipping) |
| Audit trail | Every deployment logged with who, what, when, commit SHA |

**Enforcement**: Production credentials only available to CI service accounts. Manual deploy commands disabled.

**Evidence artifact**: CI deployment logs with commit SHA and approver.

### CTRL-007.2: Deployment Gates

| Gate | Condition | Enforcement |
|------|-----------|-------------|
| **Unit + Integration tests** | All pass | CI stage, auto |
| **SAST scan** | No Critical/High | CI stage, auto |
| **Contract tests** | All pass | CI stage, auto |
| **Staging E2E** | All pass | CI stage, auto |
| **Staging soak (15 min)** | Error rate < baseline + 0.1% | Monitoring gate |
| **Manual approval** | 1 engineer for standard, 2 for breaking/security | GitHub/GitLab approval |
| **Change window** | Within approved window (no Friday deploys by default) | CI schedule gate |

**Enforcement**: Pipeline stages with required gates. Cannot skip.

**Evidence artifact**: Pipeline run with all gates green.

### CTRL-007.3: Progressive Rollout

Production deployments MUST use progressive rollout:

| Strategy | When | Configuration |
|----------|------|---------------|
| **Canary** | Default for all services | 5% → 25% → 50% → 100%, 5 min per step |
| **Blue-Green** | For zero-downtime critical services | Instant switch, instant rollback |
| **Feature flag** | For user-facing features | Gradual % rollout, instant kill switch |

Automated rollback triggers:
```yaml
rollback_triggers:
  error_rate_increase: 0.5%  # Above baseline
  latency_p99_increase: 50%  # Above baseline
  health_check_failures: 2   # Consecutive failures
  rollback_window: 30m       # Auto-rollback window
```

**Enforcement**: Deployment controller configuration. Automated rollback in pipeline.

**Evidence artifact**: Deployment metrics dashboard, rollback log.

### CTRL-007.4: Database Migration Safety

| Rule | Requirement |
|------|-------------|
| Backward compatible | Old code must work with new schema |
| Forward-only | No rollback migrations (use expand-contract) |
| Tested on production-like data | Migration tested on staging with production-scale data |
| Separate from app deploy | Migration runs as independent step |
| Lock monitoring | Alert on migrations holding locks > 30s |
| Large table operations | Online DDL tools (pt-online-schema-change, gh-ost) |

**Enforcement**: Migration review checklist. CI migration test on staging.

**Evidence artifact**: Migration test results, schema diff in PR.

### CTRL-007.5: Health Check Requirements

Every deployed service MUST expose:

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/health/live` | Process alive | 200 OK (fast, no deps) |
| `/health/ready` | Can serve traffic | 200/503 with dependency status |
| `/health/startup` | Finished initializing | 200 after init complete |

**Enforcement**: Kubernetes probes configured. Load balancer health checks.

**Evidence artifact**: Health check test in CI.

### CTRL-007.6: Post-Deployment Verification

| Check | SLA | Owner |
|-------|-----|-------|
| Automated smoke tests | < 5 min post-deploy | Pipeline |
| Synthetic monitoring | Continuous, alert < 2 min | Platform team |
| Error rate comparison | 15 min observation | Deploy engineer |
| Latency comparison | 15 min observation | Deploy engineer |
| Business metric check | 30 min observation | On-call engineer |

**Enforcement**: Post-deploy stage in pipeline. Observation period required before deploy marked complete.

**Evidence artifact**: Post-deploy verification report.

---

## Exception Path

1. Emergency hotfix: can skip staging soak (but not tests), requires 2 approvals
2. Hotfix must be backfilled to normal flow within 24 hours
3. All exceptions logged with incident reference

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Deployment frequency | ≥ 1 per day per service | Deployments / day |
| Change failure rate | < 5% | Failed deploys / total deploys |
| Mean time to recover (MTTR) | < 15 min | Time from failure detection to rollback |
| Rollback success rate | 100% | Successful rollbacks / attempted rollbacks |
| Deployment lead time | < 1 hour from merge to prod | Time from merge to production traffic |

---

## References

- `ai-governance/policies/POL-008-observability.md`
- `ai-governance/policies/POL-010-incident-response.md`
- `ai-governance/templates/pr-checklist.md`
