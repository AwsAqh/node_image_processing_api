
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const fullDir = path.join(process.cwd(), 'assets/full');
const thumbsDir = path.join(process.cwd(), 'assets/thumbs');

async function ensureThumbsDirExists(): Promise<void> {
    try {
        await fs.access(thumbsDir);
    } catch {
        console.log(`Creating thumbs directory at ${thumbsDir}`);
        await fs.mkdir(thumbsDir, { recursive: true });
    }
}

export const resizeImage = async (
    filename: string,
    width: number,
    height: number
): Promise<string> => {
    const timestamp = new Date().toISOString();

    if (!filename) {
        console.warn(`[${timestamp}] Validation failed: missing filename`);
        throw { status: 400, message: 'Filename is required' };
    }

    if (!width || !height || width <= 0 || height <= 0) {
        console.warn(`[${timestamp}] Validation failed: invalid dimensions (${width}x${height})`);
        throw { status: 400, message: 'Width and height must be positive numbers' };
    }    
   console.log("awsdsadsad",filename)
    const filenameWithExt = filename.includes('.') ? filename : `${filename}.jpg`;
    const inputPath = path.join(fullDir, filenameWithExt);
    
    try {
        await fs.access(inputPath);
    } catch {
        console.warn(`[${timestamp}] Image not found: ${filenameWithExt} in ${fullDir}`);
        throw { status: 404, message: `Image "${filename}" not found in full folder` };
    }

    const actualFilename = path.basename(inputPath);
    const ext = path.extname(actualFilename) || '.jpg';
    const nameWithoutExt = path.basename(actualFilename, ext);
    const outputFilename = `${nameWithoutExt}-${width}x${height}${ext}`;
    const outputPath = path.join(thumbsDir, outputFilename);    
    await ensureThumbsDirExists();  

    try {
        await fs.access(outputPath);
        console.log(`[${timestamp}] Serving cached image: ${outputFilename}`);
        return outputPath;
    } catch {
        console.log(`[${timestamp}] Resizing "${filename}" → ${width}x${height}`);
        try {
            await sharp(inputPath)
            .resize(width, height)
            .toFile(outputPath);    
            console.log(`[${timestamp}] Saved resized image: ${outputFilename}`);
            return outputPath;
        } catch (err) {
            console.error(
                `[${timestamp}] Error processing image "${filename}" (${width}x${height}):`,
                (err as Error).message
            );
            throw { status: 500, message: `Error processing image: ${(err as Error).message}` };
        }
    }
}