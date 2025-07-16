# Shape CLI – Product Requirements Document (PRD)

## 1. Purpose & Scope

RectGen is a command‑line program that generates a solid‑colour PNG rectangle given width, height, and colour parameters. It is intended for scripts, CI pipelines, and local tooling where programmatic placeholder images are needed. Non‑goals: gradients, text rendering, graphical UI.

## 2. Functional Requirements

| ID   | Requirement                                                            |
| ---- | ---------------------------------------------------------------------- |
| FR‑1 | Accept **WIDTH** (pixels) ≥ 1 (integer).                               |
| FR‑2 | Accept **HEIGHT** (pixels) ≥ 1 (integer).                              |
| FR‑3 | Accept **COLOR** as any valid CSS colour string.                       |
| FR‑4 | Produce an 8‑bit RGBA PNG filled with the specified colour.            |
| FR‑5 | Write output file to filesystem; default name `rectangle_<w>x<h>.png`. |
| FR‑6 | Refuse to overwrite existing files unless `--force` flag is provided.  |
| FR‑7 | Provide flags: `--help`, `--version`, `--verbose`, `--strict-color`.   |
| FR‑8 | Implement colour‑input recovery heuristics (Section 5).                |

## 3. Command‑line Interface

`shape WIDTH HEIGHT COLOR [--output <file>] [--force] [--verbose] [--strict-color]`

`npx @iamkaf/shape WIDTH HEIGHT COLOR [--output <file>] [--force] [--verbose] [--strict-color]`

`bunx @iamkaf/shape WIDTH HEIGHT COLOR [--output <file>] [--force] [--verbose] [--strict-color]`

* **WIDTH / HEIGHT** – unsigned 32‑bit integers; reject > 2 147 483 647.
* **COLOR** – processed through normalisation (Section 5) unless `--strict-color` is set.

## 4. Exit Codes

| Code | Meaning                   |
| ---- | ------------------------- |
| 0    | Success                   |
| 64   | Usage or validation error |
| 74   | I/O or encode error       |

## 5. Colour Input Normalisation

1. **Syntax repair**

   * Replace leading `@` or `0x` with `#`.
   * Add `#` to bare six‑digit hex values.
   * Expand three‑digit hex to six digits.
2. **Fuzzy name match**

   * Levenshtein distance ≤ 2 against official CSS colour names.
3. **Validation**

   * Validate final string with `validate-color`.
4. **Failure path**

   * If invalid, exit 64. When not in strict mode, suggest closest match.

## 6. Validation Rules

| Check                                    | Failure Message                               |
| ---------------------------------------- | --------------------------------------------- |
| Non‑positive or non‑integer WIDTH/HEIGHT | “Width and height must be positive integers.” |
| Dimension > 10 000 px                    | “Dimension too large; max 10000.”             |
| Invalid colour after normalisation       | “Invalid colour '<raw>'.”                     |
| Output exists without `--force`          | “File exists. Use --force to overwrite.”      |

## 7. Processing Pipeline

1. Parse arguments.
2. Normalise colour (Section 5).
3. Validate inputs (Section 6).
4. Allocate RGBA buffer `width × height × 4`.
5. Fill buffer with colour tuple.
6. Encode PNG (library choice, Section 8).
7. Atomically write file (temp → rename).
8. Exit with appropriate code.

## 8. Implementation Notes

* **Language** – Node.js ≥ 18.
* **Argument parsing** – `commander`.
* **Colour validation** – `validate-color`.
* **Colour normalisation helpers** – `colord`, `didyoumean2`, `fastest-levenshtein`, `css-color-names`.
* **PNG encoder** – `sharp` (primary) with `pngjs` fallback.

## 9. Testing Strategy

* **Unit tests** – colour normalisation, dimension validation.
* **Golden tests** – hash comparison of known 3 × 3 PNG outputs.
* **CLI smoke tests** – run generator in CI (Node 18/20) expecting exit 0.

## 10. Performance Targets

* ≤ 300 ms for 10 000 × 10 000 px rectangle on a mid‑range CPU.
* Memory usage approximately `width × height × 4` bytes plus encoder overhead.

## 11. Security Considerations

* All file operations confined to local filesystem.
* Dimension caps mitigate memory‑exhaustion attacks.
* No network activity; dependency versions pinned via `package-lock.json`.

## 12. Future Extensions

* `--alpha` flag for transparency control.
* `--gradient <c1,c2>` option for two‑colour gradients.
* Distribute standalone binaries using `pkg` or equivalent bundler.
