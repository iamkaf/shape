import { describe, expect, it, beforeEach, afterEach } from 'bun:test';
import { generate } from '../src/index';
import { ShapeType } from '../src/lib/shapes';
import { join } from 'node:path';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';

describe('Shape generation integration tests', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'shape-integration-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('generates a rectangle successfully', async () => {
    const outputFile = join(tempDir, 'test-rectangle.png');
    await generate(ShapeType.RECTANGLE, 10, 10, '#ff0000', outputFile);
    expect(existsSync(outputFile)).toBe(true);
  });

  it('generates a circle successfully', async () => {
    const outputFile = join(tempDir, 'test-circle.png');
    await generate(ShapeType.CIRCLE, 20, 20, '#0000ff', outputFile);
    expect(existsSync(outputFile)).toBe(true);
  });

  it('generates a star successfully', async () => {
    const outputFile = join(tempDir, 'test-star.png');
    await generate(ShapeType.STAR, 30, 30, '#ffff00', outputFile);
    expect(existsSync(outputFile)).toBe(true);
  });

  it('generates a heart successfully', async () => {
    const outputFile = join(tempDir, 'test-heart.png');
    await generate(ShapeType.HEART, 25, 25, '#ff69b4', outputFile);
    expect(existsSync(outputFile)).toBe(true);
  });

  it('generates an arrow successfully', async () => {
    const outputFile = join(tempDir, 'test-arrow.png');
    await generate(ShapeType.ARROW, 40, 30, '#00ff00', outputFile);
    expect(existsSync(outputFile)).toBe(true);
  });
});
