const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { convertPDFtoPPTX } = require('./pdf-pptx.js');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(bodyParser.raw({ type: 'application/pdf', limit: '50mb' }));

const OUTPUT_DIR = path.join(__dirname, 'output');

app.get('/', (req, res) => {
    res.send('PDF to PPTX conversion server is running');
});

app.post('/convert', async (req, res) => {
    console.log('Received PDF for conversion');
    const pdfBuffer = req.body;

    try {
        console.log('Starting PDF to PPTX conversion...');
        const outputFilePath = await convertPDFtoPPTX(pdfBuffer);
        console.log('Conversion completed successfully');

        const uniqueFilename = `converted_${Date.now()}.pptx`;
        const uniqueFilePath = path.join(OUTPUT_DIR, uniqueFilename);
        
        fs.renameSync(outputFilePath, uniqueFilePath);

        res.json({ downloadUrl: `http://localhost:3000/download/${uniqueFilename}` });

    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).json({ message: `Conversion failed: ${error.message}` });
    }
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(OUTPUT_DIR, req.params.filename);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.download(filePath, req.params.filename, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(500).send("Error downloading file");
        } else {
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
