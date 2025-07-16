import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import colorNames from 'css-color-names';
import didYouMean from 'didyoumean2';
import { distance } from 'fastest-levenshtein';
import { validateHTMLColor as validateColor } from 'validate-color';

// Extend colord with names plugin to support CSS color names
extend([namesPlugin]);

const CSS_COLOR_NAMES = Object.keys(colorNames);

// Regex patterns for color parsing
const HEX_6_REGEX = /^[0-9a-fA-F]{6}$/;
const HEX_3_REGEX = /^#[0-9a-fA-F]{3}$/;

function repairSyntax(input: string): string {
  let color = input.trim();

  // Replace leading @ or 0x with #
  if (color.startsWith('@') || color.startsWith('0x')) {
    color = `#${color.slice(color.startsWith('0x') ? 2 : 1)}`;
  }

  // Add # to bare six-digit hex values
  if (HEX_6_REGEX.test(color)) {
    color = `#${color}`;
  }

  // Expand three-digit hex to six digits
  if (HEX_3_REGEX.test(color)) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  return color;
}

function findClosestColorName(input: string): string | null {
  const lowerInput = input.toLowerCase();

  // First, try exact match
  if (CSS_COLOR_NAMES.includes(lowerInput)) {
    return lowerInput;
  }

  // Find closest match with Levenshtein distance ≤ 2
  for (const colorName of CSS_COLOR_NAMES) {
    if (distance(lowerInput, colorName) <= 2) {
      return colorName;
    }
  }

  return null;
}

export function normalizeColor(input: string, strict = false): string {
  const original = input;

  // In strict mode, validate input as-is
  if (strict) {
    if (validateColor(input)) {
      return input;
    }
    throw new Error(`Invalid colour '${original}'.`);
  }

  // Step 1: Syntax repair
  const color = repairSyntax(input);

  // Step 2: Check if it's valid after syntax repair
  if (validateColor(color)) {
    return colord(color).toHex();
  }

  // Step 3: Try fuzzy name matching
  const closestName = findClosestColorName(input);
  if (closestName) {
    return colord(closestName).toHex();
  }

  // Step 4: Failure path - suggest closest match
  const suggestion = didYouMean(input.toLowerCase(), CSS_COLOR_NAMES);
  const errorMessage = suggestion
    ? `Invalid colour '${original}'. Did you mean '${suggestion}'?`
    : `Invalid colour '${original}'.`;

  throw new Error(errorMessage);
}
