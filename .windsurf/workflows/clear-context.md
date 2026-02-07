---
description: Clear context and start fresh for a new task
---

# Clear Context Workflow

When the conversation topic has shifted significantly or the user needs a fresh start, this workflow creates a clean handoff.

## Step 1: Summarize Current State

Before clearing context, capture what was accomplished:

1. List completed items from the current conversation
2. List any pending/incomplete items
3. Note any important decisions made
4. Note any files created or modified

Format:
```
## Session Summary

### Completed
- [item 1]
- [item 2]

### Pending / Follow-up Needed
- [item 1] — [what remains]
- [item 2] — [what remains]

### Key Decisions
- [decision and rationale]

### Files Modified
- [file path] — [what changed]
```

## Step 2: Check for Loose Ends

Before clearing, verify:
- [ ] No uncommitted changes that should be saved
- [ ] No tests left in failing state
- [ ] No temporary debug code left in files
- [ ] No incomplete refactors that leave code broken

If loose ends exist, alert the user:
```
⚠️ Before switching context, these items need attention:
- [loose end 1]
- [loose end 2]

Want me to resolve these first, or proceed with context switch?
```

## Step 3: Create Handoff Note (Optional)

If the pending items are significant, offer to create a handoff note:

```
Would you like me to create a brief handoff note so you (or your next session)
can pick up where we left off?
```

If yes, create a concise note the user can paste into a new chat:

```
## Handoff: [Task Name]

**Status:** [In Progress / Blocked / Ready for Review]
**Branch:** [branch name if applicable]

**Context:**
[2-3 sentences about what we were doing]

**What's Done:**
- [completed item]

**What's Next:**
- [next step with enough detail to resume]

**Key Files:**
- [file] — [relevance]

**Governance Notes:**
- [any policy exceptions, pending reviews, etc.]
```

## Step 4: Recommend Fresh Start

Suggest the user start a new conversation:

```
✅ Context captured. To get the best results for your next task:

**Windsurf:** Open a new Cascade chat (Cmd/Ctrl + L, then click + for new chat)
**Cursor:** Start a new Composer session (Cmd/Ctrl + I)
**Claude Code:** Type /clear to reset context
**Copilot Chat:** Click the + button for new conversation
**Aider:** Type /clear to reset

This gives the AI a clean slate with full token budget for your next task.
```

## Step 5: Ready for New Task

After clearing:
1. The auto-router will detect the intent of the next prompt
2. The appropriate governance workflow will trigger automatically
3. No carry-over context will interfere with the new task

---

## When to Auto-Suggest Context Clearing

The AI should proactively suggest this workflow when:

| Signal | Confidence |
|--------|-----------|
| User says "new task", "different thing", "switch to" | High — suggest immediately |
| Topic shifts from backend to completely different frontend project | Medium — ask if they want fresh context |
| User seems confused by AI referencing old context | Medium — suggest clearing |
| Conversation exceeds ~50 back-and-forth messages | Low — mention option exists |
| User starts asking about a different repository | High — suggest immediately |
