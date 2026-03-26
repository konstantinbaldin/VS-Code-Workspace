# Implementation Plan: Promo+ AWS-to-GCP Migration

**Branch**: `002-aws-to-gcp-migration` | **Date**: 2026-03-26 | **Spec**: [specs/002-aws-to-gcp-migration/spec.md](specs/002-aws-to-gcp-migration/spec.md)  
**Input**: Feature specification from `/specs/002-aws-to-gcp-migration/spec.md`

## Summary

Migrate the Promo+ platform from AWS to GCP through three sequential phases: infrastructure provisioning with Terraform (IaC-first), a verified data migration with integrity checks, and a controlled incremental traffic cutover with a fully rehearsed rollback path. The migration targets service parity while establishing equivalent or better observability, security posture, and operational runbooks for the GCP environment.

## Technical Context

**Language/Version**: Terraform ≥ 1.7 (IaC); existing Promo+ application language/runtime carried over unchanged  
**Primary Dependencies**: Terraform GCP Provider, Google Cloud SDK, Cloud SQL, Cloud Run / GKE, Cloud Storage, Pub/Sub, Memorystore (Redis), Secret Manager, Cloud Monitoring, Cloud Logging, Cloud Trace, Cloud Load Balancing, Cloud CDN, Cloud DNS  
**Storage**: Cloud SQL (relational DB — MySQL/PostgreSQL parity with AWS RDS); Cloud Storage (object storage — S3 equivalent); Memorystore (cache — ElastiCache equivalent)  
**Testing**: Terratest (IaC unit tests), existing Promo+ integration/smoke test suite (ported to run against GCP environment), synthetic canary monitors (Cloud Monitoring Uptime Checks)  
**Target Platform**: GCP — single primary region with multi-zone redundancy; DR region NEEDS CLARIFICATION (active-passive vs. active-active post-migration)  
**Project Type**: Cloud infrastructure migration + operational tooling  
**Performance Goals**: GCP p95 API latency within 10% of AWS baseline; cutover window ≤ 4 hours; rollback completion ≤ 5 minutes  
**Constraints**: Zero data loss during migration; no plaintext credentials in any artifact; parallel-run period ≥ 48 hours before AWS decommission; rollback must be rehearsed before production cutover  
**Scale/Scope**: Full production Promo+ platform; scope bounded by the AWS Service Inventory (FR-001)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality by Default**: PASS — IaC is written as composable Terraform modules with clear naming; no copy-paste resource blocks; all modules peer-reviewed before apply.
- **Test-Backed Development**: PASS — Terratest covers IaC modules; existing Promo+ integration suite must pass 100% against GCP before cutover; rollback procedure rehearsed in staging.
- **User Experience Consistency**: PASS — migration is infrastructure-only; no user-facing changes are in scope; service parity (FR-002) enforces identical behaviour.
- **Performance as a Requirement**: PASS — SC-003 defines a measurable latency ceiling (within 10% of AWS baseline); load tests run against GCP before cutover.
- **Simplicity and Reversibility**: PASS — incremental traffic cutover with pause/rollback at each step (FR-003, FR-004); AWS stack kept live during the parallel-run period; rollback procedure is a documented, timed operation.

## Project Structure

### Documentation (this feature)

```text
specs/002-aws-to-gcp-migration/
├── plan.md                    # This file
├── research.md                # Phase 0: service mapping, tooling decisions
├── data-model.md              # Phase 1: data migration schema, entity mapping
├── quickstart.md              # Phase 1: dev/ops quick-start for GCP environment
├── contracts/
│   ├── aws-inventory.md       # Enumerated AWS services in scope
│   ├── gcp-service-map.md     # AWS → GCP service equivalence table
│   └── cutover-runbook.md     # Step-by-step cutover and rollback procedure
└── tasks.md                   # Phase 2 output (speckit.tasks command)
```

### Source Code (repository root)

```text
infra/
├── modules/
│   ├── networking/            # VPC, subnets, firewall rules, Cloud DNS
│   ├── compute/               # GKE cluster or Cloud Run services
│   ├── database/              # Cloud SQL instance, backups, replicas
│   ├── storage/               # Cloud Storage buckets, lifecycle policies
│   ├── messaging/             # Pub/Sub topics and subscriptions
│   ├── cache/                 # Memorystore (Redis) instances
│   ├── cdn/                   # Cloud CDN, Cloud Load Balancing
│   └── secrets/               # Secret Manager secrets layout
├── environments/
│   ├── staging/               # Staging GCP project Terraform root
│   └── production/            # Production GCP project Terraform root
└── scripts/
    ├── data-migration/        # Data migration pipeline scripts
    ├── verify-integrity/      # Post-migration verification scripts
    └── cutover/               # Traffic weight adjustment and rollback scripts

monitoring/
├── dashboards/                # Cloud Monitoring dashboard JSON definitions
├── alerts/                    # Alert policy definitions (Terraform or YAML)
└── runbooks/                  # GCP operational runbooks (per service)

tests/
└── infra/                     # Terratest test files for IaC modules
```

**Structure Decision**: Infrastructure-as-code monorepo layout under `infra/` with environment separation. Migration scripts collocated under `infra/scripts/`. Monitoring definitions versioned alongside infrastructure. Existing Promo+ application code is not restructured — only deployment targets change.

