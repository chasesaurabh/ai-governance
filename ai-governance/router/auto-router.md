# Governance Auto-Router

## Purpose

This is the core routing engine for the AI Governance framework. It enables automatic workflow detection and execution based on user intent—**no slash commands required**. The user simply describes what they want to do, and the AI detects the intent and follows the appropriate governance workflow.

## How It Works

```
User prompt → Intent Detection → Workflow Selection → Announce → Execute
```

1. **Analyze** the user's prompt for intent signals (keywords, context, file references)
2. **Match** to the most appropriate governance workflow
3. **Announce** the detected workflow to the user (transparency)
4. **Execute** the workflow steps automatically
5. **If ambiguous**, ask one clarifying question before proceeding

---

## Intent Detection Rules

### Priority Order

When multiple intents match, use this priority (highest first):

1. **Incident** — Production is down or degraded (urgency trumps all)
2. **Security Review** — Security vulnerability or concern reported
3. **Bug Fix** — Something is broken that was working before
4. **Deploy** — User wants to ship to staging or production
5. **New Project** — Starting from scratch, no existing codebase
6. **Add Feature** — Building something new in existing codebase
7. **Refactor** — Improving existing code without changing behavior
8. **Code Review** — Reviewing someone else's changes
9. **Commit Message** — Staged changes need a commit message
10. **Clear Context** — User wants a fresh start

### Intent Signal Matrix

| Intent | Strong Signals | Medium Signals | Weak Signals |
|--------|---------------|----------------|-------------|
| **New Project** | "new project", "start from scratch", "create a new app", "bootstrap", "scaffold", "init" | "build me a", "set up a", "create", "new repo" | Project directory is empty |
| **Add Feature** | "add feature", "implement", "build", "create [specific thing]", "I need a [component]" | "add", "new endpoint", "new page", "new component", "extend" | Existing code in workspace |
| **Bug Fix** | "bug", "fix", "broken", "not working", "error", "crash", "regression", "fails" | "issue", "problem", "wrong", "incorrect", "unexpected" | Error stack traces in prompt |
| **Deploy** | "deploy", "release", "ship", "push to prod", "go live", "promote" | "staging", "production", "release", "rollout" | CI/CD files referenced |
| **Incident** | "outage", "down", "incident", "SEV1", "SEV2", "production issue", "site down", "service down" | "alerts firing", "error rate spike", "users reporting", "degraded" | Urgency language, multiple exclamation marks |
| **Code Review** | "review", "look at this PR", "check this code", "review my changes" | "what do you think", "is this OK", "feedback on" | User shares diff or PR link |
| **Security Review** | "security", "vulnerability", "CVE", "penetration", "audit", "OWASP" | "is this secure", "safe to", "injection", "XSS", "auth issue" | Security-related files modified |
| **Refactor** | "refactor", "clean up", "restructure", "simplify", "extract", "DRY" | "improve", "reorganize", "too complex", "tech debt" | No new functionality mentioned |
| **Commit Message** | "commit message", "commit", "what should I commit", "stage", "git message" | "summarize changes", "changelog" | `git diff --cached` context |
| **Clear Context** | "new task", "fresh start", "clear context", "start over", "different topic", "switch to" | "unrelated", "new thing", "forget the above" | Topic dramatically shifts |

### Context Clues (Beyond Keywords)

| Context Signal | Likely Intent |
|---------------|--------------|
| Empty project directory | New Project |
| User references specific file with bug description | Bug Fix |
| User describes desired behavior that doesn't exist yet | Add Feature |
| User mentions "staging" or "production" environment | Deploy |
| User shares monitoring screenshots or alert text | Incident |
| User references PR number or branch comparison | Code Review |
| User asks about password hashing, SQL injection, etc. | Security Review |
| User says "this function is too long" or "too much duplication" | Refactor |
| User just made changes and wants to save | Commit Message |
| Conversation topic has completely shifted | Clear Context |

---

## Announcement Format

When a workflow is detected, announce it clearly before executing:

```
📋 **Detected: [Workflow Name]** (governance workflow auto-triggered)
Following: ai-governance/policies/[relevant-policies]

[Brief one-line summary of what will happen]

---
```

