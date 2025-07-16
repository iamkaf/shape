# Shape CLI – Product Requirements Document (PRD)

## 1. Purpose & Scope

Shape is a command‑line program that generates solid‑colour PNG shapes with support for 13 different geometric forms. Given shape type, dimensions, and colour parameters, it produces high-quality PNG images suitable for scripts, CI pipelines, and local tooling where programmatic placeholder images are needed. Non‑goals: gradients, text rendering, graphical UI.

## 2. Supported Shapes

The following 13 shapes are supported:

| Shape       | Description                      | Optimal Dimensions | Special Options      |
| ----------- | -------------------------------- | ------------------ | -------------------- |
| rectangle   | Filled rectangle                 | Any                | None                 |
| triangle    | Equilateral triangle             | Square             | None                 |
| circle      | Perfect circle                   | Square             | None                 |
| oval        | Ellipse                          | Any                | None                 |
| star        | Multi‑pointed star               | Square             | `starPoints` (3‑16)  |
| heart       | Heart shape                      | Square             | None                 |
| diamond     | Diamond/rhombus                  | Square             | None                 |
| pentagon    | Regular pentagon                 | Square             | None                 |
| hexagon     | Regular hexagon                  | Square             | None                 |
| octagon     | Regular octagon                  | Square             | None                 |
| cross       | Plus/cross shape                 | Square             | `crossThickness`     |
| arrow       | Arrow shape                      | 1.5:1 (width:height) | `arrowDirection`   |
| donut       | Ring/donut shape                 | Square             | `donutThickness`     |

## 3. Functional Requirements

| ID   | Requirement                                                            |
| ---- | ---------------------------------------------------------------------- |
| FR‑1 | Accept **SHAPE** parameter from 13 supported geometric shapes.         |
| FR‑2 | Accept **WIDTH** (pixels) ≥ 1 (integer).                               |
| FR‑3 | Accept **HEIGHT** (pixels) ≥ 1 (integer).                              |
| FR‑4 | Accept **COLOR** as any valid CSS colour string.                       |
| FR‑5 | Produce an 8‑bit RGBA PNG filled with the specified colour.            |
| FR‑6 | Write output file to filesystem; default name `<shape>_<w>x<h>.png`.   |
| FR‑7 | Refuse to overwrite existing files unless `--force` flag is provided.  |
| FR‑8 | Provide flags: `--help`, `--version`, `--verbose`, `--strict-color`.   |
| FR‑9 | Implement colour‑input recovery heuristics (Section 6).                |
| FR‑10| Implement shape‑name fuzzy matching and validation (Section 7).        |
| FR‑11| Maintain backward compatibility with legacy width‑height‑color format. |

## 4. Command‑line Interface

**New format (recommended):**
```
shape <SHAPE> <WIDTH> <HEIGHT> <COLOR> [outputFilename] [options]
```

**Legacy format (deprecated):**
```
shape <WIDTH> <HEIGHT> <COLOR> [outputFilename] [options]
```

**Package manager usage:**
```
npx @iamkaf/shape <SHAPE> <WIDTH> <HEIGHT> <COLOR> [options]
bunx @iamkaf/shape <SHAPE> <WIDTH> <HEIGHT> <COLOR> [options]
```

**Options:**
- `--output <file>` – Custom output filename
- `--force` – Overwrite existing files
- `--verbose` – Detailed output
- `--strict-color` – Disable color normalization
- `--strict-shape` – Disable shape name fuzzy matching

**Parameters:**
- **SHAPE** – Shape name (case‑insensitive, supports fuzzy matching)
- **WIDTH / HEIGHT** – Unsigned integers ≤ 10,000 pixels
- **COLOR** – Processed through normalisation (Section 6) unless `--strict-color` is set

## 5. Exit Codes

| Code | Meaning                   |
| ---- | ------------------------- |
| 0    | Success                   |
| 64   | Usage or validation error |
| 74   | I/O or encode error       |

## 6. Colour Input Normalisation

