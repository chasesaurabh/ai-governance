# Governance Compatibility Matrix

> How each governance control maps to enforcement mechanisms across AI coding tools.

## Architecture: Core + Adapters

```
┌─────────────────────────────────────────────────────────┐
│                    CORE (Tool-Agnostic)                  │
│  ai-governance/policies/   - 17 enforceable policies       │
│  ai-governance/templates/  - 7 reusable templates          │
│  ai-governance/kpis/       - measurable targets            │
│  ai-governance/red-team/   - bypass testing                │
│  ai-governance/router/     - auto-routing engine           │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │     AUTO-ROUTER         │
          │  Intent Detection →     │
          │  Workflow Selection →   │
          │  Announce → Execute     │
          └────────────┬────────────┘
                       │
       ┌───────────────┼───────────────────┐
       │               │                   │
  ┌────▼────┐   ┌──────▼──────┐   ┌───────▼──────┐
  │ IDE     │   │ CI/CD       │   │ VCS          │
  │ Adapters│   │ Enforcement │   │ Enforcement  │
  └─────────┘   └─────────────┘   └──────────────┘
  .windsurfrules  GitHub Actions   Branch protection
  .cursorrules    GitLab CI        CODEOWNERS
  CLAUDE.md       Jenkins          PR templates
  copilot-inst    CircleCI         Merge rules
  aider/conv      Azure DevOps     Required checks
```

### How to Adopt

**One-command install** (recommended):
```bash
npx ai-governance-setup
```

Or via shell script:
```bash
git clone https://github.com/chasesaurabh/ai-governance.git
cd AIGovernance && ./install.sh /path/to/your-project
```

Or manually:
1. **Copy `ai-governance/`** directory to your project (this is the core, includes router)
2. **Copy the auto-router file** for your AI tool (`.windsurfrules`, `.cursorrules`, `CLAUDE.md`, etc.)
3. **Just start typing** — the auto-router detects intent and triggers workflows automatically
4. **Configure CI/CD** enforcement per your pipeline tool
5. **Configure VCS** branch protection and PR templates
6. **Customize** policies to your organization's needs

See `install.sh --help` for all options including non-interactive mode.

---

## Auto-Router

The auto-router eliminates the need for users to manually select workflows. It analyzes every prompt and triggers the appropriate governance workflow automatically.

| Component | Location | Purpose |
|-----------|----------|---------|
| Router logic | `ai-governance/router/auto-router.md` | Core routing rules, announcement format, opt-out |
| Intent patterns | `ai-governance/router/intent-patterns.md` | Keyword/context patterns for 10 intent types |
| Windsurf rules | `.windsurfrules` | Always-active global rules with routing |
| Cursor rules | `.cursorrules` | Always-active global rules with routing |

**How it works:**
1. User types a natural language prompt
2. AI analyzes intent against signal patterns (keywords, context, file references)
3. AI announces the detected workflow: `📋 Detected: [Name] — Following: [policies]`
4. AI follows the workflow steps from `.windsurf/workflows/[workflow].md`

**Priority order:** Incident > Security > Bug Fix > Deploy > New Project > Add Feature > Refactor > Code Review > Commit > Clear Context

**Opt-out:** User says "skip governance" → AI proceeds without workflow, but still enforces hard security rules (POL-006, POL-017).

---

## Tool Adapter Locations

Each AI tool reads instructions from a specific file/directory:

| Tool | Auto-Router File | Workflow/Rules File | Format | Auto-loaded? |
|------|-----------------|-------------------|--------|-------------|
| **Windsurf** (Cascade) | `.windsurfrules` | `.windsurf/workflows/*.md` | Markdown | Yes, both always active |
| **Cursor** | `.cursorrules` | `.cursor/rules/*.md` | Markdown | Yes, both always active |
| **GitHub Copilot** | `.github/copilot-instructions.md` | (same file) | Markdown | Yes, always active |
| **Claude Code** | `CLAUDE.md` | (same file) | Markdown | Yes, always active |
| **Aider** | `.aider/conventions.md` | (same file) | Markdown | Yes, always active |
| **VS Code** (generic) | `.vscode/settings.json` | (settings) | JSON | Yes, workspace settings |
| **JetBrains** | `.idea/` AI config | Varies | Depends on plugin |

---

## Control-Level Enforcement Matrix

### Legend
- **IDE** = AI tool can enforce via instructions/rules
- **CI** = Automated pipeline check
- **PR** = PR template / branch protection
- **RT** = Runtime enforcement (production)
- ✅ = Fully enforceable | ⚡ = Partially enforceable | ❌ = Not enforceable at this layer

### POL-001: Requirements

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| Structured intake | ⚡ Prompts to ask | ⚡ Rules remind | ⚡ Instructions | ⚡ CLAUDE.md | ❌ | ✅ Template | ❌ |
| NFR specification | ⚡ Workflow guides | ⚡ Rules remind | ⚡ Instructions | ⚡ CLAUDE.md | ❌ | ✅ Template | ❌ |
| Threat pre-screen | ⚡ Workflow guides | ⚡ Rules remind | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Label check | ✅ Template | ❌ |

