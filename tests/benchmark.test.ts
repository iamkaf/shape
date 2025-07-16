import { describe, expect, it } from 'bun:test';
import { performance } from 'node:perf_hooks';
import {
  generateShapeBuffer,
  getSupportedShapes,
  ShapeType,
} from '../src/lib/shapes';

describe('Shape Generation Performance Benchmarks', () => {
  const BENCHMARK_ITERATIONS = 10;
  const PERFORMANCE_THRESHOLD_MS = 1000; // 1 second threshold for most operations

  /**
   * Utility function to measure performance of a function
   */
  function measurePerformance<T>(
    fn: () => T,
    iterations: number = BENCHMARK_ITERATIONS
  ): {
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
  } {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      times.push(end - start);
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    return { averageTime, minTime, maxTime, totalTime };
  }

  /**
   * Format benchmark results for readable output
   */
  function formatBenchmarkResult(
    shapeName: string,
    size: string,
    result: {
      averageTime: number;
      minTime: number;
      maxTime: number;
      totalTime: number;
    }
  ): string {
    return `${shapeName} (${size}): avg=${result.averageTime.toFixed(2)}ms, min=${result.minTime.toFixed(2)}ms, max=${result.maxTime.toFixed(2)}ms`;
  }

  describe('Small Shape Generation (50x50)', () => {
    const width = 50;
    const height = 50;
    const color = '#ff0000';

    it('benchmarks all shapes at 50x50', () => {
      const results: Record<string, ReturnType<typeof measurePerformance>> = {};

      for (const shape of getSupportedShapes()) {
        const result = measurePerformance(() => {
          generateShapeBuffer(shape, width, height, color);
        });

        results[shape] = result;

        // Log individual results
        console.log(formatBenchmarkResult(shape, '50x50', result));

        // Ensure reasonable performance
        expect(result.averageTime).toBeLessThan(100); // 100ms threshold for small shapes
      }

      // Find fastest and slowest shapes
      const entries = Object.entries(results);
      const fastest = entries.reduce((a, b) =>
        a[1].averageTime < b[1].averageTime ? a : b
      );
      const slowest = entries.reduce((a, b) =>
        a[1].averageTime > b[1].averageTime ? a : b
      );

      console.log(
        `\nFastest shape (50x50): ${fastest[0]} - ${fastest[1].averageTime.toFixed(2)}ms`
      );
      console.log(
        `Slowest shape (50x50): ${slowest[0]} - ${slowest[1].averageTime.toFixed(2)}ms`
      );
    });

    it('benchmarks rectangle vs circle performance', () => {
      const rectangleResult = measurePerformance(() => {
        generateShapeBuffer(ShapeType.RECTANGLE, width, height, color);
      });

      const circleResult = measurePerformance(() => {
        generateShapeBuffer(ShapeType.CIRCLE, width, height, color);
      });

      console.log('Rectangle vs Circle (50x50):');
      console.log(`  Rectangle: ${rectangleResult.averageTime.toFixed(2)}ms`);
      console.log(`  Circle: ${circleResult.averageTime.toFixed(2)}ms`);
      console.log(
        `  Ratio: ${(circleResult.averageTime / rectangleResult.averageTime).toFixed(2)}x`
      );

      // Both should be reasonably fast
      expect(rectangleResult.averageTime).toBeLessThan(50);
      expect(circleResult.averageTime).toBeLessThan(50);
    });
  });

  describe('Medium Shape Generation (200x200)', () => {
    const width = 200;
    const height = 200;
    const color = '#00ff00';

    it('benchmarks all shapes at 200x200', () => {
      const results: Record<string, ReturnType<typeof measurePerformance>> = {};

      for (const shape of getSupportedShapes()) {
        const result = measurePerformance(() => {
          generateShapeBuffer(shape, width, height, color);
        });

        results[shape] = result;

        // Log individual results
        console.log(formatBenchmarkResult(shape, '200x200', result));

        // Ensure reasonable performance (more lenient for medium shapes)
        expect(result.averageTime).toBeLessThan(500); // 500ms threshold for medium shapes
      }

      // Find fastest and slowest shapes
      const entries = Object.entries(results);
      const fastest = entries.reduce((a, b) =>
        a[1].averageTime < b[1].averageTime ? a : b
      );
      const slowest = entries.reduce((a, b) =>
        a[1].averageTime > b[1].averageTime ? a : b
      );

      console.log(
        `\nFastest shape (200x200): ${fastest[0]} - ${fastest[1].averageTime.toFixed(2)}ms`
      );
      console.log(
        `Slowest shape (200x200): ${slowest[0]} - ${slowest[1].averageTime.toFixed(2)}ms`
      );
    });
  });

  describe('Large Shape Generation (500x500)', () => {
    const width = 500;
    const height = 500;
    const color = '#0000ff';

    it('benchmarks critical shapes at 500x500', () => {
      const criticalShapes = [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.TRIANGLE,
        ShapeType.STAR,
        ShapeType.HEART,
      ];

      const results: Record<string, ReturnType<typeof measurePerformance>> = {};

      for (const shape of criticalShapes) {
        const result = measurePerformance(() => {
          generateShapeBuffer(shape, width, height, color);
        }, 5); // Fewer iterations for large shapes

        results[shape] = result;

        // Log individual results
        console.log(formatBenchmarkResult(shape, '500x500', result));

        // Ensure reasonable performance (most lenient for large shapes)
        expect(result.averageTime).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
      }

      // Find fastest and slowest shapes
      const entries = Object.entries(results);
      const fastest = entries.reduce((a, b) =>
        a[1].averageTime < b[1].averageTime ? a : b
      );
      const slowest = entries.reduce((a, b) =>
        a[1].averageTime > b[1].averageTime ? a : b
      );

      console.log(
        `\nFastest shape (500x500): ${fastest[0]} - ${fastest[1].averageTime.toFixed(2)}ms`
      );
      console.log(
        `Slowest shape (500x500): ${slowest[0]} - ${slowest[1].averageTime.toFixed(2)}ms`
      );
    });
  });

  describe('Shape Options Performance', () => {
    const width = 100;
    const height = 100;
    const color = '#ff00ff';

    it('benchmarks star with different point counts', () => {
      const pointCounts = [3, 5, 8, 12, 16];

      console.log('\nStar performance with different point counts:');

      for (const points of pointCounts) {
        const result = measurePerformance(() => {
          generateShapeBuffer(ShapeType.STAR, width, height, color, {
            starPoints: points,
          });
        });

        console.log(`  ${points} points: ${result.averageTime.toFixed(2)}ms`);

        // Performance should not degrade significantly with more points
        expect(result.averageTime).toBeLessThan(200);
      }
    });

    it('benchmarks arrow with different directions', () => {
      const directions: Array<'up' | 'down' | 'left' | 'right'> = [
        'up',
        'down',
        'left',
        'right',
      ];

      console.log('\nArrow performance with different directions:');

      for (const direction of directions) {
        const result = measurePerformance(() => {
          generateShapeBuffer(ShapeType.ARROW, width, height, color, {
            arrowDirection: direction,
          });
        });

        console.log(`  ${direction}: ${result.averageTime.toFixed(2)}ms`);

        // All directions should perform similarly
        expect(result.averageTime).toBeLessThan(200);
      }
    });

    it('benchmarks donut with different thicknesses', () => {
      const thicknesses = [0.1, 0.3, 0.5, 0.7, 0.9];

      console.log('\nDonut performance with different thicknesses:');

      for (const thickness of thicknesses) {
        const result = measurePerformance(() => {
          generateShapeBuffer(ShapeType.DONUT, width, height, color, {
            donutThickness: thickness,
          });
        });

        console.log(`  ${thickness}: ${result.averageTime.toFixed(2)}ms`);

        // Thickness should not significantly affect performance
        expect(result.averageTime).toBeLessThan(200);
      }
    });
  });

  describe('Memory Usage and Scaling', () => {
    it('benchmarks shapes across different sizes', () => {
      const sizes = [
        { width: 50, height: 50, name: '50x50' },
        { width: 100, height: 100, name: '100x100' },
        { width: 200, height: 200, name: '200x200' },
      ];

      const testShapes = [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.TRIANGLE,
      ];

      console.log('\nScaling performance across different sizes:');

      for (const shape of testShapes) {
        console.log(`\n${shape}:`);

        const results = sizes.map((size) => {
          const result = measurePerformance(() => {
            generateShapeBuffer(shape, size.width, size.height, '#ffff00');
          });

          console.log(`  ${size.name}: ${result.averageTime.toFixed(2)}ms`);

          return {
            size: size.name,
            time: result.averageTime,
            pixels: size.width * size.height,
          };
        });

        // Check that performance scales reasonably with pixel count
        for (let i = 1; i < results.length; i++) {
          const prev = results[i - 1];
          const current = results[i];
          if (prev && current) {
            const pixelRatio = current.pixels / prev.pixels;
            const timeRatio = current.time / prev.time;

            // Time should scale sub-linearly with pixel count (due to setup overhead)
            expect(timeRatio).toBeLessThan(pixelRatio * 2);
          }
        }
      }
    });
  });

  describe('Color Processing Performance', () => {
    const width = 100;
    const height = 100;
    const colors = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#ff00ff',
      '#00ffff',
    ];

    it('benchmarks color processing overhead', () => {
      console.log('\nColor processing performance:');

      for (const color of colors) {
        const result = measurePerformance(() => {
          generateShapeBuffer(ShapeType.RECTANGLE, width, height, color);
        });

        console.log(`  ${color}: ${result.averageTime.toFixed(2)}ms`);

        // Color should not significantly affect performance
        expect(result.averageTime).toBeLessThan(100);
      }
    });
  });

  describe('Stress Tests', () => {
    it('handles rapid successive generation', () => {
      const shapes = [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.TRIANGLE,
      ];
      const width = 100;
      const height = 100;
      const color = '#ffffff';

      console.log('\nStress test - rapid successive generation:');

      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        const shape = shapes[i % shapes.length];
        if (shape) {
          generateShapeBuffer(shape, width, height, color);
        }
      }

      const end = performance.now();
      const totalTime = end - start;
      const averageTime = totalTime / 50;

      console.log(`  50 shapes generated in ${totalTime.toFixed(2)}ms`);
      console.log(`  Average time per shape: ${averageTime.toFixed(2)}ms`);

      // Should handle rapid generation efficiently
      expect(averageTime).toBeLessThan(50);
    });
  });
});