1. **Syntax repair**
   * Replace leading `@` or `0x` with `#`.
   * Add `#` to bare six‑digit hex values.
   * Expand three‑digit hex to six digits.

2. **Fuzzy name match**
   * Levenshtein distance ≤ 2 against official CSS colour names.

3. **Validation**
   * Validate final string with `validate-color`.

4. **Failure path**
   * If invalid, exit 64. When not in strict mode, suggest closest match.

## 7. Shape Name Validation

1. **Normalization**
   * Convert to lowercase
   * Trim whitespace

2. **Fuzzy matching** (unless `--strict-shape`)
   * Levenshtein distance ≤ 2 against supported shape names
   * Suggest closest match on failure

3. **Validation**
   * Check against list of 13 supported shapes
   * Provide helpful error messages with suggestions

4. **Dimension validation**
   * Validate minimum dimensions per shape
   * Warn about non‑optimal aspect ratios
   * Show shape‑specific recommendations

## 8. Validation Rules

| Check                                    | Failure Message                               |
| ---------------------------------------- | --------------------------------------------- |
| Unknown shape name                       | "Invalid shape 'X'. Did you mean 'Y'?"       |
| Non‑positive or non‑integer WIDTH/HEIGHT | "Width and height must be positive integers." |
| Dimension > 10,000 px                   | "Dimension too large; max 10000."            |
| Below minimum dimensions                 | "Shape requires minimum dimensions of WxH"    |
| Invalid colour after normalisation       | "Invalid colour '<raw>'."                     |
| Output exists without `--force`          | "File exists. Use --force to overwrite."      |

## 9. Processing Pipeline

1. Parse arguments and determine format (new vs legacy)
2. Validate and normalize shape name (Section 7)
3. Validate dimensions with shape‑specific constraints
4. Normalise colour (Section 6)
5. Validate inputs (Section 8)
6. Generate shape using geometric algorithms
7. Encode PNG (library choice, Section 10)
8. Atomically write file (temp → rename)
9. Exit with appropriate code

## 10. Implementation Notes

* **Language** – Node.js ≥ 18 with TypeScript
* **Argument parsing** – `commander`
* **Colour validation** – `validate-color`
* **Colour normalisation helpers** – `colord`, `didyoumean2`, `fastest-levenshtein`, `css-color-names`
* **Shape validation** – `didyoumean2`, `fastest-levenshtein`
* **PNG encoder** – `sharp` (primary) with `pngjs` fallback
* **Geometry** – Custom geometric algorithms for shape generation

## 11. Testing Strategy

* **Unit tests** – All 13 shapes, colour normalisation, dimension validation, shape validation
* **Geometry tests** – Point‑in‑shape algorithms, vertex generation, transformations
* **Golden tests** – Hash comparison of known PNG outputs for each shape
* **CLI smoke tests** – Run generator in CI (Node 18/20) expecting exit 0
* **Benchmark tests** – Performance measurement across different sizes and shapes

## 12. Performance Targets

* ≤ 100 ms for 50×50 px shapes on a mid‑range CPU
* ≤ 500 ms for 200×200 px shapes on a mid‑range CPU
* ≤ 1000 ms for 500×500 px shapes on a mid‑range CPU
* Memory usage approximately `width × height × 4` bytes plus encoder overhead
* Scalable performance across different shape complexities

## 13. Security Considerations

* All file operations confined to local filesystem
* Dimension caps mitigate memory‑exhaustion attacks
* No network activity; dependency versions pinned via `package-lock.json`
* Input validation prevents injection attacks
* Atomic file writing prevents corruption

## 14. Backward Compatibility

* Legacy format `shape WIDTH HEIGHT COLOR` automatically detected
* Shows deprecation warning but continues to work
* Defaults to rectangle shape for legacy format
* All existing scripts continue to function

## 15. Future Extensions

* `--alpha` flag for transparency control
* `--gradient <c1,c2>` option for two‑colour gradients
* Additional shape options (e.g., rounded rectangles, custom polygons)
* Distribute standalone binaries using `pkg` or equivalent bundler
* Shape animation sequences
* SVG output format support