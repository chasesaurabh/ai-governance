# First useful check

Use a Git project with Node.js 22 or newer. Preview installation, then install the adapters you use and the exact local runtime:

```bash
npx ai-governance-setup@3.0.0 --tools copilot,claude,cursor,devin --dry-run .
npx ai-governance-setup@3.0.0 --tools copilot,claude,cursor,devin --save-dev .
npx ai-governance check
```

In a non-Node repository, manage the npm runtime in a dedicated tooling directory or install the exact package globally. Do not add a package manifest to your application solely for this example unless that fits your tooling conventions.

For a quick demonstration, change a dependency in package.json without updating its lockfile. The check should explain DEP-001. Restore that demonstration edit or update the dependency normally with your package manager. Run `npx ai-governance explain DEP-001` for the rule's rationale.

Review detected commands in governance.config.json. Discovery does not prove they work. After reviewing repository scripts, authorize and run a configured test command:

```bash
npx ai-governance trust --accept
npx ai-governance run --checks test
npx ai-governance summary
```

If no test command was detected, configure your actual command first. A successful process exit is machine evidence; human reviews remain separate. Edit source and request another summary to see previous results become stale. Use `run --force` when ignored files, environment variables or external dependencies change.

Before opening a PR, run `check --base origin/main` (using your repository's actual base branch), run relevant configured checks, and copy the summary into the PR. Commit the generated instructions, configuration, installation manifest and dependency lockfile after reviewing them.

For optional Claude/Cursor context hooks, see [integrations](INTEGRATIONS.md).
