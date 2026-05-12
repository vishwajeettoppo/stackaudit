# StackAudit Test Suite

This document lists the automated tests for the StackAudit intelligence engine.

## Test Suite Overview
- **Test runner:** Vitest
- **How to run all tests:** `npm test` or `npx vitest run`
- **CI Status:** GitHub Actions (`ci.yml`) runs lint, typecheck, and these tests on every push.

## Core Engine Tests

### 1. audit-engine.test.ts — direct overpayment
**What it covers:** Tests that a user on GitHub Copilot Business with 2 seats who is paying $38 (instead of the expected $19/seat) gets correctly identified as overpaying.
**Command:** `npx vitest run src/lib/__tests__/audit-engine.test.ts`

### 2. audit-engine.test.ts — plan downgrade
**What it covers:** Tests that a solo user on the ChatGPT Pro ($200) plan is flagged for a downgrade to a more cost-effective tier when their use case doesn't justify the high-tier spend.
**Command:** `npx vitest run src/lib/__tests__/audit-engine.test.ts`

### 3. audit-engine.test.ts — tool migration
**What it covers:** Tests that a user on GitHub Copilot is suggested a switch to Cursor to save money while gaining advanced IDE features.
**Command:** `npx vitest run src/lib/__tests__/audit-engine.test.ts`

### 4. audit-engine.test.ts — high-volume API credits
**What it covers:** Tests that high spend (>$100) on API tools like Anthropic correctly triggers a "consider credits" recommendation for a 15% discount.
**Command:** `npx vitest run src/lib/__tests__/audit-engine.test.ts`

### 5. audit-engine.test.ts — min seat eligibility
**What it covers:** Tests that a team of 5 on the Claude Team plan is NOT suggested a downgrade to Pro, because the Team plan requires a minimum of 5 seats.
**Command:** `npx vitest run src/lib/__tests__/audit-engine.test.ts`

### 6. audit-engine.test.ts — combined savings logic
**What it covers:** Tests that monthly and annual savings are calculated correctly when multiple tools across the stack have different types of recommendations.
**Command:** `npx vitest run src/lib/__tests__/audit-engine.test.ts`

## Validation Results
All tests were verified on **2026-05-07** and are currently passing.
```text
Test Files  1 passed (1)
Tests       10 passed (10)
```
