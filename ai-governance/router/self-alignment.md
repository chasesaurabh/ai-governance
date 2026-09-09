# Governance checkpoints and confirmed preferences

Use checkpoints at task start, before consequential actions, and at completion. Repeating the entire governance review on every conversational response is unnecessary.

1. Start: resolve action, risks, scope, project settings and applicable controls. Inspect affected files to confirm routing.
2. Before consequential actions: verify prerequisites, target and actual authorization. Workflow selection does not authorize deployment, communications, deletion or commits.
3. Completion: link each applicable control to evidence. Record passed, failed, not_run or not_applicable. Missing evidence cannot pass.

On errors, diagnose the observed failure, make a bounded correction and rerun the relevant check. After two unsuccessful attempts, report the evidence and blocker; request focused help. Do not repeat failed steps indefinitely or claim an unobserved fix.

For preferences, record only confirmed choices with scope, source and confirmation date. Example: scope `src/widgets/`; preference `match the existing test framework`; source `user confirmation`; date `YYYY-MM-DD`. Store them in the project's chosen instructions location. Do not persist speculative preferences or treat them as authorization. Project security controls are not learned preferences.

See EVIDENCE.md for structured records and exceptions. A validator checks record structure and declared results; it does not independently prove references, approvals or semantic compliance.
