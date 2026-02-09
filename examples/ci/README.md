# CI/CD Governance Gate Templates

> IDE adapters guide. CI gates enforce.

These templates wire governance policies into your CI/CD pipeline so that policy violations **block merges**, not just generate warnings.

## Available Templates

| Platform | File | Policies Enforced |
|----------|------|-------------------|
| **GitHub Actions** | `github-actions/governance-gates.yml` | POL-004, 005, 006, 014, 017 |
| **Azure DevOps** | `azure-devops/governance-gates.yml` | POL-004, 005, 006, 017 |

## What Gets Enforced

| Gate | Policy | What It Blocks |
|------|--------|---------------|
| **Lint & Format** | POL-004 | Code style violations, banned patterns |
| **Test & Coverage** | POL-005 | Missing tests, coverage below threshold |
| **SAST Scan** | POL-006 | SQL injection, XSS, insecure patterns |
| **Dependency Audit** | POL-006 | Known vulnerabilities in dependencies |
| **Secret Scanning** | POL-017 | Hardcoded secrets, API keys, credentials |
| **AI Disclosure** | POL-014 | Missing AI usage disclosure (advisory) |

## Setup

### GitHub Actions

1. Copy `github-actions/governance-gates.yml` to `.github/workflows/` in your project
2. Adjust commands for your language/framework (defaults are Node.js)
3. Enable branch protection on `main`:
   - **Settings → Branches → Branch protection rules**
   - Require status checks: select "All Governance Gates"
   - Require branches to be up to date

### Azure DevOps

1. Copy `azure-devops/governance-gates.yml` to your repo
2. Create a pipeline pointing to this file
3. Set as a required pipeline in branch policies:
   - **Project Settings → Repos → Policies → Branch Policies**
   - Add build validation policy pointing to this pipeline

## Customization

### Adjusting Coverage Threshold

GitHub Actions — edit the coverage gate step:
```yaml
if (( $(echo "$COVERAGE < 80" | bc -l) )); then  # Change 80 to your target
```

Azure DevOps — edit the variable:
```yaml
variables:
  coverageThreshold: 80  # Change to your target
```

### Adding More Languages

The templates default to Node.js. For other stacks:

- **Python**: Replace `npm` commands with `pip`, `pytest`, `bandit` (SAST), `safety` (dependency audit)
- **Java**: Replace with `mvn`, `JaCoCo` (coverage), `SpotBugs`/`PMD` (SAST)
- **Go**: Replace with `go test`, `golangci-lint`, `govulncheck`
- **C#/.NET**: Replace with `dotnet test`, `dotnet format`, security analyzers

### Making Gates Advisory vs Blocking

To make a gate advisory (warn but don't block):
- GitHub Actions: Add `continue-on-error: true` to the step
- Azure DevOps: Add `continueOnError: true` to the script task

Start with advisory gates while ramping up, then switch to blocking once the team is ready.

## Relationship to IDE Adapters

```
Developer types prompt
       ↓
AI IDE adapter guides correct behavior (advisory)
       ↓
Developer commits code
       ↓
Pre-commit hooks catch secrets and lint (local blocking)
       ↓
PR opened
       ↓
CI governance gates run (pipeline blocking)  ← YOU ARE HERE
       ↓
PR review with governance checklist (human blocking)
       ↓
Merge allowed only if all gates pass
```

The CI layer is where governance becomes **enforceable**. IDE adapters reduce the number of CI failures by guiding correct behavior upfront, but CI is the backstop.
