# POL-004: Coding Standards

| Field | Value |
|-------|-------|
| **Policy ID** | POL-004 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Tech Lead |
| **Approval** | Staff Engineer |

---

## Objective

Enforce consistent, maintainable, and secure code across all repositories through automated checks and mandatory review gates. Eliminate classes of bugs at authoring time rather than in production.

## Scope

Applies to: all code committed to any repository, including scripts, infrastructure-as-code, and AI-generated code.

---

## Mandatory Controls

### CTRL-004.1: Linting & Formatting

All repositories MUST have:

| Tool | Requirement | Enforcement |
|------|-------------|-------------|
| Linter | Language-appropriate (ESLint, Ruff, golangci-lint) | CI blocks on lint errors |
| Formatter | Language-appropriate (Prettier, Black, gofmt) | CI blocks on format diff |
| Config committed | `.eslintrc` / `pyproject.toml` / equivalent in repo | Repo setup checklist |
| Pre-commit hooks | Optional but recommended | Developer setup guide |

**Enforcement**: CI pipeline stage. Zero-tolerance for lint errors in main branch.

**Evidence artifact**: CI pipeline pass with lint/format stages green.

### CTRL-004.2: Code Complexity Limits

| Metric | Threshold | Tool |
|--------|-----------|------|
| Cyclomatic complexity per function | ≤ 15 | ESLint complexity, Radon |
| Function length | ≤ 50 lines (guideline, 80 hard limit) | Custom lint rule |
| File length | ≤ 500 lines (guideline) | Custom lint rule |
| Function parameters | ≤ 5 (use object beyond) | Lint rule |
| Nesting depth | ≤ 4 levels | Lint rule |

**Enforcement**: CI lint rules. Warnings at guideline, errors at hard limit.

**Evidence artifact**: Lint report in CI.

### CTRL-004.3: Dependency Hygiene

| Rule | Requirement |
|------|-------------|
| Lock file committed | `package-lock.json`, `poetry.lock`, `go.sum` | 
| License check | No GPL in proprietary code, no AGPL in SaaS |
| Vulnerability scan | `npm audit` / `pip-audit` / `govulncheck` |
| Unused dependency scan | `depcheck` / equivalent |
| Pinned versions | Exact versions in lock, ranges in manifest |

**Enforcement**: CI dependency check stage. High/critical CVEs block merge.

**Evidence artifact**: Dependency scan report in CI.

### CTRL-004.4: Mandatory Code Review

| Rule | Requirement |
|------|-------------|
| Minimum reviewers | 1 for standard, 2 for security-sensitive |
| Self-merge | Prohibited on main/release branches |
| Stale review | Re-review required if PR changes after approval |
| Review SLA | 1 business day for standard, 4 hours for hotfix |
| AI-generated code | Reviewer MUST verify AI output, not rubber-stamp |

**Enforcement**: Branch protection rules. CODEOWNERS file.

**Evidence artifact**: PR approval history.

### CTRL-004.5: AI-Specific Coding Rules

When AI generates or modifies code:

| Rule | Rationale |
|------|-----------|
| Verify all imports exist | AI hallucinates packages |
| Verify API signatures match docs | AI uses outdated APIs |
| Check for hardcoded test values | AI leaves example data |
| Validate error handling completeness | AI often skips edge cases |
| Run full test suite, not just new tests | AI changes can silently break |
| Review AI-suggested dependencies | AI may introduce unnecessary/risky deps |
| Never auto-merge AI-generated PRs | Human review mandatory |

**Enforcement**: PR checklist includes AI-specific items. CI runs full suite on every PR.

**Evidence artifact**: PR checklist completed, CI full-suite green.

### CTRL-004.6: Banned Patterns

Patterns that MUST NOT appear in production code:

```
BANNED:
- console.log / print() for production logging → use structured logger
- eval() / exec() with user input → never
- any → must use proper types (TypeScript)
- TODO without ticket reference → must link JIRA/GitHub issue
- Commented-out code blocks → delete, use git history
- Hardcoded IPs/URLs/credentials → use config/secrets
- Sleep/delay in tests → use proper async waits
- Catch-all error handlers that swallow → must log or rethrow
```

**Enforcement**: Custom lint rules. Pre-commit hooks recommended.

**Evidence artifact**: Lint pass.

---

## Exception Path

1. Developer documents exception rationale in PR description
2. Tech Lead approves with comment: `EXCEPTION: POL-004 CTRL-[number] - [reason]`
3. Exception limited to that PR only
4. Logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Lint pass rate on first push | > 85% | CI first-run pass / total pushes |
| Code review turnaround | < 1 business day | Time from PR open to first review |
| Critical vulnerability in dependencies | 0 in production | Dependency scan report |
| AI-generated code defect rate | Tracked, target < human rate | Bugs traced to AI-generated PRs / total AI PRs |

---

## References

- `ai-governance/policies/POL-005-testing.md`
- `ai-governance/policies/POL-006-security-privacy.md`
- `ai-governance/policies/POL-014-llm-risk-controls.md`
- `ai-governance/templates/pr-checklist.md`
