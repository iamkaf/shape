import { describe, expect, it } from 'bun:test';
import { generateShapeBuffer, getDefaultFilename, getShapeConstraints, getShapeDescription, getSupportedShapes, isValidShape, ShapeType } from '../../src/lib/shapes';

describe('shapes module', () => {
  describe('getSupportedShapes', () => {
    it('returns all 13 supported shapes', () => {
      const shapes = getSupportedShapes();
      expect(shapes).toHaveLength(13);
      expect(shapes).toContain('rectangle');
      expect(shapes).toContain('triangle');
      expect(shapes).toContain('circle');
      expect(shapes).toContain('oval');
      expect(shapes).toContain('star');
      expect(shapes).toContain('heart');
      expect(shapes).toContain('diamond');
      expect(shapes).toContain('pentagon');
      expect(shapes).toContain('hexagon');
      expect(shapes).toContain('octagon');
      expect(shapes).toContain('cross');
      expect(shapes).toContain('arrow');
      expect(shapes).toContain('donut');
    });
  });

  describe('isValidShape', () => {
    it('returns true for valid shapes', () => {
      expect(isValidShape('rectangle')).toBe(true);
      expect(isValidShape('circle')).toBe(true);
      expect(isValidShape('star')).toBe(true);
    });

    it('returns false for invalid shapes', () => {
      expect(isValidShape('square')).toBe(false);
      expect(isValidShape('invalid')).toBe(false);
      expect(isValidShape('')).toBe(false);
    });
  });

  describe('getShapeDescription', () => {
    it('returns description for rectangle', () => {
      const desc = getShapeDescription(ShapeType.RECTANGLE);
      expect(desc).toBe('Filled rectangle covering entire canvas');
    });

    it('returns description for circle', () => {
      const desc = getShapeDescription(ShapeType.CIRCLE);
      expect(desc).toBe('Perfect circle');
    });

    it('returns description for star', () => {
      const desc = getShapeDescription(ShapeType.STAR);
      expect(desc).toBe('Five-pointed star');
    });

    it('returns description for heart', () => {
      const desc = getShapeDescription(ShapeType.HEART);
      expect(desc).toBe('Heart shape');
    });

    it('returns description for arrow', () => {
      const desc = getShapeDescription(ShapeType.ARROW);
      expect(desc).toBe('Arrow pointing right');
    });
  });

  describe('getDefaultFilename', () => {
    it('generates correct filename for rectangle', () => {
      const filename = getDefaultFilename(ShapeType.RECTANGLE, 100, 200);
      expect(filename).toBe('rectangle_100x200.png');
    });

    it('generates correct filename for circle', () => {
      const filename = getDefaultFilename(ShapeType.CIRCLE, 50, 50);
      expect(filename).toBe('circle_50x50.png');
    });

    it('generates correct filename for star', () => {
      const filename = getDefaultFilename(ShapeType.STAR, 300, 300);
      expect(filename).toBe('star_300x300.png');
    });
  });

  describe('getShapeConstraints', () => {
    it('returns correct constraints for rectangle', () => {
      const constraints = getShapeConstraints(ShapeType.RECTANGLE);
      expect(constraints.minWidth).toBe(1);
      expect(constraints.minHeight).toBe(1);
      expect(constraints.preferredRatio).toBeUndefined();
    });

    it('returns correct constraints for circle', () => {
      const constraints = getShapeConstraints(ShapeType.CIRCLE);
      expect(constraints.minWidth).toBe(10);
      expect(constraints.minHeight).toBe(10);
      expect(constraints.preferredRatio).toBe(1.0);
      expect(constraints.notes).toBe('Square dimensions recommended for best appearance');
    });

    it('returns correct constraints for arrow', () => {
      const constraints = getShapeConstraints(ShapeType.ARROW);
      expect(constraints.minWidth).toBe(30);
      expect(constraints.minHeight).toBe(20);
      expect(constraints.preferredRatio).toBe(1.5);
      expect(constraints.notes).toBe('Width should be greater than height for clarity');
    });

    it('returns correct constraints for cross', () => {
      const constraints = getShapeConstraints(ShapeType.CROSS);
      expect(constraints.minWidth).toBe(20);
      expect(constraints.minHeight).toBe(20);
      expect(constraints.preferredRatio).toBe(1.0);
      expect(constraints.notes).toBe('Minimum size ensures cross visibility');
    });

    it('returns correct constraints for oval', () => {
      const constraints = getShapeConstraints(ShapeType.OVAL);
      expect(constraints.minWidth).toBe(10);
      expect(constraints.minHeight).toBe(10);
      expect(constraints.preferredRatio).toBeUndefined();
      expect(constraints.notes).toBe('Different width/height creates ellipse');
    });
  });

  describe('generateShapeBuffer', () => {
    it('generates buffer for rectangle', () => {
      const buffer = generateShapeBuffer(ShapeType.RECTANGLE, 10, 10, '#ff0000');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for circle', () => {
      const buffer = generateShapeBuffer(ShapeType.CIRCLE, 20, 20, '#00ff00');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for triangle', () => {
      const buffer = generateShapeBuffer(ShapeType.TRIANGLE, 30, 30, '#0000ff');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for star with custom points', () => {
      const buffer = generateShapeBuffer(ShapeType.STAR, 50, 50, '#ff00ff', { starPoints: 6 });
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for arrow with custom direction', () => {
      const buffer = generateShapeBuffer(ShapeType.ARROW, 40, 30, '#ffff00', { arrowDirection: 'up' });
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for donut with custom thickness', () => {
      const buffer = generateShapeBuffer(ShapeType.DONUT, 60, 60, '#ff8800', { donutThickness: 0.3 });
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for cross with custom thickness', () => {
      const buffer = generateShapeBuffer(ShapeType.CROSS, 40, 40, '#8800ff', { crossThickness: 5 });
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for heart', () => {
      const buffer = generateShapeBuffer(ShapeType.HEART, 50, 50, '#ff1493');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for diamond', () => {
      const buffer = generateShapeBuffer(ShapeType.DIAMOND, 40, 40, '#00ffff');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for pentagon', () => {
      const buffer = generateShapeBuffer(ShapeType.PENTAGON, 50, 50, '#ffa500');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for hexagon', () => {
      const buffer = generateShapeBuffer(ShapeType.HEXAGON, 60, 60, '#800080');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for octagon', () => {
      const buffer = generateShapeBuffer(ShapeType.OCTAGON, 70, 70, '#008000');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('generates buffer for oval', () => {
      const buffer = generateShapeBuffer(ShapeType.OVAL, 80, 40, '#800000');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('throws error for invalid hex color', () => {
      expect(() => generateShapeBuffer(ShapeType.RECTANGLE, 10, 10, 'invalid')).toThrow();
    });
  });
});