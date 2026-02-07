---
description: Start a new project from scratch with full governance
---

# New Project Workflow (Enterprise)

Creates a new project with all governance controls from day one.

## Step 1: Requirements Gathering (POL-001)

Read `ai-governance/policies/POL-001-requirements.md`, then:

1. Ask the user to describe:
   - What problem are we solving? (one-sentence problem statement)
   - Who are the target users/personas?
   - What are the key features and acceptance criteria?
   - Non-functional requirements (latency, availability, compliance)?
   - Technical constraints or preferences?
   - Data sensitivity level (C1-C4 per POL-013)?

2. Document in `docs/requirements.md` with:
   - Problem statement and business value
   - User stories with Given/When/Then acceptance criteria
   - NFR targets (latency p95, uptime %, throughput)
   - Data classification tags
   - Out-of-scope list

3. If auth, payments, PII, or external integrations involved:
   - Complete threat model using `ai-governance/templates/threat-model-lite.md`

## Step 2: Architecture Decision (POL-002)

Read `ai-governance/policies/POL-002-architecture.md`, then:

1. Propose architecture with trade-offs (minimum 2 options)
2. Create `docs/adrs/` directory
3. Write first ADR using `ai-governance/templates/adr-template.md`:
   - `ADR-001-architecture-style.md` — Architecture and stack decision
   - Include decision drivers, options, consequences, security/compliance impact
4. Document technology stack against Technology Radar (Adopt/Trial/Assess/Hold)

## Step 3: Project Scaffolding (POL-004)

1. Create project structure per coding standards
2. Initialize package manager with lock file
3. Set up configuration:
   - `.gitignore` (include `.env`, secrets)
   - `.env.example` (placeholders only, no real secrets per POL-017)
   - Linter config (ESLint/Ruff/golangci-lint)
   - Formatter config (Prettier/Black/gofmt)
   - Pre-commit hooks (secret scanning via gitleaks)

// turbo
4. Install core dependencies

5. Copy governance adapter for your AI tool:
   - Windsurf: already in `.windsurf/workflows/`
   - Copilot: copy `.github/copilot-instructions.md`
   - Claude Code: copy `CLAUDE.md`
   - Cursor: copy `.cursor/rules/`

## Step 4: Security Foundation (POL-006, POL-017)

1. Configure security headers middleware
2. Set up environment variable handling (no hardcoded secrets)
3. Configure secret scanning in pre-commit hooks
4. Set up input validation library (zod, joi, etc.)
5. Create data classification annotations for models per POL-013

## Step 5: Health & Observability (POL-007, POL-008)

1. Create health check endpoints:
   - `/health/live` — process alive
   - `/health/ready` — dependencies healthy
2. Configure structured JSON logging with correlation IDs
3. Set up basic metrics (request rate, errors, duration)
4. Create initial service dashboard template

## Step 6: Testing Foundation (POL-005, POL-015)

1. Set up testing framework (Jest/Pytest/Go test)
2. Create test directory mirroring src structure
3. Add sample unit test with factory pattern
4. Configure coverage thresholds (≥ 80%)
5. Set up contract testing framework if API service (Pact/Specmatic)

// turbo
6. Run tests to verify setup works

## Step 7: CI/CD Pipeline (POL-007, POL-015)

Create `.github/workflows/ci.yml` with quality gates:

1. **Gate 1**: Lint + Format + Type-check
2. **Gate 2**: Unit tests + Coverage check (≥ 80%)
3. **Gate 3**: Integration tests + Contract tests
4. **Gate 4**: SAST scan (Semgrep/CodeQL)
5. **Gate 5**: Dependency vulnerability scan
6. **Gate 6**: Secret scan (gitleaks)
7. **Gate 7**: Build artifact

Configure branch protection: no direct push to main, require PR review, require CI pass.

## Step 8: Documentation (POL-011)

1. Complete README with: description, quick start, prerequisites, dev setup, config table, architecture overview
2. Create `CONTRIBUTING.md`
3. Create `docs/runbooks/` directory with template
4. Set up API documentation (OpenAPI spec if applicable)

## Step 9: PR Template

Create `.github/pull_request_template.md` using `ai-governance/templates/pr-checklist.md`.

## Completion Checklist

- [ ] Requirements documented with acceptance criteria (POL-001)
- [ ] ADR created for architecture decision (POL-002)
- [ ] Project scaffolded with lint/format/pre-commit (POL-004)
- [ ] Security headers + input validation configured (POL-006)
- [ ] Secret scanning enabled (POL-017)
- [ ] Health checks + structured logging (POL-007, POL-008)
- [ ] Tests running with coverage gate (POL-005)
- [ ] CI pipeline with all quality gates (POL-015)
- [ ] README + PR template complete (POL-011)
- [ ] Data classification annotations on models (POL-013)
- [ ] AI usage disclosure template available (POL-014)
