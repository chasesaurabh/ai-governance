# POL-010: Incident Response & Disaster Recovery

| Field | Value |
|-------|-------|
| **Policy ID** | POL-010 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | SRE Lead / On-Call Manager |
| **Approval** | VP Engineering |

---

## Objective

Minimize blast radius and recovery time for production incidents through defined severity levels, role assignments, communication protocols, and blameless post-mortems. Ensure every incident improves the system.

## Scope

Applies to: all production incidents, near-misses, and disaster recovery scenarios.

---

## Mandatory Controls

### CTRL-010.1: Severity Classification & SLAs

| Severity | Definition | Respond | Mitigate | Resolve | Comms Cadence |
|----------|------------|---------|----------|---------|---------------|
| **SEV1** | Total outage, data loss, security breach | 5 min | 30 min | 4 hours | Every 15 min |
| **SEV2** | Major feature down, significant user impact | 15 min | 1 hour | 8 hours | Every 30 min |
| **SEV3** | Minor feature degraded, workaround exists | 1 hour | 4 hours | 3 days | Every 2 hours |
| **SEV4** | Cosmetic, minimal impact | Next business day | 1 week | 2 weeks | Ticket update |

**Enforcement**: PagerDuty/Opsgenie routing rules per severity. SLA tracking dashboard. Escalation if SLA breached.

**Evidence artifact**: Incident timeline in incident management tool.

### CTRL-010.2: Incident Roles

| Role | Responsibility | Assignment |
|------|---------------|------------|
| **Incident Commander (IC)** | Coordinates response, makes decisions, owns comms | On-call rotation |
| **Technical Lead** | Directs investigation, proposes fixes | IC assigns |
| **Communications Lead** | Stakeholder updates, status page | IC assigns (SEV1/2 only) |
| **Scribe** | Documents timeline, decisions, actions | IC assigns |

SEV1/SEV2: All four roles required.
SEV3/SEV4: IC + Technical Lead minimum.

**Enforcement**: Incident channel bot prompts for role assignment. Roles logged.

**Evidence artifact**: Incident channel log with role assignments.

### CTRL-010.3: Incident Response Protocol

```
1. DETECT   → Alert fires or report received
2. TRIAGE   → Classify severity, assign IC
3. ASSEMBLE → IC pages appropriate responders, assigns roles
4. DIAGNOSE → Systematic investigation (recent changes, logs, metrics)
5. MITIGATE → Restore service (rollback, failover, scale, disable feature)
6. RESOLVE  → Root cause fix deployed
7. VERIFY   → Confirm resolution with monitoring
8. CLOSE    → Update status page, notify stakeholders
9. REVIEW   → Post-mortem within 48 hours
```

Investigation priority order:
1. Recent deployments (last 4 hours)
2. Recent config changes
3. External dependency status
4. Infrastructure health
5. Traffic patterns (DDoS, load spike)

**Enforcement**: Incident bot guides through checklist. IC training required annually.

**Evidence artifact**: Completed incident checklist.

### CTRL-010.4: Communication Templates

**Initial notification:**
```
🔴 INCIDENT [SEV-X]: [Title]
Status: Investigating
Impact: [Who/what affected, estimated scope]
IC: @[name]
Channel: #incident-[id]
Next update: [time]
```

**Update:**
```
🟡 UPDATE [SEV-X]: [Title]
Status: Identified | Mitigating | Monitoring
Findings: [What we know]
Actions: [What we've done]
Next steps: [Plan]
Next update: [time]
```

**Resolution:**
```
🟢 RESOLVED [SEV-X]: [Title]
Duration: [time]
Impact: [summary]
Root cause: [brief]
Follow-up: Post-mortem scheduled [date]
```

**Enforcement**: Incident bot provides templates. Comms Lead fills in.

**Evidence artifact**: Communication log in incident channel.

### CTRL-010.5: Post-Mortem Requirements

| Element | Required For | Deadline |
|---------|-------------|----------|
| Timeline of events | SEV1-3 | 48 hours |
| Root cause analysis (5 Whys) | SEV1-3 | 48 hours |
| Contributing factors | SEV1-2 | 48 hours |
| Action items with owners + due dates | SEV1-3 | 48 hours |
| Blameless review meeting | SEV1-2 | 5 business days |
| Action items completed | SEV1-3 | Within 2 sprints |

Blameless principles:
- Focus on systems, not individuals
- Ask "what" and "how", not "who"
- Assume everyone acted with best intent and available information
- Optimize for learning, not punishment

**Enforcement**: Post-mortem template auto-created by incident bot. Action items tracked in project management tool with SLA alerts.

**Evidence artifact**: Post-mortem document, action item completion tracking.

### CTRL-010.6: Disaster Recovery

| Component | RTO | RPO | Backup Frequency | Recovery Test |
|-----------|-----|-----|-------------------|---------------|
| Primary database | 1 hour | 15 min | Continuous replication + 15 min snapshots | Monthly |
| Object storage | 4 hours | 1 hour | Cross-region replication | Quarterly |
| Configuration | 30 min | 0 (in git) | Every commit | Every deploy |
| Secrets | 30 min | 0 (in vault) | Continuous replication | Quarterly |

**Enforcement**: DR drill schedule. Drill results reviewed by Engineering Manager.

**Evidence artifact**: DR drill report, recovery time measurements.

### CTRL-010.7: Chaos Engineering

| Experiment | Frequency | Scope |
|-----------|-----------|-------|
| Random pod termination | Weekly | Production (single pod) |
| Dependency failure injection | Monthly | Staging |
| Region failover | Quarterly | Staging (annually in prod) |
| Data recovery from backup | Monthly | Staging |

**Enforcement**: Chaos engineering schedule maintained by SRE team.

**Evidence artifact**: Chaos experiment reports.

---

## Exception Path

1. Post-mortem deadline extension: IC requests, Engineering Manager approves, max 5 additional days
2. DR drill deferral: requires VP Engineering approval, max 30 days
3. Logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| MTTD (detect) | < 5 min for SEV1/2 | Alert timestamp - incident start |
| MTTM (mitigate) | < 30 min for SEV1 | Mitigation timestamp - alert timestamp |
| MTTR (resolve) | < 4 hours for SEV1 | Resolution timestamp - alert timestamp |
| Post-mortem completion | 100% for SEV1-3 | Post-mortems completed / qualifying incidents |
| Action item completion | > 90% within SLA | Completed on time / total action items |
| Repeat incidents | < 5% | Incidents with same root cause / total |
| DR drill success rate | 100% | Successful drills / total drills |

---

## References

- `ai-governance/policies/POL-008-observability.md`
- `ai-governance/policies/POL-007-deployment.md`
