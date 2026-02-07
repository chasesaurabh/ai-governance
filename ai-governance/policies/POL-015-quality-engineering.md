# POL-015: Quality Engineering

| Field | Value |
|-------|-------|
| **Policy ID** | POL-015 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | QE Lead / Staff Engineer |
| **Approval** | Engineering Manager |

---

## Objective

Embed quality as a systemic property—not a phase—through layered testing, contract verification, synthetic monitoring, quality gates, and continuous feedback loops. Prevent defect escape to production and ensure quality signals are automated and measurable.

## Scope

Applies to: all code, APIs, data pipelines, infrastructure, and AI-generated artifacts.

---

## Mandatory Controls

### CTRL-015.1: Quality Gate Pipeline

Every change passes through sequential, non-skippable gates:

```
Gate 1: Author      │ Lint + Format + Type-check + Unit tests (local)
Gate 2: PR CI       │ Gate 1 + Integration + Contract + SAST + Coverage check
Gate 3: Staging     │ Gate 2 + E2E + Performance baseline + DAST
Gate 4: Canary      │ Gate 3 + Smoke tests + Error rate comparison
Gate 5: Production  │ Gate 4 + Synthetic monitors + SLO observation (15 min)
```

| Gate | Failure Action |
|------|---------------|
| Gate 1 fails | Author fixes before pushing |
| Gate 2 fails | PR blocked, author notified |
| Gate 3 fails | Deploy to staging rolled back, ticket created |
| Gate 4 fails | Canary auto-rolled back |
| Gate 5 fails | Full rollback, incident created if user-impacting |

**Enforcement**: CI/CD pipeline stages. Gates cannot be skipped or overridden without Emergency Change process (POL-012).

**Evidence artifact**: Pipeline run with all gates green.

### CTRL-015.2: Contract Testing Requirements

| Contract Type | When Required | Tool Examples |
|--------------|---------------|---------------|
| **Consumer-driven (CDC)** | Any API consumed by other teams | Pact, Specmatic |
| **Provider verification** | Any API with external consumers | Pact Broker, Specmatic |
| **Schema contract** | Event-driven systems | JSON Schema, Avro Schema Registry |
| **Database contract** | Shared databases (discouraged) | Schema validation tests |

Contract testing rules:
```yaml
contracts:
  new_api:
    requirement: "Contract test BEFORE first consumer onboards"
    enforcement: "CI gate"
    
  breaking_change:
    requirement: "Contract test must FAIL to prove detection works"
    enforcement: "Reviewer verifies failing contract test exists before fix PR"
    
  consumer_onboarding:
    sla: "Consumer publishes contract within 30 days of integration"
    enforcement: "Integration review checklist"
    
  contract_compatibility:
    check: "Provider runs all consumer contracts on every PR"
    enforcement: "CI stage, merge blocked on failure"
```

**Enforcement**: CI contract test stage. Contract broker tracks consumer-provider relationships.

**Evidence artifact**: Contract test results, contract broker dashboard.

### CTRL-015.3: Synthetic Monitoring

Every user-facing service MUST have synthetic monitors:

| Monitor Type | Frequency | Coverage |
|-------------|-----------|----------|
| **Health endpoint** | 30 seconds | Every service |
| **Critical user journey** | 5 minutes | Top 5 user flows |
| **API smoke test** | 1 minute | Every public endpoint |
| **Cross-region** | 5 minutes | Primary + DR region |

Synthetic monitor requirements:
- Runs from outside the infrastructure (external probe)
- Alerts on failure within 2 minutes
- Linked to runbook
- Tests real user flows, not just health checks

**Enforcement**: Service readiness checklist. Synthetic monitor dashboard.

**Evidence artifact**: Synthetic monitor configuration, uptime report.

### CTRL-015.4: Defect Tracking & Analysis

| Metric | Tracking | Review Cadence |
|--------|----------|---------------|
| Escaped defects (prod bugs) | Tagged with escape point (which gate should have caught it) | Weekly |
| Defect density | Bugs per 1000 lines of new code | Monthly |
| Mean time to detect (MTTD) | Time from defect introduction to discovery | Monthly |
| Mean time to fix | Time from discovery to fix deployed | Monthly |
| Root cause categories | Binned: logic, integration, config, performance, security | Quarterly |

For every escaped defect:
1. Determine which gate SHOULD have caught it
2. Add a test at that gate level
3. Assess if gate needs strengthening

**Enforcement**: Bug ticket template requires "escape analysis" field. Quarterly quality review.

**Evidence artifact**: Defect tracking dashboard, quarterly quality report.

### CTRL-015.5: Performance Quality Standards

| Check | Gate | Threshold |
|-------|------|-----------|
| **Load test** | Pre-staging | Meets SLO targets at 2x expected load |
| **Latency regression** | Every PR | No p99 regression > 10% |
| **Memory leak detection** | Weekly | Heap growth over 4-hour test < 5% |
| **Bundle size** (web) | Every PR | No increase > 5% without approval |
| **Database query time** | Every PR | No query > 100ms without index plan |

**Enforcement**: Performance test CI stages. Automated regression detection.

**Evidence artifact**: Performance test report, regression comparison.

### CTRL-015.6: AI Quality Controls

| Control | Requirement |
|---------|-------------|
| AI-generated code gets same gates | No shortcuts for AI-authored code |
| AI test quality verification | Mutation testing on AI-generated tests quarterly |
| AI suggestion acceptance rate tracking | Monitor to detect over-acceptance |
| AI-introduced dependency review | Every new dependency verified by human |
| AI code churn tracking | Monitor if AI code gets rewritten quickly (quality signal) |

**Enforcement**: Tagging AI-generated code in PRs. Metrics tracked in quality dashboard.

**Evidence artifact**: AI quality metrics in quarterly report.

---

## Exception Path

1. Gate skip for emergency: Emergency Change process (POL-012), backfill within 24 hours
2. Coverage threshold exception: Tech Lead approval, remediation plan within 1 sprint
3. Performance threshold exception: ADR required if permanent, risk acceptance if temporary
4. All exceptions logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Escaped defects to production | < 3 per quarter per service | Bug tracking, escape analysis |
| Quality gate pass rate (first attempt) | > 80% | CI first-run pass / total pushes |
| Contract test coverage | 100% public APIs | APIs with contracts / total |
| Synthetic monitor uptime | > 99.9% | Synthetic monitor report |
| Mean time to detect defect | < 24 hours | Bug lifecycle tracking |
| Performance regression catch rate | > 95% | Regressions caught in CI / total regressions |

---

## References

- `ai-governance/policies/POL-005-testing.md`
- `ai-governance/policies/POL-007-deployment.md`
- `ai-governance/policies/POL-014-llm-risk-controls.md`
- `ai-governance/templates/definition-of-done.md`
