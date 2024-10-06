from pdf_processor import analyze_pdf_presentation
import sys

# Main entry point
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python app.py <pdf_file_path>")
        sys.exit(1)

    pdf_file_path = sys.argv[1]

    # Analyze the PDF presentation and generate a DOCX summary and analysis
    analyze_pdf_presentation(pdf_file_path)
