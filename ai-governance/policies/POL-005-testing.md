# POL-005: Testing & Quality Engineering

| Field | Value |
|-------|-------|
| **Policy ID** | POL-005 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | QE Lead / Tech Lead |
| **Approval** | Engineering Manager |

---

## Objective

Guarantee software quality through layered, automated testing with enforceable coverage gates, contract verification, and mutation testing. Shift quality left so defects are caught at the cheapest possible stage.

## Scope

Applies to: all production code, infrastructure-as-code, database migrations, and AI-generated code.

---

## Mandatory Controls

### CTRL-005.1: Layered Test Requirements

| Layer | Scope | Coverage Gate | Speed Target | Runs On |
|-------|-------|--------------|--------------|---------|
| **Unit** | Single function/class | ≥ 80% line coverage | < 5 min total | Every commit |
| **Integration** | Component boundaries | Critical paths 100% | < 15 min | Every PR |
| **Contract** | API consumer-provider | All public APIs | < 5 min | Every PR |
| **E2E** | User journeys | Top 5 critical flows | < 30 min | Pre-deploy |
| **Performance** | Latency, throughput | SLO targets met | < 15 min | Pre-deploy weekly |
| **Security** | OWASP Top 10 | All endpoints | < 10 min | Every PR |

**Enforcement**: CI pipeline stages. Coverage gate in CI config. Merge blocked below thresholds.

**Evidence artifact**: CI test report with coverage metrics.

### CTRL-005.2: Contract Testing

Every public API MUST have consumer-driven contract tests:

```yaml
# Pact / Specmatic / equivalent
contract_tests:
  provider: order-service
  consumers:
    - name: web-frontend
      contract: pacts/web-frontend-order-service.json
    - name: mobile-app
      contract: pacts/mobile-app-order-service.json
  verification:
    frequency: every_pr
    fail_on_break: true
```

| Rule | Requirement |
|------|-------------|
| New public API | Contract test required before merge |
| Breaking change to existing API | Contract test must fail first (proves it catches breaks) |
| Consumer onboarding | Consumer must publish contract within 30 days |

**Enforcement**: CI contract test stage. Breaking contracts block merge.

**Evidence artifact**: Contract test results in CI.

### CTRL-005.3: Mutation Testing

Quarterly mutation testing on critical business logic:

| Metric | Target |
|--------|--------|
| Mutation score | ≥ 70% for critical modules |
| Survived mutants | Each investigated and documented |

**Enforcement**: Quarterly review cycle. Results tracked in KPI dashboard.

**Evidence artifact**: Mutation test report committed to `docs/quality/`.

### CTRL-005.4: Test Quality Rules

| Rule | Enforcement |
|------|-------------|
| No skipped/disabled tests without ticket | Lint rule flags `skip` / `xit` / `@Ignore` without comment linking ticket |
| No flaky tests | Test quarantine: flaky tests moved to separate suite within 24h, fixed within 1 sprint |
| Test isolation | No test depends on another test's state |
| Deterministic | No time/random-dependent tests without seeding |
| Data factories | Use factories/builders, not raw fixtures |
| AAA pattern | Arrange-Act-Assert structure enforced by review |

**Enforcement**: CI lint rules for skipped tests. Flaky test detector.

**Evidence artifact**: CI test report, flaky test dashboard.

### CTRL-005.5: AI-Generated Test Validation

When AI generates tests:

| Rule | Rationale |
|------|-----------|
| Verify tests actually assert behavior | AI writes tests that always pass (tautologies) |
| Check test names match assertions | AI names may not reflect what's tested |
| Validate mock setups are realistic | AI mocks may not match real behavior |
| Run mutation testing on AI tests | Verify AI tests catch real bugs |
| Don't count AI test coverage alone | Must verify tests are meaningful |

**Enforcement**: Review checklist for AI-generated tests.

**Evidence artifact**: Reviewer sign-off on AI test quality.

### CTRL-005.6: Pre-Production Test Gates

| Environment | Required Tests | Gate |
|-------------|---------------|------|
| PR | Unit + Integration + Contract + SAST | All pass |
| Staging | Above + E2E + Performance baseline | All pass |
| Production (canary) | Smoke tests + synthetic monitors | Pass within 5 min |
| Production (full) | All synthetic monitors green | 15 min observation |

**Enforcement**: Deployment pipeline gates.

**Evidence artifact**: Pipeline stage results.

---

## Exception Path

1. Coverage exception: documented in PR, Tech Lead approval, max 1 sprint to remediate
2. Flaky test exception: quarantine immediately, fix ticket created, 1 sprint SLA
3. All exceptions logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Unit test coverage | ≥ 80% | CI coverage report |
| Contract test coverage | 100% public APIs | APIs with contracts / total public APIs |
| Flaky test rate | < 2% | Flaky runs / total test runs |
| Mean time to fix flaky test | < 5 business days | Time from quarantine to fix |
| Escaped defects (prod bugs not caught by tests) | < 3 per quarter | Prod bugs with missing test coverage |
| Mutation score (critical modules) | ≥ 70% | Quarterly mutation report |

---

## References

- `ai-governance/policies/POL-015-quality-engineering.md`
- `ai-governance/policies/POL-014-llm-risk-controls.md`
- `ai-governance/templates/definition-of-done.md`
