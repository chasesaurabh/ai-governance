# Router Test Suite — Intent Detection Validation

> 50 prompts with expected intent classification. Use this to validate auto-router behavior in any AI tool.

## How to Use

1. Open your AI coding tool with governance installed
2. Paste each prompt (or a subset) into the chat
3. Verify the AI announces the expected workflow
4. Mark pass/fail in the Result column

A healthy router should achieve **≥ 90% accuracy** on HIGH confidence prompts and **≥ 75%** on MEDIUM/AMBIGUOUS ones.

---

## HIGH Confidence — Single Intent

| # | Prompt | Expected Intent | Expected Workflow | Policies |
|---|--------|----------------|-------------------|----------|
| 1 | "The login page throws a 500 error after the last deploy" | BUG_FIX | fix-bug | POL-004, 005, 015 |
| 2 | "Add a password reset feature to the auth module" | ADD_FEATURE | add-feature | POL-001, 003, 005, 004, 006 |
| 3 | "Deploy the v2.3 release to production" | DEPLOY | deploy | POL-007, 008, 012, 015 |
| 4 | "The API is down and users are getting 503s" | INCIDENT | incident | POL-010, 008 |
| 5 | "Is the SQL in our search endpoint safe from injection?" | SECURITY_REVIEW | security-review | POL-006, 013, 014, 017 |
| 6 | "Refactor the payment service to reduce complexity" | REFACTOR | refactor | POL-004, 005, 009 |
| 7 | "Review my changes to the auth middleware" | CODE_REVIEW | code-review | All applicable |
| 8 | "Summarize my staged changes for a commit message" | COMMIT_MESSAGE | git-staged-summary-global | — |
| 9 | "Create a new React app with user authentication" | NEW_PROJECT | new-project | POL-001, 002, 004, 005, 006, 007 |
| 10 | "Let's switch to a completely different topic" | CLEAR_CONTEXT | clear-context | — |

---

## HIGH Confidence — Varied Phrasing

| # | Prompt | Expected Intent | Expected Workflow |
|---|--------|----------------|-------------------|
| 11 | "This used to work yesterday but now it crashes on startup" | BUG_FIX | fix-bug |
| 12 | "Build me an endpoint that returns user activity logs" | ADD_FEATURE | add-feature |
| 13 | "Ship it to staging" | DEPLOY | deploy |
| 14 | "SEV1 — database cluster unreachable, error rate at 80%" | INCIDENT | incident |
| 15 | "Check this code for XSS vulnerabilities" | SECURITY_REVIEW | security-review |
| 16 | "This function is way too complex, simplify it" | REFACTOR | refactor |
| 17 | "What do you think about this implementation?" | CODE_REVIEW | code-review |
| 18 | "git commit" | COMMIT_MESSAGE | git-staged-summary-global |
| 19 | "Bootstrap a new microservice from scratch" | NEW_PROJECT | new-project |
| 20 | "New task — forget everything above" | CLEAR_CONTEXT | clear-context |

---

## HIGH Confidence — Error Messages & Stack Traces

| # | Prompt | Expected Intent | Expected Workflow |
|---|--------|----------------|-------------------|
| 21 | "TypeError: Cannot read properties of undefined (reading 'map') in UserList.tsx:42" | BUG_FIX | fix-bug |
| 22 | "Getting a 404 on /api/v2/orders but /api/v1/orders works fine" | BUG_FIX | fix-bug |
| 23 | "NullPointerException in PaymentService.java line 187" | BUG_FIX | fix-bug |
| 24 | "The tests pass locally but fail in CI with a timeout" | BUG_FIX | fix-bug |
| 25 | "Regression: search results are empty after merging PR #412" | BUG_FIX | fix-bug |

---

## HIGH Confidence — Incident Urgency

| # | Prompt | Expected Intent | Expected Workflow |
|---|--------|----------------|-------------------|
| 26 | "Everything is broken in production right now" | INCIDENT | incident |
| 27 | "Alerts firing — latency spike across all services" | INCIDENT | incident |
| 28 | "Users are reporting they can't log in, data loss possible" | INCIDENT | incident |
| 29 | "Pages are timing out, error rate through the roof" | INCIDENT | incident |
| 30 | "Production database is returning connection refused" | INCIDENT | incident |

