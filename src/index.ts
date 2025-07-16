#!/usr/bin/env bun

import { performance } from 'node:perf_hooks';
import { Command } from 'commander';
// Sharp import removed - using optimized shape generation instead
import { normalizeColor } from './lib/color.js';
import { parseDimensions } from './lib/dimensions.js';
import { atomicWrite, fileExists } from './lib/file.js';
import {
  generateShapeBuffer,
  getDefaultFilename,
  ShapeType,
} from './lib/shapes.js';
import {
  getShapeValidationHelp,
  looksLikeShapeName,
  parseShapeName,
  validateShapeDimensions,
} from './lib/shapeValidation.js';

const NUMERIC_REGEX = /^\d+$/;

interface ParsedCliArgs {
  shape: ShapeType;
  width: number;
  height: number;
  color: string;
  outputFilename: string;
}

async function parseCliArguments(
  shapeArg: string,
  widthArg: string,
  heightArg: string,
  colorArg: string,
  outputFilenameArg: string | undefined,
  options: {
    strictShape?: boolean;
    strictColor?: boolean;
    verbose?: boolean;
    output?: string;
  }
): Promise<ParsedCliArgs> {
  // Handle backward compatibility
  let shape: ShapeType;
  let widthStr: string;
  let heightStr: string;
  let color: string;
  let outputFilename: string | undefined;

  const firstArgIsNumber = NUMERIC_REGEX.test(shapeArg);

  if (firstArgIsNumber && !looksLikeShapeName(shapeArg)) {
    // Old format: WIDTH HEIGHT COLOR [outputFilename]
    console.warn(
      '⚠️  Deprecated: Using old format. New format: shape <shape> <width> <height> <color>'
    );
    shape = ShapeType.RECTANGLE;
    widthStr = shapeArg;
    heightStr = widthArg;
    color = heightArg;
    outputFilename = colorArg;
  } else {
    // New format: SHAPE WIDTH HEIGHT COLOR [outputFilename]
    shape = parseShapeName(shapeArg, options.strictShape);
    widthStr = widthArg;
    heightStr = heightArg;
    color = colorArg;
    outputFilename = outputFilenameArg;
  }

  // Parse and validate dimensions
  const { width, height } = parseDimensions(widthStr, heightStr);

  // Validate shape dimensions
  const dimensionValidation = await validateShapeDimensions(
    shape,
    width,
    height
  );
  if (!dimensionValidation.isValid) {
    throw new Error(dimensionValidation.warnings.join(' '));
  }

  // Show dimension warnings in verbose mode
  if (options.verbose && dimensionValidation.warnings.length > 0) {
    for (const warning of dimensionValidation.warnings) {
      console.warn(`⚠️  ${warning}`);
    }
  }

  // Normalize color
  const normalizedColor = normalizeColor(color, options.strictColor);

  // Determine output filename
  const finalOutputFilename =
    options.output ||
    outputFilename ||
    getDefaultFilename(shape, width, height);

  return {
    shape,
    width,
    height,
    color: normalizedColor,
    outputFilename: finalOutputFilename,
  };
}

export async function generate(
  shape: ShapeType,
  width: number,
  height: number,
  color: string,
  outputFilename: string
): Promise<void> {
  try {
    // Normalize color before generating shape
    const normalizedColor = normalizeColor(color, false);

    // Use optimized shape generation for all shapes
    const buffer = generateShapeBuffer(shape, width, height, normalizedColor);
    await atomicWrite(outputFilename, buffer);
  } catch (error: any) {
    throw new Error(`Failed to generate PNG: ${error.message}`);
  }
}

const program = new Command();

program
  .name('shape')
  .description('A command-line tool that generates solid colour PNG shapes.')
  .version('0.0.1')
  .argument('<shape>', 'shape type (rectangle, circle, triangle, star, etc.)')
  .argument('<width>', 'width in pixels')
  .argument('<height>', 'height in pixels')
  .argument('<color>', 'any valid CSS colour string')
  .argument('[outputFilename]', 'optional output filename')
  .option('-o, --output <file>', 'custom output filename')
  .option('-f, --force', 'overwrite existing files')
  .option('-v, --verbose', 'detailed output')
  .option('-s, --strict-color', 'disable color normalization')
  .option('--strict-shape', 'disable shape name fuzzy matching')
  .addHelpText('after', `\n${getShapeValidationHelp()}`)
  .action(
    async (
      shapeArg,
      widthArg,
      heightArg,
      colorArg,
      outputFilenameArg,
      options
    ) => {
      const startTime = performance.now();

      try {
        const args = await parseCliArguments(
          shapeArg,
          widthArg,
          heightArg,
          colorArg,
          outputFilenameArg,
          options
        );

        // Check if file exists and handle force flag
        if ((await fileExists(args.outputFilename)) && !options.force) {
          console.error('File exists. Use --force to overwrite.');
          process.exit(64);
        }

        if (options.verbose) {
          console.log(
            `Generating ${args.shape} ${args.width}x${args.height} PNG with color ${args.color}`
          );
          console.log(`Output: ${args.outputFilename}`);
        }

        await generate(
          args.shape,
          args.width,
          args.height,
          args.color,
          args.outputFilename
        );

        const duration = Math.floor(performance.now() - startTime);
        console.log(`✅ Created ${args.outputFilename} (${duration}ms)`);
      } catch (error: any) {
        console.error(error.message);

        // Determine exit code based on error type
        if (
          error.message.includes(
            'Width and height must be positive integers'
          ) ||
          error.message.includes('Dimension too large') ||
          error.message.includes('Invalid colour') ||
          error.message.includes('Invalid shape') ||
          error.message.includes('File exists')
        ) {
          process.exit(64); // Usage or validation error
        } else {
          process.exit(74); // I/O or encode error
        }
      }
    }
  );

// Only parse arguments if this file is run directly
if (import.meta.main) {
  program.parse(process.argv);
}
