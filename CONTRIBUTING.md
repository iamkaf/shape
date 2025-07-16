# Contributing to Shape CLI

Thank you for your interest in contributing to Shape CLI! This document provides guidelines and information for contributors.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Performance Considerations](#performance-considerations)
- [Adding New Shapes](#adding-new-shapes)

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) runtime (latest version)
- Node.js 18+ (for compatibility testing)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iamkaf/shape.git
cd shape
```

2. Install dependencies:
```bash
bun install
```

3. Run tests to ensure everything works:
```bash
bun test
```

## Project Structure

```
shape/
├── src/
│   ├── index.ts              # Main CLI entry point
│   └── lib/
│       ├── color.ts          # Color validation and normalization
│       ├── dimensions.ts     # Dimension validation
│       ├── file.ts           # File operations and atomic writes
│       ├── geometry.ts       # Geometric helper functions
│       ├── shapes.ts         # Shape generation engine
│       └── shapeValidation.ts # Shape name validation
├── tests/
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── cli/                  # CLI smoke tests
│   └── benchmark.test.ts     # Performance benchmarks
├── docs/
│   └── assets/               # Documentation assets
└── README.md
```

## Development Workflow

### Running the CLI

During development, you can run the CLI directly:

```bash
# Run with Bun
bun src/index.ts rectangle 100 100 red

# Run with specific shape
bun src/index.ts circle 50 50 blue --verbose
```

### Testing

We have comprehensive test coverage across multiple levels:

```bash
# Run all tests
bun test

# Run specific test suites
bun test tests/unit/                    # Unit tests
bun test tests/integration/             # Integration tests
bun test tests/cli/                     # CLI smoke tests
bun test tests/benchmark.test.ts        # Performance benchmarks

# Run tests with coverage
bun test --coverage
```

### Code Quality

The project uses Biome and Ultracite for code quality:

```bash
# Format code
bun run format

# Check linting
bun run lint

# Fix linting issues
bun run lint --fix
```

## Code Style

### TypeScript Guidelines

- Use explicit types for function parameters and return values
- Prefer `interface` over `type` for object shapes
- Use `const` assertions for immutable data
- Follow the existing naming conventions

### Function Documentation

All public functions should have JSDoc comments:

```typescript
/**
 * Generates a PNG buffer for the specified shape
 * @param shape - The shape type to generate
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @param color - Hex color string
 * @param options - Optional shape-specific parameters
 * @returns PNG buffer ready for file writing
 */
export function generateShapeBuffer(
  shape: ShapeType,
  width: number,
  height: number,
  color: string,
  options: ShapeOptions = {}
): Buffer {
  // Implementation
}
```

### Error Handling

- Use descriptive error messages
- Include suggestions for fixes when possible
- Follow the exit code conventions (0, 64, 74)
- Validate inputs early and provide clear feedback

## Testing

### Unit Tests

Write unit tests for all new functions:

```typescript
import { describe, expect, it } from 'bun:test';
import { myFunction } from '../src/lib/myModule';

describe('myFunction', () => {
  it('handles valid input correctly', () => {
    expect(myFunction('valid')).toBe('expected');
  });

  it('throws error for invalid input', () => {
    expect(() => myFunction('invalid')).toThrow('Expected error message');
  });
});
```

### Integration Tests

Test the complete flow from CLI to file output:

```typescript
import { generate } from '../src/index';
import { ShapeType } from '../src/lib/shapes';

it('generates shape file successfully', async () => {
  const outputFile = join(tempDir, 'test.png');
  await generate(ShapeType.CIRCLE, 50, 50, '#ff0000', outputFile);
  expect(existsSync(outputFile)).toBe(true);
});
```

### Performance Tests

Add benchmark tests for performance-critical changes:

```typescript
it('performs well for large shapes', () => {
  const result = measurePerformance(() => {
    generateShapeBuffer(ShapeType.CIRCLE, 1000, 1000, '#ff0000');
  });
  expect(result.averageTime).toBeLessThan(1000); // 1 second
});
```

## Submitting Changes

### Pull Request Process

1. Create a feature branch from `main`:
```bash
git checkout -b feature/my-new-feature
```

2. Make your changes and ensure all tests pass:
```bash
bun test
bun run lint
```

3. Commit your changes with descriptive messages:
```bash
git commit -m "feat: add support for rounded rectangles"
```

4. Push to your branch and create a pull request

### Commit Message Format

Follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `perf:` - Performance improvements
- `refactor:` - Code refactoring
- `style:` - Code style changes

### Pull Request Guidelines

- Include a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed
- Add performance benchmarks for new features

## Performance Considerations

### Shape Generation

- Use efficient geometric algorithms
- Minimize memory allocations in tight loops
- Consider using lookup tables for expensive calculations
- Profile performance with the benchmark suite

### Memory Usage

- Be mindful of memory usage for large images
- Use streaming where possible
- Clean up temporary resources
- Monitor memory usage in benchmarks

### Example Performance Optimization

```typescript
// Before: Inefficient repeated calculations
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (isPointInCircle({ x, y }, center, radius)) {
      // Set pixel
    }
  }
}

// After: Optimized with precomputed values
const radiusSquared = radius * radius;
const centerX = center.x;
const centerY = center.y;

for (let y = 0; y < height; y++) {
  const dy = y - centerY;
  const dySquared = dy * dy;
  
  for (let x = 0; x < width; x++) {
    const dx = x - centerX;
    if (dx * dx + dySquared <= radiusSquared) {
      // Set pixel
    }
  }
}
```

## Adding New Shapes

To add a new shape to the CLI:

### 1. Add Shape Type

```typescript
// src/lib/shapes.ts
export const ShapeType = {
  // ... existing shapes
  NEW_SHAPE: 'newshape',
} as const;
```

### 2. Implement Shape Logic

```typescript
// src/lib/shapes.ts
function isPointInNewShape(
  point: Point,
  center: Point,
  width: number,
  height: number,
  options: ShapeOptions
): boolean {
  // Implementation
}

// Add to the main switch statement in isPointInShape()
case ShapeType.NEW_SHAPE:
  return isPointInNewShape(point, center, width, height, options);
```

### 3. Add Shape Constraints

```typescript
// src/lib/shapes.ts
export function getShapeConstraints(shape: ShapeType): {
  minWidth: number;
  minHeight: number;
  preferredRatio?: number;
  notes?: string;
} {
  switch (shape) {
    // ... existing cases
    case ShapeType.NEW_SHAPE:
      return {
        minWidth: 10,
        minHeight: 10,
        preferredRatio: 1.0,
        notes: 'Square dimensions recommended'
      };
  }
}
```

### 4. Add Tests

```typescript
// tests/unit/shapes.test.ts
it('generates buffer for new shape', () => {
  const buffer = generateShapeBuffer(ShapeType.NEW_SHAPE, 50, 50, '#ff0000');
  expect(buffer).toBeInstanceOf(Buffer);
  expect(buffer.length).toBeGreaterThan(0);
});
```

### 5. Update Documentation

- Add shape description to README.md
- Update PRD.md if needed
- Add usage examples

## Getting Help

- Check existing issues on GitHub
- Join our community discussions
- Review the PRD.md for design decisions
- Look at existing implementations for patterns

## Code of Conduct

Please be respectful and constructive in all interactions. This project aims to be welcoming to contributors of all experience levels.

## License

By contributing to Shape CLI, you agree that your contributions will be licensed under the MIT License.