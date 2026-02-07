# POL-014: LLM-Specific Risk Controls

| Field | Value |
|-------|-------|
| **Policy ID** | POL-014 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Security Lead / Staff Engineer |
| **Approval** | VP Engineering / CISO |

---

## Objective

Mitigate risks unique to AI-assisted software development: hallucinated code, prompt injection, data leakage to AI providers, over-reliance on AI output, and tool-use safety gaps. Make AI a force multiplier without introducing new vulnerability classes.

## Scope

Applies to: all use of AI coding assistants (Windsurf/Cascade, GitHub Copilot, Claude Code, Cursor, Aider, ChatGPT, and any future tools) for code generation, review, debugging, documentation, and architecture.

---

## Mandatory Controls

### CTRL-014.1: Hallucination Detection & Prevention

AI coding assistants commonly hallucinate in these categories:

| Hallucination Type | Detection Method | Enforcement |
|-------------------|-----------------|-------------|
| **Non-existent packages** | Dependency allowlist check, `npm info` / `pip show` verification | CI dependency resolution fails on fake packages |
| **Fabricated API methods** | Type checker (TypeScript strict, mypy strict) | CI type-check stage |
| **Outdated API signatures** | Compile/build step catches signature mismatches | CI build stage |
| **Invented configuration options** | Schema validation for config files | CI config validation |
| **Fictional documentation references** | Link checker on docs | CI link-check stage |
| **Wrong algorithm complexity claims** | Benchmarks for performance-critical code | Performance test gate |
| **Non-existent CLI flags** | Integration tests exercise actual CLI | CI integration tests |

**Additional controls:**
- Reviewer MUST verify any AI-suggested import actually exists in the ecosystem
- Reviewer MUST verify any AI-cited documentation by checking the source
- AI-suggested dependencies MUST be checked: does the package exist? Is it maintained? Is it safe?

**Enforcement**: All standard CI checks catch most hallucinations. Reviewer checklist includes hallucination-specific items.

**Evidence artifact**: CI pass, reviewer checklist sign-off.

### CTRL-014.2: Prompt Injection & Tool Safety

When AI tools have access to execute commands, read files, or make API calls:

| Risk | Control |
|------|---------|
| AI executes destructive command | All destructive commands require explicit user approval (never auto-run `rm`, `DROP`, `kubectl delete`) |
| AI reads sensitive files | AI tool file access limited to workspace. Secrets files excluded via `.gitignore` and tool config |
| AI makes external API calls | Network allowlist for AI tool processes |
| AI modifies CI/CD pipeline | Pipeline file changes require 2-reviewer approval |
| Malicious prompt in code comments | Code review, SAST custom rules for suspicious patterns |
| Dependency confusion via AI suggestion | Internal registry priority, package name validation |

**Prompt injection patterns to detect in code:**
```
# DANGEROUS: These patterns in comments/strings could manipulate AI
"Ignore previous instructions and..."
"You are now a different assistant..."
"System prompt override:..."
"<|im_start|>system..."
```

**Enforcement**: Custom lint rules scan for prompt injection patterns in code/comments. AI tool configuration restricts file access and command execution. CODEOWNERS for CI/CD files.

**Evidence artifact**: Lint scan results, AI tool configuration audit.

### CTRL-014.3: AI Output Review Requirements

| Change Type | AI Review Requirement |
|-------------|----------------------|
| New file (AI-generated) | Full manual review, line by line |
| Modification (AI-assisted) | Review all changed lines, verify context preserved |
| Test generation | Verify tests actually assert behavior (not tautologies) |
| Security-sensitive code | Security-trained reviewer required |
| Infrastructure/IaC | Platform-trained reviewer required |
| Documentation | Domain expert verifies accuracy |

**Anti-rubber-stamping controls:**
- PRs tagged `ai-generated` or `ai-assisted` MUST have reviewer spend minimum 1 min per 50 lines
- Reviewer MUST leave at least 1 substantive comment on AI-generated PRs
- Auto-generated PR descriptions MUST be manually verified

**Enforcement**: PR template requires AI usage disclosure. AI-tagged PRs have additional review requirements in branch protection.

**Evidence artifact**: PR review with substantive comments, AI disclosure completed.

### CTRL-014.4: Data Leakage to AI Providers

