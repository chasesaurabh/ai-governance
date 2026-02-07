# AI Usage Disclosure

> Required for all PRs per POL-014. Complete this section in your PR description.

## Disclosure

| Field | Value |
|-------|-------|
| **AI Tool(s) Used** | [ ] None / [ ] Windsurf (Cascade) / [ ] GitHub Copilot / [ ] Claude Code / [ ] Cursor / [ ] Aider / [ ] ChatGPT / [ ] Other: ____ |
| **Usage Level** | [ ] None / [ ] Assisted (suggestions/completions) / [ ] Generated (AI authored majority) |
| **Model Version** | _If known (e.g., GPT-4o, Claude 3.5 Sonnet, etc.)_ |

## Scope of AI Involvement

| Activity | AI Used? | Details |
|----------|----------|---------|
| Requirements analysis | [ ] Yes / [ ] No | |
| Architecture/design | [ ] Yes / [ ] No | |
| Code generation | [ ] Yes / [ ] No | |
| Test generation | [ ] Yes / [ ] No | |
| Bug diagnosis | [ ] Yes / [ ] No | |
| Documentation | [ ] Yes / [ ] No | |
| Code review assistance | [ ] Yes / [ ] No | |
| Commit message | [ ] Yes / [ ] No | |

## Files with Significant AI Contribution

_List files where AI generated more than ~50% of the content:_

| File | AI Contribution | Human Verification |
|------|----------------|-------------------|
| `path/to/file.ts` | Generated initial implementation | Reviewed, modified error handling |
| `path/to/test.ts` | Generated test cases | Verified assertions are meaningful |

## Verification Checklist

> Mandatory when AI Usage Level is "Assisted" or "Generated"

- [ ] All AI-suggested imports verified to exist in the ecosystem
- [ ] All AI-suggested API calls verified against actual documentation
- [ ] No hallucinated packages, methods, or configuration options
- [ ] No hardcoded example/test values left in production code
- [ ] Error handling reviewed for completeness (AI often misses edge cases)
- [ ] Full test suite executed (not just AI-generated tests)
- [ ] Any new dependencies verified: exists, maintained, safe license, no known vulns
- [ ] Security-sensitive code reviewed by security-trained engineer
- [ ] No C3/C4 classified data was sent to AI tool in prompts
- [ ] AI-generated tests verified to actually assert behavior (not tautologies)

## Data Handling Confirmation

- [ ] No proprietary algorithms or trade secrets were shared with AI tool
- [ ] No C3 (Confidential) or C4 (Restricted) data was included in AI prompts
- [ ] No customer data, credentials, or PII was shared with AI tool
- [ ] AI tool is on the approved tool list (POL-014 CTRL-014.6)

## Reviewer Attestation

> Reviewer: Complete this section during code review

- [ ] I have reviewed AI-generated code with the same rigor as human-written code
- [ ] I have verified the AI verification checklist items above
- [ ] I have left at least one substantive review comment on AI-generated code
- [ ] I am satisfied the AI output is correct, secure, and maintainable

**Reviewer**: @____ **Date**: ____

---

_This disclosure is required by POL-014 (LLM Risk Controls). Non-disclosure is a policy violation._
