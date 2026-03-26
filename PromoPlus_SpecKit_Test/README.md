# Promo+

Promo+ (also referred to as PromoPlus) is an internal backend product of The Coca‑Cola Company that powers promotional mechanics across the company's global presence. It is available across all consumer channels and integrates with multiple consumer-facing experiences. All capabilities are exposed exclusively via APIs; no frontend logic is embedded in the platform.

## Product Constitution

> The constitution is the highest-priority policy for this project. Every spec, plan, and task must be consistent with it. If there is a conflict between a spec and the constitution, the constitution takes precedence.

The full constitution (v1.2.0) is at [.specify/memory/constitution.md](.specify/memory/constitution.md). Key principles are summarised below.

### What Promo+ is for

Promo+ exists to provide secure, scalable, and reusable promotional capabilities that enable markets to launch compliant consumer campaigns quickly and reliably — at a fraction of the cost traditionally associated with running promotions.

**Key stakeholders:**
- **Market teams** — primary consumers of promotional capabilities; define campaign requirements.
- **Frontend / channel teams** — API consumers; require stable contracts and predictable behaviour.
- **MarTech platform team** — owns platform integrity, scalability, and evolution.
- **Legal and compliance** — own GDPR, regional regulation, and security assessment sign-off.

**Success looks like:**
- Markets launch promotions without custom backend logic.
- Time and cost to launch a new promotional mechanic decreases over successive platform versions.
- Promotional behavior is consistent, predictable, and explainable.
- Regulatory constraints are enforced by the platform.
- Platform changes do not require frontend rework.
- Long‑term maintainability improves over time.

**Out of scope:**
- Optimizing individual market customizations at the expense of platform integrity.
- Encoding market‑specific business logic directly into the core engine.
- Re-coupling the platform to a new cloud provider's proprietary features beyond what is required for equivalent functionality.

### Invariants (must never be violated)

- Promo+ operates as a platform, not a collection of bespoke solutions.
- Product behavior must be testable and explainable without tribal knowledge.
- Regional and global execution models must remain explicit, intentional, and considered together.
- No hidden production dependencies are allowed.
- Quality is a shared responsibility across roles.
- All PII handling must comply with GDPR and applicable regional data protection regulations.
- Every change touching authentication, authorisation, data access, or external integrations must pass a security assessment before release.
- Infrastructure changes must not alter observable API behaviour or SLA commitments without a versioned deprecation process.
- Cloud service integrations must be abstracted behind interfaces to avoid provider lock-in.

**Platform baseline NFRs:** API availability ≥ 99.9%; all promotional outcomes auditable and traceable; latency targets defined per mechanic type.

### How requirements work

Requirements define **what outcome must be achieved**, not how it should be implemented.

- Acceptance criteria describe externally observable behavior.
- Implementation decisions are owned by delivery and engineering.
- A requirement is not ready for delivery until: acceptance criteria are testable, dependencies identified, a business owner assigned, and compliance obligations noted.
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
