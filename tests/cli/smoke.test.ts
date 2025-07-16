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

  it('creates a file with the default name', () => {
    const outputFileName = join(tempDir, 'shape_3x3.png');
    const result = spawnSync('bun', [cli, '3', '3', 'red', outputFileName]);
    expect(result.status).toBe(0);
    expect(existsSync(outputFileName)).toBe(true);
  });

  it('fails for negative width', () => {
    const outputFileName = join(tempDir, 'shape_-1x3.png');
    const result = spawnSync('bun', [cli, '-1', '3', 'red', outputFileName]);
    expect(result.status).toBe(64);
  });
});