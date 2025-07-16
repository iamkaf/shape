const MAX_DIMENSION = 10_000;

export function parseDimensions(
  widthStr: string,
  heightStr: string
): { width: number; height: number } {
  const width = Number.parseInt(widthStr, 10);
  const height = Number.parseInt(heightStr, 10);

  // Check if parsing failed (NaN)
  if (Number.isNaN(width) || Number.isNaN(height)) {
    throw new Error('Width and height must be positive integers.');
  }

  // Check for positive values
  if (width <= 0 || height <= 0) {
    throw new Error('Width and height must be positive integers.');
  }

  // Check for maximum dimension limits
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error('Dimension too large; max 10000.');
  }

  return { width, height };
}
