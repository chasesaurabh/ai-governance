# AI Governance Framework

Governance policies for teams using AI coding assistants. Drop into any repo, works automatically.

AI coding tools generate code fast — but without guardrails, they skip tests, hardcode secrets, ignore security, and hallucinate APIs. This framework makes your AI assistant follow your team's engineering standards by default.

**You type naturally. The AI follows governance automatically.**

## Install

Run this in your project:

```bash
npx ai-governance-setup
```

<details>
<summary>Alternative: shell script</summary>

```bash
git clone https://github.com/<org>/AIGovernance.git
cd AIGovernance && ./install.sh /path/to/your-project
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

| Tool | Auto-loads? |
|------|------------|
| **Windsurf** (Cascade) | Yes — 10 workflows + auto-router |
| **Cursor** | Yes — rules + auto-router |
| **GitHub Copilot** | Yes |
| **Claude Code** | Yes |
| **Aider** | Yes |

## What's Included

- **17 policies** — requirements, architecture, testing, security, deployment, incident response, secrets, and more
- **7 templates** — PR checklist, definition of done, ADR, threat model, AI usage disclosure
- **Auto-router** — detects intent, triggers the right workflow, zero config
- **KPIs** — measurable targets for every policy area
- **Works on** Windows, Mac, and Linux

Each policy has an objective, enforceable controls, evidence artifacts, an owner, and an exception path. See `ai-governance/INDEX.md` for the full navigation guide.

## After Install

1. **Start coding** — governance loads automatically in your AI tool
2. **Customize** policies in `ai-governance/policies/` to fit your team (optional)
3. **Commit** the governance files to your repo

## Contributing

See `CONTRIBUTING.md`.
