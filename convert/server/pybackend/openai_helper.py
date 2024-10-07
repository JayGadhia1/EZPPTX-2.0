import openai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.")

client = openai.OpenAI(api_key=api_key)

def summarize_text(text):
    prompt = f"Summarize the following presentation slide text: {text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes presentation slides."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()

def generate_improvement_suggestions(text):
    prompt = f"Provide improvement suggestions for this presentation slide: {text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides improvement suggestions for presentation slides."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()
