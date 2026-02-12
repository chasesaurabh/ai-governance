# Intent Detection Patterns

## Purpose

Detailed pattern matching rules for the auto-router. Each intent has keyword patterns, regex-like signals, and contextual heuristics that AI assistants use to classify user prompts.

---

## Pattern Definitions

### 1. NEW_PROJECT

**Trigger confidence: HIGH**
```
Patterns:
  - "new project"
  - "start from scratch"
  - "create a new [app|application|service|api|website|repo|repository]"
  - "bootstrap"
  - "scaffold"
  - "initialize"
  - "set up a new"
  - "build me a [noun] from scratch"
  - "greenfield"
```

**Contextual signals:**
- Workspace/directory is empty or has only governance files
- User describes a complete system, not a modification
- No existing source code referenced

**Policies:** POL-001 → POL-002 → POL-004 → POL-005 → POL-006 → POL-007
**Windsurf workflow:** `.windsurf/workflows/new-project.md`

---

### 2. ADD_FEATURE

**Trigger confidence: HIGH**
```
Patterns:
  - "add [a|the] feature"
  - "implement [noun]"
  - "build [noun]"
  - "create [a|an] [endpoint|component|page|service|module|function|class]"
  - "I need [a|an] [noun] that [verb]"
  - "add [noun] to [noun]"
  - "extend [noun] to support [noun]"
  - "new [endpoint|route|api|page|screen|component]"
  - "integrate [with] [noun]"
  - "support for [noun]"
```

**Contextual signals:**
- Existing codebase present in workspace
- User describes desired behavior that doesn't exist yet
- References to specific files or modules to modify
- User says "I want" or "we need" followed by new functionality

**Disambiguation from NEW_PROJECT:** Existing code files present, user references current codebase
**Disambiguation from BUG_FIX:** User describes desired state, not broken state

**Policies:** POL-001 → POL-003 → POL-005 → POL-004 → POL-006
**Windsurf workflow:** `.windsurf/workflows/add-feature.md`

---

### 3. BUG_FIX

**Trigger confidence: HIGH**
```
Patterns:
  - "fix [this|the|a] [bug|issue|error|problem]"
  - "not working"
  - "broken"
  - "crash[es|ing]"
  - "error: [message]"
  - "exception"
  - "regression"
  - "fails when"
  - "should [verb] but instead [verb]"
  - "used to work"
  - "TypeError|ReferenceError|SyntaxError|NullPointerException|segfault"
  - "[noun] returns [wrong thing] instead of [right thing]"
  - "getting [error code] when"
  - "stack trace"
```

**Contextual signals:**
- Error messages or stack traces in the prompt
- User describes something that previously worked
- User describes expected vs actual behavior
- References to specific error codes (404, 500, etc.)

**Disambiguation from ADD_FEATURE:** User describes broken current state, not missing desired state

**Policies:** POL-004 → POL-005 → POL-015
**Windsurf workflow:** `.windsurf/workflows/fix-bug.md`

---

### 4. DEPLOY

**Trigger confidence: HIGH**
```
Patterns:
  - "deploy [to] [staging|production|prod]"
  - "release [this|version|v]"
  - "ship [it|this]"
  - "push to [prod|production|staging]"
  - "go live"
  - "promote [to]"
  - "rollout"
  - "cut a release"
  - "deployment checklist"
  - "ready to deploy"
  - "merge to main and deploy"
```

**Contextual signals:**
- CI/CD config files referenced
- User mentions environment names
- Conversation follows completed feature or bug fix

**Policies:** POL-007 → POL-008 → POL-012 → POL-015
**Windsurf workflow:** `.windsurf/workflows/deploy.md`

---

### 5. INCIDENT

**Trigger confidence: CRITICAL (always prioritize)**
```
Patterns:
  - "outage"
  - "[site|service|app|api|database] [is] down"
  - "incident"
  - "SEV[1-4]"
  - "production [issue|problem|error|failure]"
  - "users [are] reporting"
  - "alert[s] firing"
  - "error rate [spike|spiking|jumped|increasing]"
  - "can't reach [service]"
  - "data [loss|corruption|breach]"
  - "security breach"
  - "everything is broken"
  - "urgent"
  - "pages are timing out"
  - "latency [spike|through the roof]"
```

**Contextual signals:**
- Urgent language, exclamation marks
- Monitoring screenshots or alert text
- Multiple symptoms described simultaneously
- User sounds stressed or rushed

**RULE: Never ask for clarification on incidents. Assume INCIDENT and start triage immediately.**

**Policies:** POL-010 → POL-008
**Windsurf workflow:** `.windsurf/workflows/incident.md`

---

### 6. CODE_REVIEW

**Trigger confidence: HIGH**
```
Patterns:
  - "review [this|my|the] [code|PR|pull request|changes|diff]"
  - "look at [this|my] [code|changes]"
  - "code review"
  - "what do you think [of|about] [this code]"
  - "is this [code|implementation|approach] [OK|good|correct|right]"
  - "feedback on [my|this]"
  - "check [this|my] [implementation|approach]"
  - "anything wrong with this"
  - "can you review"
  - "PR review"
```

