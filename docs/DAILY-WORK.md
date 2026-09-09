# Everyday workflow

Run `ai-governance inspect --project .` to see detected stacks and commands. `init --project . --dry-run` previews configuration and adapters; omit dry-run to apply. Existing configuration is preserved. Add `--tools claude,cursor,copilot` or `--save-dev` when desired. Suggested commands require review and installed tools; discovery never executes them. Workspace scanning is bounded to depth three and 500 directories, skipping dependencies and hidden directories.

Use `ai-governance check --staged` before a commit or `check --base origin/main` before a PR. Without either option, check includes staged, unstaged and untracked nonignored files. Base compares with the merge base and includes current working-tree changes. Findings describe review needs, not proven defects. `explain DEP-001` explains a finding. JSON output is available. File-level paths identify findings; the checker does not yet perform AST analysis or substitute for scanners.

Review governance.config.json and repository code, then run `ai-governance trust --accept`. This authorizes configured shell commands in that repository; these commands can run repository code and access credentials/network just like manually running tests. Configuration changes require renewed trust. Trust is not a sandbox and does not mean every future source change is safe.

`ai-governance run --checks test,lint --timeout 120000` executes selected configured checks. Omit checks to run all configured commands. Ctrl+C cancels; timeouts terminate the process tree. No stdin is provided. Missing commands are errors, never success. Output is consumed and hashed without retaining text, preventing raw logs from entering local evidence. Review existing project reports or rerun a failed command manually for diagnostics. Executor version, duration and exit status are retained.

Successful results can be reused only when HEAD, index, nonignored tracked/untracked source and effective configuration match. Checks that mutate source produce stale evidence. Ignored files, nested submodule working trees, environment variables and external services are outside the fingerprint; use `--force` when those inputs change. Verification runs against the working tree, not an isolated staged checkout.

`ai-governance summary` prints a PR-ready verification summary for the current tree. A passing process exit does not prove semantic correctness or human approval. Test-runner versions and full report contents should be verified in project reports; only executor versions are collected automatically. Machine observations remain separate from the existing human-declared control evidence API.

Trust and observations live in the repository's Git metadata directory, under ai-governance/. Nothing is uploaded. CLI process failures return nonzero; check findings are advisory until an explicit enforcement mode is configured.
