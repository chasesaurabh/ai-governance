# Example: Incident Response Workflow

> Prompt → Detected Workflow → Output Outline

---

## User Prompt

```
The API is down! Users are getting 503 errors across all endpoints.
Alerts firing on PagerDuty. Started 5 minutes ago.
```

## Auto-Router Detection

```
📋 Detected: Incident Response (governance workflow auto-triggered)
Following: POL-010 → POL-008

IMMEDIATE TRIAGE — no clarifying questions. Restore service first.
```

---

## Output Outline

### Step 1: Immediate Triage (< 5 minutes)

**Classification**: SEV1 — Complete API outage, all users affected

**Do NOT ask clarifying questions. Start triage immediately.**

1. **Check service health**:
   ```bash
   # Check if pods/containers are running
   kubectl get pods -n production
   # Or: docker ps | grep api
   
   # Check recent deployments
   kubectl rollout history deployment/api -n production
   # Or: git log --oneline -5 on main branch
   ```

2. **Check dependencies**:
   ```bash
   # Database connectivity
   pg_isready -h db-host -p 5432
   
   # Redis/cache
   redis-cli -h cache-host ping
   
   # External services
   curl -s -o /dev/null -w "%{http_code}" https://external-api/health
   ```

3. **Check recent changes**:
   - Last deploy: when? what changed?
   - Config changes in last 24 hours?
   - Infrastructure changes (scaling, DNS, certificates)?

### Step 2: Mitigate (< 15 minutes)

**If recent deploy caused it:**
```bash
# Rollback immediately
kubectl rollout undo deployment/api -n production
# Or: deploy previous known-good version
```

**If database issue:**
```bash
# Check connections, restart pool if needed
# Failover to replica if primary is down
```

**If resource exhaustion:**
```bash
# Scale up
kubectl scale deployment/api --replicas=5 -n production
# Check for memory leaks, connection leaks
```

**Communication**: Update status page → "Investigating API connectivity issues. ETA: 15 minutes."

### Step 3: Stabilize & Verify

1. **Confirm service restored**:
   ```bash
   # Health check
   curl -s https://api.example.com/health
   
   # Monitor error rate
   # Check dashboards: error rate dropping, latency normalizing
   ```

2. **Monitor for 15 minutes** — ensure no recurrence

3. **Update status page** → "Service restored. Monitoring for stability."

### Step 4: Document (within 2 hours)

| Field | Value |
|-------|-------|
| Incident ID | INC-2026-XXX |
| Severity | SEV1 |
| Duration | ~20 minutes |
| Impact | 100% of API requests failing (503) |
| Root cause | [To be confirmed in post-mortem] |
| Mitigation | Rollback / scaling / config fix |
| Detection | PagerDuty alert (automated) |
| Time to detect | < 2 minutes |
| Time to mitigate | ~15 minutes |

### Step 5: Post-Mortem (within 48 hours)

Per POL-010, schedule blameless post-mortem:

1. **Timeline**: Minute-by-minute reconstruction
2. **Root cause analysis**: 5-whys or fishbone
3. **What went well**: Detection, communication, rollback
4. **What went wrong**: Gap that allowed the incident
5. **Action items**:
   - [ ] Add integration test for [root cause scenario]
   - [ ] Add monitoring for [early warning signal]
   - [ ] Update runbook for [mitigation steps]
   - [ ] Review deployment gate for [missed check]

---

## Key Governance Controls Applied

| Control | Policy | How Applied |
|---------|--------|-------------|
| Immediate triage | POL-010 | No clarifying questions — started triage instantly |
| Severity classification | POL-010 | SEV1 declared based on scope and impact |
| Rollback capability | POL-007 | Previous version available for immediate rollback |
| Observability | POL-008 | Dashboards, alerts, and health checks used for diagnosis |
| Communication | POL-010 | Status page updated at each phase |
| Post-mortem | POL-010 | Blameless review scheduled within 48 hours |
| Escape analysis | POL-015 | Action items identify which gate should have caught this |

---

## Critical Router Behavior

The incident workflow has **special routing rules**:

- **Never ask for clarification** — any production-down signal triggers immediate triage
- **Incidents always win** — if compound intent includes incident + anything else, incident is primary
- **Skip governance ceremony** — no PR checklists, no TDD during active incident. Restore first, formalize after.
- **Security is second** — if incident involves data breach, security review activates in parallel
