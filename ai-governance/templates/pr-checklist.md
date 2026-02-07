# Pull Request Checklist

> Copy this into your PR description. Check items that apply. Strike-through items that don't apply with justification.

## PR Metadata

- **Type**: [ ] Feature / [ ] Bug Fix / [ ] Refactor / [ ] Docs / [ ] Chore / [ ] Hotfix
- **Change Classification (POL-012)**: [ ] Standard / [ ] Normal / [ ] Emergency / [ ] Major
- **AI Usage (POL-014)**: [ ] None / [ ] AI-Assisted / [ ] AI-Generated
- **Breaking Change?**: [ ] Yes / [ ] No

---

## Requirements (POL-001)

- [ ] Linked to ticket/issue with acceptance criteria
- [ ] Out-of-scope clearly defined
- [ ] Data sensitivity classified per POL-013

## Design (POL-003)

- [ ] API spec updated (OpenAPI/protobuf) if new/changed endpoints
- [ ] Data model changes reviewed with migration plan
- [ ] Error handling follows error taxonomy
- [ ] State changes documented (if applicable)

## Code Quality (POL-004)

- [ ] Follows existing code style and naming conventions
- [ ] Linter and formatter pass with zero errors
- [ ] No banned patterns (eval, console.log in prod, TODO without ticket)
- [ ] Cyclomatic complexity within limits
- [ ] No unnecessary dependencies added

## Testing (POL-005)

- [ ] Unit tests added/updated for new logic
- [ ] Integration tests for new endpoints
- [ ] Contract tests updated if API changed
- [ ] Edge cases and error conditions tested
- [ ] All tests pass locally and in CI
- [ ] Coverage meets threshold (≥ 80%)

## Security (POL-006)

- [ ] Input validation on all user-provided data
- [ ] No SQL injection (parameterized queries only)
- [ ] No XSS vulnerabilities (output encoding)
- [ ] Authorization checked on new/changed endpoints
- [ ] No hardcoded secrets or credentials
- [ ] Sensitive data not logged (PII masked)
- [ ] SAST scan passes

## Data Classification (POL-013)

- [ ] New data fields have classification annotations
- [ ] C3/C4 data handling follows required controls
- [ ] N/A — no new data fields

## AI-Specific Checks (POL-014)

> Complete if AI Usage is "AI-Assisted" or "AI-Generated"

- [ ] All AI-suggested imports verified to exist
- [ ] AI-suggested API signatures match actual documentation
- [ ] No hardcoded test/example values left by AI
- [ ] Error handling reviewed (AI often skips edge cases)
- [ ] Full test suite run (not just new tests)
- [ ] New dependencies verified (exist, maintained, safe, licensed)
- [ ] AI-generated code reviewed line-by-line
- [ ] AI Usage Disclosure completed (see template)

## Documentation (POL-011)

- [ ] README updated if setup/config changed
- [ ] API docs updated if endpoints changed
- [ ] Runbook updated if operational behavior changed
- [ ] ADR created if architectural decision made

## Deployment (POL-007)

- [ ] Database migration is backward-compatible
- [ ] Feature flag configured (if applicable)
- [ ] Rollback plan documented
- [ ] Health check endpoints work
- [ ] Monitoring/alerts configured for new functionality

---

## Reviewer Notes

_Any additional context for reviewers:_

---

## AI Usage Disclosure

**AI Tool Used**: [ ] None / [ ] Windsurf / [ ] Copilot / [ ] Claude Code / [ ] Cursor / [ ] Other: ____
**Usage Level**: [ ] None / [ ] Completion suggestions / [ ] Block generation / [ ] Full file generation
**Files AI-generated/modified**: _List files_
**Reviewer verification**: [ ] Verified AI output is correct and complete
