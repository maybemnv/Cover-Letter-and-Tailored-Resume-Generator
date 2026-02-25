from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

try:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "You're a motorsport expert. Who's the GOAT of F1?",
            }
        ],
        model="moonshotai/kimi-k2-instruct-0905",
    )

    # Print the result
    print(chat_completion.choices[0].message.content)

except Exception as e:
    print(f"Error: {e}")
