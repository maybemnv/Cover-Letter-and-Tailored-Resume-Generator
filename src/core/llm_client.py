import google.generativeai as genai
from typing import Dict, Optional
import streamlit as st
from ..config.settings import GEMINI_API_KEY, GEMINI_MODEL, MAX_TOKENS, TEMPERATURE
class GeminiClient:
    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(GEMINI_MODEL)
    def generate_content(self, prompt: str) -> Optional[str]:
        """
        Generate content using Gemini AI.
        
        Args:
            prompt (str): The prompt to send to the AI
            
        Returns:
            Optional[str]: Generated content or None if error
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=MAX_TOKENS,
                    temperature=TEMPERATURE,
                )
            )
            return response.text
        except Exception as e:
            st.error(f"Error generating content: {str(e)}")
            return None
    
    def generate_cover_letter(self, resume: str, job_description: str, 
                            additional_info: Dict = None) -> Optional[str]:
        """
        Generate a tailored cover letter.
        
        Args:
            resume (str): The user's resume content
            job_description (str): The job description
            additional_info (Dict): Additional user information
            
        Returns:
            Optional[str]: Generated cover letter or None if error
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
        
        Args:
            resume (str): The user's resume content
            job_description (str): The job description
            
        Returns:
            Optional[str]: Analysis and suggestions or None if error
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
        
        Returns:
            bool: True if connection is working, False otherwise
        """
        try:
            test_response = self.generate_content("Test connection")
            return test_response is not None
        except Exception:
            return False

# Global client instance
_client = None
def get_gemini_client() -> GeminiClient:
    global _client
    if _client is None:
        _client = GeminiClient()
    return _client