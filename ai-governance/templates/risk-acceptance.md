# Risk Acceptance Form

> Complete this form when a governance policy exception is requested. Per governance exception paths, all exceptions must be documented, approved, and time-bound.

| Field | Value |
|-------|-------|
| **Form ID** | RA-[YYYY]-[NNN] |
| **Date** | YYYY-MM-DD |
| **Requestor** | @name, role |
| **Policy Exception** | POL-[NNN], CTRL-[NNN.N] |

---

## Risk Description

**What policy control is being bypassed?**
_Reference specific policy and control ID._

**Why is the exception needed?**
_Business justification. Be specific—"it's faster" is not sufficient._

**What is the risk if the exception is granted?**
_Describe realistic worst-case scenario._

| Risk Dimension | Impact (1-5) | Likelihood (1-5) | Risk Score |
|---------------|-------------|------------------|------------|
| Security breach | | | |
| Data loss | | | |
| Compliance violation | | | |
| Service outage | | | |
| Reputation damage | | | |

**Overall risk level**: [ ] Low (score ≤ 8) / [ ] Medium (9-15) / [ ] High (16-20) / [ ] Critical (> 20)

## Compensating Controls

_What alternative measures will reduce the risk while the exception is active?_

| Compensating Control | Reduces Which Risk | Implemented By |
|---------------------|-------------------|----------------|
| | | |
| | | |

## Scope & Duration

**Scope**: _What systems/services/data are affected?_

**Start date**: YYYY-MM-DD
**Expiry date**: YYYY-MM-DD (maximum 90 days, 30 days for C4 data)
**Renewal**: [ ] Non-renewable / [ ] Renewable with re-review

## Remediation Plan

_How will you eliminate the need for this exception?_

| Step | Description | Owner | Due Date |
|------|------------|-------|----------|
| 1 | | | |
| 2 | | | |

## Approval

| Role | Required For | Name | Decision | Date |
|------|-------------|------|----------|------|
| Tech Lead | All exceptions | | Approve / Reject | |
| Security Lead | Security exceptions (POL-006, 013, 014, 017) | | Approve / Reject | |
| Engineering Manager | Standard exceptions | | Approve / Reject | |
| VP Engineering | High/Critical risk | | Approve / Reject | |
| CISO | C4 data exceptions | | Approve / Reject | |

## Monitoring During Exception

_How will you monitor for the risk materializing during the exception period?_

| Monitor | Alert Condition | Owner |
|---------|----------------|-------|
| | | |

---

## Closure

**Exception closed on**: YYYY-MM-DD
**Reason**: [ ] Remediation complete / [ ] Expired / [ ] Risk materialized / [ ] Renewed (new form ID: RA-[YYYY]-[NNN])
**Lessons learned**: _Brief note for future reference._
