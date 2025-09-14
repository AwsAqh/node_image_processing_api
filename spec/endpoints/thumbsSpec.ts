import request from 'supertest';
import app from '../../src/app';
import fs from 'fs/promises';
import path from 'path';

const thumbsDir = path.join(process.cwd(), 'assets/thumbs');

describe('GET /thumbs', () => {
    it('should return all thumbnails if no filename is provided', async () => {
        const files = await fs.readdir(thumbsDir).catch(() => []);
        if (files.length === 0) {
            await fs.writeFile(path.join(thumbsDir, 'test.jpg'), '');
        }

        const res = await request(app).get('/thumbs');
        expect(res.status).toBe(200); 
        expect(res.body.success).toBeTrue(); 
        expect(res.body.thumbs).toBeInstanceOf(Array); 
    });

    it('should return the thumbnail info if filename is provided and exists', async () => {
        const testFile = 'fjord-100x100.jpg';
        const filePath = path.join(thumbsDir, testFile);
        await fs.writeFile(filePath, '').catch(() => {});
        
        const res = await request(app).get(`/thumbs?filename=${testFile}`);
        expect(res.status).toBe(200); 
        expect(res.body.success).toBeTrue(); 
        expect(res.body.thumb).toBe(testFile); 
    });

    it('should return 404 if the requested thumbnail does not exist', async () => {
        const res = await request(app).get('/thumbs?filename=nonexistent.jpg');
        expect(res.status).toBe(404); 
        expect(res.body.success).toBeFalse(); 
        expect(res.body.message).toContain('not found'); 
    });

    it('should return 400 for invalid path after /thumbs', async () => {
        const res = await request(app).get('/thumbs/invalid');
        expect(res.status).toBe(400); 
        expect(res.body.success).toBeFalse(); 
        expect(res.body.message).toBe('Invalid path');
        expect(res.body.error).toBe('Invalid path');
    });

    it('should return 200 if filename is an array', async () => {
        const res = await request(app).get('/thumbs?filename[]=test');
        expect(res.status).toBe(200); 
        expect(res.body.success).toBeTrue(); 
        expect(res.body.thumbs).toBeInstanceOf(Array);
    });

    it('should return 404 if no thumbnails exist', async () => {
        const res = await request(app).get('/thumbs?filename=nonexistent-thumb.jpg');
        expect(res.status).toBe(404); 
        expect(res.body.success).toBeFalse(); 
        expect(res.body.message).toContain('not found');
    });
});