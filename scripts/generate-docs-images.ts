#!/usr/bin/env bun

import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { generate } from '../src/index';
import { ShapeType } from '../src/lib/shapes';

const DOCS_SHAPES_DIR = join(import.meta.dir, '..', 'docs', 'assets', 'shapes');

// Ensure the directory exists
if (!existsSync(DOCS_SHAPES_DIR)) {
  mkdirSync(DOCS_SHAPES_DIR, { recursive: true });
}

// Define all shapes with their colors as shown in README
const shapes = [
  // Basic shapes
  { name: 'rectangle', type: ShapeType.RECTANGLE, width: 60, height: 60, color: '#5B8DEE' }, // Soft blue
  { name: 'circle', type: ShapeType.CIRCLE, width: 60, height: 60, color: '#FF6B6B' }, // Coral red
  { name: 'triangle', type: ShapeType.TRIANGLE, width: 60, height: 60, color: '#4ECDC4' }, // Mint green
  { name: 'oval', type: ShapeType.OVAL, width: 60, height: 60, color: '#9F7AEA' }, // Lavender purple
  
  // Geometric shapes
  { name: 'diamond', type: ShapeType.DIAMOND, width: 60, height: 60, color: '#F6AD55' }, // Warm orange
  { name: 'pentagon', type: ShapeType.PENTAGON, width: 60, height: 60, color: '#48BB78' }, // Emerald green
  { name: 'hexagon', type: ShapeType.HEXAGON, width: 60, height: 60, color: '#667EEA' }, // Royal blue
  { name: 'octagon', type: ShapeType.OCTAGON, width: 60, height: 60, color: '#ED8936' }, // Burnt orange
  
  // Special shapes
  { name: 'star', type: ShapeType.STAR, width: 60, height: 60, color: '#ECC94B' }, // Golden yellow
  { name: 'heart', type: ShapeType.HEART, width: 60, height: 60, color: '#ED64A6' }, // Hot pink
  { name: 'cross', type: ShapeType.CROSS, width: 60, height: 60, color: '#2D3748' }, // Charcoal
  { name: 'arrow', type: ShapeType.ARROW, width: 60, height: 60, color: '#38B2AC' }, // Teal
  { name: 'donut', type: ShapeType.DONUT, width: 60, height: 60, color: '#975A16' }, // Rich brown
];

async function generateDocImages() {
  console.log('🎨 Generating documentation images...\n');
  
  for (const shape of shapes) {
    const outputPath = join(DOCS_SHAPES_DIR, `${shape.name}.png`);
    console.log(`📸 Generating ${shape.name} (${shape.width}x${shape.height}, ${shape.color})...`);
    
    try {
      // biome-ignore lint/nursery/noAwaitInLoop: it's just an utility script, chill
      await generate(shape.type, shape.width, shape.height, shape.color, outputPath);
      console.log(`✅ Created: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${shape.name}:`, error);
    }
  }
  
  console.log('\n✨ Documentation images generated successfully!');
}

// Run the generator
generateDocImages().catch(console.error);