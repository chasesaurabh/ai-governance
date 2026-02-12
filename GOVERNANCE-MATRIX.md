# Governance Compatibility Matrix

> How each governance control maps to enforcement mechanisms across AI coding tools.

## Architecture: Core + Adapters

```
┌─────────────────────────────────────────────────────────┐
│                    CORE (Tool-Agnostic)                  │
│  ai-governance/policies/   - 17 enforceable policies       │
│  ai-governance/templates/  - 7 reusable templates          │
│  ai-governance/kpis/       - measurable targets            │
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
cd ai-governance && ./install.sh /path/to/your-project
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
| **Shared rules** | `ai-governance/GOVERNANCE-RULES.md` | **Single source of truth** — auto-router table, hard rules, self-alignment |
| Router logic | `ai-governance/router/auto-router.md` | Detailed routing rules, announcement format, opt-out |
| Intent patterns | `ai-governance/router/intent-patterns.md` | Keyword/context patterns for 10 intent types |

**How it works:**
1. User types a natural language prompt
2. AI loads shared rules from `ai-governance/GOVERNANCE-RULES.md` (if not already loaded)
3. AI analyzes intent against signal patterns (keywords, context, file references)
4. AI announces the detected workflow: `📋 Detected: [Name] — Following: [policies]`
5. AI reads and follows the relevant policy files or workflow steps

**Priority order:** Incident > Security > Bug Fix > Deploy > New Project > Add Feature > Refactor > Code Review > Commit > Clear Context

**Opt-out:** User says "skip governance" → AI proceeds without workflow, but still enforces hard security rules (POL-006, POL-017).

---

## Tool Adapter Architecture: Shared Rules + Tool-Specific

Each adapter file references the shared `ai-governance/GOVERNANCE-RULES.md` and adds only tool-specific behavioral instructions. This eliminates duplication while making instructions realistic for each tool's actual capabilities.

| Tool | Adapter File | Reads Shared Rules? | Workflow System | Key Capabilities |
|------|-------------|-------------------|-----------------|-----------------|
| **Windsurf** (Cascade) | `.windsurfrules` | Yes, via `read_file` tool | `.windsurf/workflows/*.md` | File editing, terminal, browser preview, memories |
| **Cursor** | `.cursorrules` + `.cursor/rules/governance.md` | Yes, via file reading | Policy-based (no workflow files) | Composer, Chat, inline edit, `@` mentions |
| **Claude Code** | `CLAUDE.md` | Yes, via Read tool / cat | Policy-based (no workflow files) | File I/O, bash commands, CLAUDE.md tree |
| **GitHub Copilot** | `.github/copilot-instructions.md` | No (hard rules inline) | Conversational guidance | Inline completions, Copilot Chat, `@workspace` |
| **Aider** | `.aider/conventions.md` | No (hard rules inline, `/add` for full rules) | `/add` to load policies | Git-aware auto-commit, `/run`, `/test`, `/architect` |

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

All tools require the core: `ai-governance/` directory (includes `GOVERNANCE-RULES.md`, policies, templates, router).

### Windsurf
Copy `.windsurfrules` + `.windsurf/workflows/` to project. Cascade auto-loads rules and uses `read_file` to load shared governance rules and workflow files on demand.

### Cursor
Copy `.cursorrules` + `.cursor/rules/governance.md` to project. Rules auto-loaded on every interaction. Cursor reads shared governance rules via file reading capabilities.

### GitHub Copilot
Copy `.github/copilot-instructions.md` to project. Auto-loaded in VS Code with Copilot. Hard rules are inline since Copilot cannot autonomously read other files.

### Claude Code
Copy `CLAUDE.md` to project root. Auto-loaded by Claude Code. Reads shared governance rules via Read tool on session start.

### Aider
Copy `.aider/conventions.md` to project. Auto-loaded by Aider. Hard rules inline; users can `/add ai-governance/GOVERNANCE-RULES.md` for full rules.

### CI/CD (Any Tool)
Reference `ai-governance/policies/` in CI configuration. Implement enforcement gates per the matrix above. See `examples/ci/` for ready-to-use templates.
