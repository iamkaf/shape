#!/usr/bin/env bun

import { performance } from 'node:perf_hooks';
import { colord } from 'colord';
import { Command } from 'commander';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import { normalizeColor } from './lib/color.js';
import { parseDimensions } from './lib/dimensions.js';
import { atomicWrite, fileExists } from './lib/file.js';

export async function generate(
  width: number,
  height: number,
  color: string,
  outputFilename: string
): Promise<void> {
  try {
    // Try Sharp first (primary PNG encoder)
    const buffer = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: color,
      },
    })
      .png()
      .toBuffer();

    await atomicWrite(outputFilename, buffer);
  } catch (_sharpError) {
    try {
      // Fallback to pngjs if Sharp fails
      console.warn('Sharp failed, falling back to pngjs');

      const png = new PNG({ width, height });
      const colorObj = colord(color);
      const rgba = colorObj.toRgb();

      // Fill the PNG buffer with the color
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (width * y + x) << 2;
          png.data[idx] = rgba.r; // Red
          png.data[idx + 1] = rgba.g; // Green
          png.data[idx + 2] = rgba.b; // Blue
          png.data[idx + 3] = 255; // Alpha (fully opaque)
        }
      }

      const buffer = PNG.sync.write(png);
      await atomicWrite(outputFilename, buffer);
    } catch (fallbackError) {
      // Both Sharp and pngjs failed - this is an I/O error
      throw new Error(`Failed to generate PNG: ${fallbackError.message}`);
    }
  }
}

const program = new Command();

program
  .name('shape')
  .description(
    'A command-line tool that generates a solid colour PNG rectangle.'
  )
  .version('0.0.1')
  .argument('<width>', 'width in pixels')
  .argument('<height>', 'height in pixels')
  .argument('<color>', 'any valid CSS colour string')
  .argument('[outputFilename]', 'optional output filename')
  .option('-o, --output <file>', 'custom output filename')
  .option('-f, --force', 'overwrite existing files')
  .option('-v, --verbose', 'detailed output')
  .option('-s, --strict-color', 'disable color normalization')
  .action(async (widthStr, heightStr, color, outputFilenameArg, options) => {
    const startTime = performance.now();

    try {
      // Parse and validate dimensions
      const { width, height } = parseDimensions(widthStr, heightStr);

      // Normalize color
      const normalizedColor = normalizeColor(color, options.strictColor);

      // Determine output filename
      const outputFilename =
        options.output || outputFilenameArg || `shape_${width}x${height}.png`;

      // Check if file exists and handle force flag
      if ((await fileExists(outputFilename)) && !options.force) {
        console.error('File exists. Use --force to overwrite.');
        process.exit(64);
      }

      if (options.verbose) {
        console.log(
          `Generating ${width}x${height} PNG with color ${normalizedColor}`
        );
        console.log(`Output: ${outputFilename}`);
      }

      await generate(width, height, normalizedColor, outputFilename);

      const duration = Math.floor(performance.now() - startTime);
      console.log(`✅ Created ${outputFilename} (${duration}ms)`);
    } catch (error) {
      console.error(error.message);

      // Determine exit code based on error type
      if (
        error.message.includes('Width and height must be positive integers') ||
        error.message.includes('Dimension too large') ||
        error.message.includes('Invalid colour') ||
        error.message.includes('File exists')
      ) {
        process.exit(64); // Usage or validation error
      } else {
        process.exit(74); // I/O or encode error
      }
    }
  });

// Only parse arguments if this file is run directly
if (import.meta.main) {
  program.parse(process.argv);
}
