from typing import Dict, Optional
import streamlit as st
from ..core.llm_client import get_gemini_client
from ..utils.validators import validate_inputs

class CoverLetterGenerator:
    """Service for generating tailored cover letters."""
    
    def __init__(self):
        """Initialize the cover letter generator."""
        self.client = get_gemini_client()
    
    def generate(self, resume: str, job_description: str, 
                additional_info: Dict = None) -> Optional[str]:
        # Validate inputs
        is_valid, error_message = validate_inputs(resume, job_description)
        if not is_valid:
            st.error(error_message)
            return None
        
        # Prepare additional info
        if additional_info is None:
            additional_info = {}
        
        # Generate cover letter
        with st.spinner("🔥 Generating your tailored cover letter..."):
            cover_letter = self.client.generate_cover_letter(
                resume=resume,
                job_description=job_description,
                additional_info=additional_info
            )
        
        if cover_letter:
            st.success("✅ Cover letter generated successfully!")
            return cover_letter
        else:
            st.error("❌ Failed to generate cover letter. Please try again.")
            return None
    
    def get_quick_improvements(self, resume: str, job_description: str) -> Optional[str]:
        from ..core.prompts import QUICK_TIPS_PROMPT
        
        prompt = QUICK_TIPS_PROMPT.format(
            resume=resume,
            job_description=job_description
        )
        
        with st.spinner("💡 Getting quick tips..."):
            tips = self.client.generate_content(prompt)
        
        return tips
    
    def extract_skills(self, resume: str) -> Optional[str]:
        from ..core.prompts import SKILLS_EXTRACTION_PROMPT
        prompt = SKILLS_EXTRACTION_PROMPT.format(resume=resume)
        with st.spinner("🔍 Analyzing your skills..."):
            skills = self.client.generate_content(prompt)
        return skills
    def customize_for_company(self, base_cover_letter: str, 
                            company_info: str) -> Optional[str]:
        prompt = f"""
        Customize this cover letter for the specific company based on the company information provided:
        
        BASE COVER LETTER:
        {base_cover_letter}
        
        COMPANY INFORMATION:
        {company_info}
        
        INSTRUCTIONS:
        1. Incorporate specific company details and values
        2. Show knowledge of the company's mission, products, or recent news
        3. Explain why you want to work specifically for this company
        4. Maintain the same professional tone and structure
        5. Keep the same length
        
        Return the customized cover letter.
        """
        with st.spinner("🏢 Customizing for company..."):
            customized = self.client.generate_content(prompt)
        return customized
_generator = None
def get_cover_letter_generator() -> CoverLetterGenerator:
    """Get or create the cover letter generator instance."""
    global _generator
    if _generator is None:
        _generator = CoverLetterGenerator()
    return _generator