### POL-004: Coding Standards

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| Lint/format | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Lint stage | ✅ Required check | ❌ |
| Complexity limits | ⚡ Rules | ⚡ Rules | ❌ | ⚡ CLAUDE.md | ✅ Lint rules | ✅ Required check | ❌ |
| Dependency hygiene | ⚡ Rules | ⚡ Rules | ❌ | ⚡ CLAUDE.md | ✅ Audit stage | ✅ Required check | ❌ |
| Banned patterns | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Custom lint | ✅ Required check | ❌ |
| Code review | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Branch protection | ❌ |

### POL-005: Testing

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| Layered tests | ⚡ Workflow | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Test stages | ✅ Required checks | ❌ |
| Coverage gate | ❌ | ❌ | ❌ | ❌ | ✅ Coverage tool | ✅ Required check | ❌ |
| Contract tests | ⚡ Workflow | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Contract stage | ✅ Required check | ❌ |
| Mutation testing | ❌ | ❌ | ❌ | ❌ | ✅ Scheduled CI | ❌ | ❌ |

### POL-006: Security

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| SAST | ❌ | ❌ | ❌ | ❌ | ✅ SAST stage | ✅ Required check | ❌ |
| Input validation | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ SAST rules | ✅ Review checklist | ✅ WAF |
| Parameterized queries | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ SAST rules | ✅ Review checklist | ❌ |
| Security headers | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Integration tests | ❌ | ✅ Middleware |
| Secret scanning | ❌ | ❌ | ❌ | ❌ | ✅ Secret scanner | ✅ Pre-commit hook | ❌ |

### POL-013: Data Classification

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| Classification annotations | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Custom lint | ✅ Review checklist | ❌ |
| C3/C4 log prevention | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ SAST rules | ✅ Review checklist | ✅ Log scanner |
| AI data controls | ✅ Tool config | ✅ Tool config | ✅ Tool config | ✅ Tool config | ❌ | ❌ | ✅ AI proxy |

### POL-014: LLM Risk Controls

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| Hallucination detection | ⚡ Rules | ⚡ Rules | ❌ | ⚡ CLAUDE.md | ✅ Build + type check | ✅ Review checklist | ❌ |
| Prompt injection scan | ❌ | ❌ | ❌ | ❌ | ✅ Custom SAST | ✅ Review checklist | ❌ |
| AI usage disclosure | ⚡ Workflow | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Template check | ✅ PR template | ❌ |
| Tool allowlist | ✅ Network policy | ✅ Network policy | ✅ Network policy | ✅ Network policy | ❌ | ❌ | ✅ DNS/endpoint |
| Output review | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ❌ | ✅ Branch protection | ❌ |

### POL-017: Secrets Management

| Control | Windsurf | Cursor | Copilot | Claude Code | CI | PR | RT |
|---------|----------|--------|---------|-------------|----|----|-----|
| No secrets in code | ⚡ Rules | ⚡ Rules | ⚡ Instructions | ⚡ CLAUDE.md | ✅ Gitleaks | ✅ Pre-commit | ✅ Vault |
| Secret rotation | ❌ | ❌ | ❌ | ❌ | ✅ Rotation automation | ❌ | ✅ Secret manager |
| Audit logging | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Secret manager |

---

## Enforcement Coverage Summary

| Enforcement Layer | Policies Covered | Strength |
|------------------|-----------------|----------|
| **AI IDE rules** | All 17 (guidance level) | Advisory — AI follows instructions but can be overridden |
| **Pre-commit hooks** | POL-004, 006, 017 | Blocking — prevents commit locally |
| **CI pipeline** | POL-004, 005, 006, 007, 013, 014, 015, 017 | Blocking — prevents merge |
| **PR/Branch protection** | POL-001, 004, 005, 007, 012, 014 | Blocking — prevents merge without approval |
| **Runtime** | POL-006, 007, 008, 013, 017 | Blocking/Alerting — protects production |

### Defense in Depth

```
Layer 1: AI IDE Instructions    → Guides correct behavior at authoring time
Layer 2: Pre-commit Hooks       → Catches secrets and lint issues before commit
Layer 3: CI Pipeline             → Automated quality gates on every PR
Layer 4: PR Review + Templates   → Human verification with structured checklists
Layer 5: Deployment Gates        → Progressive rollout with automated rollback
Layer 6: Runtime Controls        → WAF, secret manager, monitoring, alerting
```

---

## Quick Setup Per Tool

### Windsurf
Copy `.windsurf/workflows/` to project. Workflows reference governance policies via relative paths.

### Cursor
Copy `.cursor/rules/governance.md` to project. Rules auto-loaded on every interaction.

### GitHub Copilot
Copy `.github/copilot-instructions.md` to project. Instructions auto-loaded in VS Code with Copilot.

### Claude Code
Copy `CLAUDE.md` to project root. Auto-loaded by Claude Code.

### Aider
Copy `.aider/conventions.md` to project. Auto-loaded by Aider.

### CI/CD (Any Tool)
Reference `ai-governance/policies/` in CI configuration. Implement enforcement gates per the matrix above.
