# POL-017: Secrets Management

| Field | Value |
|-------|-------|
| **Policy ID** | POL-017 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Security Lead / Platform Lead |
| **Approval** | CISO / VP Engineering |

---

## Objective

Ensure all secrets (credentials, API keys, tokens, certificates, encryption keys) are created, stored, accessed, rotated, and revoked through controlled, auditable processes—with zero secrets in code, logs, or AI tool context.

## Scope

Applies to: all secrets across all environments including development, CI/CD, staging, and production.

---

## Mandatory Controls

### CTRL-017.1: Secret Storage

| Rule | Requirement |
|------|-------------|
| Secret store | HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, or Azure Key Vault |
| No secrets in code | Enforced by secret scanner (pre-commit + CI) |
| No secrets in env files committed | `.env` in `.gitignore`, `.env.example` has placeholders only |
| No secrets in CI logs | CI configured to mask secret patterns |
| No secrets in container images | Multi-stage builds, secrets injected at runtime |
| No secrets in AI prompts | AI proxy scans outbound context |

**Enforcement**: Pre-commit hook (detect-secrets, gitleaks). CI secret scanning stage. Container image scanner.

**Evidence artifact**: Secret scan pass in CI, pre-commit configuration.

### CTRL-017.2: Secret Scanning

| Scanner | Scope | Frequency |
|---------|-------|-----------|
| **Pre-commit** (gitleaks/detect-secrets) | Staged files | Every commit |
| **CI scanner** (gitleaks/trufflehog) | Full diff | Every PR |
| **Repository history scan** | Full git history | Weekly |
| **Container image scan** | Built images | Every build |
| **Log scanner** | Application logs | Daily |
| **AI prompt scanner** | Outbound AI requests | Real-time |

High-entropy string detection + known secret patterns (AWS keys, GitHub tokens, JWTs, private keys).

**Enforcement**: Pre-commit blocks commit with secrets. CI blocks merge. History scan alerts security team.

**Evidence artifact**: Scan reports, alert log.

### CTRL-017.3: Secret Rotation

| Secret Type | Rotation Frequency | Automation |
|-------------|-------------------|------------|
| Database passwords | 90 days | Automated via secret manager |
| API keys (internal) | 90 days | Automated |
| API keys (third-party) | Per vendor policy, max 1 year | Semi-automated |
| Service account tokens | 90 days | Automated |
| TLS certificates | Auto-renew (60 days before expiry) | Automated (cert-manager/ACM) |
| SSH keys | Annually | Manual with checklist |
| Encryption keys | Annually (or per compliance) | Automated KMS rotation |
| JWT signing keys | 90 days | Automated with key overlap period |

Rotation process:
```
1. Generate new secret
2. Update secret manager
3. Gradually shift consumers to new secret (dual-read period)
4. Verify all consumers using new secret
5. Revoke old secret
6. Log rotation event
```

**Enforcement**: Secret expiry monitoring with alerts. Automated rotation where possible. Manual rotation tracked in ticketing system.

**Evidence artifact**: Rotation log, expiry dashboard.

### CTRL-017.4: Access Control for Secrets

| Principle | Implementation |
|-----------|---------------|
| Least privilege | Service gets only the secrets it needs |
| Environment isolation | Dev/staging/prod secrets are completely separate |
| Audit logging | All secret access logged with who, when, which secret |
| Human access | Break-glass procedure only, requires justification |
| Service identity | Workload identity (IAM roles, service accounts) preferred over static credentials |
| Two-person rule | Production secret creation/modification requires 2 people |

**Enforcement**: Secret manager RBAC policies. Audit log monitoring. Break-glass procedure with alerting.

**Evidence artifact**: RBAC configuration, audit logs, break-glass log.

### CTRL-017.5: Secret Incident Response

If a secret is exposed (committed to git, logged, leaked):

| Step | SLA | Action |
|------|-----|--------|
| 1. Detect | Immediate | Scanner alert or manual report |
| 2. Revoke | < 1 hour | Rotate/revoke the exposed secret |
| 3. Assess | < 4 hours | Determine if secret was exploited |
| 4. Remediate | < 24 hours | Remove from git history (BFG/git-filter-repo), update consumers |
| 5. Review | < 48 hours | Post-mortem, process improvement |

**Enforcement**: Incident response process (POL-010). Automated revocation where possible.

**Evidence artifact**: Incident record, revocation log, git history cleanup verification.

### CTRL-017.6: Development Environment Secrets

| Rule | Requirement |
|------|-------------|
| Local development | Use `.env.local` (gitignored) or secret manager CLI |
| Shared dev secrets | Stored in secret manager, not shared via Slack/email |
| CI/CD secrets | Stored in CI platform's secret management (GitHub Secrets, etc.) |
| Never share secrets | No secrets in tickets, chat, email, shared documents |
| AI tool context | Never paste secrets into AI prompts or chat |

**Enforcement**: Developer training. Secret scanner catches common patterns.

**Evidence artifact**: Training completion records.

---

## Exception Path

1. Legacy system unable to use secret manager: compensating controls documented, migration plan with deadline
2. Third-party requiring static credentials: risk acceptance form (ai-governance/templates/risk-acceptance.md)
3. All exceptions require Security Lead approval, 90-day TTL
4. Logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Secrets in code (detected by scanner) | 0 | Pre-commit + CI scan results |
| Secret rotation compliance | > 95% rotated within policy window | Rotation log vs policy schedule |
| Secret exposure incidents | 0 | Incident count |
| Time to revoke exposed secret | < 1 hour | Incident response time |
| Secrets with audit logging | 100% | Secret manager configuration audit |

---

## References

- `ai-governance/policies/POL-006-security-privacy.md`
- `ai-governance/policies/POL-013-data-classification.md`
- `ai-governance/policies/POL-014-llm-risk-controls.md`
- `ai-governance/templates/risk-acceptance.md`
