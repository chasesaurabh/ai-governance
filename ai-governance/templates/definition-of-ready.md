# Definition of Ready (DoR)

> A work item is "Ready" when it meets ALL applicable criteria below. Items not meeting DoR MUST NOT enter a sprint.

## Universal Criteria (All Work Items)

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | **Problem statement** is clear and specific | Product Owner confirms |
| 2 | **Acceptance criteria** written in Given/When/Then format | At least 2 scenarios per story |
| 3 | **Out-of-scope** explicitly listed | Prevents scope creep mid-sprint |
| 4 | **Size estimated** by team | Story points or t-shirt size agreed |
| 5 | **Dependencies identified** and resolved (or plan in place) | No blocking unknowns |
| 6 | **Data classification** tagged per POL-013 | C1-C4 label applied |
| 7 | **Design assets** available (if UI work) | Mockups/wireframes linked |

## Feature-Specific Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 8 | **Non-functional requirements** specified (latency, availability) | NFR table in ticket |
| 9 | **API contract** drafted (if new endpoints) | OpenAPI stub or interface definition |
| 10 | **Threat model** completed (if security-sensitive per POL-006) | Threat Model Lite linked |
| 11 | **Feature flag** strategy defined (if user-facing) | Flag name and rollout plan |
| 12 | **Monitoring plan** identified (what metrics/alerts needed) | Listed in ticket |

## Bug-Specific Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 8 | **Reproduction steps** documented | Verified by at least 1 engineer |
| 9 | **Severity** classified (SEV1-4) | Per POL-010 severity table |
| 10 | **Affected users/systems** identified | Scope documented |
| 11 | **Workaround** documented (if exists) | Available to support team |

## Tech Debt Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 8 | **Current impact** quantified ("interest rate") | Bugs/sprint, time/deploy, $/month |
| 9 | **Expected outcome** defined | Measurable improvement target |
| 10 | **Rollback plan** if refactor goes wrong | Documented approach |

---

## Process

1. **Product Owner** proposes item
2. **Team** reviews against DoR checklist in backlog refinement
3. **Missing items** sent back with specific gaps listed
4. **Ready items** prioritized into sprint
5. **Edge case**: If urgent item doesn't meet DoR, Engineering Manager can approve exception with documented gaps and remediation plan

## Anti-Patterns to Reject

- "We'll figure out the requirements during the sprint"
- "Just make it fast" (without specific latency target)
- "It should be secure" (without threat model for sensitive features)
- "Same as the other service" (without explicit specification)
- Tickets with only a title and no description
