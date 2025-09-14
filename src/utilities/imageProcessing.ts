import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { Logger } from "./logger";

const fullDir = path.join(process.cwd(), "assets/full");
const thumbsDir = path.join(process.cwd(), "assets/thumbs");

async function ensureThumbsDirExists(): Promise<void> {
  try {
    await fs.access(thumbsDir);
  } catch {
    Logger.info(`Creating thumbs directory at ${thumbsDir}`);
    await fs.mkdir(thumbsDir, { recursive: true });
  }
}

export const resizeImage = async (
  filename: string,
  width: number,
  height: number,
): Promise<string> => {

  if (!filename) {
    Logger.warn(`Validation failed: missing filename`);
    throw { status: 400, message: "Filename is required" };
  }

  if (!width || !height || width <= 0 || height <= 0) {
    Logger.warn(`Validation failed: invalid dimensions (${width}x${height})`);
    throw { status: 400, message: "Width and height must be positive numbers" };
  }
  Logger.debug("Processing filename:", filename);
  const filenameWithExt = filename.includes(".") ? filename : `${filename}.jpg`;
  const inputPath = path.join(fullDir, filenameWithExt);

  try {
    await fs.access(inputPath);
  } catch {
    Logger.warn(`Image not found: ${filenameWithExt} in ${fullDir}`);
    throw {
      status: 404,
      message: `Image "${filename}" not found in full folder`,
    };
  }

  const actualFilename = path.basename(inputPath);
  const ext = path.extname(actualFilename) || ".jpg";
  const nameWithoutExt = path.basename(actualFilename, ext);
  const outputFilename = `${nameWithoutExt}-${width}x${height}${ext}`;
  const outputPath = path.join(thumbsDir, outputFilename);
  await ensureThumbsDirExists();

  try {
    await fs.access(outputPath);
    Logger.info(`Serving cached image: ${outputFilename}`);
    return outputPath;
  } catch {
    Logger.info(`Resizing "${filename}" → ${width}x${height}`);
    try {
      await sharp(inputPath).resize(width, height).toFile(outputPath);
      Logger.info(`Saved resized image: ${outputFilename}`);
      return outputPath;
    } catch (err) {
      Logger.error(
        `Error processing image "${filename}" (${width}x${height}):`,
        (err as Error).message,
      );
      throw {
        status: 500,
        message: `Error processing image: ${(err as Error).message}`,
      };
    }
  }
};
