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
const imageProcessing_1 = require("../../src/utilities/imageProcessing");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const fullDir = path_1.default.join(process.cwd(), 'assets/full');
const thumbsDir = path_1.default.join(process.cwd(), 'assets/thumbs');
describe('Image Processing Utility', () => {
    const testFilename = 'fjord.jpg';
    const width = 100;
    const height = 100;
    it('should resize an image and return the output path', () => __awaiter(void 0, void 0, void 0, function* () {
        const outputPath = yield (0, imageProcessing_1.resizeImage)(testFilename, width, height);
        expect(outputPath).toContain(`${testFilename.split('.')[0]}-${width}x${height}.jpg`);
        const exists = yield promises_1.default.access(outputPath).then(() => true).catch(() => false);
        expect(exists).toBeTrue();
    }));
    it('should throw an error if the image does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync((0, imageProcessing_1.resizeImage)('nonexistent.jpg', width, height)).toBeRejected();
    }));
    it('should throw an error for invalid width or height', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync((0, imageProcessing_1.resizeImage)(testFilename, -50, 0)).toBeRejected();
        yield expectAsync((0, imageProcessing_1.resizeImage)(testFilename, 0, 0)).toBeRejected();
    }));
    it('should throw an error if filename is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expectAsync((0, imageProcessing_1.resizeImage)('', width, height)).toBeRejected();
    }));
});
