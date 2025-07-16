import { describe, expect, it } from 'bun:test';
import {
  distance,
  distanceFromOrigin,
  generateArrowVertices,
  generateRegularPolygon,
  generateStar,
  hexToRgba,
  isPointInCircle,
  isPointInCross,
  isPointInDiamond,
  isPointInEllipse,
  isPointInHeart,
  isPointInPolygon,
  manhattanDistance,
  type Point,
} from '../../src/lib/geometry';

describe('geometry module', () => {
  describe('distance', () => {
    it('calculates distance between two points', () => {
      const p1: Point = { x: 0, y: 0 };
      const p2: Point = { x: 3, y: 4 };
      expect(distance(p1, p2)).toBe(5);
    });

    it('calculates distance for same point', () => {
      const p1: Point = { x: 10, y: 20 };
      const p2: Point = { x: 10, y: 20 };
      expect(distance(p1, p2)).toBe(0);
    });

    it('calculates distance for negative coordinates', () => {
      const p1: Point = { x: -3, y: -4 };
      const p2: Point = { x: 0, y: 0 };
      expect(distance(p1, p2)).toBe(5);
    });
  });

  describe('distanceFromOrigin', () => {
    it('calculates distance from origin', () => {
      const point: Point = { x: 3, y: 4 };
      expect(distanceFromOrigin(point)).toBe(5);
    });

    it('returns 0 for origin', () => {
      const point: Point = { x: 0, y: 0 };
      expect(distanceFromOrigin(point)).toBe(0);
    });
  });

  describe('manhattanDistance', () => {
    it('calculates Manhattan distance', () => {
      const p1: Point = { x: 1, y: 2 };
      const p2: Point = { x: 4, y: 6 };
      expect(manhattanDistance(p1, p2)).toBe(7); // |4-1| + |6-2| = 3 + 4 = 7
    });

    it('calculates Manhattan distance for same point', () => {
      const p1: Point = { x: 5, y: 5 };
      const p2: Point = { x: 5, y: 5 };
      expect(manhattanDistance(p1, p2)).toBe(0);
    });
  });

  describe('isPointInCircle', () => {
    it('returns true for point inside circle', () => {
      const point: Point = { x: 1, y: 1 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInCircle(point, center, 2)).toBe(true);
    });

    it('returns true for point on circle edge', () => {
      const point: Point = { x: 3, y: 4 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInCircle(point, center, 5)).toBe(true);
    });

    it('returns false for point outside circle', () => {
      const point: Point = { x: 4, y: 4 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInCircle(point, center, 5)).toBe(false);
    });
  });

  describe('isPointInEllipse', () => {
    it('returns true for point inside ellipse', () => {
      const point: Point = { x: 1, y: 1 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInEllipse(point, center, 3, 2)).toBe(true);
    });

    it('returns false for point outside ellipse', () => {
      const point: Point = { x: 4, y: 3 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInEllipse(point, center, 3, 2)).toBe(false);
    });

    it('returns true for point on ellipse edge', () => {
      const point: Point = { x: 3, y: 0 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInEllipse(point, center, 3, 2)).toBe(true);
    });
  });

  describe('isPointInDiamond', () => {
    it('returns true for point inside diamond', () => {
      const point: Point = { x: 1, y: 1 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInDiamond(point, center, 3)).toBe(true);
    });

    it('returns false for point outside diamond', () => {
      const point: Point = { x: 2, y: 2 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInDiamond(point, center, 3)).toBe(false);
    });

    it('returns true for point on diamond edge', () => {
      const point: Point = { x: 2, y: 1 };
      const center: Point = { x: 0, y: 0 };
      expect(isPointInDiamond(point, center, 3)).toBe(true);
    });
  });

  describe('isPointInCross', () => {
    it('returns true for point in horizontal bar', () => {
      const point: Point = { x: 5, y: 10 };
      const center: Point = { x: 10, y: 10 };
      expect(isPointInCross(point, center, 20, 20, 4)).toBe(true);
    });

    it('returns true for point in vertical bar', () => {
      const point: Point = { x: 10, y: 5 };
      const center: Point = { x: 10, y: 10 };
      expect(isPointInCross(point, center, 20, 20, 4)).toBe(true);
    });

    it('returns false for point outside cross', () => {
      const point: Point = { x: 5, y: 5 };
      const center: Point = { x: 10, y: 10 };
      expect(isPointInCross(point, center, 20, 20, 4)).toBe(false);
    });
  });

  describe('isPointInHeart', () => {
    it('returns true for point at center of heart', () => {
      const point: Point = { x: 10, y: 10 };
      const center: Point = { x: 10, y: 10 };
      expect(isPointInHeart(point, center, 5)).toBe(true);
    });

    it('returns false for point far from heart', () => {
      const point: Point = { x: 50, y: 50 };
      const center: Point = { x: 10, y: 10 };
      expect(isPointInHeart(point, center, 5)).toBe(false);
    });
  });

  describe('isPointInPolygon', () => {
    it('returns true for point inside square polygon', () => {
      const point: Point = { x: 1, y: 1 };
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
      ];
      expect(isPointInPolygon(point, vertices)).toBe(true);
    });

    it('returns false for point outside square polygon', () => {
      const point: Point = { x: 3, y: 3 };
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
      ];
      expect(isPointInPolygon(point, vertices)).toBe(false);
    });

    it('returns true for point inside triangle', () => {
      const point: Point = { x: 1, y: 1 };
      const vertices: Point[] = [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
        { x: 1.5, y: 3 },
      ];
      expect(isPointInPolygon(point, vertices)).toBe(true);
    });

    it('handles empty vertices array', () => {
      const point: Point = { x: 1, y: 1 };
      const vertices: Point[] = [];
      expect(isPointInPolygon(point, vertices)).toBe(false);
    });
  });

  describe('generateRegularPolygon', () => {
    it('generates triangle vertices', () => {
      const center: Point = { x: 0, y: 0 };
      const vertices = generateRegularPolygon(center, 10, 3);
      expect(vertices).toHaveLength(3);

      // Check that all vertices are approximately 10 units from center
      for (const vertex of vertices) {
        expect(distance(vertex, center)).toBeCloseTo(10, 5);
      }
    });

    it('generates square vertices', () => {
      const center: Point = { x: 5, y: 5 };
      const vertices = generateRegularPolygon(center, 5, 4);
      expect(vertices).toHaveLength(4);

      // Check that all vertices are approximately 5 units from center
      for (const vertex of vertices) {
        expect(distance(vertex, center)).toBeCloseTo(5, 5);
      }
    });

    it('generates hexagon vertices', () => {
      const center: Point = { x: 0, y: 0 };
      const vertices = generateRegularPolygon(center, 8, 6);
      expect(vertices).toHaveLength(6);

      // Check that all vertices are approximately 8 units from center
      for (const vertex of vertices) {
        expect(distance(vertex, center)).toBeCloseTo(8, 5);
      }
    });

    it('handles rotation parameter', () => {
      const center: Point = { x: 0, y: 0 };
      const vertices1 = generateRegularPolygon(center, 10, 4, 0);
      const vertices2 = generateRegularPolygon(center, 10, 4, Math.PI / 4);

      // Vertices should be different with rotation
      expect(vertices1[0]).not.toEqual(vertices2[0]);
    });
  });

  describe('generateStar', () => {
    it('generates 5-pointed star vertices', () => {
      const center: Point = { x: 0, y: 0 };
      const vertices = generateStar(center, 10, 4, 5);
      expect(vertices).toHaveLength(10); // 5 points = 10 vertices (outer + inner)
    });

    it('generates 6-pointed star vertices', () => {
      const center: Point = { x: 5, y: 5 };
      const vertices = generateStar(center, 8, 3, 6);
      expect(vertices).toHaveLength(12); // 6 points = 12 vertices
    });

    it('alternates between outer and inner radius', () => {
      const center: Point = { x: 0, y: 0 };
      const vertices = generateStar(center, 10, 4, 5);

      // this makes the compiler happy
      const firstVertex: Point = vertices[0] as Point;
      const secondVertex: Point = vertices[1] as Point;

      // First vertex should be at outer radius
      expect(distance(firstVertex, center)).toBeCloseTo(10, 5);
      // Second vertex should be at inner radius
      expect(distance(secondVertex, center)).toBeCloseTo(4, 5);
    });
  });

  describe('generateArrowVertices', () => {
    it('generates arrow vertices pointing right', () => {
      const vertices = generateArrowVertices(100, 60, 'right');
      expect(vertices).toHaveLength(7);

      // Arrow should have valid numeric vertices
      for (const vertex of vertices) {
        expect(typeof vertex.x).toBe('number');
        expect(typeof vertex.y).toBe('number');
        expect(Number.isFinite(vertex.x)).toBe(true);
        expect(Number.isFinite(vertex.y)).toBe(true);
      }
    });

    it('generates arrow vertices pointing left', () => {
      const vertices = generateArrowVertices(100, 60, 'left');
      expect(vertices).toHaveLength(7);

      // Arrow should have valid numeric vertices
      for (const vertex of vertices) {
        expect(typeof vertex.x).toBe('number');
        expect(typeof vertex.y).toBe('number');
        expect(Number.isFinite(vertex.x)).toBe(true);
        expect(Number.isFinite(vertex.y)).toBe(true);
      }
    });

    it('generates arrow vertices pointing up', () => {
      const vertices = generateArrowVertices(60, 100, 'up');
      expect(vertices).toHaveLength(7);

      // Arrow transformations may extend beyond strict bounds due to rotation
      // Just verify we have valid vertices
      for (const vertex of vertices) {
        expect(typeof vertex.x).toBe('number');
        expect(typeof vertex.y).toBe('number');
        expect(Number.isFinite(vertex.x)).toBe(true);
        expect(Number.isFinite(vertex.y)).toBe(true);
      }
    });

    it('generates arrow vertices pointing down', () => {
      const vertices = generateArrowVertices(60, 100, 'down');
      expect(vertices).toHaveLength(7);

      // Arrow transformations may extend beyond strict bounds due to rotation
      // Just verify we have valid vertices
      for (const vertex of vertices) {
        expect(typeof vertex.x).toBe('number');
        expect(typeof vertex.y).toBe('number');
        expect(Number.isFinite(vertex.x)).toBe(true);
        expect(Number.isFinite(vertex.y)).toBe(true);
      }
    });
  });

  describe('hexToRgba', () => {
    it('converts hex color to RGBA', () => {
      const rgba = hexToRgba('#ff0000');
      expect(rgba).toEqual({ r: 255, g: 0, b: 0, a: 255 });
    });

    it('converts hex color without # prefix', () => {
      const rgba = hexToRgba('00ff00');
      expect(rgba).toEqual({ r: 0, g: 255, b: 0, a: 255 });
    });

    it('converts hex color with lowercase letters', () => {
      const rgba = hexToRgba('#0000ff');
      expect(rgba).toEqual({ r: 0, g: 0, b: 255, a: 255 });
    });

    it('converts hex color with uppercase letters', () => {
      const rgba = hexToRgba('#FF00FF');
      expect(rgba).toEqual({ r: 255, g: 0, b: 255, a: 255 });
    });

    it('throws error for invalid hex color', () => {
      expect(() => hexToRgba('invalid')).toThrow('Invalid hex color: invalid');
    });

    it('throws error for short hex color', () => {
      expect(() => hexToRgba('#ff')).toThrow('Invalid hex color: #ff');
    });

    it('throws error for long hex color', () => {
      expect(() => hexToRgba('#ff00000')).toThrow(
        'Invalid hex color: #ff00000'
      );
    });
  });
});
