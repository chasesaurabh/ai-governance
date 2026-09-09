# AI tool integrations

Initialize selected repository adapters with `ai-governance init --tools claude,cursor,copilot,devin`. Devin receives AGENTS.md; existing instructions are preserved through managed blocks. Copilot gets a repository entry and scoped security instructions. Cursor gets a valid MDC rule. These instructions call the same CLI and do not certify host activation.

After installing the runtime locally, optionally run `ai-governance hooks --tools claude,cursor --dry-run`, then without dry-run to apply. Claude uses UserPromptSubmit; Cursor uses sessionStart. Existing settings and other hooks are retained. `hooks --tools claude,cursor --remove` removes only unchanged owned entries; edited entries are preserved for manual review. Hooks call the local Node runtime without npx or downloads. They perform read-only Git inspection and inject a short category summary; they never execute configured checks or store prompt text. Ensure the host runs hooks in the project root. Commands require Node on PATH and the pinned local dependency.

For Devin Cloud, install the pinned npm runtime in its configured repository environment as well as on the developer machine. Commit AGENTS.md and repository configuration; local Git metadata trust/results do not transfer to a cloud environment. Have the operator approve the execution scope there. No cloud account configuration or session creation is performed by this installer.

Activation verification: launch a fresh session in each selected host; ask it to identify applicable governance and inspect a representative change. Check its actual response/tool logs. Installed files and protocol fixture tests alone do not prove the live host loaded them. No live account sessions were run as part of these implementation tests.

References checked September 2026:
- Claude: https://code.claude.com/docs/en/hooks
- Cursor: https://prod.cursor.com/docs/hooks
- Copilot: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
- Devin: https://docs.devin.ai/onboard-devin/agents-md
