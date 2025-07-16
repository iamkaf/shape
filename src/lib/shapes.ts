/**
 * Shape generation engine for creating various geometric shapes
 */

import { PNG } from 'pngjs';
import {
  distance,
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
  type Point,
} from './geometry.js';

export const ShapeType = {
  RECTANGLE: 'rectangle',
  TRIANGLE: 'triangle',
  CIRCLE: 'circle',
  OVAL: 'oval',
  STAR: 'star',
  HEART: 'heart',
  DIAMOND: 'diamond',
  PENTAGON: 'pentagon',
  HEXAGON: 'hexagon',
  OCTAGON: 'octagon',
  CROSS: 'cross',
  ARROW: 'arrow',
  DONUT: 'donut',
} as const;

export type ShapeType = (typeof ShapeType)[keyof typeof ShapeType];

export interface ShapeOptions {
  starPoints?: number;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
  donutThickness?: number; // 0-1, percentage of radius
  crossThickness?: number; // pixels
}

/**
 * Generate a PNG buffer for the specified shape
 */
export function generateShapeBuffer(
  shape: ShapeType,
  width: number,
  height: number,
  color: string,
  options: ShapeOptions = {}
): Buffer {
  const png = new PNG({ width, height });
  const rgba = hexToRgba(color);

  // Fill with transparent background
  png.data.fill(0);

  // Use optimized shape generation for better performance
  generateShapePixelsOptimized(png, shape, width, height, rgba, options);

  return PNG.sync.write(png);
}

/**
 * Optimized shape pixel generation with shape-specific algorithms
 */
function generateShapePixelsOptimized(
  png: PNG,
  shape: ShapeType,
  width: number,
  height: number,
  rgba: { r: number; g: number; b: number; a: number },
  options: ShapeOptions
): void {
  const centerX = width / 2;
  const centerY = height / 2;

  switch (shape) {
    case ShapeType.RECTANGLE:
      generateRectangleOptimized(png, width, height, rgba);
      break;
    
    case ShapeType.CIRCLE:
      generateCircleOptimized(png, width, height, centerX, centerY, Math.min(width, height) / 2, rgba);
      break;
    
    case ShapeType.OVAL:
      generateEllipseOptimized(png, width, height, centerX, centerY, width / 2, height / 2, rgba);
      break;
    
    case ShapeType.DIAMOND:
      generateDiamondOptimized(png, width, height, centerX, centerY, Math.min(width, height) / 2, rgba);
      break;
    
    case ShapeType.DONUT:
      generateDonutOptimized(png, width, height, centerX, centerY, Math.min(width, height) / 2, options.donutThickness || 0.4, rgba);
      break;
    
    default:
      // Fall back to the original point-by-point method for complex shapes
      generateShapePixelsFallback(png, shape, width, height, rgba, options);
  }
}

/**
 * Optimized rectangle generation (fastest path)
 */
function generateRectangleOptimized(
  png: PNG,
  width: number,
  height: number,
  rgba: { r: number; g: number; b: number; a: number }
): void {
  const data = png.data;
  const pixelSize = 4;
  
  for (let y = 0; y < height; y++) {
    const rowStart = y * width * pixelSize;
    for (let x = 0; x < width; x++) {
      const idx = rowStart + x * pixelSize;
      data[idx] = rgba.r;
      data[idx + 1] = rgba.g;
      data[idx + 2] = rgba.b;
      data[idx + 3] = rgba.a;
    }
  }
}

/**
 * Optimized circle generation using precomputed values
 */
function generateCircleOptimized(
  png: PNG,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  rgba: { r: number; g: number; b: number; a: number }
): void {
  const data = png.data;
  const radiusSquared = radius * radius;
  
  for (let y = 0; y < height; y++) {
    const dy = y - centerY;
    const dySquared = dy * dy;
    
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      
      if (dx * dx + dySquared <= radiusSquared) {
        const idx = (width * y + x) << 2;
        data[idx] = rgba.r;
        data[idx + 1] = rgba.g;
        data[idx + 2] = rgba.b;
        data[idx + 3] = rgba.a;
      }
    }
  }
}

/**
 * Optimized ellipse generation
 */
function generateEllipseOptimized(
  png: PNG,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  rgba: { r: number; g: number; b: number; a: number }
): void {
  const data = png.data;
  const radiusXSquared = radiusX * radiusX;
  const radiusYSquared = radiusY * radiusY;
  
  for (let y = 0; y < height; y++) {
    const dy = y - centerY;
    const dySquared = dy * dy;
    
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      
      if ((dx * dx) / radiusXSquared + (dySquared) / radiusYSquared <= 1) {
        const idx = (width * y + x) << 2;
        data[idx] = rgba.r;
        data[idx + 1] = rgba.g;
        data[idx + 2] = rgba.b;
        data[idx + 3] = rgba.a;
      }
    }
  }
}

