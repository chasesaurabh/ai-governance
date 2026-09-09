# Two-week self-service pilot

Recruit 5–10 consenting developers across two teams. Include Copilot, Claude Code, Cursor and Devin. No invitations or user sessions are created by the framework. Live participation and activation must be observed by the team; synthetic tests are not adoption evidence.

1. Pick a normal repository and record the framework version, tool and team rollout stage.
2. Optionally enable local metrics before onboarding with `ai-governance pilot-start --tool cursor` (other values: copilot, claude, devin).
3. Run init preview, review the inferred commands, and complete setup. Record any help needed with `pilot-help`.
4. Use check on real feature, bugfix and PR work. Do not introduce deliberately unsafe changes into production projects just to get findings.
5. Mark actionable findings with `pilot-feedback --rule TEST-001 --rating useful`; use dismissed for irrelevant feedback. Avoid submitting personal information or code.
6. Run `pilot-report` after one and two weeks. Export its stdout only if the developer agrees to share it. No automatic uploads occur. `pilot-stop` stops future collection.

Metrics: first check, first self-reported useful finding, active days, second-week use, setup help requests, useful/dismissed feedback and average check latency. Records contain a random participant ID, selected tool, timestamps and numeric/categorical metrics; no repository path, source, prompt or raw command output. They live under the Git metadata directory in ai-governance/pilot.json and retain at most 1000 events. Remove that exact file if the participant wants to erase their local history.

The report is scoped to one local repository, not an organization-wide retention measure. A developer using multiple repositories has separate records. Collect matching participant/time windows before computing team-level percentages. Ask separately about PR preparation time and whether developers would keep the tool enabled; do not infer time savings from command counts.

Suggested pilot targets (hypotheses, not achieved results): first useful result within two minutes for supported fixtures; few setup interventions; most participating developers return in week two; fewer dismissed than useful findings; no disruptive full-suite runs on ordinary edits. Review actual results before imposing blocking gates.

Live host checklist: verify the repository adapter is loaded, verify optional hooks through host logs, verify a deliberately failing local test remains failed, and verify no permissions are silently broadened. Devin's runtime and trust are configured in its execution environment, independently of the developer machine.
