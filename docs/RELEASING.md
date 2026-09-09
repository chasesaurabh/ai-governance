# Version 2.0.2 runtime refresh

Use the latest Node 24 LTS patch for development and publishing; .nvmrc selects the 24 line. Node 22 remains supported from 22.13.0, and CI also covers the latest Node 26 Current release. Node 20 and 25 are end-of-life as of this review. The framework does not change the Node installation on your machine. See the [official release schedule](https://nodejs.org/en/about/previous-releases), checked 2026-09-09.

Inquirer 14.2.2 is the only direct npm dependency; its transitive dependencies are refreshed within upstream constraints. Optional TypeScript peer dependencies are not needed by this JavaScript package. CI actions are updated to checkout 7.0.1, setup-node 7.0.0, CodeQL 4.38.0 and Gitleaks 3.0.0. Consumers of the example workflows using self-hosted runners must meet those actions' current runner requirements.

# Version 2.0.1 update

Version 2.0.1 supports `devin`, `cursor`, `copilot`, `claude` and `aider`. Select `--tools devin` to install AGENTS.md. Shared task workflows live in ai-governance/workflows/.

Installation preserves existing files and user edits. Manifest entries for adapters outside the supported set do not prevent selecting current adapters; their tracked files remain available to doctor and safe uninstall. Preview the update and review the resulting files before committing.

# Release and compatibility

Version 2 requires Node.js 22.13+ or 24+ (24 LTS recommended). It adds the ai-governance runtime binary; v1 only exposed setup. Existing adapter files are integrated through managed blocks. Customized legacy core files need manual reconciliation. Preview upgrades first.

Publishing: configure npm's trusted publisher for this repository and `.github/workflows/release.yml`, and configure the `npm-release` GitHub environment with the desired reviewers. Push a reviewed tag exactly matching package.json, such as v2.0.2. The workflow verifies, tests the archive and publishes through OIDC. Do not reuse an already published version. See https://docs.npmjs.com/trusted-publishers/ for npm account setup. Repository code alone cannot configure account ownership or grant publishing rights.

For persistent use in a Node project, setup accepts `--save-dev` and installs the exact framework version with lifecycle scripts disabled. Use `npx ai-governance` thereafter. An npm install still performs registry access and updates package/lock files. Existing npm proxy, registry and certificate configuration is respected; no custom network bypass is used. In other stacks, use a user-managed npm installation or a dedicated tooling directory. After dependencies are installed, local runtime commands work offline except explicitly configured network checks.

`ai-governance-setup uninstall --dry-run <project>` previews removal. Uninstall removes only unchanged tracked framework files and unmodified managed blocks. User text, edited files, configuration and evidence survive. Remove the development dependency separately. There are no package install lifecycle scripts, automatic telemetry, accounts or administrator requirements in the runtime. Checks do not upload source or prompts. Explicit npm installation/publishing and user-configured checks may access the network.

Publishing has not occurred merely because a release tag/workflow exists; verify npm's dist-tag and version after a successful workflow.
