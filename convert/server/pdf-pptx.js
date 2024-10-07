const {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExportPDFJob,
    ExportPDFParams,
    ExportPDFTargetFormat,
    ExportPDFResult
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");
const path = require("path");
const streamifier = require("streamifier");

const OUTPUT_DIR = path.join(__dirname, 'output');

async function convertPDFtoPPTX(pdfBuffer) {
    try {
        const credentials = new ServicePrincipalCredentials({
            clientId: '3bca9964300a430cb84448563c7d8cc3',
            clientSecret: 'p8e-4x5XUYJ9Ca2f3CSYE6Uu8UWzkfMxRa59'
        });

        const pdfServices = new PDFServices({ credentials });

        const inputAsset = await pdfServices.upload({
            readStream: streamifier.createReadStream(pdfBuffer),
            mimeType: MimeType.PDF
        });

        const params = new ExportPDFParams({
            targetFormat: ExportPDFTargetFormat.PPTX
        });

        const job = new ExportPDFJob({ inputAsset, params });
        const pollingURL = await pdfServices.submit({ job });
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFResult
        });

        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });

        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        const outputFilePath = path.join(OUTPUT_DIR, "PPTXOutput.pptx");
        console.log(`Saving asset at ${outputFilePath}`);

        return new Promise((resolve, reject) => {
            const outputStream = fs.createWriteStream(outputFilePath);
            streamAsset.readStream.pipe(outputStream);

            outputStream.on('finish', () => {
                console.log("PDF to PPTX conversion completed successfully");
                resolve(outputFilePath);
            });

            outputStream.on('error', (err) => {
                console.error("Error writing to file:", err);
                reject(err);
            });
        });
    } catch (err) {
        console.error("Exception encountered while executing operation", err);
        throw err;
    }
}

module.exports = { convertPDFtoPPTX };
