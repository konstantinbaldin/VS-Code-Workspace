# PromoPlus_SpecKit_Test Constitution

## Core Principles

### I. Code Quality by Default
All production code must prioritize clarity, maintainability, and correctness over short-term speed. Changes must be small, readable, and consistent with existing project patterns. Every pull request must include meaningful naming, focused scope, and removal of dead code introduced by the change.

### II. Test-Backed Development (Non-Negotiable)
Every feature or bug fix must include appropriate automated tests before merge. Unit tests are required for business logic; integration tests are required when components interact across boundaries. A change is not complete unless tests fail before the fix, pass after the fix, and guard against regression.

### III. User Experience Consistency
User-facing behavior must remain predictable across screens, flows, and edge cases. Existing design patterns, terminology, interaction models, and accessibility expectations must be reused rather than reinvented. Any intentional UX deviation must be documented in the related specification and approved during review.

### IV. Performance as a Requirement
Performance is a product requirement, not a post-release task. New work must define expected latency/throughput impact and avoid avoidable allocations, blocking calls, and redundant computation. Regressions in critical user paths must be measured, explained, and resolved before release.

### V. Simplicity and Reversibility
Prefer the simplest solution that satisfies the requirement with clear rollback paths. Avoid speculative abstractions, premature optimization, and architecture changes without demonstrated need. When trade-offs are necessary, capture rationale and alternatives in the implementation plan.

## Engineering Standards

- Keep functions and modules single-purpose and cohesive.
- Enforce static checks and formatting before merge.
- Require peer review for all non-trivial changes.
- Document public interfaces and behavioral assumptions.
- Treat warnings in build/test pipelines as actionable quality signals.

## Delivery Workflow and Quality Gates

1. Define behavior in specification artifacts before implementation.
2. Add or update tests for expected behavior and failure modes.
3. Implement the minimal change that satisfies the specification.
4. Validate locally: lint, tests, and any applicable performance checks.
5. Submit for review with evidence: test output, risk notes, and UX/performance impact.
6. Merge only when all required checks pass.

## Governance

This constitution is the highest-priority engineering policy for this repository. All specifications, plans, and tasks must align with these principles. Amendments require: (a) written rationale, (b) explicit impact analysis on existing work, and (c) approval recorded in project documentation.

Compliance is verified during planning, review, and release readiness checks. Non-compliant work must be revised before merge unless an explicit, time-bound exception is documented and approved.

**Version**: 1.0.0 | **Ratified**: 2026-03-16 | **Last Amended**: 2026-03-16
