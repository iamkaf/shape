import { describe, expect, it } from 'bun:test';
import { performance } from 'node:perf_hooks';
import { generateShapeBuffer, getSupportedShapes, ShapeType } from '../src/lib/shapes';

describe('Memory Usage Monitoring', () => {
  /**
   * Get current memory usage
   */
  function getMemoryUsage() {
    return process.memoryUsage();
  }

  /**
   * Format memory usage for display
   */
  function formatMemory(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  /**
   * Monitor memory usage during shape generation
   */
  function monitorMemoryUsage<T>(fn: () => T, description: string): T {
    const memBefore = getMemoryUsage();
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const result = fn();
    
    const memAfter = getMemoryUsage();
    
    const heapUsedDiff = memAfter.heapUsed - memBefore.heapUsed;
    const rssUsedDiff = memAfter.rss - memBefore.rss;
    
    console.log(`${description}:`);
    console.log(`  Heap Used: ${formatMemory(heapUsedDiff)} (${formatMemory(memAfter.heapUsed)} total)`);
    console.log(`  RSS: ${formatMemory(rssUsedDiff)} (${formatMemory(memAfter.rss)} total)`);
    
    return result;
  }

  describe('Shape Memory Usage', () => {
    it('monitors memory usage for small shapes (50x50)', () => {
      const testShapes = [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.TRIANGLE,
        ShapeType.STAR,
        ShapeType.HEART,
      ];
      
      console.log('\nMemory usage for small shapes (50x50):');
      
      for (const shape of testShapes) {
        const buffer = monitorMemoryUsage(() => {
          return generateShapeBuffer(shape, 50, 50, '#ff0000');
        }, `${shape} 50x50`);
        
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
        
        // PNG compression makes buffer much smaller than raw pixels
        // Just ensure we get a reasonable compressed PNG
        expect(buffer.length).toBeGreaterThan(100); // At least 100 bytes for a valid PNG
      }
    });

    it('monitors memory usage for medium shapes (200x200)', () => {
      const testShapes = [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.OVAL,
        ShapeType.DIAMOND,
        ShapeType.DONUT,
      ];
      
      console.log('\nMemory usage for medium shapes (200x200):');
      
      for (const shape of testShapes) {
        const buffer = monitorMemoryUsage(() => {
          return generateShapeBuffer(shape, 200, 200, '#00ff00');
        }, `${shape} 200x200`);
        
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
        
        // PNG compression makes buffer much smaller than raw pixels
        // Just ensure we get a reasonable compressed PNG
        expect(buffer.length).toBeGreaterThan(100); // At least 100 bytes for a valid PNG
      }
    });

    it('monitors memory usage for large shapes (500x500)', () => {
      const testShapes = [
        ShapeType.RECTANGLE,
        ShapeType.CIRCLE,
        ShapeType.TRIANGLE,
      ];
      
      console.log('\nMemory usage for large shapes (500x500):');
      
      for (const shape of testShapes) {
        const buffer = monitorMemoryUsage(() => {
          return generateShapeBuffer(shape, 500, 500, '#0000ff');
        }, `${shape} 500x500`);
        
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
        
        // PNG compression makes buffer much smaller than raw pixels
        // Just ensure we get a reasonable compressed PNG
        expect(buffer.length).toBeGreaterThan(1000); // At least 1KB for a 500x500 PNG
      }
    });

    it('monitors memory usage for very large shapes (1000x1000)', () => {
      console.log('\nMemory usage for very large shapes (1000x1000):');
      
      const buffer = monitorMemoryUsage(() => {
        return generateShapeBuffer(ShapeType.CIRCLE, 1000, 1000, '#ff00ff');
      }, 'circle 1000x1000');
      
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      
      // PNG compression makes buffer much smaller than raw pixels
      // Just ensure we get a reasonable compressed PNG
      expect(buffer.length).toBeGreaterThan(2000); // At least 2KB for a 1000x1000 PNG
    });
  });

  describe('Memory Efficiency', () => {
    it('measures memory efficiency ratio', () => {
      const sizes = [
        { width: 50, height: 50, name: '50x50' },
        { width: 100, height: 100, name: '100x100' },
        { width: 200, height: 200, name: '200x200' },
        { width: 500, height: 500, name: '500x500' },
      ];
      
      console.log('\nMemory efficiency analysis:');
      
      for (const size of sizes) {
        const memBefore = getMemoryUsage();
        
        const buffer = generateShapeBuffer(ShapeType.RECTANGLE, size.width, size.height, '#ffff00');
        
        const memAfter = getMemoryUsage();
        const heapUsed = memAfter.heapUsed - memBefore.heapUsed;
        const expectedMemory = size.width * size.height * 4;
        const efficiency = (expectedMemory / heapUsed) * 100;
        
        console.log(`${size.name}: ${formatMemory(heapUsed)} used, ${formatMemory(expectedMemory)} expected, ${efficiency.toFixed(1)}% efficient`);
        
        // Memory efficiency should be reasonable (allow for overhead)
        expect(efficiency).toBeGreaterThan(10); // At least 10% efficient
        expect(heapUsed).toBeLessThan(expectedMemory * 10); // No more than 10x overhead
      }
    });

    it('tests memory cleanup after generation', () => {
      console.log('\nMemory cleanup test:');
      
      const memBefore = getMemoryUsage();
      console.log(`Initial memory: ${formatMemory(memBefore.heapUsed)}`);
      
      // Generate several large shapes
      for (let i = 0; i < 5; i++) {
        const buffer = generateShapeBuffer(ShapeType.CIRCLE, 300, 300, '#000000');
        expect(buffer).toBeInstanceOf(Buffer);
        // Don't hold references to the buffer
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const memAfter = getMemoryUsage();
      console.log(`Final memory: ${formatMemory(memAfter.heapUsed)}`);
      
      const memoryIncrease = memAfter.heapUsed - memBefore.heapUsed;
      console.log(`Memory increase: ${formatMemory(memoryIncrease)}`);
      
      // Memory should not increase significantly after cleanup
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
    });
  });

  describe('Performance vs Memory Trade-offs', () => {
    it('compares optimized vs fallback memory usage', () => {
      console.log('\nOptimized vs fallback comparison:');
      
      const optimizedShapes = [ShapeType.RECTANGLE, ShapeType.CIRCLE, ShapeType.OVAL, ShapeType.DIAMOND, ShapeType.DONUT];
      const fallbackShapes = [ShapeType.TRIANGLE, ShapeType.STAR, ShapeType.HEART, ShapeType.ARROW, ShapeType.CROSS];
      
      // Test optimized shapes
      const optimizedResults = optimizedShapes.map(shape => {
        const memBefore = getMemoryUsage();
        const start = performance.now();
        
        const buffer = generateShapeBuffer(shape, 200, 200, '#123456');
        
        const end = performance.now();
        const memAfter = getMemoryUsage();
        
        return {
          shape,
          time: end - start,
          memory: memAfter.heapUsed - memBefore.heapUsed,
          buffer: buffer.length
        };
      });
      
      // Test fallback shapes
      const fallbackResults = fallbackShapes.map(shape => {
        const memBefore = getMemoryUsage();
        const start = performance.now();
        
        const buffer = generateShapeBuffer(shape, 200, 200, '#123456');
        
        const end = performance.now();
        const memAfter = getMemoryUsage();
        
        return {
          shape,
          time: end - start,
          memory: memAfter.heapUsed - memBefore.heapUsed,
          buffer: buffer.length
        };
      });
      
      console.log('Optimized shapes:');
      for (const result of optimizedResults) {
        console.log(`  ${result.shape}: ${result.time.toFixed(2)}ms, ${formatMemory(result.memory)}`);
      }
      
      console.log('Fallback shapes:');
      for (const result of fallbackResults) {
        console.log(`  ${result.shape}: ${result.time.toFixed(2)}ms, ${formatMemory(result.memory)}`);
      }
      
      // Calculate averages
      const avgOptimizedTime = optimizedResults.reduce((sum, r) => sum + r.time, 0) / optimizedResults.length;
      const avgFallbackTime = fallbackResults.reduce((sum, r) => sum + r.time, 0) / fallbackResults.length;
      
      console.log(`\nAverage optimized time: ${avgOptimizedTime.toFixed(2)}ms`);
      console.log(`Average fallback time: ${avgFallbackTime.toFixed(2)}ms`);
      console.log(`Performance improvement: ${((avgFallbackTime - avgOptimizedTime) / avgFallbackTime * 100).toFixed(1)}%`);
      
      // Optimized shapes should be faster
      expect(avgOptimizedTime).toBeLessThan(avgFallbackTime);
    });
  });
});