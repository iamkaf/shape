import { describe, it, expect } from 'bun:test';
import { join } from 'node:path';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { generate } from '../../src/index';

describe('PNG generation', () => {
  it('matches golden hash for 3x3 red PNG', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'shape-'));
    const file = join(dir, 'out.png');
    await generate(3, 3, 'red', file);
    const data = readFileSync(file);
    const hash = createHash('sha256').update(data).digest('hex');
    expect(hash).toBe('9e0d5b9fdaa3d1d4256dd0c1eebcd7f28c46bd4b9dc59fc95d5fd0f2dedf74c9');
  });
});
