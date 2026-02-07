---
description: Perform security review of code or application
---

# Security Review Workflow (Enterprise)

Comprehensive security review per POL-006, POL-013, POL-014, POL-017.

## Step 1: Scope & Data Classification

1. Identify review scope: PR / component / full application
2. Identify data classification per POL-013:
   - C1 (Public) — standard review
   - C2 (Internal) — standard review
   - C3 (Confidential/PII) — enhanced review
   - C4 (Restricted/PCI/PHI) — enhanced review + Security Lead sign-off
3. Identify security-sensitive areas: auth, payments, PII, admin, external integrations
4. If applicable, review threat model: `ai-governance/templates/threat-model-lite.md`

## Step 2: Authentication (POL-006 CTRL-006.4)

- [ ] Passwords hashed with Argon2id or bcrypt (cost ≥ 12)
- [ ] JWT access tokens ≤ 15 min, refresh ≤ 7 days
- [ ] Session IDs cryptographically random, regenerated on privilege change
- [ ] Cookie flags: `HttpOnly; Secure; SameSite=Strict`
- [ ] Brute-force protection: rate limit (5 failures/min), lockout after 10
- [ ] MFA required for admin accounts

## Step 3: Authorization (POL-006 CTRL-006.5)

- [ ] Every endpoint has explicit permission check (default deny)
- [ ] Object-level access control (IDOR prevention — users access only their data)
- [ ] No reliance on hidden URLs/IDs for security
- [ ] Admin endpoints on separate route prefix with additional logging
- [ ] Authorization failures logged with user context
- [ ] Role definitions documented and quarterly reviewed

## Step 4: Input Validation & Injection Prevention (POL-006 CTRL-006.6)

- [ ] All user inputs validated with schema (zod/joi/etc.)
- [ ] SQL: parameterized queries only, no string concatenation
- [ ] XSS: auto-escaping templates, CSP header, no `dangerouslySetInnerHTML` without sanitizer
- [ ] Command injection: no shell exec with user input
- [ ] Path traversal: validate and canonicalize file paths
- [ ] SSRF: allowlist outbound URLs, block private IPs
- [ ] Deserialization: never deserialize untrusted input

## Step 5: Data Protection (POL-013)

- [ ] PII (C3/C4) masked in logs: `j***@example.com`
- [ ] Passwords never stored in plain text
- [ ] Data encrypted in transit (TLS 1.2+)
- [ ] C3/C4 data encrypted at rest (AES-256)
- [ ] Data retention policy defined and enforced
- [ ] Right-to-deletion capability exists for PII
- [ ] C3/C4 data NOT sent to AI tools (POL-014)
- [ ] Test environments use synthetic/anonymized data for C3/C4

## Step 6: Secrets (POL-017)

- [ ] No hardcoded secrets in code (verified by secret scanner)
- [ ] No secrets in git history
- [ ] `.env` files in `.gitignore`, `.env.example` has placeholders only
- [ ] Secrets loaded from env vars or secret manager
- [ ] Secret rotation policy followed
- [ ] CI secrets not exposed in logs

// turbo
Run secret scanner: `gitleaks detect --source .` or `npm audit`

## Step 7: Security Headers (POL-006 CTRL-006.7)

- [ ] `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `Content-Security-Policy: default-src 'self'; script-src 'self'`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Step 8: Dependencies (POL-006 CTRL-006.3)

// turbo
Run dependency audit: `npm audit` / `pip-audit` / `govulncheck`

- [ ] No Critical/High CVEs (block if found)
- [ ] Lock file committed
- [ ] No GPL in proprietary code, no AGPL in SaaS

## Step 9: AI-Specific Security (POL-014)

- [ ] AI-generated code scanned by same SAST as human code
- [ ] No prompt injection patterns in comments/strings
- [ ] AI-suggested dependencies verified (not typosquat)
- [ ] C3/C4 data controls enforced in AI tool configuration

## Step 10: Report Findings

| # | Finding | Severity | Location | OWASP | Recommendation | Status |
|---|---------|----------|----------|-------|----------------|--------|
| 1 | | Crit/High/Med/Low | file:line | A01-A10 | | Open/Fixed |

**Severity SLAs per POL-006:**
- **Critical**: Fix before deploy
- **High**: Fix before deploy
- **Medium**: Fix in current sprint
- **Low**: Fix when convenient

For accepted risks, file `ai-governance/templates/risk-acceptance.md`.
