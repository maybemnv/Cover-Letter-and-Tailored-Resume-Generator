import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
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
            # Configure safety settings to avoid blocking standard content
            safety_settings = {
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            }

            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=MAX_TOKENS,
                    temperature=TEMPERATURE,
                ),
                safety_settings=safety_settings
            )
            
            # Safely extract text
            if response.parts:
                return response.text
            
            # Handle cases where parts are empty but candidates might have info
            if response.candidates:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    return candidate.content.parts[0].text
                
                # Check for finish reason if no content
                if candidate.finish_reason == 3: # SAFETY
                    raise ValueError("Content generation blocked by safety filters.")
                elif candidate.finish_reason == 4: # RECITATION
                    raise ValueError("Content generation blocked (recitation).")
                else:
                    raise ValueError(f"No content generated. Finish reason: {candidate.finish_reason}")
            
            raise ValueError("No response candidates returned.")

        except Exception as e:
            # Log error but don't show stack trace to user unless it's a specific logic error
            print(f"LLM Generation Error: {str(e)}")
            raise e
    
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