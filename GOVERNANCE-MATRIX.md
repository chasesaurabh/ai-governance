# Tool compatibility and enforcement

The framework separates host adapters, generated task instructions, project settings and actual enforcement. Avoid assumptions about a tool's capabilities based on its name alone; modes and versions differ.

| Host | Installed files | Capability fallback |
|---|---|---|
| Claude Code | CLAUDE.md | Read shared runtime; use only available tools; never invent verification |
| Cursor | .cursor/rules/governance.mdc, compatibility pointers | MDC entry loads shared runtime; check activation in the host |
| Windsurf | .windsurfrules, .windsurf/workflows/ | Shared workflow definitions; authorized actions only |
| Copilot | .github/copilot-instructions.md | If files cannot be loaded, provide the relevant workflow explicitly |
| Aider | .aider/conventions.md | Attach conventions and shared runtime; setup does not modify Aider launch arguments |

Cursor project rules use `.mdc` with frontmatter; plain `.md` rule files are ignored by that system. Source: [Cursor rule documentation](https://prod.cursor.com/docs/rules), checked September 2026. Generated-file and installation checks confirm file layout, not actual activation inside external hosts.

| Layer | What it establishes | What it does not establish |
|---|---|---|
| Catalog and configuration validation | Known controls, valid thresholds, protected floor | Complete compliance with all 17 policy documents |
| Router and packet generation | Reproducible action selection and applicable instructions | Perfect understanding of arbitrary language or code risk |
| Adapter instructions | Guidance for available tool capabilities | Blocking enforcement or guaranteed model adherence |
| Evidence validation | Complete declared statuses and scoped, current exceptions | Authenticity of approvals or correctness of linked artifacts |
| Project CI | Actual checks configured by the team | Controls the team has not implemented |
| Human review | Contextual evaluation and approval | Automatic proof from a filled checklist |

## Adoption checks

1. Preview installation; review conflicts and existing managed blocks.
2. Confirm the host can identify the shared runtime and relevant workflow.
3. Resolve one representative task and inspect action, risks, commands and controls.
4. Verify a deliberately failing project check blocks the configured pipeline.
5. Verify missing task evidence fails evidence-check.

Keep tool instructions short. Do not load the entire policy library on every prompt. Do not describe advisory checks as blocking. The Azure example enables dependency auditing; its optional SAST step must be enabled separately. GitHub's AI disclosure check is advisory. Required gate results must be success; cancellation and unexpected skips are not success.
