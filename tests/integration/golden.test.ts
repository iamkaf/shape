import { beforeEach, afterEach, describe, it, expect } from 'bun:test';
import { join } from 'node:path';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { generate } from '../../src/index';

describe('PNG generation', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'shape-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('matches golden hash for 3x3 red PNG', async () => {
    const file = join(dir, 'out.png');
    await generate(3, 3, 'red', file);
    const data = readFileSync(file);
    const hash = createHash('sha256').update(data).digest('hex');
    expect(hash).toBe('209c1ebe2ccec8f2bf5e43694606588e616b076801554eec3bb1ab9b52e15129');
  });
});