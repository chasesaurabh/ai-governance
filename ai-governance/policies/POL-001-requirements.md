# POL-001: Requirements Engineering

| Field | Value |
|-------|-------|
| **Policy ID** | POL-001 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Product Lead / Engineering Manager |
| **Approval** | VP Engineering |

---

## Objective

Ensure every unit of work has verifiable acceptance criteria, measurable success metrics, and traceable lineage before any design or implementation begins. Prevent scope ambiguity that leads to rework, missed deadlines, and security gaps.

## Scope

Applies to: all features, bug fixes, tech-debt items, and infrastructure changes regardless of size.

---

## Mandatory Controls

### CTRL-001.1: Structured Intake

Every work item MUST have:

| Element | Required | Example |
|---------|----------|---------|
| Problem statement | Yes | "Users cannot reset passwords on mobile" |
| Affected persona(s) | Yes | "End-user, Support agent" |
| Business value / OKR link | Yes | "Reduces support tickets 30%" |
| Acceptance criteria (Given/When/Then) | Yes | See template below |
| Out-of-scope list | Yes | "Admin bulk reset not included" |
| Data sensitivity tag | Yes | From POL-013 data classification |

**Enforcement**: PR template requires `## Requirements` section with all fields. CI bot rejects PRs missing the section.

**Evidence artifact**: Completed requirements section in PR or linked ticket with all fields populated.

### CTRL-001.2: Non-Functional Requirements

Every feature MUST specify targets for applicable NFRs:

| NFR | Must Specify When |
|-----|-------------------|
| Latency (p50/p95/p99) | Any user-facing endpoint |
| Throughput (rps) | Any API change |
| Availability (% uptime) | New service or SLA change |
| Data retention | Any new data store or field |
| Compliance | Any PII/PHI/PCI data |

**Enforcement**: Definition of Ready checklist blocks sprint entry without NFR targets.

**Evidence artifact**: NFR table in ticket or design doc.

### CTRL-001.3: Threat & Risk Pre-Screen

Work items touching auth, payments, PII, or external integrations MUST include a Threat Model Lite (see `ai-governance/templates/threat-model-lite.md`).

**Enforcement**: PR label `security-review-required` auto-applied by CI when files in `/auth`, `/payment`, `/integrations` are modified. Merge blocked without security sign-off.

**Evidence artifact**: Completed threat model linked in PR.

### CTRL-001.4: AI-Assisted Requirements Validation

When using AI assistants to draft requirements:
- AI output MUST be reviewed by a human with domain knowledge
- AI-generated acceptance criteria MUST be validated against real user scenarios
- Disclose AI usage per `ai-governance/templates/ai-usage-disclosure.md`

**Enforcement**: AI usage disclosure checkbox in PR template.

**Evidence artifact**: Signed-off AI usage disclosure.

---

## Exception Path

1. Requestor files exception with justification in the ticket
2. Engineering Manager reviews within 1 business day
3. Approved exceptions logged in `ai-governance/exceptions-log.md`
4. Exceptions expire after 30 days and must be renewed

---

## Acceptance Criteria Template

```gherkin
Feature: [Feature Name]

  Scenario: [Scenario Name]
    Given [initial context]
    And [additional context]
    When [action taken]
    Then [expected outcome]
    And [additional outcome]

  Scenario: [Error Case]
    Given [context]
    When [invalid action]
    Then [error handling outcome]
```

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Rework rate from ambiguous requirements | < 5% of sprint items | Tickets reopened due to unclear reqs / total tickets |
| Requirement completeness score | > 90% fields populated | Automated PR template field check |
| Time from intake to ready | < 2 business days | Ticket lifecycle tracking |

---

## References

- `ai-governance/templates/definition-of-ready.md`
- `ai-governance/templates/threat-model-lite.md`
- `ai-governance/templates/ai-usage-disclosure.md`
- `ai-governance/policies/POL-013-data-classification.md`
