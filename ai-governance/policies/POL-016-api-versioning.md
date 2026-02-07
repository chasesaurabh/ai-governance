# POL-016: API Versioning & Deprecation

| Field | Value |
|-------|-------|
| **Policy ID** | POL-016 |
| **Version** | 2.0 |
| **Last Reviewed** | 2026-02-06 |
| **Owner** | Staff Engineer / API Platform Lead |
| **Approval** | Engineering Manager |

---

## Objective

Ensure all APIs evolve predictably with clear versioning, documented breaking changes, graceful deprecation, and consumer migration support—so that no team is surprised by broken integrations.

## Scope

Applies to: all REST APIs, gRPC services, GraphQL schemas, event schemas, SDK/client libraries, and CLI tools.

---

## Mandatory Controls

### CTRL-016.1: Versioning Scheme

| API Type | Versioning Method | Example |
|----------|------------------|---------|
| REST (external) | URL path versioning | `/v1/users`, `/v2/users` |
| REST (internal) | URL path or header | `Accept: application/vnd.myapi.v2+json` |
| gRPC | Package versioning | `package myapi.v2;` |
| GraphQL | Field-level deprecation | `@deprecated(reason: "Use newField")` |
| Events/Messages | Schema registry with compatibility mode | Avro BACKWARD compatibility |
| SDKs/Libraries | Semantic versioning | `2.1.0` |
| CLI tools | Semantic versioning | `myctl v2.1.0` |

Semantic versioning rules:
```
MAJOR (X.0.0) - Breaking changes (removal, rename, type change)
MINOR (0.X.0) - Backward-compatible additions
PATCH (0.0.X) - Backward-compatible bug fixes
```

**Enforcement**: OpenAPI spec linter validates version field. Schema registry enforces compatibility.

**Evidence artifact**: OpenAPI spec with version, schema registry compatibility check.

### CTRL-016.2: Breaking Change Detection

Changes classified as breaking:

| Change | Breaking? | Handling |
|--------|-----------|----------|
| Remove endpoint | Yes | New major version + deprecation |
| Remove field from response | Yes | New major version + deprecation |
| Add required field to request | Yes | New major version |
| Change field type | Yes | New major version |
| Rename field | Yes | New major version |
| Add optional request field | No | Minor version |
| Add response field | No | Minor version |
| Change error message text | No | Patch version |
| Change HTTP status code | Yes | New major version |

Automated breaking change detection:
```yaml
# CI step: compare OpenAPI spec with previous version
api_diff:
  tool: oasdiff / openapi-diff
  base: main branch spec
  revision: PR spec
  fail_on:
    - endpoint_removed
    - request_field_required_added
    - response_field_removed
    - field_type_changed
    - status_code_changed
```

**Enforcement**: CI API diff stage blocks merge on unversioned breaking changes.

**Evidence artifact**: API diff report in PR.

### CTRL-016.3: Deprecation Process

| Phase | Timeline | Actions |
|-------|----------|---------|
| **Announce** | T-90 days | Add `Deprecated: true` header, update docs, notify consumers |
| **Warn** | T-60 days | Log all usage of deprecated endpoints, send weekly reports |
| **Final notice** | T-30 days | Direct notification to remaining consumers |
| **Sunset** | T-0 | Return `410 Gone` or redirect to new version |
| **Remove** | T+30 days | Remove code (keep sunset response for 30 more days) |

Deprecation response headers:
```http
Deprecation: true
Sunset: Sat, 01 Jun 2026 00:00:00 GMT
Link: <https://api.example.com/v2/users>; rel="successor-version"
```

**Enforcement**: Deprecation middleware auto-adds headers. Consumer usage dashboard. Sunset date in API registry.

**Evidence artifact**: Deprecation headers in responses, consumer migration tracking.

### CTRL-016.4: Consumer Registry & Notification

| Requirement | Details |
|-------------|---------|
| Consumer registry | All API consumers registered with contact info |
| Impact assessment | Breaking change PR must list affected consumers |
| Notification method | Email + Slack + API changelog |
| Migration support | Migration guide for every breaking change |
| Consumer testing | Consumer contract tests run on provider changes |

**Enforcement**: Consumer registry maintained. PR template for breaking changes includes consumer notification section.

**Evidence artifact**: Consumer registry, notification records, migration guides.

### CTRL-016.5: Concurrent Version Support

| Rule | Requirement |
|------|-------------|
| Minimum versions supported | 2 concurrent major versions |
| Maximum versions supported | 3 (to limit maintenance burden) |
| Version-specific test coverage | All supported versions have full test suites |
| Version-specific monitoring | Separate metrics per version |
| Routing | API gateway routes to correct version |

**Enforcement**: API gateway configuration. CI test matrix includes all supported versions.

**Evidence artifact**: Version support matrix, CI test results per version.

---

## Exception Path

1. Emergency deprecation (security vulnerability in old version): 7-day accelerated timeline, Security Lead approval
2. Consumer unable to migrate by sunset: 30-day extension maximum, consumer must provide migration plan
3. All exceptions logged in `ai-governance/exceptions-log.md`

---

## KPI Linkage

| KPI | Target | Measurement |
|-----|--------|-------------|
| Breaking changes without versioning | 0 | CI API diff catches / total breaking PRs |
| Consumer migration before sunset | 100% | Consumers migrated / total consumers on deprecated version |
| Deprecation notice compliance | 100% of deprecations follow 90-day process | Deprecation tracker |
| API version sprawl | ≤ 3 versions per API | API registry |
| Consumer notification SLA | 100% notified within 24h of deprecation announce | Notification records |

---

## References

- `ai-governance/policies/POL-002-architecture.md`
- `ai-governance/policies/POL-003-design.md`
- `ai-governance/policies/POL-012-change-management.md`
