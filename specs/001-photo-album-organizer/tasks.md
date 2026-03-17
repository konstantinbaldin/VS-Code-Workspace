# Tasks: Photo Album Organizer

**Input**: Design documents from `/specs/001-photo-album-organizer/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Included by requirement (constitution requires test-backed development).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`US1`, `US2`, `US3`, `US4`)
- All tasks include explicit file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project skeleton for Vite frontend + minimal local Node/SQLite backend.

- [ ] T001 Create frontend/backend directories and baseline files in `frontend/` and `backend/`
- [ ] T002 Initialize `frontend/package.json` with Vite scripts (`dev`, `build`, `test`)
- [ ] T003 Initialize `backend/package.json` with Node API scripts (`dev`, `start`, `test`)
- [ ] T004 [P] Add frontend lint/test config in `frontend/vitest.config.js` and `frontend/eslint.config.js`
- [ ] T005 [P] Add backend test config in `backend/vitest.config.js`
- [ ] T006 [P] Add shared ignore and env templates in `.gitignore`, `frontend/.env.example`, `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core platform pieces required before any user story work.

**⚠️ CRITICAL**: No user story tasks start before this phase is complete.

- [ ] T007 Create SQLite schema in `backend/src/db/schema.sql` for albums/photos/order indexes
- [ ] T008 Implement SQLite connection bootstrap in `backend/src/db/connection.js`
- [ ] T009 [P] Implement album repository base methods in `backend/src/db/repositories/album-repository.js`
- [ ] T010 [P] Implement photo repository base methods in `backend/src/db/repositories/photo-repository.js`
- [ ] T011 Implement path normalization utilities in `backend/src/storage/image-paths.js`
- [ ] T012 Implement API server bootstrap and middleware in `backend/src/server.js`
- [ ] T013 [P] Wire album routes module in `backend/src/api/albums.js`
- [ ] T014 [P] Wire photo routes module in `backend/src/api/photos.js`
- [ ] T015 Configure Vite dev proxy for local API in `frontend/vite.config.js`
- [ ] T016 Build shared API client helpers in `frontend/src/services/api-client.js`

**Checkpoint**: Foundation ready — user stories can be built and tested independently.

---

## Phase 3: User Story 1 - Create and view date-grouped albums (Priority: P1) 🎯 MVP

**Goal**: Users can create/manage albums and view them grouped by date on main page.

**Independent Test**: Create albums with different dates and verify correct grouping + CRUD behavior.

### Tests for User Story 1 (write first)

- [ ] T017 [P] [US1] Add integration test for album create/list/date grouping in `backend/tests/integration/albums.grouping.test.js`
- [ ] T018 [P] [US1] Add integration test for album rename/delete in `backend/tests/integration/albums.crud.test.js`
- [ ] T019 [P] [US1] Add frontend unit test for date grouping transform in `frontend/tests/unit/date-groups.test.js`
- [ ] T020 [P] [US1] Add e2e smoke test for album creation and grouped rendering in `frontend/tests/e2e/albums-grouped.spec.js`

### Implementation for User Story 1

- [ ] T021 [US1] Implement album CRUD endpoints in `backend/src/api/albums.js`
- [ ] T022 [US1] Implement grouped album query logic in `backend/src/db/repositories/album-repository.js`
- [ ] T023 [US1] Implement date-group rendering module in `frontend/src/albums/date-groups.js`
- [ ] T024 [P] [US1] Implement album list/card rendering in `frontend/src/albums/album-list.js`
- [ ] T025 [P] [US1] Implement main page bootstrap and event wiring in `frontend/src/main.js`
- [ ] T026 [US1] Add album create/rename/delete UI controls in `frontend/index.html`
- [ ] T027 [US1] Add consistent album list styling in `frontend/src/styles/app.css`
- [ ] T028 [US1] Handle duplicate album names and API validation errors in `backend/src/api/albums.js` and `frontend/src/main.js`

**Checkpoint**: US1 fully functional as MVP.

---

## Phase 4: User Story 2 - Reorder albums by drag and drop (Priority: P2)

**Goal**: Users can reorder albums on the main page and order persists.

**Independent Test**: Reorder albums and verify saved order remains after refresh.

### Tests for User Story 2 (write first)

- [ ] T029 [P] [US2] Add integration test for reorder persistence in `backend/tests/integration/albums.reorder.test.js`
- [ ] T030 [P] [US2] Add frontend unit test for reorder index updates in `frontend/tests/unit/album-reorder.test.js`
- [ ] T031 [P] [US2] Add e2e smoke test for drag-drop reorder persistence in `frontend/tests/e2e/albums-reorder.spec.js`

### Implementation for User Story 2

- [ ] T032 [US2] Implement reorder API endpoint in `backend/src/api/albums.js`
- [ ] T033 [US2] Implement transactional reorder persistence in `backend/src/db/repositories/album-repository.js`
- [ ] T034 [US2] Implement drag-and-drop interaction logic in `frontend/src/albums/album-reorder.js`
- [ ] T035 [US2] Integrate reorder behavior into album list in `frontend/src/albums/album-list.js`
- [ ] T036 [US2] Add optimistic UI + rollback on save failure in `frontend/src/main.js`

