import { beforeEach, afterEach, describe, it, expect } from 'bun:test';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const cli = join(import.meta.dir, '../../src/index.ts');

describe('cli smoke tests', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'shape-cli-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates a rectangle file with new format', () => {
    const outputFileName = join(tempDir, 'rectangle_3x3.png');
    const result = spawnSync('bun', [cli, 'rectangle', '3', '3', 'red', outputFileName]);
    expect(result.status).toBe(0);
    expect(existsSync(outputFileName)).toBe(true);
  });

  it('creates a circle file with new format', () => {
    const outputFileName = join(tempDir, 'circle_10x10.png');
    const result = spawnSync('bun', [cli, 'circle', '10', '10', 'blue', outputFileName]);
    expect(result.status).toBe(0);
    expect(existsSync(outputFileName)).toBe(true);
  });

  it('supports legacy format (backward compatibility)', () => {
    const outputFileName = join(tempDir, 'rectangle_5x5.png');
    const result = spawnSync('bun', [cli, '5', '5', 'green', outputFileName]);
    expect(result.status).toBe(0);
    expect(existsSync(outputFileName)).toBe(true);
  });

  it('fails for negative width', () => {
    const outputFileName = join(tempDir, 'rectangle_-1x3.png');
    const result = spawnSync('bun', [cli, 'rectangle', '-1', '3', 'red', outputFileName]);
    expect(result.status).toBe(64);
  });

  it('fails for invalid shape', () => {
    const outputFileName = join(tempDir, 'invalid_5x5.png');
    const result = spawnSync('bun', [cli, 'invalidshape', '5', '5', 'red', outputFileName]);
    expect(result.status).toBe(64);
  });

  it('supports fuzzy shape matching', () => {
    const outputFileName = join(tempDir, 'circle_12x12.png');
    const result = spawnSync('bun', [cli, 'circl', '12', '12', '#800080', outputFileName]);
    expect(result.status).toBe(0);
    expect(existsSync(outputFileName)).toBe(true);
  });
});