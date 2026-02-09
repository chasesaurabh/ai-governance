# Example: Add Feature Workflow

> Prompt → Detected Workflow → Output Outline

---

## User Prompt

```
Add a password reset feature. Users should be able to request a reset via email,
receive a time-limited token, and set a new password.
```

## Auto-Router Detection

```
📋 Detected: Add Feature (governance workflow auto-triggered)
Following: POL-001 → POL-003 → POL-005 → POL-004 → POL-006

Adding password reset feature with TDD approach, security gates, and governance compliance.
```

---

## Output Outline

### Step 1: Requirements Intake (POL-001)

- **User story**: As a user, I can reset my password via a time-limited email token
- **Acceptance criteria**:
  - User submits email on /forgot-password
  - System sends email with reset link (token valid 1 hour)
  - User sets new password via /reset-password?token=xxx
  - Token is single-use and time-limited
  - Account lockout after 5 failed attempts
- **NFRs**: Token expiry ≤ 1 hour, rate-limited to 3 requests/15 min, audit logged
- **Threat pre-screen**: Token guessing, email enumeration, timing attacks

### Step 2: Design (POL-003)

- **API endpoints**:
  - `POST /api/auth/forgot-password` — accepts email, returns 200 (always, to prevent enumeration)
  - `POST /api/auth/reset-password` — accepts token + new password
- **Data model**: `password_reset_tokens` table with `user_id`, `token_hash`, `expires_at`, `used_at`
- **Token strategy**: Crypto-random 32-byte token, stored as SHA-256 hash (never store raw token in DB)

### Step 3: Tests First (POL-005)

- Unit tests for token generation, validation, expiry
- Integration test for full reset flow
- Security tests: expired token, reused token, invalid token, rate limiting
- Tests written BEFORE implementation, verified to fail

### Step 4: Implementation (POL-004)

- Password hashing with bcrypt (salt rounds ≥ 12)
- Parameterized queries for all DB operations (POL-006)
- Input validation on email format and password strength
- Structured logging with no PII (POL-013) — log event type, not email address
- Rate limiting middleware on reset endpoints

### Step 5: Security Review (POL-006)

- [ ] Token stored as hash, not plaintext
- [ ] No timing oracle on token comparison (constant-time compare)
- [ ] Email enumeration prevented (same response for valid/invalid emails)
- [ ] Password meets complexity requirements
- [ ] No secrets hardcoded (POL-017)
- [ ] Input validation on all user inputs
- [ ] Security headers set (CSRF, etc.)

### Step 6: PR & AI Disclosure

- PR checklist completed (`ai-governance/templates/pr-checklist.md`)
- AI usage disclosure attached (`ai-governance/templates/ai-usage-disclosure.md`)
- Tests passing, coverage gate met

---

## Key Governance Controls Applied

| Control | Policy | How Applied |
|---------|--------|-------------|
| Structured requirements | POL-001 | User story + acceptance criteria + NFRs before code |
| TDD approach | POL-005 | Tests written and verified failing before implementation |
| Parameterized queries | POL-006 | All SQL uses parameterized queries, no string concatenation |
| No secrets in code | POL-017 | Token stored as hash, no hardcoded keys |
| Input validation | POL-006 | Email format, password strength validated |
| Data classification | POL-013 | No PII in logs, token stored as hash |
| AI disclosure | POL-014 | AI usage tracked in PR |
