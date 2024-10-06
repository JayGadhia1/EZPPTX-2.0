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

async function convertPDFtoPPTX(pdfBuffer) {
    try {
        const credentials = new ServicePrincipalCredentials({
            clientId: '3bca9964300a430cb84448563c7d8cc3',
            clientSecret: 'p8e-4x5XUYJ9Ca2f3CSYE6Uu8UWzkfMxRa59'
        });

        const pdfServices = new PDFServices({ credentials });

        // Use streamifier to create a stream from the buffer
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

        // Ensure the output directory exists
        const outputDir = './server/output';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFilePath = path.join(outputDir, "PPTXOutput.pptx");
        console.log(`Saving asset at ${outputFilePath}`);

        const outputStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(outputStream);

        console.log("PDF to PPTX conversion completed successfully");
    } catch (err) {
        console.error("Exception encountered while executing operation", err);
        throw err;
    }
}

module.exports = { convertPDFtoPPTX };
