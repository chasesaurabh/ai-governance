# Evaluation protocol

Run `npm run evaluate` for deterministic routing and instruction-size checks. The cases include the original 50 prompts plus negative and ordered-task examples. Legacy case 34 now requires incident triage only; follow-up code changes are not automatically queued without an explicit request. General questions map to `explain` rather than an absent workflow. These are regression cases, not a held-out measure of model intelligence.

Budgets use characters divided by four, rounded up: bootstrap ≤550, Claude adapter ≤180, representative feature packet ≤1800. This is an approximation, not billed tokens. JSON evidence and packets are larger than compact Markdown instructions and should be processed outside the model when possible. A host may resend its full accumulated context; loading fewer files does not guarantee an equal billing reduction.

## External model runs

No model providers are called by this repository. To compare medium/low reasoning or model families:

1. Freeze repository revision, tasks, project configuration, tools and fixture code. Add held-out tasks with independently authored required control IDs and success criteria.
2. Run the old instructions and compact instructions against the same fixtures, model settings and tool permissions. Use multiple trials and record failures and retries, not just successful samples.
3. Have an independent reviewer check actual artifacts, command results, routing, authority boundaries and required controls. Include package/API mistakes and false incident triggers.
4. Record actual provider input/output tokens and clarification count. Cache accounting and latency should be recorded separately if relevant.
5. Score a JSON array with `node scripts/score-model-runs.js reviewed-runs.json`.

Each record requires: runId (unique), caseId, model, reasoning, variant (baseline/compact), inputTokens, outputTokens, clarifications, reviewed: true, success (boolean), sequence (action array), metControls (verified control ID array).

The scorer groups by model/reasoning/variant and counts route accuracy, missed required controls and total token cost divided by successful tasks. A success must meet the expected route, required controls and independently reviewed task outcome. Zero successes produces null cost per success. The scorer trusts reviewer declarations; it cannot authenticate reviews. Compare only matched case sets and trial counts. The bundled routing examples define only a few required controls; expand those for a full behavior benchmark before making model reliability claims.

Acceptance for a model rollout: no regression in essential control adherence, no unauthorized actions, and improved token cost per successful task on held-out cases. Instruction-size reduction alone is not proof of better results.
