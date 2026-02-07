# POL-008: Observability & Monitoring

| Field | Value |
|-------|-------|
| **Policy ID** | POL-008 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Platform / SRE Lead |
| **Approval** | Engineering Manager |

---

## Objective

Ensure every production system is observable through metrics, logs, and traces with defined SLOs, actionable alerts, and runbooks—so issues are detected before users report them and debugged in minutes, not hours.

## Scope

Applies to: all production and staging services, infrastructure, CI/CD pipelines, and third-party dependencies.

---

## Mandatory Controls

### CTRL-008.1: Three Pillars Coverage

Every production service MUST implement:

| Pillar | Minimum Requirements | Tool Examples |
|--------|---------------------|---------------|
| **Metrics** | RED metrics (Rate, Error, Duration) for every endpoint | Prometheus, Datadog, CloudWatch |
| **Logs** | Structured JSON, correlation ID, severity levels | ELK, Loki, CloudWatch Logs |
| **Traces** | Distributed trace propagation across all service boundaries | Jaeger, Datadog APM, AWS X-Ray |

**Enforcement**: Service readiness checklist blocks production deploy without all three configured. Automated check for trace propagation headers.

**Evidence artifact**: Service observability configuration, trace propagation test.

### CTRL-008.2: SLO Definition & Error Budgets

Every user-facing service MUST have:

| Element | Requirement |
|---------|-------------|
| SLI definition | Specific metric formula |
| SLO target | Numeric target (e.g., 99.9%) |
| Measurement window | 30-day rolling |
| Error budget | Calculated from SLO |
| Budget burn alert | Alert at 50% and 80% budget consumed |
| Consequence of budget exhaustion | Feature freeze until budget recovers |

Example:
```yaml
slo:
  - name: "API Availability"
    sli: "successful_requests / total_requests"
    target: 99.9%
    window: 30d
    budget: 43.2 min/month
    alerts:
      - burn_rate: 14.4x  # 50% budget in 1 hour
        severity: critical
      - burn_rate: 6x     # 50% budget in 3.5 hours
        severity: warning
```

**Enforcement**: SLO dashboard mandatory for production services. Budget burn alerts configured.

**Evidence artifact**: SLO dashboard, alert configuration.

### CTRL-008.3: Alert Standards

| Rule | Requirement |
|------|-------------|
| Every alert has a runbook | Link in alert annotation |
| Alert on symptoms, not causes | "High error rate" not "CPU high" |
| Severity definitions followed | See table below |
| No unactionable alerts | Every alert requires human action |
| Alert routing | Critical → PagerDuty page, Warning → Slack, Info → Dashboard |
| Alert review | Monthly review of alert effectiveness |

Severity definitions:
| Severity | Meaning | Response SLA |
|----------|---------|-------------|
| Critical | Customer impact, data at risk | Page immediately, respond < 5 min |
| Warning | Degraded, workaround exists | Respond within business hours |
| Info | Informational, no action needed | Review in weekly meeting |

**Enforcement**: Alert template requires runbook field. Monthly alert audit.

**Evidence artifact**: Alert configuration with runbook links, monthly audit report.

### CTRL-008.4: Structured Logging Standard

All services MUST use structured logging:

```json
{
  "timestamp": "2026-02-06T14:30:00.123Z",
  "level": "error",
  "service": "order-service",
  "version": "1.5.2",
  "traceId": "abc123def456",
  "spanId": "789ghi",
  "requestId": "req-xyz",
  "message": "Payment processing failed",
  "error": {
    "type": "PaymentGatewayTimeout",
    "message": "Stripe timeout after 5000ms"
  },
  "context": {
    "orderId": "ord-123",
    "userId": "usr-456",
    "amount": 99.99
  }
}
```

Mandatory fields: `timestamp`, `level`, `service`, `version`, `traceId`, `message`.

PII masking rules per POL-006/POL-013: emails masked, no passwords/tokens logged.

**Enforcement**: Log schema validation in CI. PII scanner on log output in staging.

**Evidence artifact**: Log schema validation pass, PII scan report.

### CTRL-008.5: Dashboard Standards

| Dashboard Tier | Content | Update Frequency |
|---------------|---------|-----------------|
| **Executive** | SLO status, error budget, availability | Real-time |
| **Service** | RED metrics, dependency health, resource utilization | Real-time |
| **Debug** | Detailed metrics, log queries, trace views | Real-time |
| **Business** | Conversion, revenue, user activity | Near real-time |

Every service MUST have at minimum a Service dashboard with:
1. Request rate (total and by endpoint)
2. Error rate (total and by type)
3. Latency percentiles (p50, p95, p99)
4. Dependency health
5. Resource utilization (CPU, memory, connections)

**Enforcement**: Service readiness checklist includes dashboard requirement.

**Evidence artifact**: Dashboard URL in service README.

---

## Exception Path

1. New services get 30-day grace period for full observability setup
2. Exception requires Engineering Manager approval
3. Minimum viable monitoring (health checks + error alerts) required from day 1
4. Logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| MTTD (Mean Time to Detect) | < 5 min | Time from incident start to alert |
| MTTR (Mean Time to Resolve) | < 30 min for SEV1 | Time from alert to resolution |
| SLO adherence | > 99% of services meeting SLO | Services meeting SLO / total services |
| Alert signal-to-noise ratio | > 80% actionable | Actionable alerts / total alerts |
| Runbook coverage | 100% of alerts | Alerts with runbooks / total alerts |

---

## References

- `ai-governance/policies/POL-010-incident-response.md`
- `ai-governance/policies/POL-006-security-privacy.md`
- `ai-governance/policies/POL-013-data-classification.md`
