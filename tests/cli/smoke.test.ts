import { describe, it, expect } from 'bun:test';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

const cli = join(import.meta.dir, '../../src/index.ts');

describe('cli smoke tests', () => {
  it('creates a file with the default name', () => {
    if (existsSync('rectangle_3x3.png')) rmSync('rectangle_3x3.png');
    const result = spawnSync('bun', [cli, '3', '3', 'red']);
    expect(result.status).toBe(0);
    expect(existsSync('rectangle_3x3.png')).toBe(true);
  });

  it('fails for negative width', () => {
    const result = spawnSync('bun', [cli, '-1', '3', 'red']);
    expect(result.status).toBe(64);
  });
});
