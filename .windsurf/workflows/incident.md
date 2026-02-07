---
description: Handle production incidents with proper response process
---

# Incident Response Workflow (Enterprise)

Full POL-010 incident response protocol with severity SLAs and blameless post-mortems.

## Step 1: Acknowledge & Classify (< 5 min for SEV1/2)

1. Acknowledge alert immediately
2. Classify severity per POL-010:

| Severity | Definition | Respond | Mitigate | Comms |
|----------|-----------|---------|----------|-------|
| **SEV1** | Total outage, data loss, security breach | 5 min | 30 min | Every 15 min |
| **SEV2** | Major feature down, significant impact | 15 min | 1 hour | Every 30 min |
| **SEV3** | Minor degradation, workaround exists | 1 hour | 4 hours | Every 2 hours |
| **SEV4** | Cosmetic, minimal impact | Next day | 1 week | Ticket update |

## Step 2: Assemble & Assign Roles

1. Create incident channel: `#incident-YYYY-MM-DD-brief-name`
2. Assign roles (SEV1/2 require all four):
   - **Incident Commander (IC)**: Coordinates, decides, owns comms
   - **Technical Lead**: Directs investigation
   - **Communications Lead**: Stakeholder updates (SEV1/2)
   - **Scribe**: Documents timeline

3. Post initial notification:
```
🔴 INCIDENT [SEV-X]: [Title]
Status: Investigating
Impact: [Who/what affected, estimated scope]
IC: @[name]
Channel: #incident-[id]
Next update: [time]
```

## Step 3: Systematic Investigation (POL-008)

Priority order — check each in sequence:

1. **Recent deployments** (last 4 hours): `git log --since="4 hours ago"`
2. **Recent config changes**: Feature flags, env vars, DNS
3. **External dependency status**: Health endpoints, status pages
4. **Infrastructure health**: CPU, memory, disk, connections
5. **Traffic patterns**: DDoS, load spike, unusual patterns
6. **Error logs**: Structured log search with correlation IDs
7. **Metrics dashboards**: RED metrics, SLO burn rate

## Step 4: Mitigate First (Restore > Root Cause)

Priority: **Restore service first**, investigate root cause later.

| Symptom | Quick Mitigation |
|---------|-----------------|
| Bad deploy | Rollback: `kubectl rollout undo deployment/app` |
| Resource exhaustion | Scale: `kubectl scale deployment/app --replicas=N` |
| Dependency failure | Circuit break, enable fallback |
| Feature bug | Kill switch via feature flag |
| Traffic spike | Enable rate limiting, scale CDN |

## Step 5: Communicate (Per Severity SLA)

Update template:
```
🟡 UPDATE [SEV-X]: [Title]
Status: Identified | Mitigating | Monitoring
Findings: [What we know]
Actions: [What we've done]
Next steps: [Plan]
Next update: [time]
```

## Step 6: Verify Resolution

- [ ] Health checks passing (`/health/live`, `/health/ready`)
- [ ] Error rate returned to baseline
- [ ] Latency returned to baseline
- [ ] Synthetic monitors green
- [ ] User flows verified

Post resolution:
```
🟢 RESOLVED [SEV-X]: [Title]
Duration: [time]
Impact: [summary]
Root cause: [brief]
Follow-up: Post-mortem scheduled [date]
```

## Step 7: Post-Incident (POL-010 CTRL-010.5)

**Within 48 hours** for SEV1-3:

1. Create post-mortem document with:
   - Timeline of events (UTC timestamps)
   - Root cause analysis (5 Whys)
   - Contributing factors
   - What went well / what went poorly
   - Action items with owners and due dates (max 2 sprints)

2. **Within 5 business days** for SEV1-2:
   - Blameless review meeting
   - Focus on systems, not individuals

3. Track action items — escalate if overdue per POL-010

## Quick Reference

| Symptom | Check First | Then |
|---------|-------------|------|
| High error rate | Recent deploys → rollback | Dependencies → circuit break |
| High latency | DB slow queries | External APIs → timeouts |
| Service down | Pod/container health → restart | Networking → DNS, LB |
| Data issues | Recent migrations | Replication lag |
