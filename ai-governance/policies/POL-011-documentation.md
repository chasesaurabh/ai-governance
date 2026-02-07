# POL-011: Documentation Standards

| Field | Value |
|-------|-------|
| **Policy ID** | POL-011 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Tech Lead |
| **Approval** | Engineering Manager |

---

## Objective

Ensure knowledge is captured, discoverable, and current—reducing onboarding time, bus factor risk, and operational guesswork. Documentation is treated as a deliverable, not an afterthought.

## Scope

Applies to: all production services, libraries, APIs, infrastructure, and operational procedures.

---

## Mandatory Controls

### CTRL-011.1: Minimum Documentation Set

Every production service MUST have:

| Document | Location | Update Trigger | Staleness Threshold |
|----------|----------|---------------|-------------------|
| README (setup, run, test, deploy) | Repo root | Any change to process | 90 days |
| API specification | `docs/api/` or auto-generated | Any endpoint change | Stale = out of sync with code |
| Architecture overview | `docs/architecture/` | Any architecture change | 180 days |
| Runbook (per alert) | `docs/runbooks/` | Any operational change or incident | 90 days |
| Data model | `docs/data/` | Any schema change | 90 days |
| ADRs | `docs/adrs/` | Any qualifying decision (POL-002) | N/A (immutable once accepted) |

**Enforcement**: Service readiness checklist. Stale doc scanner (CI job checks last-modified dates). PR template asks: "Does this change require doc updates?"

**Evidence artifact**: Doc freshness report, service readiness checklist.

### CTRL-011.2: API Documentation

| Rule | Requirement |
|------|-------------|
| Format | OpenAPI 3.x for REST, protobuf for gRPC |
| Auto-generation | Preferred (from code annotations or spec-first) |
| Examples | Every endpoint has a request/response example |
| Error codes | All possible error responses documented |
| Authentication | Auth requirements per endpoint |
| Versioning | Version clearly indicated |
| Changelog | Breaking changes highlighted |

**Enforcement**: CI validates OpenAPI spec matches implementation (spec-diff tool). Broken spec blocks merge.

**Evidence artifact**: OpenAPI spec in repo, spec-diff CI pass.

### CTRL-011.3: Runbook Standards

Every production alert MUST have a linked runbook containing:

```markdown
# Runbook: [Alert Name]

## Symptoms
[What the operator will see]

## Impact
[What users experience]

## Diagnosis (copy-pasteable commands)
1. [Command to check X]
2. [Command to check Y]

## Resolution Options
### Option A: [Name]
1. [Step with exact command]
2. [Verification step]

### Option B: [Name]
1. [Step]

## Escalation
If not resolved in [N] minutes, escalate to [team/person]

## History
| Date | Incident | Resolution | Notes |
```

**Enforcement**: Alert configuration requires runbook URL field. Missing runbook flagged in monthly alert audit.

**Evidence artifact**: Runbook file, alert-runbook linkage audit.

### CTRL-011.4: Onboarding Documentation

Every team MUST maintain a 30-60-90 day onboarding guide:

| Timeframe | Content |
|-----------|---------|
| Day 1 | Environment setup, access requests, team intro |
| Week 1 | Architecture overview, key services, dev workflow |
| Month 1 | First PR shipped, on-call shadow, domain deep-dives |
| Month 2 | Independent feature delivery, on-call primary |
| Month 3 | Contributing to architecture decisions, mentoring |

**Enforcement**: New hire feedback survey at 30/60/90 days. Onboarding doc updated based on feedback.

**Evidence artifact**: Onboarding guide, new hire survey results.

### CTRL-011.5: AI-Generated Documentation Rules

| Rule | Rationale |
|------|-----------|
| AI-generated docs MUST be reviewed by domain expert | AI can hallucinate features, endpoints, or behaviors |
| AI-generated runbooks MUST be tested (dry-run) | Commands may be wrong or dangerous |
| Auto-generated API docs preferred over AI-written | Spec-from-code is ground truth |
| AI usage disclosed in doc header | Transparency |

**Enforcement**: Review checklist for AI-generated docs.

**Evidence artifact**: Reviewer sign-off.

---

## Exception Path

1. Documentation deferral for hotfixes: must be completed within 5 business days
2. Tech Lead approves deferral, creates follow-up ticket
3. Logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Documentation freshness | > 85% of docs within staleness threshold | Doc scanner report |
| Onboarding time to first PR | < 5 business days | New hire tracking |
| Runbook coverage | 100% of production alerts | Alerts with runbooks / total alerts |
| API doc accuracy | > 95% | Quarterly spec-vs-implementation audit |
| New hire satisfaction (docs) | > 4/5 | 90-day survey |

---

## References

- `ai-governance/policies/POL-002-architecture.md` (ADRs)
- `ai-governance/policies/POL-008-observability.md` (runbooks)
- `ai-governance/policies/POL-014-llm-risk-controls.md`
