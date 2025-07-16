# Development Plan

This file tracks the high level phases for building Shape CLI. Each phase delivers a usable increment.

## Phase 1 – Setup

- [x] Initialize repository with Bun and TypeScript.
- [x] Configure Biome and Ultracite.
- [x] Add Vitest for testing.
- [x] Establish directory structure (`src/`, `tests/`).

## Phase 2 – Tracer Bullet

- [x] Implement a minimal end-to-end CLI that accepts width, height, and colour.
- [x] Hardcode PNG generation with a single colour as placeholder.
- [x] Provide basic argument parsing and file output.

## Phase 3 – Testing Suite

- [x] Add a **complete** well organized suite of unit tests.
- [x] Add a comprehensive suite of end-to-end tests.
- [x] Add CLI smoke tests.
- [x] Setup code coverage.

## Phase 4 – Input Validation

- [x] Enforce dimension limits and positive integers.
- [x] Implement colour normalisation heuristics.
- [x] Support `--strict-color` mode.

## Phase 5 – PNG Generation

- [x] Replace placeholder with real image creation using `sharp` (primary) and `pngjs` fallback.
- [x] Ensure atomic file writing.

## Phase 6 – CLI Flags and Error Handling

- [x] Add `--output`, `--force`, `--verbose`, and `--help` flags.
- [x] Implement exit codes per PRD.

## Phase 7 – Documentation

- [x] Update README with detailed usage and examples.
- [x] Document development workflow and contribution guide.

## Phase 8 – Optimisations

- [x] Improve performance for large images.
- [x] Review memory usage and refine implementation.

## Phase 9 – Packaging

- [x] Prepare for distribution on npm under `@iamkaf/shape`.
- [x] Create CLIs for `bunx` usage and bundling steps.

## Phase 10 – Cleanup and Publishing

- Final code cleanup and dependency audit.
- Tag release, publish package, and announce project.
