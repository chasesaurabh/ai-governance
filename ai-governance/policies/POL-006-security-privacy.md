# POL-006: Security & Privacy

| Field | Value |
|-------|-------|
| **Policy ID** | POL-006 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Security Lead / AppSec Engineer |
| **Approval** | CISO / VP Engineering |

---

## Objective

Embed security and privacy into every phase of development through automated scanning, mandatory review gates, and enforceable data handling rules. Prevent vulnerabilities from reaching production and ensure compliance with data protection regulations.

## Scope

Applies to: all code, infrastructure, CI/CD pipelines, third-party integrations, and AI-assisted development.

---

## Mandatory Controls

### CTRL-006.1: SAST (Static Application Security Testing)

| Rule | Requirement |
|------|-------------|
| Scanner | Semgrep / CodeQL / SonarQube (language-appropriate) |
| Frequency | Every PR |
| Blocking severity | Critical and High block merge |
| False positive handling | Suppress with inline comment + ticket reference |
| Custom rules | Org-specific rules for auth, crypto, data handling |

**Enforcement**: CI SAST stage. Merge blocked on Critical/High findings.

**Evidence artifact**: SAST scan report in CI.

### CTRL-006.2: DAST (Dynamic Application Security Testing)

| Rule | Requirement |
|------|-------------|
| Scanner | OWASP ZAP / Burp Suite / equivalent |
| Frequency | Weekly on staging, pre-release on production-like |
| Scope | All authenticated and unauthenticated endpoints |
| Blocking | Critical findings block release |

**Enforcement**: Scheduled CI job. Release gate.

**Evidence artifact**: DAST report committed to `docs/security/`.

### CTRL-006.3: Dependency Vulnerability Management

| Severity | SLA to Patch | Enforcement |
|----------|-------------|-------------|
| Critical (CVSS ≥ 9.0) | 24 hours | Auto-PR created, Slack alert to security channel |
| High (CVSS 7.0-8.9) | 7 days | Auto-PR created |
| Medium (CVSS 4.0-6.9) | 30 days | Monthly dependency update cycle |
| Low (CVSS < 4.0) | 90 days | Quarterly review |

**Enforcement**: Dependabot/Renovate with auto-merge for patch updates. Dashboard tracking SLA compliance.

**Evidence artifact**: Dependency scan report, SLA compliance dashboard.

### CTRL-006.4: Authentication Standards

| Control | Requirement |
|---------|-------------|
| Password hashing | Argon2id (preferred) or bcrypt (cost ≥ 12) |
| MFA | Required for admin, optional for users |
| JWT lifetime | Access: ≤ 15 min, Refresh: ≤ 7 days |
| Session management | Regenerate on privilege change, absolute timeout ≤ 24h |
| Brute-force protection | Rate limit: 5 failures/min, lockout after 10 |
| Cookie flags | `HttpOnly; Secure; SameSite=Strict` |

**Enforcement**: SAST custom rules for auth patterns. Security review for auth changes.

**Evidence artifact**: Security review sign-off.

### CTRL-006.5: Authorization Standards

| Control | Requirement |
|---------|-------------|
| Default deny | All endpoints require explicit permission |
| Object-level auth | Users can only access their own resources (IDOR prevention) |
| Role definitions | Documented, reviewed quarterly |
| Admin endpoints | Separate route prefix, additional logging |
| Permission changes | Require 2-reviewer approval |

**Enforcement**: Middleware/decorator enforced. Integration tests for auth boundaries.

**Evidence artifact**: Auth integration test results.

### CTRL-006.6: Input Validation & Injection Prevention

| Attack Vector | Mandatory Control |
|--------------|-------------------|
| SQL Injection | Parameterized queries only. Lint rule bans string concatenation in SQL |
| XSS | Auto-escaping template engine. CSP headers. No `dangerouslySetInnerHTML` without sanitizer |
| Command Injection | No shell exec with user input. Allowlist if unavoidable |
| Path Traversal | Validate and canonicalize file paths |
| SSRF | Allowlist outbound URLs. Block private IPs |
| Deserialization | Never deserialize untrusted input |

**Enforcement**: SAST rules per attack vector. WAF rules in production.

**Evidence artifact**: SAST scan pass, WAF configuration.

### CTRL-006.7: Security Headers

All HTTP responses MUST include:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Enforcement**: Integration test validates headers. Security scanner checks.

**Evidence artifact**: Header test results.

### CTRL-006.8: Privacy & Data Handling

| Control | Requirement |
|---------|-------------|
| PII inventory | Maintained per POL-013 data classification |
| Data minimization | Collect only what's needed, justify each field |
| Retention policy | Defined per data class, automated deletion |
| Right to deletion | Technical capability verified quarterly |
| Cross-border transfer | Documented and compliant with local law |
| Logging | PII masked in logs (email: `j***@example.com`) |

**Enforcement**: Data classification review in PR. Quarterly PII audit.

**Evidence artifact**: Data classification tags in code, PII audit report.

### CTRL-006.9: AI-Specific Security Controls

| Risk | Control |
|------|---------|
| AI suggesting insecure code | SAST scans AI output same as human code |
| AI leaking secrets in suggestions | Secret scanner runs on all commits |
| AI-generated SQL vulnerable to injection | Parameterized query lint rule enforced |
| Sensitive data sent to AI service | Data classification gate: C3/C4 data prohibited in AI prompts |
| AI hallucinating security libraries | Dependency allowlist check |

**Enforcement**: All standard security tooling applies to AI-generated code. Additional prompt-level controls per POL-014.

**Evidence artifact**: SAST/secret scan pass on AI-generated PRs.

---

## Exception Path

1. Security exceptions require Security Lead approval
2. Risk acceptance form completed (`ai-governance/templates/risk-acceptance.md`)
3. Exception has maximum 90-day TTL
4. Re-review required with compensating controls documented
5. All exceptions tracked in security exception register

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| SAST findings in production | 0 Critical, 0 High | SAST scan of deployed code |
| Dependency vulnerability SLA compliance | > 95% | Patched within SLA / total vulnerabilities |
| Security review turnaround | < 2 business days | Time from request to sign-off |
| PII exposure incidents | 0 | Incident count |
| Secret leak incidents | 0 | Secret scanner alerts |
| Security training completion | 100% of engineers annually | Training platform records |

---

## References

- `ai-governance/policies/POL-013-data-classification.md`
- `ai-governance/policies/POL-017-secrets-management.md`
- `ai-governance/policies/POL-014-llm-risk-controls.md`
- `ai-governance/templates/threat-model-lite.md`
- `ai-governance/templates/risk-acceptance.md`
