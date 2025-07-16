/**
 * Shape validation module with fuzzy matching and error recovery
 */

import didYouMean from 'didyoumean2';
import { distance } from 'fastest-levenshtein';
import { getSupportedShapes, ShapeType } from './shapes.js';

const SUPPORTED_SHAPES = getSupportedShapes();
const SHAPE_NAMES = SUPPORTED_SHAPES.map((shape) => shape.toLowerCase());
const ALPHA_ONLY_REGEX = /^[a-zA-Z]+$/;

/**
 * Normalize shape name input
 */
function normalizeShapeName(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Check if a shape name is valid
 */
export function isValidShapeName(input: string): boolean {
  const normalized = normalizeShapeName(input);
  return SHAPE_NAMES.includes(normalized);
}

/**
 * Find closest shape name using Levenshtein distance
 */
function findClosestShapeName(input: string): string | null {
  const normalized = normalizeShapeName(input);

  // First, try exact match
  if (SHAPE_NAMES.includes(normalized)) {
    return normalized;
  }

  // Find closest match with Levenshtein distance ≤ 2
  for (const shapeName of SHAPE_NAMES) {
    if (distance(normalized, shapeName) <= 2) {
      return shapeName;
    }
  }

  return null;
}

/**
 * Validate and normalize shape name with error recovery
 */
export function validateShapeName(input: string, strict = false): string {
  const original = input;

  // In strict mode, only allow exact matches
  if (strict) {
    const normalized = normalizeShapeName(input);
    if (SHAPE_NAMES.includes(normalized)) {
      return normalized;
    }
    throw new Error(
      `Invalid shape '${original}'. Use --help to see supported shapes.`
    );
  }

  // Step 1: Check if it's valid after normalization
  const normalized = normalizeShapeName(input);
  if (SHAPE_NAMES.includes(normalized)) {
    return normalized;
  }

  // Step 2: Try fuzzy name matching
  const closestName = findClosestShapeName(input);
  if (closestName) {
    return closestName;
  }

  // Step 3: Failure path - suggest closest match
  const suggestion = didYouMean(normalized, SHAPE_NAMES);
  const errorMessage = suggestion
    ? `Invalid shape '${original}'. Did you mean '${suggestion}'?`
    : `Invalid shape '${original}'. Supported shapes: ${SHAPE_NAMES.join(', ')}.`;

  throw new Error(errorMessage);
}

/**
 * Convert normalized shape name to ShapeType
 */
export function normalizedNameToShapeType(normalizedName: string): ShapeType {
  const shapeEntry = Object.entries(ShapeType).find(
    ([, value]) => value === normalizedName
  );

  if (!shapeEntry) {
    throw new Error(`Invalid shape name: ${normalizedName}`);
  }

  return shapeEntry[1];
}

/**
 * Parse and validate shape name from user input
 */
export function parseShapeName(input: string, strict = false): ShapeType {
  const normalizedName = validateShapeName(input, strict);
  return normalizedNameToShapeType(normalizedName);
}

/**
 * Get shape validation suggestions for help text
 */
export function getShapeValidationHelp(): string {
  const shapes = SUPPORTED_SHAPES.map((shape) => `  ${shape}`).join('\n');
  return `Supported shapes:\n${shapes}`;
}

/**
 * Check if input might be a shape name (for backward compatibility detection)
 */
export function looksLikeShapeName(input: string): boolean {
  const normalized = normalizeShapeName(input);

  // Check if it's a known shape name
  if (SHAPE_NAMES.includes(normalized)) {
    return true;
  }

  // Check if it's close to a known shape name
  for (const shapeName of SHAPE_NAMES) {
    if (distance(normalized, shapeName) <= 3) {
      return true;
    }
  }

  // Check if it looks like a shape name (contains alphabetic characters)
  return ALPHA_ONLY_REGEX.test(normalized);
}

/**
 * Validate shape dimensions for specific shapes
 */
export async function validateShapeDimensions(
  shape: ShapeType,
  width: number,
  height: number
): Promise<{ isValid: boolean; warnings: string[] }> {
  const warnings: string[] = [];
  let isValid = true;

  // Get shape constraints
  const shapeModule = await import('./shapes.js');
  const constraints = shapeModule.getShapeConstraints(shape);

  // Check minimum dimensions
  if (width < constraints.minWidth || height < constraints.minHeight) {
    warnings.push(
      `${shape} requires minimum dimensions of ${constraints.minWidth}x${constraints.minHeight}`
    );
    isValid = false;
  }

  // Check preferred ratio
  if (constraints.preferredRatio) {
    const actualRatio = width / height;
    const preferredRatio = constraints.preferredRatio;
    const ratioTolerance = 0.5; // Allow 50% deviation

    if (Math.abs(actualRatio - preferredRatio) > ratioTolerance) {
      warnings.push(
        `${shape} looks best with aspect ratio ${preferredRatio}:1 (try ${Math.round(height * preferredRatio)}x${height})`
      );
    }
  }

  // Add shape-specific notes
  if (constraints.notes) {
    warnings.push(constraints.notes);
  }

  return { isValid, warnings };
}

/**
 * Get all shape names for fuzzy matching
 */
export function getAllShapeNames(): string[] {
  return [...SHAPE_NAMES];
}
