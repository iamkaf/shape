import { describe, expect, it } from 'bun:test';
import { normalizeColor } from '../../src/lib/color';

describe('color normalisation', () => {
  it('normalises named colours', () => {
    expect(normalizeColor(' red ')).toBe('#ff0000');
  });

  it('recovers mistyped colours', () => {
    expect(normalizeColor('bleu')).toBe('#0000ff');
  });

  it('throws in strict mode for invalid colour', () => {
    expect(() => normalizeColor('blu', true)).toThrow();
  });
});
