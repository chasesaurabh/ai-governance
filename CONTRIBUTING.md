# Contributing to AI Governance Framework

## How to Use This Framework

### For Your Projects

1. **Copy to your project**: Copy the `ai-governance/` directory and relevant config files to your project root
2. **Customize**: Adapt the governance documents to your team's needs
3. **Use workflows**: Reference the workflows via slash commands in your AI coding assistant

### Improving This Framework

1. **Report issues**: Open an issue for unclear guidance or missing scenarios
2. **Suggest improvements**: PRs welcome for better practices
3. **Add examples**: Real-world examples help everyone

## Framework Structure

```
AIGovernance/
├── ai-governance/              # Core governance (policies, templates, router)
│   ├── policies/               # 17 enforceable policies (POL-001 to POL-017)
│   ├── templates/              # 7 reusable templates
│   ├── router/                 # Auto-routing engine + self-alignment
│   ├── kpis/                   # Measurable targets
│   └── INDEX.md                # Navigation guide
├── .windsurf/workflows/        # 10 Windsurf workflows (ADAPTER)
├── .windsurfrules              # Windsurf auto-router (ADAPTER)
├── .cursorrules                # Cursor auto-router (ADAPTER)
├── .cursor/rules/              # Cursor rules (ADAPTER)
├── .github/                    # GitHub Copilot instructions (ADAPTER)
├── .aider/                     # Aider conventions (ADAPTER)
├── CLAUDE.md                   # Claude Code instructions (ADAPTER)
├── examples/                   # Evaluable workflow demos + CI templates
│   ├── feature.md              # Feature workflow walkthrough
│   ├── bugfix.md               # Bug fix workflow walkthrough
│   ├── security-review.md      # Security review walkthrough
│   ├── incident.md             # Incident response walkthrough
│   ├── router-tests.md         # 50-prompt router validation suite
│   └── ci/                     # CI/CD enforcement templates
│       ├── github-actions/     # GitHub Actions governance gates
│       └── azure-devops/       # Azure DevOps governance gates
├── GOVERNANCE-MATRIX.md        # Tool compatibility matrix
├── CHANGELOG.md                # Version history and change log
└── README.md
```

## Governance File Guidelines

When adding or modifying governance files:

1. **Scope appropriately**: Each file should cover one phase/topic
2. **Be practical**: Focus on what helps ship software
3. **Include checklists**: Actionable items are more useful than prose
4. **Add AI instructions**: Each file should have guidance for AI assistants
5. **Link to related files**: Help users navigate between documents

## Workflow Guidelines

When adding workflows:

1. **Follow the format**:
   ```markdown
   ---
   description: Short description for the workflow list
   ---
   
   # Workflow Title
   
   Steps...
   ```

2. **Reference governance files**: Workflows should use the governance docs
3. **Mark safe commands**: Use `// turbo` for commands safe to auto-run
4. **Include verification steps**: Each workflow should verify completion

## Principles

- **Tool-agnostic core**: Governance files should work with any AI assistant
- **Native integrations**: Workflows leverage each tool's specific features
- **Practical over theoretical**: Focus on real developer workflows
- **Composable**: Documents can be combined for complex tasks
