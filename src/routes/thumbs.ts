
import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();


const thumbsDir = path.join(process.cwd(), 'assets/thumbs');

router.get('/', async (req: Request, res: Response): Promise<void> => {
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

            const filePath = path.join(thumbsDir, filename);

            try {
                await fs.access(filePath);
                console.log(`Thumbnail found: ${filename}`);
                res.json({
                    success: true,
                    message: 'Thumbnail found.',
                    thumb: filename
                });
            } catch {
                console.log(`Thumbnail not found: ${filename}`);
                res.status(404).json({
                    success: false,
                    message: `Thumbnail '${filename}' not found in the folder.`
                });
            }
            return;
        }

        const files = await fs.readdir(thumbsDir);

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

    } catch (error) {
        console.error('Error accessing thumbs directory:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reading the thumbnails folder.'
        });
    }
});
router.get('/:invalidPath', (req: Request, res: Response) => {
    console.log(`Invalid path accessed: ${req.originalUrl}`);
    res.status(400).json({
        success: false,
        message: 'Invalid path',
        error: "Invalid path",
    });
});

export default router;