---

## MEDIUM Confidence — Compound Intents

| # | Prompt | Expected Primary | Expected Secondary | Notes |
|---|--------|-----------------|-------------------|-------|
| 31 | "Fix the cart bug and then deploy to staging" | BUG_FIX | DEPLOY | Primary first, then transition |
| 32 | "Add user search and review my existing auth code" | ADD_FEATURE | CODE_REVIEW | Feature first, review queued |
| 33 | "Refactor the API layer and commit when done" | REFACTOR | COMMIT_MESSAGE | Refactor first, then commit |
| 34 | "This is broken in production, users are impacted" | INCIDENT | BUG_FIX | Incident always wins — triage first |
| 35 | "Clean up the tests and then ship to prod" | REFACTOR | DEPLOY | Refactor first, deploy after |

---

## MEDIUM Confidence — Disambiguation Required

| # | Prompt | Expected Intent | Why Not the Alternative |
|---|--------|----------------|----------------------|
| 36 | "The dashboard looks wrong on mobile" | BUG_FIX | Describes broken state, not missing feature |
| 37 | "I want the dashboard to look better on mobile" | ADD_FEATURE | Describes desired state, not broken state |
| 38 | "Look at the auth module" | CODE_REVIEW | Asks for evaluation, not reporting something broken |
| 39 | "Make the auth module cleaner" | REFACTOR | No new behavior, just improvement |
| 40 | "Add rate limiting to the auth module" | ADD_FEATURE | New behavior described |

---

## LOW Confidence — Ambiguous (Router Should Ask)

| # | Prompt | Top 2 Options | Expected Behavior |
|---|--------|--------------|-------------------|
| 41 | "Something's off with the login" | BUG_FIX / CODE_REVIEW | Ask: "Are you reporting a bug or requesting a review?" |
| 42 | "Can you help with the user service?" | ADD_FEATURE / REFACTOR / BUG_FIX | Ask: clarify what kind of help |
| 43 | "Let's work on the API" | ADD_FEATURE / REFACTOR | Ask: new functionality or improving existing? |
| 44 | "Take a look at this" | CODE_REVIEW / BUG_FIX | Ask: review or fix? |
| 45 | "Improve performance" | REFACTOR / BUG_FIX | Ask: is it broken or just slow? |

---

## NONE — No Workflow (Baseline Rules Only)

| # | Prompt | Expected Behavior |
|---|--------|-------------------|
| 46 | "What does this function do?" | No workflow — just answer the question. Apply hard security rules. |
| 47 | "Explain the difference between REST and GraphQL" | No workflow — general knowledge question. |
| 48 | "How do I install Docker on Mac?" | No workflow — tooling question. |
| 49 | "What's the best way to structure a monorepo?" | No workflow — architecture discussion (may evolve into NEW_PROJECT). |
| 50 | "Thanks, that's all for now" | No workflow — conversation end. |

---

## Scoring Guide

| Category | Prompts | Target Accuracy |
|----------|---------|----------------|
| HIGH — Single Intent | #1–#10 | ≥ 95% |
| HIGH — Varied Phrasing | #11–#20 | ≥ 90% |
| HIGH — Error/Stack Traces | #21–#25 | ≥ 95% |
| HIGH — Incident Urgency | #26–#30 | 100% (incidents must never be missed) |
| MEDIUM — Compound | #31–#35 | ≥ 80% (primary correct) |
| MEDIUM — Disambiguation | #36–#40 | ≥ 80% |
| LOW — Ambiguous | #41–#45 | Ask for clarification (not misclassify) |
| NONE — No Workflow | #46–#50 | No false triggers |

**Overall target: ≥ 90% correct classification across all 50 prompts.**

---

## Fail-Safe Behaviors

The router should exhibit these safety properties:

1. **Incidents are never missed** — any production-down language triggers incident response immediately
2. **Security is second priority** — security concerns override feature/bug/refactor workflows
3. **Ambiguity → ask, don't guess** — when confidence is LOW, ask ONE clarifying question with top 2 options
4. **No false triggers** — general questions should NOT trigger governance workflows
5. **Hard security rules always apply** — even when no workflow is triggered (no hardcoded secrets, no SQL injection, no eval with user input, no PII in logs)
