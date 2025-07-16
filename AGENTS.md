# Agent Instructions

These notes guide Codex contributors working on the Shape CLI project.

## Repository Overview

- **Runtime**: Bun (not Node).
- **Language**: TypeScript only.
- **Formatting/Linting**: Use Biome and Ultracite. Do not use ESLint or Prettier.
- **Testing**: Use Vitest for unit and integration tests.
- **Package Manager**: `bun` should manage dependencies.

## Development Tips

- Always read `PRD.md` for functional requirements before implementing features.
- Keep all source under `src/` and tests under `tests/`.
- Ensure `bun.lockb` stays committed for reproducible installs.
- The project should be able to run with `bun src/index.ts` once implemented.

## Workflow

1. Create or update tasks in `TODO.md` before coding.
2. Run `bun test` to execute the Vitest suite.
3. Use `bunx biome` and `bunx ultracite` for formatting and linting.
4. Keep the repository clean with `git status` before each commit.

