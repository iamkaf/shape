#!/usr/bin/env bun

import { performance } from 'node:perf_hooks';
import { Command } from 'commander';
import sharp from 'sharp';

// Placeholder implementation.
// TODO: Move to its own file.
export async function generatePng(
  width: number,
  height: number,
  color: string,
  outputFilename: string
): Promise<void> {
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color,
    },
  })
    .png()
    .toFile(outputFilename);
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
  .action(async (widthStr, heightStr, color) => {
    const startTime = performance.now();

    const width = Number.parseInt(widthStr, 10);
    const height = Number.parseInt(heightStr, 10);

    const outputFilename = `shape_${width}x${height}.png`;

    await generatePng(width, height, color, outputFilename);

    console.log(
      `✅ Created ${outputFilename} (${Math.floor(performance.now() - startTime)}ms)`
    );
  });

// Only parse arguments if this file is run directly
if (import.meta.main) {
  program.parse(process.argv);
}
