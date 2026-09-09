# Contributing

The repository has two layers: the detailed human policy library and a compact execution catalog. Runtime controls are a curated subset, not a complete encoding of the enterprise policies.

## Source of truth

- `ai-governance/controls.json`: control IDs, applicability, requirements, verification, evidence and exception eligibility.
- `lib/config.js`: validated profiles, project settings and precedence.
- `lib/router.js`: executable routing patterns and risk detection.
- `lib/workflows.js`: bounded action steps.
- `lib/packet.js`: applicable controls and compact task instructions.
- `lib/evidence.js`: declared results, task binding, exceptions and metrics.
- `lib/installer.js`: installation planning, managed blocks, manifests and doctor.
- `scripts/generate.js`: shared runtime, adapters, workflow and routing reference generation.

Edit these sources and run `npm run generate`. Do not hand-edit generated files. Consumer projects should keep overrides in `governance.config.json`; catalog extensions are maintained in this source repository and distributed with a versioned package.

## Validation

Run `npm ci`, then `npm run check` and `npm run test:package`. The first runs regression tests, generated drift detection and instruction budgets. The second installs a package archive into an isolated temporary project and exercises its binaries. It requires npm registry access for dependencies.

Add behavioral tests for routing changes, unsafe input, upgrades, missing evidence and exception handling. Add held-out model evaluations before asserting low-reasoning reliability. Include negative prompts and scoped risk paths.

CI defines Windows/Linux and Node 22/24 runs. A local pass does not establish remote CI status. Line-ending attributes preserve portable scripts.

## Extending controls

Use existing policy control IDs and reference the correct source. Add concise requirements with observable verification and evidence. Security-floor controls must remain errors and cannot have exceptions. Keep project-type conditions explicit; HTTP-specific requirements should not apply to a CLI. Unknown configuration must fail validation.

Full policy documents retain broader organizational guidance. Runtime profiles may resolve different thresholds; document that relationship rather than asking a model to reconcile competing runtime instructions.

## Package and release

The package allowlist includes runtime modules, controls, adapters, workflows and CI examples. Source-only evaluations and tests run in this development checkout. Packaging tests verify local-only files are absent. Publishing and remote pushes are separate release actions.
