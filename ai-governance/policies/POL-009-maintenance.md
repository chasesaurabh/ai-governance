# POL-009: Ongoing Maintenance

| Field | Value |
|-------|-------|
| **Policy ID** | POL-009 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Tech Lead / Platform Lead |
| **Approval** | Engineering Manager |

---

## Objective

Prevent system degradation through scheduled maintenance, automated dependency management, technical debt tracking, and capacity planning—so production systems remain healthy, secure, and cost-efficient.

## Scope

Applies to: all production systems, dependencies, certificates, infrastructure, and documentation.

---

## Mandatory Controls

### CTRL-009.1: Dependency Update Cadence

| Update Type | Frequency | Process | Enforcement |
|-------------|-----------|---------|-------------|
| Patch (x.y.Z) | Weekly | Auto-merge if tests pass | Renovate/Dependabot auto-merge |
| Minor (x.Y.0) | Bi-weekly | Review changelog, auto-PR | Renovate PR, reviewer approval |
| Major (X.0.0) | Monthly review, quarterly execute | ADR for breaking changes | Tracked in tech-debt register |
| Security patches | Per POL-006 SLA | Priority handling | Security scanner alerts |

**Enforcement**: Renovate/Dependabot configured. Stale dependency PR dashboard. Monthly audit.

**Evidence artifact**: Dependency update PRs merged, staleness dashboard.

### CTRL-009.2: Technical Debt Register

Every team MUST maintain a tech-debt register:

```markdown
| ID | Description | Impact (H/M/L) | Effort (days) | Interest Rate | Owner | Target Date |
|----|-------------|-----------------|---------------|---------------|-------|-------------|
| TD-042 | Auth service monolith | H | 15 | Growing: +2 bugs/sprint | @alice | Q2 2026 |
```

"Interest rate" = measurable cost of NOT fixing (bugs/sprint, minutes/deploy, $/month).

| Rule | Requirement |
|------|-------------|
| Sprint allocation | ≥ 20% of capacity to debt paydown |
| Debt ceiling | No more than 30 items in register (prioritize or accept) |
| Review cadence | Monthly with Engineering Manager |
| New debt | Must be logged when introduced knowingly |

**Enforcement**: Sprint planning review. Quarterly debt audit.

**Evidence artifact**: Tech-debt register, sprint allocation report.

### CTRL-009.3: Certificate & Secret Rotation

| Asset | Rotation Frequency | Alert Before Expiry |
|-------|-------------------|-------------------|
| TLS certificates | Auto-renew (Let's Encrypt/ACM) | 30 days |
| API keys (internal) | 90 days | 14 days |
| API keys (third-party) | Per vendor policy | 14 days |
| Database passwords | 90 days | 14 days |
| Service account tokens | 90 days | 14 days |
| SSH keys | Annually | 30 days |

**Enforcement**: Secret rotation automation. Expiry monitoring with alerts.

**Evidence artifact**: Rotation log, monitoring dashboard.

### CTRL-009.4: Capacity Planning

Quarterly capacity review MUST cover:

| Metric | Action Threshold | Response |
|--------|-----------------|----------|
| CPU sustained | > 65% | Scale plan within 2 weeks |
| Memory sustained | > 75% | Investigate leaks, scale plan |
| Disk usage | > 65% | Archive plan, expansion plan |
| Database connections | > 60% pool | Pool tuning, read replicas |
| Cost growth | > 15% MoM unexpected | Cost audit, optimization sprint |

**Enforcement**: Monthly automated capacity report. Quarterly review meeting.

**Evidence artifact**: Capacity report, meeting notes.

### CTRL-009.5: Documentation Freshness

| Document Type | Review Trigger | Staleness Threshold |
|---------------|---------------|-------------------|
| README | Any significant change | 90 days without update |
| API docs | Any endpoint change | Auto-generated preferred |
| Runbooks | Any operational change or incident | 90 days without update |
| Architecture diagrams | Any architecture change | 180 days without update |

**Enforcement**: Stale doc scanner (check last modified date). PR template asks "Does this change require doc update?"

**Evidence artifact**: Doc freshness report.

---

## Exception Path

1. Maintenance deferral requires Engineering Manager approval
2. Maximum 1-sprint deferral for dependency updates
3. Security patches cannot be deferred (see POL-006)
4. Logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Dependency staleness | < 5% of deps more than 2 minor versions behind | Automated scan |
| Tech debt reduction rate | ≥ 3 items resolved per sprint | Debt register tracking |
| Certificate expiry incidents | 0 | Incident count |
| Documentation freshness | > 80% within threshold | Doc scanner report |
| Unplanned maintenance incidents | < 2 per quarter | Incident tracking |

---

## References

- `ai-governance/policies/POL-006-security-privacy.md`
- `ai-governance/policies/POL-017-secrets-management.md`
- `ai-governance/policies/POL-012-change-management.md`
