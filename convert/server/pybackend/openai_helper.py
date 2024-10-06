import openai
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the API key from the environment variable
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.")

# Initialize the OpenAI client with the API key
client = openai.OpenAI(api_key=api_key)

def summarize_text(text):
    logger.info("Summarizing text")
    prompt = f"Summarize the following presentation slide text: {text}"
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes presentation slides."},
                {"role": "user", "content": prompt}
            ]
        )
        summary = response.choices[0].message.content.strip()
        logger.info("Text summarized successfully")
        return summary
    except Exception as e:
        logger.error(f"Error summarizing text: {str(e)}")
        raise

def generate_improvement_suggestions(text):
    logger.info("Generating improvement suggestions")
    prompt = f"Provide improvement suggestions for this presentation slide: {text}"
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides improvement suggestions for presentation slides."},
                {"role": "user", "content": prompt}
            ]
        )
        suggestions = response.choices[0].message.content.strip()
        logger.info("Improvement suggestions generated successfully")
        return suggestions
    except Exception as e:
        logger.error(f"Error generating improvement suggestions: {str(e)}")
        raise