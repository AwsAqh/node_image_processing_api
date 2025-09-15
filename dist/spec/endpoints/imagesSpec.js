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
describe('GET /api/images', () => {
    it('should return 400 if filename is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images?width=200&height=200');
        expect(res.status).toBe(400);
        expect(res.text).toContain('Filename is required');
    }));
    it('should return 400 if width or height is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=fjord.jpg&width=-100&height=abc');
        expect(res.status).toBe(400);
        expect(res.text).toContain('Width and height are required');
    }));
    it('should return 400 if width or height is zero', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=fjord.jpg&width=0&height=200');
        expect(res.status).toBe(400);
        expect(res.text).toContain('Width and height are required');
    }));
    it('should return 400 if width or height is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=fjord.jpg&width=200');
        expect(res.status).toBe(400);
        expect(res.text).toContain('Width and height are required');
    }));
    it('should return 404 if image does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=nonexistent.jpg&width=200&height=200');
        expect(res.status).toBe(404);
        expect(res.text).toContain('Image "nonexistent.jpg" not found in full folder');
    }));
    it('should return 200 and serve the resized image', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/images?filename=fjord.jpg&width=200&height=200');
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('image/jpeg');
    }));
});
