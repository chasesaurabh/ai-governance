# Project configuration

Copy `ai-governance/config.example.json` to `governance.config.json` in your project root. Fill in commands you have verified in that project. Validate with `ai-governance check-config .` (or `npx --package ai-governance-setup ai-governance check-config .`).

Precedence: protected security controls → profile minimums → explicit project settings → defaults. Unknown fields and controls are errors. Host and user authorization still govern tool actions; project configuration does not grant new permissions.

| Setting | Meaning |
|---|---|
| profile | starter: 60% coverage, 1 reviewer; team: 80%, 1; regulated: at least 90%, 2 |
| projectType | library (default), cli, web, service; HTTP-only controls apply to web/service |
| execution | standard or guided; guided adds scaffolding without reducing safeguards |
| commands | test, lint, build, coverage, secrets, sast, audit; null/missing means unavailable, never success |
| thresholds | coverage percentage, reviewer count, functionLines hard limit, complexity hard limit |
| riskPaths | Relative path prefixes per risk: security, data, migration, production, api, dependencies. No wildcard syntax |
| overrides | Control ID → severity: error or warning. Protected controls cannot be weakened; regulated controls remain errors |

Commands are trusted project configuration for display in task instructions, not automatically executed by this CLI. Review project configuration before using its commands. Configure coverage commands to enforce the threshold, not merely print a report.

`controls.json` is the source for the compact execution layer. It currently curates 28 controls across all 17 policies. It is not a complete encoding of the organizational policy library or a compliance certification. Teams adopting the complete enterprise policies must also assess their remaining controls. Profile settings intentionally resolve runtime thresholds and applicability; use the detailed policies for rationale and organizational requirements, not as a second competing runtime instruction set.

Applicability uses (matching action OR matching risk), AND matching project type when specified. Empty action/risk lists mean always applicable. Read-only tasks retain the security baseline without implementation checklists. A project-specific review may identify additional controls; expand the task context and regenerate rather than silently omitting them.

Keep project customizations in `governance.config.json` so upstream policy updates can be installed without overwriting preferences. No inferred preference should alter a security control. Record confirmed preferences with scope, source and date; session guesses are not durable rules.
