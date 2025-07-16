import { describe, expect, it } from 'bun:test';
import { parseDimensions } from '../../src/lib/dimensions';

describe('parseDimensions', () => {
  it('parses valid dimensions', () => {
    expect(parseDimensions('10', '20')).toEqual({ width: 10, height: 20 });
  });

  it('rejects zero width', () => {
    expect(() => parseDimensions('0', '10')).toThrow();
  });

  it('rejects negative height', () => {
    expect(() => parseDimensions('10', '-1')).toThrow();
  });

  it('rejects width larger than int32', () => {
    expect(() => parseDimensions('3000000000', '1')).toThrow();
  });
});
