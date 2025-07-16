<p align="center">
  <img src="./docs/assets/divider_1.png" width="100%" alt="Divider">
</p>

# Shape CLI

Shape is a command‑line tool that generates a solid colour PNG rectangle.

<p align="center">
  <img src="./docs/assets/divider_2.png" width="100%" alt="Divider">
</p>

## Features

- Written in **TypeScript** using **Bun** runtime.
- Provides a simple CLI to specify width, height, and colour.
- Outputs a PNG file named `rectangle_<w>x<h>.png` by default.
- Validates inputs and supports colour normalisation heuristics.
- Includes tests written with **Bun**.
- Formatting and linting handled by **Biome** and **Ultracite**.

<p align="center">
  <img src="./docs/assets/divider_3.png" width="100%" alt="Divider">
</p>

## Usage

```bash
bunx @iamkaf/shape WIDTH HEIGHT COLOR [--output <file>] [--force] [--verbose] [--strict-color]
```

See `shape --help` for command details.

<p align="center">
  <img src="./docs/assets/divider_4.png" width="100%" alt="Divider">
</p>

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

<p align="center">
  <img src="./docs/assets/divider_5.png" width="100%" alt="Divider">
</p>

## Project Goals

See [PRD.md](PRD.md) for the full product requirements.

<p align="center">
  <img src="./docs/assets/divider_6.png" width="100%" alt="Divider">
</p>

<p align="center">
  <img src="./docs/assets/divider_7.png" width="100%" alt="Divider">
</p>
