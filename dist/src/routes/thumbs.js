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
const express_1 = require("express");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const thumbsDir = path_1.default.join(process.cwd(), 'assets/thumbs');
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Incoming GET request to /thumbs with query:', req.query);
    try {
        const { filename } = req.query;
        if (filename) {
            if (typeof filename !== 'string') {
                console.log('Error: filename is not a string');
                res.status(400).json({
                    success: false,
                    message: 'Filename must be a string.'
                });
                return;
            }
            const filePath = path_1.default.join(thumbsDir, filename);
            try {
                yield promises_1.default.access(filePath);
                console.log(`Thumbnail found: ${filename}`);
                res.json({
                    success: true,
                    message: 'Thumbnail found.',
                    thumb: filename
                });
            }
            catch (_a) {
                console.log(`Thumbnail not found: ${filename}`);
                res.status(404).json({
                    success: false,
                    message: `Thumbnail '${filename}' not found in the folder.`
                });
            }
            return;
        }
        const files = yield promises_1.default.readdir(thumbsDir);
        const imageFiles = files.filter((file) => {
            return !file.startsWith('.') && /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
        });
        if (imageFiles.length === 0) {
            console.log('No thumbnails found in folder');
            res.status(404).json({
                success: false,
                message: 'No thumbnails found in the folder.'
            });
            return;
        }
        console.log(`Returning ${imageFiles.length} thumbnails`);
        res.json({
            success: true,
            message: 'List of all thumbnails.',
            count: imageFiles.length,
            thumbs: imageFiles
        });
    }
    catch (error) {
        console.error('Error accessing thumbs directory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reading the thumbnails folder.'
        });
    }
}));
router.get('/:invalidPath', (req, res) => {
    console.log(`Invalid path accessed: ${req.originalUrl}`);
    res.status(400).json({
        success: false,
        message: 'Invalid path',
        error: "Invalid path",
    });
});
exports.default = router;
