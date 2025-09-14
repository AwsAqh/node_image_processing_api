import { resizeImage } from '../../src/utilities/imageProcessing';
import fs from 'fs/promises';
import path from 'path';

const fullDir = path.join(process.cwd(), 'assets/full');
const thumbsDir = path.join(process.cwd(), 'assets/thumbs');

describe('Image Processing Utility', () => {
  const testFilename = 'fjord.jpg';
  const width = 100;
  const height = 100;

  it('should resize an image and return the output path', async () => {
    const outputPath = await resizeImage(testFilename, width, height);

    expect(outputPath).toContain(`${testFilename.split('.')[0]}-${width}x${height}.jpg`);

    const exists = await fs.access(outputPath).then(() => true).catch(() => false);
    expect(exists).toBeTrue();
  });

  it('should throw an error if the image does not exist', async () => {
    await expectAsync(resizeImage('nonexistent.jpg', width, height)).toBeRejected();
  });

  it('should throw an error for invalid width or height', async () => {
    await expectAsync(resizeImage(testFilename, -50, 0)).toBeRejected();
    await expectAsync(resizeImage(testFilename, 0, 0)).toBeRejected();
  });

  it('should throw an error if filename is missing', async () => {
    await expectAsync(resizeImage('', width, height)).toBeRejected();
  });
});