**Checkpoint**: US1 + US2 functional and independently testable.

---

## Phase 5: User Story 3 - View photos in tile layout inside album (Priority: P3)

**Goal**: Users can open an album and view photo previews in a tile interface.

**Independent Test**: Open album with photos and verify tile previews + empty/loading/error states.

### Tests for User Story 3 (write first)

- [ ] T037 [P] [US3] Add integration test for album photo listing endpoint in `backend/tests/integration/photos.list.test.js`
- [ ] T038 [P] [US3] Add frontend unit test for tile grid state handling in `frontend/tests/unit/photo-grid.test.js`
- [ ] T039 [P] [US3] Add e2e smoke test for opening album and viewing photo tiles in `frontend/tests/e2e/photo-tiles.spec.js`

### Implementation for User Story 3

- [ ] T040 [US3] Implement album photo list endpoint in `backend/src/api/photos.js`
- [ ] T041 [US3] Implement photo query + metadata mapping in `backend/src/db/repositories/photo-repository.js`
- [ ] T042 [P] [US3] Implement tile component rendering in `frontend/src/photos/photo-tile.js`
- [ ] T043 [P] [US3] Implement tile grid + loading/empty/error states in `frontend/src/photos/photo-grid.js`
- [ ] T044 [US3] Add album detail view wiring in `frontend/src/main.js`
- [ ] T045 [US3] Add tile grid styles and responsive behavior in `frontend/src/styles/app.css`

**Checkpoint**: US3 functional and independently testable.

---

## Phase 6: User Story 4 - Prevent nested albums (Priority: P3)

**Goal**: Ensure album hierarchy remains flat and nested-album operations are blocked.

**Independent Test**: Attempt nested album operations and verify UI and API both reject them.

### Tests for User Story 4 (write first)

- [ ] T046 [P] [US4] Add integration test preventing parentAlbum assignment in `backend/tests/integration/albums.non-nested.test.js`
- [ ] T047 [P] [US4] Add frontend unit test ensuring nested actions are unavailable in `frontend/tests/unit/albums-nested-guard.test.js`

### Implementation for User Story 4

- [ ] T048 [US4] Add backend guardrails rejecting nested album inputs in `backend/src/api/albums.js`
- [ ] T049 [US4] Enforce schema/repository constraints for flat hierarchy in `backend/src/db/schema.sql` and `backend/src/db/repositories/album-repository.js`
- [ ] T050 [US4] Remove/disable any nested album UI affordances in `frontend/src/albums/album-list.js`

**Checkpoint**: All user stories complete and independently verifiable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, accessibility, performance, and documentation updates.

- [ ] T051 [P] Add keyboard reorder controls and ARIA announcements in `frontend/src/albums/album-reorder.js` and `frontend/src/main.js`
- [ ] T052 [P] Add performance instrumentation for render/reorder timing in `frontend/src/main.js`
- [ ] T053 [P] Add handling for unsupported/corrupted images in `backend/src/api/photos.js` and `frontend/src/photos/photo-grid.js`
- [ ] T054 Update quickstart for local run/test workflow in `specs/001-photo-album-organizer/quickstart.md`
- [ ] T055 Run full test suite and document results in `specs/001-photo-album-organizer/research.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1) has no prerequisites.
- Foundational (Phase 2) depends on Setup and blocks all user stories.
- User Stories (Phases 3–6) depend on Foundational completion.
- Polish (Phase 7) depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: Starts immediately after Foundational.
- **US2 (P2)**: Starts after Foundational; depends on US1 album list integration points.
- **US3 (P3)**: Starts after Foundational; depends on US1 album navigation.
- **US4 (P3)**: Starts after Foundational; can run in parallel with US3.

### Within Each User Story

- Tests first and initially failing.
- Backend API + data logic before frontend wiring.
- UI completion before e2e stabilization.

## Parallel Opportunities

- Setup tasks marked [P] can run together (`T004`, `T005`, `T006`).
- Foundational tasks marked [P] can run together (`T009`, `T010`, `T013`, `T014`).
- US1 frontend modules (`T024`, `T025`) can run in parallel after API contracts stabilize.
- US3 tile component and tile grid (`T042`, `T043`) can run in parallel.
- US3 and US4 implementation can proceed in parallel after Foundational.

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tests + implementation.
3. Validate US1 independently (album CRUD + date groups).

### Incremental Delivery

1. Deliver MVP (US1).
2. Add reorder behavior (US2), validate persistence.
3. Add photo tiles (US3), validate rendering and states.
4. Add non-nested enforcement (US4), validate UI/API constraints.
5. Complete polish and quality gates.

### Suggested Commit Grouping

- Commit A: Setup + Foundational
- Commit B: US1
- Commit C: US2
- Commit D: US3
- Commit E: US4 + Polish