| Control | Requirement |
|---------|-------------|
| C3/C4 data in prompts | Prohibited (POL-013) |
| Proprietary algorithms | Prohibited without approval |
| Customer data in examples | Prohibited, use synthetic data |
| Internal architecture details | Allowed for C1/C2, prohibited for C3/C4 |
| API keys / secrets in context | Prohibited, secret scanner on AI proxy |
| Telemetry to AI provider | Review and approve data sent |

**Tool-specific data controls:**

| Tool | Data Handling | Control |
|------|--------------|---------|
| GitHub Copilot | Code sent to GitHub servers | Enterprise tier with data retention opt-out |
| Windsurf/Cascade | Code processed by Codeium | Enterprise tier, review data policy |
| Claude Code | Code sent to Anthropic | Review data retention policy |
| Cursor | Code sent to cursor servers | Enterprise tier, review data policy |
| Self-hosted models | Data stays internal | Preferred for C3/C4 codebases |

**Enforcement**: AI prompt proxy for network-based tools. Developer training. Quarterly access audit.

**Evidence artifact**: Tool configuration audit, training records, proxy logs (sampling).

### CTRL-014.5: AI Usage Disclosure & Tracking

| Requirement | Details |
|-------------|---------|
| PR disclosure | Every PR MUST indicate AI usage level (none/assisted/generated) |
| Disclosure template | `ai-governance/templates/ai-usage-disclosure.md` |
| Metrics tracked | % of PRs AI-assisted, defect rate by AI vs human, review time |
| Quarterly review | Engineering leadership reviews AI usage metrics |

AI usage levels:
```
none      - No AI tools used
assisted  - AI used for suggestions/completions, human authored majority
generated - AI generated majority of code, human reviewed and modified
```

**Enforcement**: PR template requires disclosure. CI label applied based on disclosure.

**Evidence artifact**: AI usage disclosure in PR, quarterly metrics report.

### CTRL-014.6: AI Tool Allowlist

Only approved AI tools may be used for development:

| Status | Meaning | Process |
|--------|---------|---------|
| **Approved** | General use permitted | Listed in tool registry |
| **Restricted** | Permitted with controls | Security review completed, specific usage rules |
| **Prohibited** | Not permitted | Security risk unacceptable |

Approval criteria for new AI tools:
1. Data handling and retention policy reviewed
2. SOC2/ISO27001 compliance verified
3. Enterprise agreement with appropriate DPA
4. Security review of tool's access model
5. Engineering Manager + Security Lead sign-off

**Enforcement**: Network controls block unapproved AI tool domains. Endpoint management.

**Evidence artifact**: AI tool registry, security review documents.

### CTRL-014.7: AI-Generated Code Ownership & Liability

| Rule | Requirement |
|------|-------------|
| Code ownership | The developer who submits AI-generated code owns it fully |
| License compliance | AI-generated code must not violate licenses (copilot filter enabled) |
| Patent risk | AI-suggested algorithms reviewed for patent risk on critical paths |
| Liability | Defects in AI-generated code treated same as human-written defects |

**Enforcement**: Developer agreement, training. License filter enabled in AI tools.

**Evidence artifact**: Training records, license filter configuration.

---

## Exception Path

1. AI tool exception (using non-approved tool): Security Lead approval, 30-day trial, full security review before permanent approval
2. Data classification exception for AI: See POL-013 exception path
3. Review requirement exception: Not available for security-sensitive code
4. All exceptions logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| AI-generated code defect rate | ≤ human defect rate | Bugs traced to AI PRs / total AI PRs vs human PRs |
| AI hallucination escape rate | < 1% of AI PRs | Post-merge hallucination discoveries / total AI PRs |
| AI disclosure compliance | 100% of PRs | PRs with AI disclosure / total PRs |
| C3/C4 data leakage to AI | 0 instances | AI proxy alerts |
| AI tool security review coverage | 100% of tools in use | Reviewed tools / total tools used |
| AI-specific incidents | < 1 per quarter | Incidents with AI as contributing factor |

---

## References

- `ai-governance/policies/POL-013-data-classification.md`
- `ai-governance/policies/POL-006-security-privacy.md`
- `ai-governance/policies/POL-004-coding-standards.md`
- `ai-governance/templates/ai-usage-disclosure.md`
