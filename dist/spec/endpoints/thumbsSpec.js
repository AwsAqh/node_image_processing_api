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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const thumbsDir = path_1.default.join(process.cwd(), 'assets/thumbs');
describe('GET /thumbs', () => {
    it('should return all thumbnails if no filename is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const files = yield promises_1.default.readdir(thumbsDir).catch(() => []);
        if (files.length === 0) {
            yield promises_1.default.writeFile(path_1.default.join(thumbsDir, 'test.jpg'), '');
        }
        const res = yield (0, supertest_1.default)(app_1.default).get('/thumbs');
        expect(res.status).toBe(200);
        expect(res.body.success).toBeTrue();
        expect(res.body.thumbs).toBeInstanceOf(Array);
    }));
    it('should return the thumbnail info if filename is provided and exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const testFile = 'fjord-100x100.jpg';
        const filePath = path_1.default.join(thumbsDir, testFile);
        yield promises_1.default.writeFile(filePath, '').catch(() => { });
        const res = yield (0, supertest_1.default)(app_1.default).get(`/thumbs?filename=${testFile}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBeTrue();
        expect(res.body.thumb).toBe(testFile);
    }));
    it('should return 404 if the requested thumbnail does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/thumbs?filename=nonexistent.jpg');
        expect(res.status).toBe(404);
        expect(res.body.success).toBeFalse();
        expect(res.body.message).toContain('not found');
    }));
    it('should return 400 for invalid path after /thumbs', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/thumbs/invalid');
        expect(res.status).toBe(400);
        expect(res.body.success).toBeFalse();
        expect(res.body.message).toBe('Invalid path');
        expect(res.body.error).toBe('Invalid path');
    }));
    it('should return 200 if filename is an array', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/thumbs?filename[]=test');
        expect(res.status).toBe(200);
        expect(res.body.success).toBeTrue();
        expect(res.body.thumbs).toBeInstanceOf(Array);
    }));
    it('should return 404 if no thumbnails exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/thumbs?filename=nonexistent-thumb.jpg');
        expect(res.status).toBe(404);
        expect(res.body.success).toBeFalse();
        expect(res.body.message).toContain('not found');
    }));
});
