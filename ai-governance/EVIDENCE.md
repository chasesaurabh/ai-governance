# Task evidence and exceptions

Generate a task-specific record with `ai-governance evidence-init --input task.json --project .`. Save stdout as an evidence JSON file. Generate a matching human checklist with `ai-governance checklist --input task.json --project .`.

Every control starts as `not_run`. Set it to `passed` only after observing verification, and include nonempty references to reports, changed files or review artifacts. For `failed`, `not_run` or `not_applicable`, include a concrete reason. Protected controls cannot be marked not applicable. Applicability declarations still require reviewer scrutiny.

Run `ai-governance evidence-check --input evidence.json --task task.json --project .`. The command reports completion counts, outstanding checks and exception health. Exit code 1 means invalid evidence, a blocking unmet control, unresolved task intent or an expired supplied exception. Warning-severity controls are reported without blocking, but unverified warnings still make verificationComplete false.

Records are bound to a task fingerprint and the resolved packet, including configuration and controls. Changes require regenerating the record and re-verifying affected controls. Identical task text is not a run identity: keep records in per-run locations and use fresh references. Do not reuse old run evidence merely because its packet matches.

The validator checks structure and declared results. It does not fetch references, authenticate approvals, run project commands or certify policy compliance. Pair it with real CI checks and human review. `ready` means the submitted declarations meet the selected execution controls, potentially with approved exceptions; `verificationComplete` requires all checks passed or validly declared not applicable. These are deliberately separate.

## Exceptions

Pass `--exceptions exceptions.json` to evidence-check. This file contains an array of objects with these fields:

- id: unique exception identifier
- control: existing, non-protected control ID
- packetDigest: digest from the evidence record, binding the exception to this task
- owner: accountable owner
- reason: specific justification
- remediation: issue or remediation plan reference
- approval: actual approval reference, independently checked by the reviewer
- expiresAt: exact UTC date-time, for example `2030-01-10T00:00:00Z`

Set the affected evidence item's `exception` to that ID. Expired or mismatched exceptions cannot waive a check. Exceptions expiring in seven days are reported as expiring. Security-floor controls cannot be waived. Continue using the human exceptions log for organizational review; the JSON array is the machine-readable companion.

## Metrics

The evidence report provides counts by status, evidenceCompletionPercent, exceptionCount and exceptionHealth. None measures defect prevention by itself. Compare these with escaped defects, routing mistakes and task completion in evaluations. A lower token count is useful only when successful task completion and control adherence are maintained.