/**
 * Optimized diamond generation using Manhattan distance
 */
function generateDiamondOptimized(
  png: PNG,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  size: number,
  rgba: { r: number; g: number; b: number; a: number }
): void {
  const data = png.data;
  
  for (let y = 0; y < height; y++) {
    const dy = Math.abs(y - centerY);
    
    for (let x = 0; x < width; x++) {
      const dx = Math.abs(x - centerX);
      
      if (dx + dy <= size) {
        const idx = (width * y + x) << 2;
        data[idx] = rgba.r;
        data[idx + 1] = rgba.g;
        data[idx + 2] = rgba.b;
        data[idx + 3] = rgba.a;
      }
    }
  }
}

/**
 * Optimized donut generation
 */
function generateDonutOptimized(
  png: PNG,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  rgba: { r: number; g: number; b: number; a: number }
): void {
  const data = png.data;
  const outerRadiusSquared = radius * radius;
  const innerRadius = radius * (1 - thickness);
  const innerRadiusSquared = innerRadius * innerRadius;
  
  for (let y = 0; y < height; y++) {
    const dy = y - centerY;
    const dySquared = dy * dy;
    
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const distanceSquared = dx * dx + dySquared;
      
      if (distanceSquared <= outerRadiusSquared && distanceSquared >= innerRadiusSquared) {
        const idx = (width * y + x) << 2;
        data[idx] = rgba.r;
        data[idx + 1] = rgba.g;
        data[idx + 2] = rgba.b;
        data[idx + 3] = rgba.a;
      }
    }
  }
}

/**
 * Fallback to original point-by-point method for complex shapes
 */
function generateShapePixelsFallback(
  png: PNG,
  shape: ShapeType,
  width: number,
  height: number,
  rgba: { r: number; g: number; b: number; a: number },
  options: ShapeOptions
): void {
  const data = png.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const point: Point = { x, y };

      if (isPointInShape(point, shape, width, height, options)) {
        const idx = (width * y + x) << 2;
        data[idx] = rgba.r;
        data[idx + 1] = rgba.g;
        data[idx + 2] = rgba.b;
        data[idx + 3] = rgba.a;
      }
    }
  }
}

/**
 * Check if a point is inside the specified shape
 */
function isPointInShape(
  point: Point,
  shape: ShapeType,
  width: number,
  height: number,
  options: ShapeOptions = {}
): boolean {
  const center: Point = { x: width / 2, y: height / 2 };

  switch (shape) {
    case ShapeType.RECTANGLE:
      return isPointInRectangle(point, width, height);

    case ShapeType.TRIANGLE:
      return isPointInTriangle(point, center, Math.min(width, height) / 2);

    case ShapeType.CIRCLE:
      return isPointInCircle(point, center, Math.min(width, height) / 2);

    case ShapeType.OVAL:
      return isPointInEllipse(point, center, width / 2, height / 2);

    case ShapeType.STAR:
      return isPointInStarShape(
        point,
        center,
        Math.min(width, height) / 2,
        options.starPoints || 5
      );

    case ShapeType.HEART:
      return isPointInHeart(point, center, Math.min(width, height) / 4);

    case ShapeType.DIAMOND:
      return isPointInDiamond(point, center, Math.min(width, height) / 2);

    case ShapeType.PENTAGON:
      return isPointInRegularPolygon(
        point,
        center,
        Math.min(width, height) / 2,
        5
      );

    case ShapeType.HEXAGON:
      return isPointInRegularPolygon(
        point,
        center,
        Math.min(width, height) / 2,
        6
      );

    case ShapeType.OCTAGON:
      return isPointInRegularPolygon(
        point,
        center,
        Math.min(width, height) / 2,
        8
      );

    case ShapeType.CROSS:
      return isPointInCross(
        point,
        center,
        width,
        height,
        options.crossThickness || Math.min(width, height) / 6
      );

    case ShapeType.ARROW:
      return isPointInArrowShape(
        point,
        width,
        height,
        options.arrowDirection || 'right'
      );

    case ShapeType.DONUT:
      return isPointInDonut(
        point,
        center,
        Math.min(width, height) / 2,
        options.donutThickness || 0.4
      );

    default:
      return false;
  }
}

/**
 * Rectangle shape (fills entire canvas)
 */
