# Feature Specification: Promo+ AWS-to-GCP Migration

**Feature Branch**: `002-aws-to-gcp-migration`  
**Created**: 2026-03-26  
**Status**: Draft  
**Input**: User description: "Promo+ platform migration from AWS to GCP - infrastructure re-hosting, service parity, and post-migration operations support"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - GCP Infrastructure Deployment (Priority: P1)

A platform engineer needs to provision all Promo+ infrastructure on GCP so that the application can run in the new environment before any traffic cutover occurs. This is the foundational prerequisite for every other migration step.

**Why this priority**: Nothing else can proceed until the GCP environment exists and mirrors the AWS topology. This is the critical path item for the entire migration.

**Independent Test**: Can be fully tested by deploying infrastructure via IaC scripts into a GCP project, verifying all services are healthy, and confirming Promo+ starts and passes a smoke-test suite — all without touching production AWS traffic.

**Acceptance Scenarios**:

1. **Given** a fresh GCP project with IAM and billing configured, **When** the IaC pipeline (`terraform apply` or equivalent) runs, **Then** all required GCP services (Compute Engine/GKE, Cloud SQL, Cloud Storage, Cloud Run/Functions, Pub/Sub, Memorystore, Cloud Load Balancing, Cloud CDN, Cloud DNS, Secret Manager) are provisioned with no manual steps.
2. **Given** a provisioned GCP environment, **When** the Promo+ application containers are deployed, **Then** all services start successfully, pass health checks, and the application responds to internal smoke tests within 10 minutes of deployment.
3. **Given** GCP infrastructure is provisioned, **When** configuration secrets and environment variables are applied from Secret Manager, **Then** no plaintext credentials exist in deployment artifacts or logs.

---

### User Story 2 - Zero-Downtime Traffic Cutover (Priority: P2)

A release engineer needs to migrate live Promo+ traffic from AWS to GCP incrementally so that end users experience no service disruption during the transition window.

**Why this priority**: User impact is the highest risk in a migration. A controlled, reversible cutover with rollback capability protects both users and the business during the critical switchover moment.

**Independent Test**: Can be tested end-to-end in a staging environment by running both AWS and GCP stacks simultaneously, shifting synthetic traffic from 0% → 100% GCP via DNS weighted routing or load-balancer weights, and verifying zero 5xx errors and less than 100ms latency increase throughout.

**Acceptance Scenarios**:

1. **Given** both AWS and GCP stacks are running with data in sync, **When** traffic weight is shifted from AWS to GCP in configurable increments (10% → 25% → 50% → 100%), **Then** each increment completes without error-rate increase and can be paused or reversed within 5 minutes.
2. **Given** a cutover is in progress and a critical error is detected, **When** the rollback procedure is executed, **Then** 100% of traffic returns to AWS within 5 minutes with no data loss for in-flight transactions.
3. **Given** traffic is fully on GCP, **When** the AWS stack is decommissioned after a defined stabilisation period, **Then** no user-visible functionality is lost and all data is owned by GCP resources.

---

### User Story 3 - GCP Operations Parity (Priority: P3)

An operations engineer needs equivalent observability, alerting, and incident-response tooling on GCP so that the on-call team can monitor, diagnose, and remediate Promo+ issues without learning a completely different workflow.

**Why this priority**: Post-migration supportability is essential for long-term stability. Gaps in monitoring or runbooks create operational risk that outlasts the migration itself.

**Independent Test**: Can be tested independently by provisioning GCP monitoring dashboards, firing synthetic error conditions, and verifying that alerts fire, logs are queryable, and runbooks produce the same diagnostic outcomes as the AWS equivalents.

**Acceptance Scenarios**:

1. **Given** Promo+ is running on GCP, **When** an operations engineer opens Cloud Monitoring, **Then** they can view the same set of service health metrics (request rate, error rate, latency p50/p95/p99, resource utilisation) that were previously available in CloudWatch.
2. **Given** a service degradation event occurs on GCP, **When** alert thresholds are breached, **Then** PagerDuty (or equivalent) is notified within 2 minutes and the alert includes a direct link to the relevant log query and dashboard.
3. **Given** a post-migration incident, **When** an on-call engineer follows the GCP runbook for Promo+, **Then** the runbook provides actionable steps equivalent to the existing AWS runbooks and allows resolution without GCP-specific tribal knowledge.

---

### User Story 4 - Data Migration and Integrity Verification (Priority: P4)

A data engineer needs to migrate all Promo+ persistent data (databases, object storage, queued messages) from AWS to GCP with verifiable integrity so that the GCP environment reflects the complete and correct production state.

**Why this priority**: Data loss or corruption during migration is catastrophic. This story is lower priority only because it is parallelisable with infrastructure setup and occurs before cutover, not because the outcome matters less.

**Independent Test**: Can be tested independently by running a full data migration from a production snapshot to GCP and executing the integrity verification suite, which compares row counts, checksums, and a statistically sampled record comparison between source and destination.

**Acceptance Scenarios**:

1. **Given** a production AWS database snapshot, **When** the data migration pipeline runs, **Then** all records are present in Cloud SQL with row-count and checksum parity confirmed by the verification report.
2. **Given** production S3 buckets, **When** objects are migrated to Cloud Storage, **Then** all objects are present with identical checksums, ACLs are translated to equivalent IAM policies, and no object is readable by unauthorised principals.
3. **Given** the data migration is complete, **When** the verification report is reviewed, **Then** the report shows 0 discrepancies in mandatory data sets and any acceptable discrepancies (e.g., eventual-consistency deltas for live data) are documented with resolution plans.

