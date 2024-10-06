import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import fs from 'fs';
import { convertPDFtoPPTX } from './pdf-pptx.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ensure output directory exists
const outputDir = join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

app.post('/convert', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const pdfBuffer = req.file.buffer;
        const outputPath = await convertPDFtoPPTX(pdfBuffer);
        
        const downloadUrl = `http://localhost:${PORT}/download/${outputPath}`;
        res.json({ downloadUrl });
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ error: 'Conversion failed' });
    }
});

app.get('/download/:filename', (req, res) => {
    const filePath = join(__dirname, 'output', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});