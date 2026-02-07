# POL-003: Detailed Design

| Field | Value |
|-------|-------|
| **Policy ID** | POL-003 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Tech Lead |
| **Approval** | Staff Engineer |

---

## Objective

Ensure implementations are preceded by reviewable designs that specify interfaces, data contracts, error modes, and state transitions—eliminating ambiguity before code is written.

## Scope

Applies to: any change that introduces new API endpoints, data models, service interactions, or non-trivial algorithms (> 200 lines estimated).

---

## Mandatory Controls

### CTRL-003.1: Interface-First Design

New endpoints or service methods MUST be specified as contracts before implementation:

| Artifact | Required | Format |
|----------|----------|--------|
| API spec (REST) | Yes, if REST | OpenAPI 3.x YAML |
| API spec (gRPC) | Yes, if gRPC | Protobuf `.proto` files |
| Event schema | Yes, if event-driven | JSON Schema or Avro |
| Type definitions | Yes, always | TypeScript types / Python dataclasses / equivalent |

**Enforcement**: CI validates OpenAPI spec exists for new route files. Contract tests generated from specs.

**Evidence artifact**: Spec file committed in PR alongside implementation.

### CTRL-003.2: Data Model Review

Schema changes MUST include:

| Element | Required |
|---------|----------|
| Field-level descriptions | Yes |
| Constraints (nullable, length, FK) | Yes |
| Index strategy with query patterns | Yes |
| Migration plan (expand-contract) | Yes |
| Data classification tag per POL-013 | Yes |

**Enforcement**: Migration PR template requires data model section. DBA or data-owner review for tables > 1M rows.

**Evidence artifact**: Migration file + data model section in PR.

### CTRL-003.3: Error Taxonomy

Every new service/module MUST define its error types:

```
Error Code         HTTP Status   Retryable   User Message
VALIDATION_FAILED  400           No          "Invalid input: {details}"
NOT_FOUND          404           No          "Resource not found"
RATE_LIMITED       429           Yes         "Too many requests, retry after {n}s"
UPSTREAM_TIMEOUT   502           Yes         "Service temporarily unavailable"
INTERNAL           500           No          "Something went wrong (ref: {correlationId})"
```

**Enforcement**: Code review checklist. Linter rule: catch blocks must use typed errors.

**Evidence artifact**: Error catalog in service README or design doc.

### CTRL-003.4: State Machine Documentation

Any entity with lifecycle states (order, user, subscription) MUST have a documented state machine:

```
[created] --validate--> [pending] --pay--> [active]
                            |                  |
                            +--cancel-->  [cancelled]
                                               |
                                          [archived]
```

**Enforcement**: Code review checklist for state-bearing entities.

**Evidence artifact**: State diagram in design doc or code comments.

### CTRL-003.5: AI-Assisted Design Validation

AI-generated designs MUST be validated:
- Verify AI-proposed schemas against actual DB engine capabilities
- Validate AI-suggested error codes against existing error catalog
- Cross-check AI-proposed interfaces against existing service contracts

**Enforcement**: Design review checklist includes AI validation items.

**Evidence artifact**: Review comment confirming AI output validated.

---

## Exception Path

1. For hotfixes: post-hoc design doc within 5 business days
2. Tech Lead approves exception, logs in `ai-governance/exceptions-log.md`
3. Design debt tracked as tech-debt ticket

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Design-before-code compliance | > 95% qualifying PRs | PRs with spec file / PRs requiring spec |
| Contract test coverage | 100% of public APIs | APIs with contract tests / total public APIs |
| Post-implementation design drift | < 10% | Spec vs implementation diff in quarterly audit |

---

## References

- `ai-governance/policies/POL-013-data-classification.md`
- `ai-governance/templates/adr-template.md`
- `ai-governance/policies/POL-016-api-versioning.md`
