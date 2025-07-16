import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';

export async function atomicWrite(
  filePath: string,
  data: Buffer
): Promise<void> {
  const dir = dirname(filePath);
  const tempFile = join(dir, `.tmp_${randomBytes(8).toString('hex')}`);

  try {
    await fs.writeFile(tempFile, data);
    await fs.rename(tempFile, filePath);
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore errors during cleanup
    }
    throw error;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
