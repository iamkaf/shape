# Development Plan

This file tracks the high level phases for building Shape CLI. Each phase delivers a usable increment.

## Phase 1 – Setup
- Initialize repository with Bun and TypeScript.
- Configure Biome and Ultracite.
- Add Vitest for testing.
- Establish directory structure (`src/`, `tests/`).

## Phase 2 – Tracer Bullet
- Implement a minimal end-to-end CLI that accepts width, height, and colour.
- Hardcode PNG generation with a single colour as placeholder.
- Provide basic argument parsing and file output.

## Phase 3 – Input Validation
- Enforce dimension limits and positive integers.
- Implement colour normalisation heuristics.
- Support `--strict-color` mode.

## Phase 4 – PNG Generation
- Replace placeholder with real image creation using `sharp` (primary) and `pngjs` fallback.
- Ensure atomic file writing.

## Phase 5 – CLI Flags and Error Handling
- Add `--output`, `--force`, `--verbose`, and `--help` flags.
- Implement exit codes per PRD.

## Phase 6 – Testing Suite
- Add unit tests for colour normalisation and validation.
- Add golden tests for PNG output.
- Add CLI smoke tests.

## Phase 7 – Documentation
- Update README with detailed usage and examples.
- Document development workflow and contribution guide.

## Phase 8 – Optimisations
- Improve performance for large images.
- Review memory usage and refine implementation.

## Phase 9 – Packaging
- Prepare for distribution on npm under `@iamkaf/shape`.
- Create CLIs for `bunx` usage and bundling steps.

## Phase 10 – Cleanup and Publishing
- Final code cleanup and dependency audit.
- Tag release, publish package, and announce project.

