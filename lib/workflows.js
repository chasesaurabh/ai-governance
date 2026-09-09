// Executable workflow definitions also generate the human-readable references.
export const workflows = {
  explain: ['Read the referenced material.', 'Answer the question; identify uncertainty and cite relevant files.'],
  review: ['Read the requested code and surrounding context.', 'Report actionable findings with evidence; do not edit unless asked.'],
  'security-review': ['Identify relevant input and trust boundaries.', 'Inspect protections and report reproducible findings; make fixes only when requested.'],
  feature: ['Confirm acceptance criteria and affected interfaces.', 'Add behavior tests and implement the smallest complete change.', 'Run applicable checks and collect evidence.'],
  bugfix: ['Reproduce expected versus actual behavior and identify root cause.', 'Add a regression test; verify it fails because of the defect.', 'Apply a focused fix; verify the regression passes and relevant existing tests pass.'],
  refactor: ['Identify behavior to preserve and run relevant existing tests.', 'Make focused structural changes.', 'Rerun checks and inspect the diff for unintended behavior changes.'],
  'new-project': ['Confirm scope, acceptance criteria and project commands.', 'Record significant architectural choices and define interfaces.', 'Implement an initial tested vertical slice and verify setup instructions.'],
  deploy: ['Verify target, authorization, successful required gates and rollback plan.', 'Use the approved release mechanism within authorized scope.', 'Verify health against release criteria; stop or roll back using the approved plan if checks fail.'],
  incident: ['Establish current impact from available evidence and begin read-only triage.', 'Identify safe mitigation; confirm missing authority or target before external changes.', 'Verify recovery, record timeline and create follow-up actions.'],
  commit: ['Inspect the requested diff and staged scope.', 'Write an accurate commit summary; commit only when the user asked to commit.'],
  'clear-context': ['Summarize relevant unresolved work and confirmed constraints.', 'Continue the new topic; do not claim to erase tool or conversation state.'],
  dependencies: ['Identify dependency scope and verify maintenance, licensing and compatibility.', 'Update dependencies and lockfiles together.', 'Run audit and relevant tests; record unresolved findings.'],
  architecture: ['Confirm constraints and compare at least two viable options.', 'Record tradeoffs and recommendation in an ADR when a decision is made.'],
  clarify: ['Inspect available context without changing files.', 'Ask one focused question about the requested outcome if it remains unclear.'],
};
