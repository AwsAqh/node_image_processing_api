"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fullDir = path_1.default.join(process.cwd(), 'assets/full');
const thumbsDir = path_1.default.join(process.cwd(), 'assets/thumbs');
function ensureThumbsDirExists() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.access(thumbsDir);
        }
        catch (_a) {
            console.log(`Creating thumbs directory at ${thumbsDir}`);
            yield promises_1.default.mkdir(thumbsDir, { recursive: true });
        }
    });
}
const resizeImage = (filename, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = new Date().toISOString();
    if (!filename) {
        console.warn(`[${timestamp}] Validation failed: missing filename`);
        throw { status: 400, message: 'Filename is required' };
    }
    if (!width || !height || width <= 0 || height <= 0) {
        console.warn(`[${timestamp}] Validation failed: invalid dimensions (${width}x${height})`);
        throw { status: 400, message: 'Width and height must be positive numbers' };
    }
    const filenameWithExt = filename.includes('.') ? filename : `${filename}.jpg`;
    const inputPath = path_1.default.join(fullDir, filenameWithExt);
    try {
        yield promises_1.default.access(inputPath);
    }
    catch (_a) {
        console.warn(`[${timestamp}] Image not found: ${filenameWithExt} in ${fullDir}`);
        throw { status: 404, message: `Image "${filename}" not found in full folder` };
    }
    const actualFilename = path_1.default.basename(inputPath);
    const ext = path_1.default.extname(actualFilename) || '.jpg';
    const nameWithoutExt = path_1.default.basename(actualFilename, ext);
    const outputFilename = `${nameWithoutExt}-${width}x${height}${ext}`;
    const outputPath = path_1.default.join(thumbsDir, outputFilename);
    yield ensureThumbsDirExists();
    try {
        yield promises_1.default.access(outputPath);
        console.log(`[${timestamp}] Serving cached image: ${outputFilename}`);
        return outputPath;
    }
    catch (_b) {
        console.log(`[${timestamp}] Resizing "${filename}" → ${width}x${height}`);
        try {
            yield (0, sharp_1.default)(inputPath)
                .resize(width, height)
                .toFile(outputPath);
            console.log(`[${timestamp}] Saved resized image: ${outputFilename}`);
            return outputPath;
        }
        catch (err) {
            console.error(`[${timestamp}] Error processing image "${filename}" (${width}x${height}):`, err.message);
            throw { status: 500, message: `Error processing image: ${err.message}` };
        }
    }
});
exports.resizeImage = resizeImage;
