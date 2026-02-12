# AI Governance Framework

Governance policies for teams using AI coding assistants. Drop into any repo, works automatically.

AI coding tools generate code fast — but without guardrails, they skip tests, hardcode secrets, ignore security, and hallucinate APIs. This framework makes your AI assistant follow your team's engineering standards by default.

**You type naturally. The AI follows governance automatically.**

## Install

Run this in your project:

```bash
npx ai-governance-setup
```

The setup wizard asks which AI tools you use, then installs the core policies and selected adapters. Use `--all` or `--core-only` flags for non-interactive mode (see `install.sh --help`).

<details>
<summary>Alternative: shell script</summary>

```bash
git clone https://github.com/chasesaurabh/ai-governance.git
cd ai-governance && ./install.sh /path/to/your-project
```

Non-interactive: `./install.sh --all /path` · `./install.sh --tools windsurf,cursor /path` · `./install.sh --core-only /path`
</details>

## How It Works

The framework includes an **auto-router** that reads your prompt, detects what you're trying to do, and applies the right governance workflow. No setup, no slash commands needed.

| You type | AI does |
|----------|---------|
| "The login page is broken" | Bug fix workflow: reproduce → root cause → regression test → fix |
| "Add user authentication" | Feature workflow: TDD, security gates, code review |
| "Deploy to production" | Deploy workflow: progressive rollout, all gates |
| "Site is down!" | Incident response: immediate triage, no questions asked |
| "Is this SQL safe?" | Security review: injection checks, parameterized queries |
| "Refactor this" | Refactor workflow: tests first, then simplify |

## Supported Tools

Each tool gets instructions tailored to how it actually works — not copy-pasted generic prompts.

| Tool | Adapter | How Governance Works |
|------|---------|---------------------|
| **Windsurf** (Cascade) | `.windsurfrules` | Loads shared rules via `read_file`, executes `.windsurf/workflows/`, uses Cascade Memories |
| **Cursor** | `.cursorrules` | Loads shared rules, mode-specific guidance (Composer / Chat / Inline) |
| **Claude Code** | `CLAUDE.md` | Loads shared rules via Read tool, CLI commands, bash verification |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Self-contained rules (can't auto-read files), Copilot Chat + `@workspace` |
| **Aider** | `.aider/conventions.md` | Self-contained rules, `/add` to load policies, git-aware auto-commit |

## What's Included

- **17 policies** — requirements, architecture, testing, security, deployment, incident response, secrets, and more
- **Shared governance rules** — single source of truth referenced by all tool adapters (no duplication)
- **Tool-specific adapters** — each adapter is tailored to the tool's real capabilities
- **7 templates** — PR checklist, definition of done, ADR, threat model, AI usage disclosure
- **Auto-router** — detects intent, triggers the right workflow, zero config
- **KPIs** — measurable targets for every policy area
- **Works on** Windows, Mac, and Linux

Each policy has an objective, enforceable controls, evidence artifacts, an owner, and an exception path. See `ai-governance/INDEX.md` for the full navigation guide.

## Enforcement Model

Adapters provide guidance and auto-routing behavior, but **enforcement ultimately depends on the tool, team discipline, and CI gates**.

| Layer | Role |
|-------|------|
| **AI IDE adapters** | Advisory — guides correct behavior at authoring time |
| **Pre-commit hooks** | Blocking — catches secrets and lint issues locally |
| **CI pipeline** | **Enforcement** — SAST, coverage gates, dependency scanning on every PR |
| **PR review + templates** | Human verification with structured checklists |
| **Runtime controls** | WAF, secret managers, monitoring, alerting |

IDE rules guide. CI gates enforce. See `GOVERNANCE-MATRIX.md` for full enforcement mapping and `examples/ci/` for ready-to-use pipeline templates.

## After Install

1. **Start coding** — governance loads automatically in your AI tool
2. **Customize** policies in `ai-governance/policies/` to fit your team (optional)
3. **Set up CI enforcement** — use templates in `examples/ci/` to wire governance into your pipeline (recommended)
4. **Commit** the governance files to your repo

## Contributing

See `CONTRIBUTING.md`.