function isPointInRectangle(
  point: Point,
  width: number,
  height: number
): boolean {
  return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

/**
 * Equilateral triangle pointing up
 */
function isPointInTriangle(
  point: Point,
  center: Point,
  radius: number
): boolean {
  // Generate equilateral triangle vertices
  const vertices = generateRegularPolygon(center, radius, 3, -Math.PI / 2);
  return isPointInPolygon(point, vertices);
}

/**
 * Regular polygon
 */
function isPointInRegularPolygon(
  point: Point,
  center: Point,
  radius: number,
  sides: number
): boolean {
  const vertices = generateRegularPolygon(center, radius, sides, -Math.PI / 2);
  return isPointInPolygon(point, vertices);
}

/**
 * Star shape
 */
function isPointInStarShape(
  point: Point,
  center: Point,
  radius: number,
  points: number
): boolean {
  const innerRadius = radius * 0.4; // Inner radius is 40% of outer radius
  const vertices = generateStar(center, radius, innerRadius, points);
  return isPointInPolygon(point, vertices);
}

/**
 * Arrow shape
 */
function isPointInArrowShape(
  point: Point,
  width: number,
  height: number,
  direction: 'up' | 'down' | 'left' | 'right'
): boolean {
  const vertices = generateArrowVertices(width, height, direction);
  return isPointInPolygon(point, vertices);
}

/**
 * Donut shape (circle with hole)
 */
function isPointInDonut(
  point: Point,
  center: Point,
  radius: number,
  thickness: number
): boolean {
  const dist = distance(point, center);
  const innerRadius = radius * (1 - thickness);
  return dist <= radius && dist >= innerRadius;
}

/**
 * Get list of all supported shapes
 */
export function getSupportedShapes(): ShapeType[] {
  return Object.values(ShapeType);
}

/**
 * Check if a shape name is valid
 */
export function isValidShape(shape: string): shape is ShapeType {
  return Object.values(ShapeType).includes(shape as ShapeType);
}

/**
 * Get shape description for help text
 */
export function getShapeDescription(shape: ShapeType): string {
  switch (shape) {
    case ShapeType.RECTANGLE:
      return 'Filled rectangle covering entire canvas';
    case ShapeType.TRIANGLE:
      return 'Equilateral triangle pointing upward';
    case ShapeType.CIRCLE:
      return 'Perfect circle';
    case ShapeType.OVAL:
      return 'Ellipse fitting width and height';
    case ShapeType.STAR:
      return 'Five-pointed star';
    case ShapeType.HEART:
      return 'Heart shape';
    case ShapeType.DIAMOND:
      return 'Diamond/rhombus shape';
    case ShapeType.PENTAGON:
      return 'Regular five-sided polygon';
    case ShapeType.HEXAGON:
      return 'Regular six-sided polygon';
    case ShapeType.OCTAGON:
      return 'Regular eight-sided polygon';
    case ShapeType.CROSS:
      return 'Plus/cross shape';
    case ShapeType.ARROW:
      return 'Arrow pointing right';
    case ShapeType.DONUT:
      return 'Ring/donut shape';
    default:
      return 'Unknown shape';
  }
}

/**
 * Get default filename for shape
 */
export function getDefaultFilename(
  shape: ShapeType,
  width: number,
  height: number
): string {
  return `${shape}_${width}x${height}.png`;
}

/**
 * Get shape-specific constraints and recommendations
 */
export function getShapeConstraints(shape: ShapeType): {
  minWidth: number;
  minHeight: number;
  preferredRatio?: number;
  notes?: string;
} {
  switch (shape) {
    case ShapeType.RECTANGLE:
      return { minWidth: 1, minHeight: 1 };

    case ShapeType.TRIANGLE:
    case ShapeType.CIRCLE:
    case ShapeType.STAR:
    case ShapeType.HEART:
    case ShapeType.DIAMOND:
    case ShapeType.PENTAGON:
    case ShapeType.HEXAGON:
    case ShapeType.OCTAGON:
    case ShapeType.DONUT:
      return {
        minWidth: 10,
        minHeight: 10,
        preferredRatio: 1.0,
        notes: 'Square dimensions recommended for best appearance',
      };

    case ShapeType.OVAL:
      return {
        minWidth: 10,
        minHeight: 10,
        notes: 'Different width/height creates ellipse',
      };

    case ShapeType.CROSS:
      return {
        minWidth: 20,
        minHeight: 20,
        preferredRatio: 1.0,
        notes: 'Minimum size ensures cross visibility',
      };

    case ShapeType.ARROW:
      return {
        minWidth: 30,
        minHeight: 20,
        preferredRatio: 1.5,
        notes: 'Width should be greater than height for clarity',
      };

    default:
      return { minWidth: 1, minHeight: 1 };
  }
}
