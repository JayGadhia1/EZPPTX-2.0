from flask import Flask, request, jsonify, send_file, abort
from flask_cors import CORS
import os
import logging
from pdf_processor import analyze_pdf_presentation

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Configure paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'output')
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)

app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
SERVER_ADDRESS = '127.0.0.1'
SERVER_PORT = 5000

@app.route('/')
def home():
    return "PDF Summary and Analysis Server is running"

@app.route('/convert', methods=['POST'])
def convert_pdf():
    app.logger.info("Received request to /convert endpoint")
    try:
        app.logger.debug("Checking for file in request")
        if 'file' not in request.files:
            app.logger.error("No file part in the request")
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        app.logger.debug(f"File received: {file.filename}")
        
        if file.filename == '':
            app.logger.error("No selected file")
            return jsonify({"error": "No selected file"}), 400

        if file:
            pdf_path = os.path.join(app.config['OUTPUT_FOLDER'], 'input.pdf')
            app.logger.info(f"Saving file to {pdf_path}")
            file.save(pdf_path)

            app.logger.info("Starting PDF analysis")
            output_docx_path = analyze_pdf_presentation(pdf_path)
            app.logger.info(f"PDF analysis complete. Output saved to {output_docx_path}")

            if output_docx_path and os.path.exists(output_docx_path):
                download_url = f"http://{SERVER_ADDRESS}:{SERVER_PORT}/download/{os.path.basename(output_docx_path)}"
                app.logger.info(f"Generated download URL: {download_url}")
                return jsonify({"downloadUrl": download_url})
            else:
                app.logger.error(f"Failed to generate DOCX file at {output_docx_path}")
                return jsonify({"error": "Failed to generate DOCX file"}), 500

    except Exception as e:
        app.logger.exception(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    app.logger.info(f"Attempting to download file: {file_path}")
    
    if os.path.exists(file_path):
        app.logger.info(f"File found. Sending: {file_path}")
        return send_file(file_path, as_attachment=True)
    else:
        app.logger.error(f"File not found: {file_path}")
        abort(404, description="Resource not found")

if __name__ == '__main__':
    app.logger.info(f"Starting server at http://{SERVER_ADDRESS}:{SERVER_PORT}")
    app.run(debug=True, host=SERVER_ADDRESS, port=SERVER_PORT)