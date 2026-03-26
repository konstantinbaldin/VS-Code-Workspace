# Promo+

Promo+ (also referred to as PromoPlus) is an internal backend product of The Coca‑Cola Company that powers promotional mechanics across the company's global presence. It serves as the engine behind promotional logic and exposes capabilities to frontend experiences exclusively via APIs.

## Product Constitution

> The constitution is the highest-priority policy for this project. Every spec, plan, and task must be consistent with it. If there is a conflict between a spec and the constitution, the constitution takes precedence.

The full constitution is at [.specify/memory/constitution.md](.specify/memory/constitution.md). Key principles are summarised below.

### What Promo+ is for

Promo+ exists to provide secure, scalable, and reusable promotional capabilities that enable markets to launch compliant consumer campaigns quickly and reliably.

**Success looks like:**
- Markets launch promotions without custom backend logic.
- Promotional behavior is consistent, predictable, and explainable.
- Regulatory constraints are enforced by the platform.
- Platform changes do not require frontend rework.
- Long‑term maintainability improves over time.

**Out of scope:**
- Optimizing individual market customizations at the expense of platform integrity.
- Encoding market‑specific business logic directly into the core engine.

### Invariants (must never be violated)

- Promo+ operates as a platform, not a collection of bespoke solutions.
- Product behavior must be testable and explainable without tribal knowledge.
- Regional and global execution models must remain explicit, intentional, and considered together.
- No hidden production dependencies are allowed.
- Quality is a shared responsibility across roles.

### How requirements work

Requirements define **what outcome must be achieved**, not how it should be implemented.

- Acceptance criteria describe externally observable behavior.
- Implementation decisions are owned by delivery and engineering.
- If an outcome cannot be clearly stated in business or user terms, it is not ready for specification.

---

## Repository Structure

```
.specify/
  memory/
    constitution.md   # Authoritative product constitution
  templates/          # Spec, plan, and task templates
  scripts/            # SpecKit automation scripts
.github/
  agents/             # AI agent definitions for speckit.* workflows
specs/
  NNN-feature-name/
    spec.md           # Feature specification
    plan.md           # Implementation plan
    tasks.md          # Delivery tasks
    research.md       # Research findings
    data-model.md     # Data model design
    contracts/        # Interface and service contracts
    quickstart.md     # Developer quick-start
```

## Working on Promo+

All work follows the delivery workflow defined in the constitution:

1. Define behavior in specification artifacts before implementation.
2. Add or update tests for expected behavior and failure modes.
3. Implement the minimal change that satisfies the specification.
4. Validate locally: lint, tests, and applicable performance checks.
5. Submit for review with evidence: test output, risk notes, and impact assessment.
6. Merge only when all required checks pass.

Use the `speckit.*` agents in `.github/agents/` to create specs, plans, and tasks.