**Contextual signals:**
- User shares a code block or diff
- User references a PR number or branch
- User asks for opinions on existing code
- User shares a file and asks if it's correct

**Disambiguation from BUG_FIX:** User is asking for evaluation, not reporting something broken
**Disambiguation from REFACTOR:** User wants assessment, not modification

**Policies:** All applicable
**Windsurf workflow:** `.windsurf/workflows/code-review.md`

---

### 7. SECURITY_REVIEW

**Trigger confidence: HIGH**
```
Patterns:
  - "security [review|audit|check|scan|assessment]"
  - "vulnerability"
  - "CVE[-]"
  - "pen[etration] test"
  - "OWASP"
  - "is this secure"
  - "safe to [verb]"
  - "[SQL|command|code] injection"
  - "XSS"
  - "CSRF"
  - "authentication [issue|problem|concern]"
  - "authorization [issue|problem|concern]"
  - "data [leak|exposure|breach]"
  - "secrets [in|exposed|leaked]"
  - "hardcoded [password|credential|key|secret|token]"
```

**Contextual signals:**
- Security-related files (auth, crypto, middleware) modified
- User asks about data handling or privacy
- Compliance or regulatory discussion

**Policies:** POL-006 → POL-013 → POL-014 → POL-017
**Windsurf workflow:** `.windsurf/workflows/security-review.md`

---

### 8. REFACTOR

**Trigger confidence: MEDIUM**
```
Patterns:
  - "refactor [this|the]"
  - "clean[ing] up"
  - "restructure"
  - "simplify"
  - "extract [function|method|component|module]"
  - "DRY [this|up]"
  - "reduce [complexity|duplication]"
  - "too [complex|long|messy|tangled]"
  - "tech debt"
  - "split [this|the] [file|function|class|module]"
  - "move [this|the] [logic|code] to"
  - "rename [this|the]"
  - "improve [code|structure|readability]"
```

**Contextual signals:**
- User explicitly says behavior should NOT change
- Discussion about code quality metrics
- References to complexity or duplication
- No new user-facing functionality described

**Disambiguation from ADD_FEATURE:** No new behavior described
**Disambiguation from BUG_FIX:** Nothing is broken, just messy

**Policies:** POL-004 → POL-005 → POL-009
**Windsurf workflow:** `.windsurf/workflows/refactor.md`

---

### 9. COMMIT_MESSAGE

**Trigger confidence: HIGH**
```
Patterns:
  - "commit [message]"
  - "write [a|the] commit"
  - "what should I commit"
  - "summarize [my|the|these] changes"
  - "git commit"
  - "stage[d] changes"
  - "changelog [entry]"
  - "conventional commit"
```

**Contextual signals:**
- User just finished implementing something
- `git diff --cached` shows changes
- User asks to wrap up or finalize

**Windsurf workflow:** `.windsurf/workflows/git-staged-summary-global.md`

---

### 10. CLEAR_CONTEXT

**Trigger confidence: MEDIUM**
```
Patterns:
  - "new task"
  - "fresh start"
  - "clear [the] context"
  - "start over"
  - "different [topic|task|thing]"
  - "switch to [something unrelated]"
  - "forget [the above|what we discussed|everything]"
  - "unrelated [question|task]"
  - "let's move on to"
  - "new chat"
  - "clean slate"
```

**Contextual signals:**
- Topic has dramatically shifted from previous messages
- User mentions a completely different codebase or project
- Technology stack discussion changes entirely
- User expresses frustration with current context

**Windsurf workflow:** `.windsurf/workflows/clear-context.md`

---

## Compound Intent Parsing

When a prompt contains multiple intents, decompose into primary + secondary:

| Compound Prompt | Primary | Secondary |
|----------------|---------|-----------|
| "Fix this bug and deploy" | BUG_FIX | DEPLOY (after fix) |
| "Add auth and review my cart code" | ADD_FEATURE | CODE_REVIEW (queued) |
| "Set up new project with user login" | NEW_PROJECT | (feature included in project) |
| "Refactor the API then deploy" | REFACTOR | DEPLOY (after refactor) |
| "This is broken in prod" | INCIDENT | BUG_FIX (after mitigation) |
| "Clean up and commit" | REFACTOR | COMMIT_MESSAGE (after refactor) |

**Rule:** Execute primary workflow fully, then transition to secondary with a brief announcement:

```
📋 **Transitioning to: [Secondary Workflow]**
The [primary task] is complete. Now proceeding with [secondary task].
```

---

## Confidence Thresholds

| Confidence | Action |
|-----------|--------|
| **HIGH** (clear match) | Auto-trigger workflow, announce it |
| **MEDIUM** (likely match) | Auto-trigger with brief confirmation: "Looks like [X]—proceeding with that workflow." |
| **LOW** (ambiguous) | Ask ONE clarifying question with top 2 options |
| **NONE** (no match) | Proceed without governance workflow, apply hard security rules only |

## Fallback Behavior

If no intent matches:
1. Apply baseline governance rules (security, coding standards)
2. Do NOT force a workflow—just help the user
3. If the work evolves into a recognizable intent, trigger mid-conversation:
   ```
   📋 **Detected: [Workflow]** (auto-triggered based on conversation direction)
   ```
