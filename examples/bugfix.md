# Example: Bug Fix Workflow

> Prompt → Detected Workflow → Output Outline

---

## User Prompt

```
The checkout page is broken — users click "Place Order" and get a blank white screen.
Started happening after yesterday's deploy. Affects all browsers.
```

## Auto-Router Detection

```
📋 Detected: Bug Fix (governance workflow auto-triggered)
Following: POL-004 → POL-005 → POL-015

Systematic debugging: reproduce → root cause → regression test → minimal fix.
```

---

## Output Outline

### Step 1: Reproduce & Classify

- **Severity**: SEV2 — major feature broken (checkout), no workaround
- **Reproduction**: Navigate to /checkout with items in cart → click "Place Order" → blank screen
- **Scope**: All users, all browsers, started after deploy #347 (yesterday 2:15 PM)
- **Console error**: `TypeError: Cannot read properties of undefined (reading 'id')` in `OrderService.js:87`

### Step 2: Root Cause Investigation (POL-004)

```bash
git log --since="2 days ago" --oneline
# → abc1234 refactor: extract order validation into separate module
```

- **Root cause**: PR #345 refactored `OrderService` and renamed `order.id` to `order.orderId`, but the checkout handler still references `order.id`
- **Error location**: `OrderService.js:87` — `processPayment(order.id)` should be `processPayment(order.orderId)`
- **Root cause documented BEFORE writing fix**

### Step 3: Escape Analysis (POL-015)

- **Which gate should have caught this?** Gate 2 — unit/integration tests
- **Gap**: No test for the `processPayment()` call with the refactored order object shape
- **Action**: Add test that verifies checkout flow with current order schema

### Step 4: Regression Test (POL-005)

```javascript
// test/checkout.test.js
it('should process payment with order ID from refactored schema', () => {
  const order = { orderId: 'ORD-123', items: [...], total: 99.99 };
  // This test FAILS with current code (order.id is undefined)
  expect(() => processPayment(order)).not.toThrow();
  expect(paymentGateway.charge).toHaveBeenCalledWith('ORD-123', 99.99);
});
```

- Test verified to FAIL before fix ✓

### Step 5: Implement Fix (POL-004)

```diff
- processPayment(order.id)
+ processPayment(order.orderId)
```

- Single-line fix targeting root cause
- No downstream workaround, no over-engineering
- Full test suite run — regression test now PASSES, no other failures

### Step 6: Security & Data Check

- Checkout involves payment data — quick security check:
  - [ ] No new inputs exposed (no change to inputs)
  - [ ] No secrets affected (no change to secrets handling)
  - [ ] Payment data handling unchanged (just the ID reference)

### Step 7: PR & Documentation

- **PR description**: Root cause (property rename not propagated), fix (single reference update), escape analysis (missing integration test for checkout→payment flow)
- **PR checklist**: Completed
- **AI disclosure**: Attached

---

## Key Governance Controls Applied

| Control | Policy | How Applied |
|---------|--------|-------------|
| Root cause first | POL-004 | Identified property rename as cause before coding |
| Escape analysis | POL-015 | Documented which quality gate missed the bug |
| Regression test | POL-005 | Test written and verified failing before fix |
| Minimal fix | POL-004 | Single-line change, no over-engineering |
| Structured logging | POL-008 | Error tracked via existing monitoring |
| AI disclosure | POL-014 | AI assistance documented in PR |
