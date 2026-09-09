# Release and compatibility

Version 2 requires Node.js 22 or newer. It adds the ai-governance runtime binary; v1 only exposed setup. Existing adapter files are integrated through managed blocks. Customized legacy core files need manual reconciliation. Preview upgrades first.

Publishing: configure npm's trusted publisher for this repository and `.github/workflows/release.yml`, and configure the `npm-release` GitHub environment with the desired reviewers. Push a reviewed tag exactly matching package.json, such as v2.0.0. The workflow verifies, tests the archive and publishes through OIDC. Do not reuse an already published version. See https://docs.npmjs.com/trusted-publishers/ for npm account setup. Repository code alone cannot configure account ownership or grant publishing rights.

For persistent use in a Node project, setup accepts `--save-dev` and installs the exact framework version with lifecycle scripts disabled. Use `npx ai-governance` thereafter. An npm install still performs registry access and updates package/lock files. Existing npm proxy, registry and certificate configuration is respected; no custom network bypass is used. In other stacks, use a user-managed npm installation or a dedicated tooling directory. After dependencies are installed, local runtime commands work offline except explicitly configured network checks.

`ai-governance-setup uninstall --dry-run <project>` previews removal. Uninstall removes only unchanged tracked framework files and unmodified managed blocks. User text, edited files, configuration and evidence survive. Remove the development dependency separately. There are no package install lifecycle scripts, telemetry, accounts or administrator requirements in the runtime. Checks do not upload source or prompts. Explicit npm installation/publishing and user-configured checks may access the network.

Publishing has not occurred merely because a release tag/workflow exists; verify npm's dist-tag and version after a successful workflow.