## Phase 0: Research

*Resolve all NEEDS CLARIFICATION items and establish tooling decisions.*

**Outputs**: `research.md`

### Research Tasks

1. **AWS Service Inventory audit** — Enumerate all AWS services, regions, instance types, and inter-service dependencies currently used by Promo+. Document in `contracts/aws-inventory.md`.
2. **GCP service mapping** — For each AWS service in the inventory, identify the GCP equivalent, configuration translation notes, and known behavioural differences (e.g., SQS visibility timeout vs. Pub/Sub ack deadline). Document in `contracts/gcp-service-map.md`.
3. **Data migration tooling** — Evaluate AWS DMS, Google Database Migration Service, and custom pg_dump/mysqldump pipelines for relational DB migration. Evaluate Storage Transfer Service vs. `gsutil rsync` for S3→GCS. Choose and document rationale.
4. **Network connectivity** — Confirm AWS Direct Connect or HA VPN availability for the data sync period; document bandwidth and latency constraints.
5. **DR region decision** — Resolve NEEDS CLARIFICATION: confirm target region(s) and DR strategy (active-passive vs. active-active) with stakeholders.
6. **Decommission timeline** — Resolve NEEDS CLARIFICATION: confirm AWS decommission deadline (30/60/90 days post-cutover) with finance and ops stakeholders.
7. **GCP quota pre-provisioning** — Calculate required GCP quotas (CPU, memory, disk, Cloud SQL storage, Pub/Sub throughput) against Promo+ peak load and submit quota increase requests.

## Phase 1: Design

*Produce data model, contracts, and quickstart. Re-check Constitution after design.*

**Outputs**: `data-model.md`, `contracts/`, `quickstart.md`

### Phase 1 Deliverables

1. **`data-model.md`** — Schema migration plan: column type mappings (AWS RDS dialect → Cloud SQL dialect), index equivalence, sequence/auto-increment translation, and any schema changes required for Cloud SQL compatibility.
2. **`contracts/aws-inventory.md`** — Complete AWS service inventory with owner assignments and decommission dependencies.
3. **`contracts/gcp-service-map.md`** — Authoritative AWS → GCP mapping table with configuration notes.
4. **`contracts/cutover-runbook.md`** — Step-by-step cutover plan: pre-checks, data sync verification, traffic weight increments (10% → 25% → 50% → 100%), success gates at each increment, rollback triggers, and post-cutover decommission checklist.
5. **`quickstart.md`** — Developer and operator quick-start: how to provision a local/staging GCP environment, run the smoke test suite, and execute a test cutover.

### Phase 1 Constitution Re-check

*(Complete after Phase 1 artifacts are written)*

- [ ] IaC modules are single-purpose and composable — no monolithic `main.tf` files
- [ ] All secrets resolved via Secret Manager; no `.tfvars` files containing credentials committed
- [ ] Cutover runbook includes explicit rollback decision criteria and authority assignment
- [ ] Data migration pipeline is idempotent (can be re-run without side effects)
- [ ] Monitoring dashboards cover all Promo+ SLIs defined in the spec

## Phase 2: Implementation Sequencing

*Ordered delivery phases — each gate must pass before the next phase begins.*

### Gate 0 → Phase A: GCP Infrastructure (FR-001, FR-010)
- Provision networking (VPC, subnets, firewall rules, Cloud DNS)
- Provision compute (GKE or Cloud Run), database (Cloud SQL), storage (GCS), messaging (Pub/Sub), cache (Memorystore)
- Configure Secret Manager and inject secrets into deployment
- **Gate A**: `terraform plan` shows zero drift; Promo+ smoke tests pass 100% against GCP staging

### Gate A → Phase B: Data Migration (FR-005, FR-006)
- Execute data migration pipeline against staging (dry run)
- Run integrity verification; confirm 0 discrepancies
- Execute data migration against production snapshot
- **Gate B**: Integrity verification report shows 0 unresolved discrepancies (SC-004)

### Gate B → Phase C: Observability & Runbooks (FR-007, FR-008, FR-009)
- Deploy Cloud Monitoring dashboards, alert policies, uptime checks
- Author and review GCP operational runbooks
- Conduct ops team walkthrough; sign-off on runbook completeness
- **Gate C**: All alert policies tested (synthetic fault injection); ops team sign-off obtained (SC-006)

### Gate C → Phase D: Cutover Rehearsal & Production Cutover (FR-003, FR-004, FR-011)
- Execute full cutover + rollback rehearsal in staging environment (SC-005)
- Schedule production cutover window
- Execute incremental traffic shift: 10% → 25% → 50% → 100% GCP
- Monitor for 48+ hours on 100% GCP before AWS decommission
- **Gate D**: Zero customer-visible errors exceeding SLA error budget; p95 latency within 10% of AWS baseline (SC-002, SC-003)

### Gate D → Phase E: AWS Decommission (FR-012)
- Disable and remove AWS resources per the decommission checklist in the cutover runbook
- Confirm $0 Promo+ AWS spend via cost-centre report (SC-008)
- Archive AWS infrastructure code and configs
- **Gate E**: SC-008 confirmed; migration closed
