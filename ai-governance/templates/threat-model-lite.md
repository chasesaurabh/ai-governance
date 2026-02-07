# Threat Model Lite

> Lightweight threat model for features touching auth, payments, PII, or external integrations. Required by POL-001 (CTRL-001.3) and POL-006.

| Field | Value |
|-------|-------|
| **Feature/Component** | |
| **Author** | @name |
| **Date** | YYYY-MM-DD |
| **Data Classification** | C1 / C2 / C3 / C4 |
| **Review Status** | Draft / Reviewed / Approved |

---

## 1. What Are We Building?

_One-paragraph description of the feature and its boundaries._

## 2. Data Flow Diagram

_Describe or diagram how data flows through the feature:_

```
[Actor] --[protocol]--> [Component] --[protocol]--> [Storage/External]
```

Example:
```
[User Browser] --HTTPS--> [API Gateway] --gRPC--> [Auth Service] --TLS--> [User DB]
                                                        |
                                                        +--HTTPS--> [Email Provider]
```

## 3. Assets (What Are We Protecting?)

| Asset | Classification | Location | Impact If Compromised |
|-------|---------------|----------|----------------------|
| | C1/C2/C3/C4 | | |
| | | | |

## 4. Trust Boundaries

_Where does trust level change?_

| Boundary | From | To | Controls |
|----------|------|----|----------|
| Internet → API | Untrusted | Authenticated | TLS, auth, rate limiting |
| API → Database | Authenticated | Trusted | Parameterized queries, ACL |
| Service → External API | Internal | Third-party | API key, TLS, timeout |

## 5. Threat Analysis (STRIDE)

| Category | Threat | Applicable? | Mitigation | Status |
|----------|--------|-------------|------------|--------|
| **S**poofing | Attacker impersonates user | Yes/No | | Mitigated / Accepted / Open |
| **T**ampering | Attacker modifies data in transit | Yes/No | | |
| **R**epudiation | User denies performing action | Yes/No | | |
| **I**nformation Disclosure | Sensitive data leaked | Yes/No | | |
| **D**enial of Service | Service made unavailable | Yes/No | | |
| **E**levation of Privilege | Attacker gains higher access | Yes/No | | |

### Common Threats Checklist

_Check all that apply and document mitigation:_

**Authentication & Session:**
- [ ] Brute force login → Rate limiting, lockout
- [ ] Session hijacking → Secure cookies, regeneration
- [ ] Credential stuffing → Breach password check, MFA

**Authorization:**
- [ ] IDOR (accessing other users' data) → Object-level auth checks
- [ ] Privilege escalation → Role checks on every request
- [ ] Missing function-level auth → Middleware enforcement

**Input:**
- [ ] SQL injection → Parameterized queries
- [ ] XSS → Output encoding, CSP
- [ ] Command injection → No shell exec with user input
- [ ] Path traversal → Canonicalize + allowlist
- [ ] SSRF → URL allowlist, block private IPs

**Data:**
- [ ] PII exposure in logs → Log masking
- [ ] Data at rest unencrypted → Encryption
- [ ] Excessive data in API response → Response filtering
- [ ] Backup data unprotected → Encrypted backups

**Infrastructure:**
- [ ] DDoS → WAF, rate limiting, CDN
- [ ] Misconfigured cloud resources → IaC review, scanner
- [ ] Exposed admin interfaces → Network segmentation, auth

**AI-Specific:**
- [ ] Prompt injection via user input → Input sanitization, no user data in system prompts
- [ ] Data leakage to AI provider → C3/C4 data controls
- [ ] AI hallucination in security logic → Human review mandatory

## 6. Risk Summary

| Threat | Likelihood (1-5) | Impact (1-5) | Risk Score | Decision |
|--------|------------------|-------------|------------|----------|
| | | | L × I | Mitigate / Accept / Transfer |
| | | | | |

**Residual risk after mitigations**: Low / Medium / High

## 7. Open Items

| Item | Owner | Due Date | Status |
|------|-------|----------|--------|
| | | | |

---

## Approval

- [ ] Security Lead reviewed and approved: @name — Date
- [ ] Tech Lead acknowledged: @name — Date

_For High residual risk: VP Engineering approval required._
_Risk acceptance form required for any "Accept" decisions: ai-governance/templates/risk-acceptance.md_