---

### Edge Cases

- What happens when a GCP service quota is insufficient for Promo+ peak load? (Pre-migration quota requests must be submitted and approved before cutover begins.)
- How does the system handle in-flight AWS SQS messages when the application is cut over to GCP Pub/Sub? (Define a drain-and-idle period; no cutover until queue depth reaches zero or messages are replayed.)
- What happens if the Cloud SQL primary fails during the migration data-sync window? (Replication from AWS RDS re-syncs from the last consistent checkpoint; migration pauses until replication lag is within the defined SLA.)
- How does the system handle AWS-specific environment variables or SDK calls baked into application code? (Audit pass required before migration; all AWS SDK calls replaced with GCP equivalents or abstracted behind an interface layer.)
- What happens to long-running scheduled jobs (AWS EventBridge/Cron) during cutover? (Job schedules are disabled on AWS before enabling on Cloud Scheduler; no dual-execution window is permitted.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The migration MUST provision all GCP target services using infrastructure-as-code (Terraform or equivalent) with no manual console steps required for a fresh environment.
- **FR-002**: The GCP environment MUST achieve feature parity with the AWS environment: all Promo+ endpoints, integrations, scheduled jobs, and background workers MUST function identically.
- **FR-003**: The traffic cutover mechanism MUST support incremental traffic shifting with configurable weight increments and the ability to halt or reverse the cutover at any increment.
- **FR-004**: Rollback to AWS MUST be executable within 5 minutes from the point a rollback decision is made, with no data loss for transactions that completed before rollback.
- **FR-005**: All persistent data (relational databases, object storage, message queues) MUST be migrated with a verified integrity report showing 0 unresolved discrepancies before cutover begins.
- **FR-006**: All secrets and credentials MUST be stored in GCP Secret Manager; no plaintext credentials may appear in code, IaC files, deployment manifests, or CI/CD pipeline logs.
- **FR-007**: The GCP environment MUST have equivalent or better observability to AWS: metrics, logs, distributed traces, and uptime checks covering all Promo+ services.
- **FR-008**: Alerting MUST be configured with the same severity tiers and escalation paths as the AWS environment, delivering notifications within 2 minutes of threshold breach.
- **FR-009**: Runbooks for the GCP environment MUST be produced for all existing AWS runbooks, reviewed by at least one on-call engineer, and stored in the project documentation.
- **FR-010**: The GCP VPC network MUST enforce equivalent or stricter security group / firewall rules as the AWS VPC, with no public ingress except via the designated load balancer.
- **FR-011**: The migration MUST support a parallel-running period of at least 48 hours where both AWS and GCP stacks handle production traffic before AWS is decommissioned.
- **FR-012**: Post-migration, the AWS infrastructure MUST be fully decommissioned within [NEEDS CLARIFICATION: decommission timeline — 30, 60, or 90 days post-cutover?] to avoid dual-cloud cost accumulation.

### Key Entities

- **AWS Service Inventory**: The enumerated set of AWS services, regions, instance types, and configurations that compose the current Promo+ platform. Source of truth for migration scope.
- **GCP Service Mapping**: The authoritative mapping of each AWS service to its GCP equivalent, including configuration translation notes and known behavioural differences.
- **Migration Runbook**: Step-by-step procedure covering pre-migration checks, data sync, cutover increments, verification gates, rollback triggers, and post-cutover cleanup.
- **Data Migration Pipeline**: The automated process (e.g., AWS DMS, custom scripts, Storage Transfer Service) that replicates and verifies data from AWS to GCP before cutover.
- **Cutover Plan**: The time-boxed, role-assigned execution plan for the go-live event, including communication checkpoints, success criteria, and rollback decision authority.
- **GCP Operations Runbook**: Per-service operational documentation covering health checks, common failure modes, diagnostic queries, and remediation steps for the GCP environment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The GCP environment passes 100% of the existing Promo+ integration and smoke test suite before any production traffic is shifted.
- **SC-002**: End-to-end cutover (0% → 100% GCP) completes within a planned maintenance window of 4 hours or less, with no customer-visible errors exceeding the production SLA error budget.
- **SC-003**: p95 API latency on GCP is within 10% of the equivalent AWS baseline measured over the same traffic profile.
- **SC-004**: Data integrity verification report shows 0 unresolved discrepancies across all mandatory data sets (relational DB, object storage) before cutover.
- **SC-005**: Rollback procedure is rehearsed at least once in a staging environment and confirmed to complete within 5 minutes.
- **SC-006**: All GCP monitoring dashboards, alerts, and runbooks are reviewed and signed off by the operations team before the production cutover window.
- **SC-007**: Zero plaintext credentials are present in any deployment artifact, IaC state file, or CI/CD log at any point during or after the migration.
- **SC-008**: AWS infrastructure decommission is completed by the agreed deadline, confirmed by a final cost-centre report showing $0 in Promo+ AWS spend.

## Assumptions

- Promo+ currently runs on containerised workloads (Docker/OCI images); container images are portable and do not contain AWS-specific compiled binaries.
- The Promo+ codebase already abstracts storage and messaging behind interfaces, minimising direct AWS SDK references in application code.
- A GCP billing account, organisation structure, and base IAM setup with the required service APIs enabled will be provided before migration work begins.
- Network connectivity between AWS and GCP (AWS Direct Connect or VPN tunnel via Cloud Interconnect/HA VPN) will be available for the data sync period.
- The operations team has basic GCP familiarity; deep GCP-specific training is out of scope for this spec but should be tracked as a parallel work item.
