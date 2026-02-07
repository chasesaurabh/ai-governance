# POL-012: Change Management & Upgrades

| Field | Value |
|-------|-------|
| **Policy ID** | POL-012 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Tech Lead / Platform Lead |
| **Approval** | Engineering Manager |

---

## Objective

Ensure all changes to production systems—code, configuration, infrastructure, and data—are traceable, reversible, and risk-assessed. Prevent uncontrolled changes that bypass quality gates.

## Scope

Applies to: all changes to production and staging environments including application code, infrastructure-as-code, database schemas, feature flags, DNS, load balancer configs, and secret values.

---

## Mandatory Controls

### CTRL-012.1: Change Classification

| Class | Risk | Examples | Approval |
|-------|------|----------|----------|
| **Standard** | Low, well-tested pattern | Feature behind flag, dependency patch | 1 reviewer |
| **Normal** | Medium, some risk | New API endpoint, schema migration | 2 reviewers |
| **Emergency** | Restoring service | Hotfix for production incident | 1 reviewer (retroactive 2nd) |
| **Major** | High, broad impact | New service, framework migration, infra change | ADR + 2 Staff+ reviewers |

**Enforcement**: PR labels trigger appropriate review requirements. CI validates label matches change scope.

**Evidence artifact**: PR with correct classification label and required approvals.

### CTRL-012.2: Change Freeze Windows

| Window | Rule |
|--------|------|
| Friday 3pm – Monday 9am | No standard or normal deploys |
| Company holidays | No deploys except emergency |
| Declared freeze periods | No deploys except emergency |
| Active SEV1/SEV2 incident | No unrelated deploys |

Emergency exceptions: IC or Engineering Manager can override with documented justification.

**Enforcement**: CI deploy stage checks calendar. Emergency override requires explicit flag + approval.

**Evidence artifact**: Deploy log with timestamp, freeze calendar.

### CTRL-012.3: Migration Safety Standards

| Migration Type | Requirements |
|---------------|-------------|
| **Schema (additive)** | Backward compatible, tested on staging with prod-scale data |
| **Schema (breaking)** | Expand-contract pattern, 3-phase rollout, consumer coordination |
| **Data backfill** | Batched, resumable, rate-limited, dry-run first |
| **Infrastructure** | Blue-green or canary, tested in staging, rollback plan |
| **Framework/language** | ADR, incremental migration, both versions coexist during transition |

Every migration MUST have:
- Rollback plan documented before execution
- Success criteria defined
- Monitoring for migration-specific metrics
- Communication plan for affected teams

**Enforcement**: Migration checklist in PR template. ADR required for major migrations.

**Evidence artifact**: Migration plan document, PR checklist.

### CTRL-012.4: Feature Flag Discipline

| Rule | Requirement |
|------|-------------|
| Naming convention | `[team]-[feature]-[type]` (e.g., `payments-new-checkout-release`) |
| Flag types | `release` (temporary), `ops` (kill switch), `experiment` (A/B test), `permission` (entitlement) |
| Release flag TTL | 30 days max after 100% rollout, then remove |
| Stale flag cleanup | Monthly audit, remove flags past TTL |
| Flag inventory | All flags documented with owner, purpose, TTL |
| Emergency kill switch | Every user-facing feature has one |

**Enforcement**: Feature flag lint tool. Stale flag dashboard. Monthly cleanup sprint task.

**Evidence artifact**: Feature flag inventory, staleness report.

### CTRL-012.5: Configuration Change Control

Non-code changes that affect production behavior:

| Change Type | Process |
|-------------|---------|
| Environment variable | PR to config repo, reviewed, tested in staging |
| Feature flag | Flag management UI with audit log |
| DNS change | PR with peer review, low-TTL rollout |
| Load balancer config | IaC PR with peer review |
| Secret rotation | Automated where possible, manual requires 2-person rule |

**Enforcement**: All config in version control or audited management tool. No ad-hoc production changes.

**Evidence artifact**: Config change PR or audit log entry.

---

## Exception Path

1. Emergency changes: proceed with 1 approval, backfill documentation within 24 hours
2. Freeze override: IC or Engineering Manager approval with documented justification
3. All exceptions logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Change failure rate | < 5% | Failed changes / total changes |
| Unauthorized changes | 0 | Changes bypassing required approvals |
| Stale feature flags | < 5 at any time | Flags past TTL |
| Migration rollback rate | < 10% | Rolled-back migrations / total migrations |
| Change lead time | < 4 hours (standard) | Time from PR open to production |

---

## References

- `ai-governance/policies/POL-002-architecture.md` (ADRs)
- `ai-governance/policies/POL-007-deployment.md`
- `ai-governance/policies/POL-017-secrets-management.md`
