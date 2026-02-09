# Governance Exceptions Log

> All policy exceptions are logged here per individual policy exception paths. Review monthly.

| ID | Date | Policy | Control | Requestor | Approver | Expiry | Status | Compensating Controls |
|----|------|--------|---------|-----------|----------|--------|--------|-----------------------|
| _EX-2026-001_ | _YYYY-MM-DD_ | _POL-NNN_ | _CTRL-NNN.N_ | _@name_ | _@name_ | _YYYY-MM-DD_ | _Active / Expired / Remediated_ | _Description_ |

---

## Rules

- **Maximum active exceptions per team**: 10 (VP Engineering review if exceeded)
- **Maximum renewals per exception**: 2 (270 days total, then must remediate or escalate)
- **Review cadence**: Monthly by Engineering Manager, quarterly by VP Engineering
- **C4 data exceptions**: CISO approval, 30-day TTL maximum
- **Security exceptions**: Security Lead approval required

## How to Propose an Exception

1. **Identify the policy and control** you need an exception for (e.g., POL-005 CTRL-005.1)
2. **Fill out the risk acceptance template**: `ai-governance/templates/risk-acceptance.md`
3. **Get approval** from the required approver:
   - Security exceptions (POL-006, POL-017): Security Lead
   - C4 data exceptions (POL-013): CISO, 30-day TTL maximum
   - All others: Engineering Manager
4. **Log the exception** by adding a row to the table above with:
   - Unique ID (format: `EX-YYYY-NNN`)
   - Expiry date (90-day default, 30-day for C4 data)
   - Compensating controls (what mitigates the risk while the exception is active)
5. **Submit a PR** with the exception entry and risk acceptance form
6. **Set a calendar reminder** for the expiry date

## Renewal Process

- Maximum 2 renewals per exception (270 days total)
- Each renewal requires re-approval and updated compensating controls
- After 2 renewals: must remediate or escalate to VP Engineering
- Renewal PR must reference the original exception ID

## Closure Reasons

- **Remediated**: Root cause fixed, exception no longer needed
- **Expired**: TTL reached without renewal
- **Renewed**: New exception form filed (link to new entry)
- **Risk materialized**: The risk occurred, triggering incident response