### Examples

```
📋 **Detected: Add Feature** (governance workflow auto-triggered)
Following: POL-001 → POL-003 → POL-005 → POL-004 → POL-006

I'll guide this through requirements verification, design, tests-first implementation, and security review.

---
```

```
📋 **Detected: Bug Fix** (governance workflow auto-triggered)
Following: POL-004 → POL-005 → POL-015

I'll reproduce the issue, identify root cause, write a regression test, then implement a minimal fix.

---
```

```
📋 **Detected: Incident Response** (governance workflow auto-triggered)
Following: POL-010 → POL-008

⚠️ PRIORITY: Restore service first, investigate root cause after. Let's triage immediately.

---
```

---

## Ambiguity Resolution

If the intent is ambiguous (multiple intents score similarly), ask ONE clarifying question:

```
I see this could be either:
1. **Add Feature** — building [X] as new functionality
2. **Bug Fix** — fixing [Y] that's currently broken

Which best describes what you need?
```

Rules for ambiguity:
- Ask only ONE question, not multiple
- Provide the top 2 options with brief descriptions
- Default to the higher-priority intent if the user says "just do it"
- Never ask for clarification on incidents—assume incident and act

---

## Workflow Execution After Detection

Once a workflow is detected:

1. **Read the relevant policy files** from `ai-governance/policies/` for the detected intent
   - Windsurf: also read the workflow file from `.windsurf/workflows/[workflow].md`
   - Other tools: follow the task routing steps from `ai-governance/GOVERNANCE-RULES.md`
2. **Follow the steps in order** — don't skip governance gates
3. **Use the PR checklist** from `ai-governance/templates/pr-checklist.md` before finalizing
4. **Apply AI disclosure** per POL-014 for any AI-generated output
5. **At completion**, summarize what was done and what governance artifacts were produced

---

## Opting Out

If the user explicitly says they don't want governance routing:
- "Skip governance" / "no workflow" / "just do it without the process"
- Respect the request but note: "Proceeding without governance workflow. You can re-enable anytime."
- Still follow the hard security rules from POL-006 and POL-017 (these are non-negotiable)

---

## Multi-Intent Handling

Sometimes a prompt contains multiple intents:
- "Fix this bug and then deploy it" → **Bug Fix first**, then **Deploy**
- "Add this feature and review my other PR" → **Add Feature**, note Code Review as follow-up
- "Set up a new project and add user authentication" → **New Project** (includes feature)

Rule: Execute the primary intent's workflow. Note secondary intents for follow-up.

---

## Context Switching Detection

If the user's prompt represents a significant topic change from the current conversation:
- Suggest clearing context: "This looks like a new task. Want me to start fresh for better focus?"
- If user confirms, follow the clear-context workflow
- If user declines, proceed with the new intent in current context

Signals for context switch:
- Different codebase or directory referenced
- Completely different technology stack discussed
- Shift from implementation to operations (or vice versa)
- User says "actually", "different thing", "switching to"

---

## Self-Alignment, Self-Healing & Self-Learning

The auto-router integrates with a continuous improvement system that makes the AI more effective over time while staying governance-compliant. See `ai-governance/router/self-alignment.md` for full details.

### Self-Align (Every Response)
Before finalizing any response, verify:
- Active workflow steps followed in order
- Hard security rules enforced (POL-006, POL-017)
- Code matches user's established style
- No hallucinated imports/APIs/packages
- AI disclosure ready if applicable (POL-014)

### Self-Heal (On Errors)
When errors are detected (build failures, user corrections, hallucinations):
1. **Detect** → **Acknowledge** → **Diagnose root cause** → **Correct** → **Learn** → **Verify**

### Self-Learn (Per Session)
Track and adapt to: code style, architecture preferences, testing approach, error handling patterns, commit style, verbosity preference. Persist preferences with user permission via the tool's memory/config system.

### Adaptive Governance
Adjust strictness based on context (production → maximum, prototype → moderate, learning → minimum) while never dropping below the security floor (no hardcoded secrets, no injection vectors, no eval with user input, no PII in logs).
