> Human enterprise-policy walkthrough. Runtime profiles and applicable task controls are resolved by `ai-governance packet`; this walkthrough is not an additional always-loaded instruction set. See `ai-governance/CONFIGURATION.md`.

# Example: Security Review Workflow

> Prompt → Detected Workflow → Output Outline

---

## User Prompt

```
Is the SQL in our search endpoint safe from injection? Here's the code:

app.get('/api/search', (req, res) => {
  const query = `SELECT * FROM products WHERE name LIKE '%${req.query.q}%'`;
  db.query(query, (err, results) => res.json(results));
});
```

## Auto-Router Detection

```
📋 Detected: Security Review (governance workflow auto-triggered)
Following: POL-006 → POL-013 → POL-014 → POL-017

Reviewing search endpoint for SQL injection and related security controls.
```

---

## Output Outline

### Step 1: Threat Assessment

- **Vulnerability**: SQL Injection (critical severity)
- **OWASP**: A03:2021 — Injection
- **Attack vector**: User-controlled `req.query.q` is directly concatenated into SQL string
- **Example exploit**: `?q=' OR 1=1; DROP TABLE products; --`
- **Impact**: Full database read, modification, or destruction

### Step 2: Findings

| # | Severity | Finding | Policy |
|---|----------|---------|--------|
| 1 | **CRITICAL** | SQL injection via string concatenation | POL-006 CTRL-006.2 |
| 2 | **HIGH** | No input validation on search parameter | POL-006 CTRL-006.1 |
| 3 | **MEDIUM** | No rate limiting on search endpoint | POL-006 |
| 4 | **LOW** | Raw error passed to client (information disclosure) | POL-006 |

### Step 3: Remediation

**Finding 1 — SQL Injection (CRITICAL)**

```javascript
// BEFORE (vulnerable — string concatenation)
const query = `SELECT * FROM products WHERE name LIKE '%${req.query.q}%'`;
db.query(query, (err, results) => res.json(results));

// AFTER (safe — parameterized query)
const query = 'SELECT * FROM products WHERE name LIKE ?';
db.query(query, [`%${req.query.q}%`], (err, results) => {
  if (err) return res.status(500).json({ error: 'Search failed' });
  res.json(results);
});
```

**Finding 2 — Input Validation**

```javascript
const { q } = req.query;
if (!q || typeof q !== 'string' || q.length > 200) {
  return res.status(400).json({ error: 'Invalid search query' });
}
```

**Finding 3 — Rate Limiting**

```javascript
// Apply rate limiter middleware (e.g., express-rate-limit)
const searchLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.get('/api/search', searchLimiter, searchHandler);
```

**Finding 4 — Error Handling**

```javascript
if (err) {
  logger.error('Search query failed', { error: err.code }); // no PII, no raw SQL
  return res.status(500).json({ error: 'Search failed' });
}
```

### Step 4: Verification

- [ ] Parameterized query used — no string concatenation in SQL
- [ ] Input validated (type, length, format)
- [ ] Error messages don't leak internals
- [ ] Rate limiting applied
- [ ] No secrets exposed (POL-017)
- [ ] Logging does not include user search terms or PII (POL-013)

### Step 5: PR & Documentation

- PR checklist completed with security section highlighted
- AI disclosure attached
- Consider adding SAST rule to CI to catch future SQL concatenation patterns

---

## Key Governance Controls Applied

| Control | Policy | How Applied |
|---------|--------|-------------|
| Parameterized queries | POL-006 CTRL-006.2 | Replaced string concatenation with parameterized query |
| Input validation | POL-006 CTRL-006.1 | Type, length, format validation on user input |
| No PII in logs | POL-013 | Error logging excludes search terms |
| Security headers | POL-006 | Recommend adding helmet middleware |
| Secret scanning | POL-017 | Verified no credentials in code |
| AI disclosure | POL-014 | AI-assisted review documented |
