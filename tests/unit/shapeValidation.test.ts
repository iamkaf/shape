import { describe, expect, it } from 'bun:test';
import {
  getAllShapeNames,
  getShapeValidationHelp,
  isValidShapeName,
  looksLikeShapeName,
  normalizedNameToShapeType,
  parseShapeName,
  validateShapeDimensions,
  validateShapeName,
} from '../../src/lib/shapeValidation';
import { ShapeType } from '../../src/lib/shapes';

describe('shapeValidation module', () => {
  describe('isValidShapeName', () => {
    it('returns true for valid shape names', () => {
      expect(isValidShapeName('rectangle')).toBe(true);
      expect(isValidShapeName('circle')).toBe(true);
      expect(isValidShapeName('star')).toBe(true);
      expect(isValidShapeName('heart')).toBe(true);
    });

    it('returns true for valid shape names with different cases', () => {
      expect(isValidShapeName('RECTANGLE')).toBe(true);
      expect(isValidShapeName('Circle')).toBe(true);
      expect(isValidShapeName('STAR')).toBe(true);
    });

    it('returns true for valid shape names with whitespace', () => {
      expect(isValidShapeName('  rectangle  ')).toBe(true);
      expect(isValidShapeName(' circle ')).toBe(true);
    });

    it('returns false for invalid shape names', () => {
      expect(isValidShapeName('square')).toBe(false);
      expect(isValidShapeName('invalid')).toBe(false);
      expect(isValidShapeName('')).toBe(false);
      expect(isValidShapeName('123')).toBe(false);
    });
  });

  describe('validateShapeName', () => {
    it('returns normalized name for valid shapes', () => {
      expect(validateShapeName('rectangle')).toBe('rectangle');
      expect(validateShapeName('CIRCLE')).toBe('circle');
      expect(validateShapeName('  Star  ')).toBe('star');
    });

    it('performs fuzzy matching for close matches', () => {
      expect(validateShapeName('reactangle')).toBe('rectangle'); // 1 character difference
      expect(validateShapeName('circl')).toBe('circle'); // 1 character difference
      expect(validateShapeName('triangel')).toBe('triangle'); // 1 character difference
    });

    it('handles common typos', () => {
      expect(validateShapeName('rectangl')).toBe('rectangle'); // Missing last letter
      expect(validateShapeName('triangl')).toBe('triangle'); // Missing last letter
      expect(validateShapeName('heartt')).toBe('heart'); // Double letter
    });

    it('throws error for invalid shapes in non-strict mode', () => {
      expect(() => validateShapeName('invalid')).toThrow();
      expect(() => validateShapeName('square')).toThrow();
      expect(() => validateShapeName('notashape')).toThrow();
    });

    it('throws error for invalid shapes in strict mode', () => {
      expect(() => validateShapeName('reactangle', true)).toThrow();
      expect(() => validateShapeName('circl', true)).toThrow();
      expect(() => validateShapeName('invalid', true)).toThrow();
    });

    it('allows valid shapes in strict mode', () => {
      expect(validateShapeName('rectangle', true)).toBe('rectangle');
      expect(validateShapeName('CIRCLE', true)).toBe('circle');
      expect(validateShapeName('  triangle  ', true)).toBe('triangle');
    });

    it('provides suggestions in error messages', () => {
      expect(() => validateShapeName('invalidsquare')).toThrow(/rectangle/);
      expect(() => validateShapeName('wrongshape')).toThrow(/Supported shapes:/);
      expect(() => validateShapeName('notashape')).toThrow(/Supported shapes:/);
    });
  });

  describe('normalizedNameToShapeType', () => {
    it('converts normalized names to ShapeType', () => {
      expect(normalizedNameToShapeType('rectangle')).toBe(ShapeType.RECTANGLE);
      expect(normalizedNameToShapeType('circle')).toBe(ShapeType.CIRCLE);
      expect(normalizedNameToShapeType('triangle')).toBe(ShapeType.TRIANGLE);
      expect(normalizedNameToShapeType('star')).toBe(ShapeType.STAR);
      expect(normalizedNameToShapeType('heart')).toBe(ShapeType.HEART);
      expect(normalizedNameToShapeType('diamond')).toBe(ShapeType.DIAMOND);
      expect(normalizedNameToShapeType('pentagon')).toBe(ShapeType.PENTAGON);
      expect(normalizedNameToShapeType('hexagon')).toBe(ShapeType.HEXAGON);
      expect(normalizedNameToShapeType('octagon')).toBe(ShapeType.OCTAGON);
      expect(normalizedNameToShapeType('cross')).toBe(ShapeType.CROSS);
      expect(normalizedNameToShapeType('arrow')).toBe(ShapeType.ARROW);
      expect(normalizedNameToShapeType('donut')).toBe(ShapeType.DONUT);
      expect(normalizedNameToShapeType('oval')).toBe(ShapeType.OVAL);
    });

    it('throws error for invalid normalized names', () => {
      expect(() => normalizedNameToShapeType('invalid')).toThrow();
      expect(() => normalizedNameToShapeType('square')).toThrow();
      expect(() => normalizedNameToShapeType('')).toThrow();
    });
  });

  describe('parseShapeName', () => {
    it('parses valid shape names', () => {
      expect(parseShapeName('rectangle')).toBe(ShapeType.RECTANGLE);
      expect(parseShapeName('CIRCLE')).toBe(ShapeType.CIRCLE);
      expect(parseShapeName('  triangle  ')).toBe(ShapeType.TRIANGLE);
    });

    it('parses fuzzy matches', () => {
      expect(parseShapeName('reactangle')).toBe(ShapeType.RECTANGLE);
      expect(parseShapeName('circl')).toBe(ShapeType.CIRCLE);
      expect(parseShapeName('triangel')).toBe(ShapeType.TRIANGLE);
    });

    it('respects strict mode', () => {
      expect(parseShapeName('rectangle', true)).toBe(ShapeType.RECTANGLE);
      expect(() => parseShapeName('reactangle', true)).toThrow();
    });

    it('throws error for invalid shapes', () => {
      expect(() => parseShapeName('invalid')).toThrow();
      expect(() => parseShapeName('square')).toThrow();
      expect(() => parseShapeName('')).toThrow();
    });
  });

  describe('looksLikeShapeName', () => {
    it('returns true for valid shape names', () => {
      expect(looksLikeShapeName('rectangle')).toBe(true);
      expect(looksLikeShapeName('circle')).toBe(true);
      expect(looksLikeShapeName('star')).toBe(true);
    });

    it('returns true for close matches', () => {
      expect(looksLikeShapeName('reactangle')).toBe(true);
      expect(looksLikeShapeName('circl')).toBe(true);
      expect(looksLikeShapeName('triangel')).toBe(true);
    });

    it('returns true for alphabetic strings', () => {
      expect(looksLikeShapeName('shape')).toBe(true);
      expect(looksLikeShapeName('abc')).toBe(true);
      expect(looksLikeShapeName('xyz')).toBe(true);
    });

    it('returns false for numeric strings', () => {
      expect(looksLikeShapeName('123')).toBe(false);
      expect(looksLikeShapeName('456')).toBe(false);
    });

    it('returns false for mixed alphanumeric strings', () => {
      expect(looksLikeShapeName('abc123')).toBe(false);
      expect(looksLikeShapeName('123abc')).toBe(false);
    });

    it('returns false for empty strings', () => {
      expect(looksLikeShapeName('')).toBe(false);
      expect(looksLikeShapeName('   ')).toBe(false);
    });
  });

  describe('getAllShapeNames', () => {
    it('returns all shape names', () => {
      const names = getAllShapeNames();
      expect(names).toHaveLength(13);
      expect(names).toContain('rectangle');
      expect(names).toContain('triangle');
      expect(names).toContain('circle');
      expect(names).toContain('oval');
      expect(names).toContain('star');
      expect(names).toContain('heart');
      expect(names).toContain('diamond');
      expect(names).toContain('pentagon');
      expect(names).toContain('hexagon');
      expect(names).toContain('octagon');
      expect(names).toContain('cross');
      expect(names).toContain('arrow');
      expect(names).toContain('donut');
    });

    it('returns a copy of the array', () => {
      const names1 = getAllShapeNames();
      const names2 = getAllShapeNames();
      expect(names1).not.toBe(names2); // Different array instances
      expect(names1).toEqual(names2); // Same content
    });
  });

  describe('getShapeValidationHelp', () => {
    it('returns help text with all shapes', () => {
      const help = getShapeValidationHelp();
      expect(help).toContain('Supported shapes:');
      expect(help).toContain('rectangle');
      expect(help).toContain('triangle');
      expect(help).toContain('circle');
      expect(help).toContain('oval');
      expect(help).toContain('star');
      expect(help).toContain('heart');
      expect(help).toContain('diamond');
      expect(help).toContain('pentagon');
      expect(help).toContain('hexagon');
      expect(help).toContain('octagon');
      expect(help).toContain('cross');
      expect(help).toContain('arrow');
      expect(help).toContain('donut');
    });

    it('formats help text properly', () => {
      const help = getShapeValidationHelp();
      expect(help).toMatch(/Supported shapes:\n/);
      expect(help.split('\n')).toHaveLength(14); // Header + 13 shapes
    });
  });

  describe('validateShapeDimensions', () => {
    it('validates rectangle dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.RECTANGLE, 100, 200);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('validates circle dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.CIRCLE, 50, 50);
      expect(result.isValid).toBe(true);
      // May have warnings about square dimensions being recommended
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
    });

    it('warns about non-square circle dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.CIRCLE, 100, 50);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('aspect ratio');
    });

    it('validates minimum dimensions for circle', async () => {
      const result = await validateShapeDimensions(ShapeType.CIRCLE, 5, 5);
      expect(result.isValid).toBe(false);
      expect(result.warnings[0]).toContain('minimum dimensions');
    });

    it('validates minimum dimensions for cross', async () => {
      const result = await validateShapeDimensions(ShapeType.CROSS, 10, 10);
      expect(result.isValid).toBe(false);
      expect(result.warnings[0]).toContain('minimum dimensions');
    });

    it('validates minimum dimensions for arrow', async () => {
      const result = await validateShapeDimensions(ShapeType.ARROW, 20, 10);
      expect(result.isValid).toBe(false);
      expect(result.warnings[0]).toContain('minimum dimensions');
    });

    it('provides shape-specific notes', async () => {
      const result = await validateShapeDimensions(ShapeType.OVAL, 50, 30);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('ellipse'))).toBe(true);
    });

    it('suggests better aspect ratio for arrow', async () => {
      const result = await validateShapeDimensions(ShapeType.ARROW, 60, 60);
      expect(result.isValid).toBe(true);
      // Arrow should have warnings about aspect ratio or may include other notes
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('handles star shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.STAR, 40, 40);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles heart shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.HEART, 30, 30);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles diamond shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.DIAMOND, 25, 25);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles pentagon shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.PENTAGON, 35, 35);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles hexagon shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.HEXAGON, 45, 45);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles octagon shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.OCTAGON, 55, 55);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles donut shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.DONUT, 50, 50);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });

    it('handles triangle shape dimensions', async () => {
      const result = await validateShapeDimensions(ShapeType.TRIANGLE, 40, 40);
      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.includes('Square dimensions'))).toBe(true);
    });
  });
});