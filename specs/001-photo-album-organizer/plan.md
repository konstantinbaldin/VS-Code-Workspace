# Implementation Plan: Photo Album Organizer

**Branch**: `001-photo-album-organizer` | **Date**: 2026-03-16 | **Spec**: [specs/001-photo-album-organizer/spec.md](specs/001-photo-album-organizer/spec.md)
**Input**: Feature specification from `/specs/001-photo-album-organizer/spec.md`

## Summary

Build a local-first photo album organizer using Vite with vanilla HTML/CSS/JavaScript for the UI, a minimal Node.js API for local file and metadata operations, and SQLite for metadata persistence. Albums are grouped by date, can be reordered via drag-and-drop on the main page, never support nesting, and display album photos in a tile preview interface. Images remain on local disk and are never uploaded to external services.

## Technical Context

**Language/Version**: JavaScript (ES2022), Node.js 20.x  
**Primary Dependencies**: Vite, Express (minimal local API), better-sqlite3  
**Storage**: Local SQLite database for album/photo metadata; local filesystem for image files  
**Testing**: Vitest (unit), Supertest (API integration), Playwright (critical UI flow smoke tests)  
**Target Platform**: Local desktop usage on Windows/macOS/Linux via browser served from local machine  
**Project Type**: Web application (frontend + local backend service)  
**Performance Goals**: Initial album page render < 1s for 200 albums; album open with first tile paint < 2s for 500 photos; reorder update feedback < 200ms  
**Constraints**: Minimal libraries, vanilla HTML/CSS/JS UI, no nested albums, no cloud upload, local-only storage, accessible drag/drop fallback  
**Scale/Scope**: Single-user local library; up to 10k photos across up to 1k albums

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality by Default**: PASS — module boundaries kept simple (`frontend` UI modules, `backend` API + DB modules), no unnecessary framework abstractions.
- **Test-Backed Development**: PASS — unit + integration + smoke test plan included before implementation.
- **User Experience Consistency**: PASS — single interaction pattern for album cards, reorder interactions, and tile previews across pages.
- **Performance as Requirement**: PASS — measurable render and interaction targets included.
- **Simplicity and Reversibility**: PASS — minimal dependency footprint and clear separation between UI and local API allow rollback/replace of backend implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-photo-album-organizer/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── src/
│   ├── main.js
│   ├── albums/
│   │   ├── album-list.js
│   │   ├── album-reorder.js
│   │   └── date-groups.js
│   ├── photos/
│   │   ├── photo-grid.js
│   │   └── photo-tile.js
│   ├── services/
│   │   └── api-client.js
│   └── styles/
│       └── app.css
└── tests/
    ├── unit/
    └── e2e/

backend/
├── src/
│   ├── server.js
│   ├── api/
│   │   ├── albums.js
│   │   └── photos.js
│   ├── db/
│   │   ├── schema.sql
│   │   ├── connection.js
│   │   └── repositories/
│   │       ├── album-repository.js
│   │       └── photo-repository.js
│   └── storage/
│       └── image-paths.js
└── tests/
    └── integration/
```

**Structure Decision**: Use a web app split into `frontend` (Vite + vanilla JS) and `backend` (local Node API + SQLite) to preserve a simple UI implementation while enabling robust local metadata persistence and file handling.

## Phase 0: Research & Decisions

1. Confirm SQLite schema supports date grouping, stable ordering, and non-nested album constraints.
2. Validate drag-and-drop implementation options with keyboard-accessible reorder fallback.
3. Define local file path strategy for image references and thumbnail generation/caching approach.
4. Confirm CORS/dev proxy approach for Vite ↔ local API in development.

## Phase 1: Design Artifacts

1. `research.md`: Document dependency and architecture trade-offs with minimal-library rationale.
2. `data-model.md`: Define Album, Photo, DateGroup, and ordering models + integrity rules.
3. `contracts/`: Define API contracts for album CRUD, reorder, and album photo listing.
4. `quickstart.md`: Local run and test steps for Windows-first setup.

## Phase 2: Implementation Strategy

1. Implement backend SQLite schema and migration bootstrap.
2. Implement album CRUD + date grouping endpoints.
3. Implement album reorder endpoint with persistent order indexes.
4. Implement photo listing and tile-preview metadata endpoint per album.
5. Implement frontend album main page with date groups and drag/drop reorder.
6. Implement album detail tile grid and empty/loading/error states.
7. Add keyboard-accessible reorder controls and ARIA updates.
8. Add tests: unit (UI logic), integration (API + DB), smoke e2e (critical flows).

## Test Strategy

- **Unit**: date grouping logic, reorder list mutation logic, UI state reducers/helpers.
- **Integration**: API handlers against test SQLite DB for CRUD, reorder persistence, and non-nested constraints.
- **E2E Smoke**: create album, reorder album, open album, view tile previews, verify no nested-album action.
- **Performance Checks**: measure initial render and reorder interaction timing on representative sample data.

## Risks and Mitigations

- **Large local libraries may slow tile rendering** → mitigate with paginated/virtualized rendering and lazy image loading.
- **File path portability issues across OS** → normalize paths at backend boundary and store canonical relative paths.
- **Drag/drop accessibility gaps** → provide explicit move up/down controls and keyboard focus management.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
