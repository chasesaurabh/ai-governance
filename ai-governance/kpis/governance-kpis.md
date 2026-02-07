# Governance KPIs & Targets

> Measurable indicators across all policies. Review monthly, report quarterly.

---

## Executive Dashboard

| Category | KPI | Target | Red Threshold | Measurement Source |
|----------|-----|--------|---------------|-------------------|
| **Velocity** | Deployment frequency | ≥ 1/day/service | < 1/week | CI/CD logs |
| **Velocity** | Change lead time (merge → prod) | < 1 hour | > 4 hours | CI/CD timestamps |
| **Stability** | Change failure rate | < 5% | > 15% | Failed deploys / total |
| **Stability** | MTTR (Mean Time to Recover) | < 15 min | > 1 hour | Incident tracking |
| **Quality** | Escaped defects to prod | < 3/quarter/service | > 5/quarter | Bug tracking |
| **Security** | Critical/High vulns in prod | 0 | > 0 | SAST + dependency scan |
| **Compliance** | Policy adherence | > 95% | < 85% | Automated audits |

---

## Detailed KPIs by Policy Area

### Requirements (POL-001)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| Rework rate from ambiguous reqs | < 5% | > 15% | Sprint | Tickets reopened / total |
| Requirement completeness score | > 90% fields populated | < 70% | Per PR | PR template field check |
| Time intake → ready | < 2 business days | > 5 days | Per ticket | Ticket lifecycle |

### Architecture (POL-002)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| ADR coverage (qualifying changes) | 100% | < 80% | Per PR | CI ADR check |
| ADR review turnaround | < 3 business days | > 7 days | Per ADR | ADR timestamps |
| Fitness function pass rate | > 99% | < 95% | Per commit | CI results |
| Deprecated API consumer migration | 100% before sunset | < 80% | Monthly | Consumer tracking |

### Coding Standards (POL-004)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| Lint pass rate (first push) | > 85% | < 70% | Per push | CI first-run stats |
| Code review turnaround | < 1 business day | > 2 days | Per PR | PR timestamps |
| Critical dependency vulns | 0 in prod | > 0 | Continuous | Dependency scanner |
| Banned pattern violations | 0 merged | > 0 | Per PR | Lint report |

### Testing (POL-005)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| Unit test coverage | ≥ 80% | < 70% | Per PR | CI coverage |
| Contract test coverage | 100% public APIs | < 80% | Monthly | Contract broker |
| Flaky test rate | < 2% | > 5% | Weekly | Test analytics |
| Flaky test MTTF (mean time to fix) | < 5 business days | > 10 days | Per flaky | Quarantine tracker |
| Mutation score (critical modules) | ≥ 70% | < 50% | Quarterly | Mutation report |

### Security (POL-006)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| SAST findings in prod | 0 Crit/High | > 0 | Continuous | SAST scanner |
| Dependency vuln SLA compliance | > 95% | < 80% | Monthly | Patch tracking |
| Security review turnaround | < 2 business days | > 5 days | Per request | Review tracker |
| PII exposure incidents | 0 | > 0 | Continuous | Incident tracking |
| Secret leak incidents | 0 | > 0 | Continuous | Secret scanner |

### Deployment (POL-007)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| Deployment frequency | ≥ 1/day/service | < 1/week | Daily | CI/CD logs |
| Change failure rate | < 5% | > 15% | Weekly | Deploy tracking |
| Rollback success rate | 100% | < 100% | Per incident | Deploy logs |
| Deployment lead time | < 1 hour | > 4 hours | Per deploy | CI timestamps |

### Observability (POL-008)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| MTTD (detect) | < 5 min for SEV1/2 | > 15 min | Per incident | Incident timeline |
| SLO adherence | > 99% services meeting SLO | < 95% | Monthly | SLO dashboard |
| Alert signal-to-noise | > 80% actionable | < 60% | Monthly | Alert audit |
| Runbook coverage | 100% alerts have runbook | < 90% | Monthly | Alert config audit |

### Incident Response (POL-010)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| MTTM (mitigate) SEV1 | < 30 min | > 1 hour | Per incident | Incident timeline |
| MTTR (resolve) SEV1 | < 4 hours | > 8 hours | Per incident | Incident timeline |
| Post-mortem completion | 100% for SEV1-3 | < 90% | Per incident | Post-mortem tracker |
| Action item completion in SLA | > 90% | < 75% | Monthly | Action item tracker |
| Repeat incidents (same root cause) | < 5% | > 10% | Quarterly | Incident analysis |

### Data Classification (POL-013)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| Data fields classified | 100% | < 90% | Per PR | Lint scan |
| C3/C4 data in logs | 0 instances | > 0 | Daily | Log scanner |
| C3/C4 data sent to AI | 0 instances | > 0 | Continuous | AI proxy |
| Data inventory freshness | Updated quarterly | > 6 months stale | Quarterly | Inventory review |

### LLM Risk Controls (POL-014)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| AI disclosure compliance | 100% PRs | < 90% | Per PR | PR template check |
| AI hallucination escape rate | < 1% AI PRs | > 3% | Monthly | Post-merge tracking |
| AI-generated code defect rate | ≤ human rate | > 2x human rate | Quarterly | Bug attribution |
| AI tool security review coverage | 100% tools reviewed | < 100% | Quarterly | Tool registry |
| AI-specific incidents | < 1/quarter | > 2/quarter | Quarterly | Incident analysis |

### Secrets Management (POL-017)

| KPI | Target | Red | Cadence | Source |
|-----|--------|-----|---------|--------|
| Secrets in code (scanner) | 0 | > 0 | Per commit | Pre-commit + CI |
| Rotation compliance | > 95% within policy | < 80% | Monthly | Rotation log |
| Secret exposure incidents | 0 | > 0 | Continuous | Incident tracking |
| Time to revoke exposed secret | < 1 hour | > 4 hours | Per incident | Incident timeline |

---

## Measurement Automation

| Data Source | Collection Method | Frequency |
|-------------|------------------|-----------|
| CI/CD pipeline | Pipeline analytics API | Real-time |
| Git/VCS | PR analytics API | Real-time |
| Incident management | PagerDuty/Opsgenie API | Real-time |
| Dependency scanner | Renovate/Dependabot reports | Daily |
| SAST scanner | Semgrep/CodeQL reports | Per PR |
| Secret scanner | Gitleaks/TruffleHog reports | Per commit |
| SLO dashboard | Prometheus/Datadog API | Real-time |
| Bug tracking | Jira/Linear API | Real-time |

## Review Cadence

| Review | Audience | Frequency | Focus |
|--------|----------|-----------|-------|
| Sprint quality | Dev team | Every sprint | Escaped defects, test health, debt |
| Monthly governance | Tech leads + EM | Monthly | All red KPIs, trend analysis |
| Quarterly executive | VP Eng + CISO | Quarterly | Executive dashboard, compliance, risk |
| Annual governance review | All engineering | Annually | Policy effectiveness, updates needed |
