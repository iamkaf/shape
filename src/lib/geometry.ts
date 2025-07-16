/**
 * Geometric helper functions for shape generation
 */

const HEX_COLOR_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export interface Point {
  x: number;
  y: number;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Calculate distance from point to origin
 */
export function distanceFromOrigin(point: Point): number {
  return Math.sqrt(point.x ** 2 + point.y ** 2);
}

/**
 * Check if point is inside a circle
 */
export function isPointInCircle(
  point: Point,
  center: Point,
  radius: number
): boolean {
  return distance(point, center) <= radius;
}

/**
 * Check if point is inside an ellipse
 */
export function isPointInEllipse(
  point: Point,
  center: Point,
  radiusX: number,
  radiusY: number
): boolean {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
}

/**
 * Check if point is inside a polygon using ray casting algorithm
 */
export function isPointInPolygon(point: Point, vertices: Point[]): boolean {
  let inside = false;
  const n = vertices.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const vi = vertices[i];
    const vj = vertices[j];

    if (!(vi && vj)) {
      continue;
    }

    const xi = vi.x;
    const yi = vi.y;
    const xj = vj.x;
    const yj = vj.y;

    const yiAbove = yi > point.y;
    const yjAbove = yj > point.y;
    const crossesRay = yiAbove !== yjAbove;
    const leftOfPoint = point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (crossesRay && leftOfPoint) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Generate vertices for regular polygon
 */
export function generateRegularPolygon(
  center: Point,
  radius: number,
  sides: number,
  rotation = 0
): Point[] {
  const vertices: Point[] = [];
  const angleStep = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep + rotation;
    vertices.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }

  return vertices;
}

/**
 * Generate vertices for a star shape
 */
export function generateStar(
  center: Point,
  outerRadius: number,
  innerRadius: number,
  points = 5
): Point[] {
  const vertices: Point[] = [];
  const angleStep = Math.PI / points;

  for (let i = 0; i < points * 2; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;

    vertices.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }

  return vertices;
}

/**
 * Generate vertices for heart shape using parametric equations
 */
export function generateHeartVertices(
  center: Point,
  size: number,
  resolution = 100
): Point[] {
  const vertices: Point[] = [];

  // Scale factor to make heart fit within the expected size
  const scale = size / 8; // Normalize by the largest coefficient (16)

  for (let i = 0; i < resolution; i++) {
    const t = (i / resolution) * 2 * Math.PI;

    // Parametric heart equation with proper scaling
    const x = scale * (16 * Math.sin(t) ** 3);
    const y =
      scale *
      (13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t));

    vertices.push({
      x: center.x + x,
      y: center.y - y, // Flip Y to make heart right-side up
    });
  }

  return vertices;
}

/**
 * Check if point is inside heart shape using parametric equation vertices
 */
export function isPointInHeart(
  point: Point,
  center: Point,
  size: number
): boolean {
  // Generate heart vertices using parametric equations
  const vertices = generateHeartVertices(center, size, 200);

  // Use polygon-based point-in-polygon test
  return isPointInPolygon(point, vertices);
}

/**
 * Generate vertices for arrow shape
 */
export function generateArrowVertices(
  width: number,
  height: number,
  direction: 'up' | 'down' | 'left' | 'right' = 'right'
): Point[] {
  const shaftWidth = width * 0.4;
  const headWidth = width * 0.8;
  const headLength = height * 0.3;
  const shaftLength = height - headLength;

  let vertices: Point[] = [];

  // Generate right-pointing arrow first
  const centerY = height / 2;
  const shaftTop = centerY - shaftWidth / 2;
  const shaftBottom = centerY + shaftWidth / 2;
  const headTop = centerY - headWidth / 2;
  const headBottom = centerY + headWidth / 2;

  vertices = [
    { x: 0, y: shaftTop },
    { x: shaftLength, y: shaftTop },
    { x: shaftLength, y: headTop },
    { x: width, y: centerY },
    { x: shaftLength, y: headBottom },
    { x: shaftLength, y: shaftBottom },
    { x: 0, y: shaftBottom },
  ];

  // Transform based on direction
  if (direction !== 'right') {
    vertices = vertices.map((v) => transformPoint(v, width, height, direction));
  }

  return vertices;
}

/**
 * Transform point based on direction
 */
function transformPoint(
  point: Point,
  width: number,
  height: number,
  direction: 'up' | 'down' | 'left' | 'right'
): Point {
  const centerX = width / 2;
  const centerY = height / 2;

  switch (direction) {
    case 'up':
      return {
        x: centerX + (point.y - centerY),
        y: centerX - (point.x - centerX),
      };
    case 'down':
      return {
        x: centerX - (point.y - centerY),
        y: centerX + (point.x - centerX),
      };
    case 'left':
      return { x: width - point.x, y: point.y };
    default:
      return point;
  }
}

/**
 * Manhattan distance (diamond shape)
 */
export function manhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

/**
 * Check if point is in diamond shape
 */
export function isPointInDiamond(
  point: Point,
  center: Point,
  size: number
): boolean {
  return manhattanDistance(point, center) <= size;
}

/**
 * Check if point is in cross shape
 */
export function isPointInCross(
  point: Point,
  center: Point,
  width: number,
  height: number,
  thickness: number
): boolean {
  const dx = Math.abs(point.x - center.x);
  const dy = Math.abs(point.y - center.y);

  // Point is in cross if it's in either the horizontal or vertical bar
  const inHorizontalBar = dy <= thickness / 2 && dx <= width / 2;
  const inVerticalBar = dx <= thickness / 2 && dy <= height / 2;

  return inHorizontalBar || inVerticalBar;
}

/**
 * Convert hex color to RGBA
 */
export function hexToRgba(hex: string): RGBAColor {
  const result = HEX_COLOR_REGEX.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
    a: 255,
  };
}
