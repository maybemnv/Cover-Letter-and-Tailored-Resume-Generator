from groq import Groq
from typing import Dict, Optional
import streamlit as st
from ..config.settings import GROQ_API_KEY, GROQ_MODEL, MAX_TOKENS, TEMPERATURE

class LLMClient:
    def __init__(self):
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = GROQ_MODEL

    def generate_content(self, prompt: str) -> Optional[str]:
        """
        Generate content using Groq AI.
        
        Args:
            prompt (str): The prompt to send to the AI
            
        Returns:
            Optional[str]: Generated content or None if error
        """
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=self.model,
                temperature=TEMPERATURE,
                max_tokens=MAX_TOKENS,
            )
            
            return chat_completion.choices[0].message.content

        except Exception as e:
            print(f"LLM Generation Error: {str(e)}")
            raise e
    
    def generate_cover_letter(self, resume: str, job_description: str, 
                            additional_info: Dict = None) -> Optional[str]:
        """
        Generate a tailored cover letter.
        """
        from .prompts import COVER_LETTER_PROMPT
        
        prompt = COVER_LETTER_PROMPT.format(
            resume=resume,
            job_description=job_description,
            additional_info=additional_info or {}
        )
        
        return self.generate_content(prompt)
    
    def analyze_resume(self, resume: str, job_description: str) -> Optional[str]:
        """
        Analyze resume and provide improvement suggestions.
        """
        from .prompts import RESUME_ANALYSIS_PROMPT
        
        prompt = RESUME_ANALYSIS_PROMPT.format(
            resume=resume,
            job_description=job_description
        )
        
        return self.generate_content(prompt)
    
    def check_api_connection(self) -> bool:
        """
        Check if the API connection is working.
        """
        try:
            test_response = self.generate_content("Test connection")
            return test_response is not None
        except Exception:
            return False

# Global client instance
_client = None
def get_llm_client() -> LLMClient:
    global _client
    if _client is None:
        _client = LLMClient()
    return _client

# Compatibility alias
def get_gemini_client():
    return get_llm_client()
