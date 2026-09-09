# Organization packs and staged adoption

A pack is an npm package containing `package.json` with an exact version and a data-only `governance-pack.json`. Install it using your approved registry and `--ignore-scripts`, then reference its local path in project configuration. The framework never imports package JavaScript, executes pack scripts or fetches packs automatically.

Example governance-pack.json:

```json
{
  "schemaVersion": 1,
  "owner": "Platform Engineering",
  "escalation": "team/security",
  "config": { "profile": "team", "mode": "assist", "thresholds": { "coverage": 85 }, "requiredChecks": ["test"], "owners": { "default": "Platform Engineering" } },
  "minimums": { "coverage": 85, "reviewers": 1 },
  "protectedControls": ["CTRL-004.1"]
}
```

Project configuration uses `"packs": [{"path":"node_modules/@example/policy","version":"1.0.0"}]`. Run `ai-governance pack-lock` to inspect the proposed version/content digest; use `pack-lock --write` after review. Commit the resulting governance.packs.lock.json. Version mismatches or changed package metadata/policy bytes are rejected until the new lock is explicitly reviewed. Review pack content and lock diff together; a hash alone does not establish trust in its publisher. Symbolic-link packs and traversal paths are rejected. Pin package-manager resolution as well as the policy lock.

Precedence: pack defaults in listed order, repository settings, then matching scopes from broad to narrow. Organization minimums, protected control severity, required checks and minimum enforcement mode survive overrides. The framework's security floor always remains. Unknown fields fail validation. Nested packs/scopes inside pack defaults are unsupported.

Add package-specific settings with `"scopes": [{"path":"packages/api","config":{"commands":{"test":"npm test"}}}]`. Use `check`, `trust`, `run` and `summary` with `--scope packages/api`. Commands run from that directory; evidence and trust are stored per scope. Use explicit scope selection for monorepos: the tool does not guess which package's test command should run. Review overlapping scopes, and put shared scope-wide requirements in an organization pack.

Modes: discover reports findings; assist adds actionable guidance using the same nonblocking checks; enforce returns nonzero for nonbaselined error findings or required checks without current passing observations. Assist does not silently rewrite code. Configuration errors always fail. Human approvals are not proven by this gate.

Use `baseline --base origin/main` to preview existing findings and add `--write` to save governance.baseline.json. A baseline only covers the inspected change set, not an exhaustive audit of unchanged repository code. Entries are bound to rule and file content; changes invalidate them. Auth, CI and migration findings cannot be baselined. Baseline updates need team review in Git; local settings remain editable by developers, so mandatory enforcement belongs in protected CI.

For team rollout, start in discover, review false positives and missing tools, then configure requiredChecks and enforce. These are explicit gates over observed command exits, not a complete organizational compliance score.
