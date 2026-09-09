# Current tools and model selection

Verified against official documentation on **2026-09-09**. This is a dated reference, not an automatic inventory of your account. Model availability depends on the host version, provider, plan, region and organization settings. The governance runtime does not select models or call provider APIs.

| Tool | Current reference | How to select and record it |
|---|---|---|
| Claude Code | Anthropic API aliases currently resolve to Opus 5 and Sonnet 5. Fable 5.1 is available through the `fable` alias with provider/gateway exceptions; `haiku` remains a supported family alias. | Use `/model` or `claude --model`. Record the actual model ID and effort. Aliases change, and other providers can resolve to different versions. [Model configuration](https://code.claude.com/docs/en/model-config) |
| Cursor | The current catalog includes Composer 2.5, Grok 4.6/4.5, Claude Sonnet 5, Opus 5 and Fable 5.1, alongside other providers. Teams/Enterprise Auto uses Cursor Router with Cost, Balance or Intelligence modes. | Check the model selector and organization restrictions. Record the explicit model or Auto mode; record the resolved model only when exposed. [Models and pricing](https://cursor.com/docs/models-and-pricing) |
| Devin Desktop | Current Desktop documentation lists SWE-1.7 alongside Claude and GPT families. Desktop can host different agents; an agent's capabilities depend on that selection. | Check the selected agent and its model picker. Desktop availability does not establish an identical Cloud model catalog. [Desktop models](https://docs.devin.ai/desktop/models), [Desktop](https://devin.ai/desktop) |
| Devin CLI | Supports Adaptive routing and model-family aliases such as `swe`, `opus` and `sonnet`; aliases follow current family versions. | Use `/model` or `devin --model`. Some models expose thinking levels through Alt+T (Opt+T on macOS). Enterprise settings can restrict availability. [CLI models](https://docs.devin.ai/cli/models) |

For reproducible comparisons, record the date, host version, provider, exact model ID where exposed, effort, routing mode and tool permissions. Use `unknown` for undisclosed routing outcomes. Do not compare a model-family alias as if it were an immutable version. Follow the [evaluation protocol](https://github.com/chasesaurabh/ai-governance/blob/main/eval/README.md) before claiming better low/medium-reasoning performance.

## Instructions and execution

Devin uses `AGENTS.md` to reference the shared runtime and relevant task workflows. CLI documentation recommends compact rules; Cloud also supports repository `AGENTS.md`. Verify loading in the selected agent. [CLI rules](https://docs.devin.ai/cli/extensibility/rules), [Cloud instructions](https://docs.devin.ai/onboard-devin/agents-md).

Claude Code hooks use `UserPromptSubmit`; Cursor hooks use `sessionStart`. These installed hooks supply advisory context. They do not enforce governance gates. See [integration setup](INTEGRATIONS.md) and the official [Claude hooks](https://code.claude.com/docs/en/hooks) and [Cursor hooks](https://cursor.com/docs/hooks) references.

## Enterprise data review

- **Claude Code:** commercial terms generally exclude training unless the customer opts in; consumer settings and third-party deployments differ. Review the actual account and retention terms. [Data usage](https://code.claude.com/docs/en/data-usage).
- **Cursor:** Privacy Mode prevents training, but model-specific retention exceptions still need review. Fable models require retention approval in the documented protected account configurations. Cloud Agents also require repository access and storage. [Privacy and data governance](https://cursor.com/docs/enterprise/privacy-and-data-governance).
- **Devin:** review Cognition Data Controls and provider retention. Paid-plan training opt-out and Enterprise contract protections differ; a local interface alone does not mean local inference. [Security and data controls](https://docs.devin.ai/admin/security).

Review these official pages before each release and when changing the approved model catalog. Keep volatile pricing, model lists and plan entitlements in this human reference rather than adding them to every model's task context.
