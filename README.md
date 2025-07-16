# Shape CLI

Shape is a command‑line tool that generates a solid colour PNG rectangle.

## Features

- Written in **TypeScript** using **Bun** runtime.
- Provides a simple CLI to specify width, height, and colour.
- Outputs a PNG file named `rectangle_<w>x<h>.png` by default.
- Validates inputs and supports colour normalisation heuristics.
- Includes tests written with **Bun**.
- Formatting and linting handled by **Biome** and **Ultracite**.

## Usage

```bash
bunx @iamkaf/shape WIDTH HEIGHT COLOR [--output <file>] [--force] [--verbose] [--strict-color]
```

See `shape --help` for command details.

## Development

This project uses Bun and TypeScript. Install dependencies with:

```bash
bun install
```

Run tests with:

```bash
bun test
```

Formatting and linting are handled by Biome and Ultracite:

```bash
bun run format
bun run lint
```

## Project Goals

See [PRD.md](PRD.md) for the full product requirements.

