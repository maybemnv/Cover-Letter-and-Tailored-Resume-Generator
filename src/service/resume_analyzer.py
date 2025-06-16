from typing import Dict, Optional, List
import streamlit as st
from ..core.llm_client import get_gemini_client
from ..utils.validators import validate_inputs

class ResumeAnalyzer:
    """Service for analyzing resumes and providing improvement suggestions."""
    
    def __init__(self):
        """Initialize the resume analyzer."""
        self.client = get_gemini_client()
    
    def analyze(self, resume: str, job_description: str) -> Optional[str]:
        """
        Analyze resume against job description and provide suggestions.
        
        Args:
            resume (str): The user's resume content
            job_description (str): The job description
            
        Returns:
            Optional[str]: Analysis report or None if error
        """
        # Validate inputs
        is_valid, error_message = validate_inputs(resume, job_description)
        if not is_valid:
            st.error(error_message)
            return None
        
        # Generate analysis
        with st.spinner("🔍 Analyzing your resume against the job requirements..."):
            analysis = self.client.analyze_resume(resume, job_description)
        
        if analysis:
            st.success("✅ Resume analysis completed!")
            return analysis
        else:
            st.error("❌ Failed to analyze resume. Please try again.")
            return None
    
    def get_keyword_suggestions(self, resume: str, job_description: str) -> Optional[str]:
        """
        Get keyword optimization suggestions.
        
        Args:
            resume (str): The user's resume content
            job_description (str): The job description
            
        Returns:
            Optional[str]: Keyword suggestions or None if error
        """
        prompt = f"""
        Analyze the job description and resume to suggest keyword optimizations:
        
        JOB DESCRIPTION:
        {job_description}
        
        RESUME:
        {resume}
        
        TASK:
        1. Identify important keywords and phrases from the job description
        2. Check which keywords are missing from the resume
        3. Suggest how to naturally incorporate missing keywords
        4. Provide ATS (Applicant Tracking System) optimization tips
        5. Rank suggestions by importance
        
        Format as a clear, actionable list with explanations.
        """
        
        with st.spinner("🔑 Analyzing keywords..."):
            suggestions = self.client.generate_content(prompt)
        
        return suggestions
    
    def get_formatting_suggestions(self, resume: str) -> Optional[str]:
        prompt = f"""
        Analyze this resume and provide formatting and structure suggestions:
        
        RESUME:
        {resume}
        
        PROVIDE SUGGESTIONS FOR:
        1. Overall structure and organization
        2. Section ordering and priorities
        3. Content presentation improvements
        4. Length and conciseness
        5. Professional formatting best practices
        6. Industry-specific formatting considerations
        
        Focus on actionable improvements that will make the resume more impactful.
        """
        with st.spinner("📝 Analyzing resume format..."):
            suggestions = self.client.generate_content(prompt)
        
        return suggestions
    
    def calculate_match_score(self, resume: str, job_description: str) -> Optional[Dict]:
        prompt = f"""
        Calculate a match score between this resume and job description:
        
        RESUME:
        {resume}
        
        JOB DESCRIPTION:
        {job_description}
        
        PROVIDE:
        1. Overall match score (1-10)
        2. Skills match percentage
        3. Experience match percentage
        4. Education/qualifications match percentage
        5. Key strengths that align
        6. Major gaps
        
        Format as JSON-like structure for easy parsing.
        """
        
        with st.spinner("📊 Calculating match score..."):
            score_analysis = self.client.generate_content(prompt)
        
        return score_analysis
    
    def suggest_improvements_priority(self, resume: str, job_description: str) -> Optional[str]:
        prompt = f"""
        Provide a prioritized action plan for improving this resume for the specific job:
        
        RESUME:
        {resume}
        
        JOB DESCRIPTION:
        {job_description}
        
        CREATE A PRIORITIZED ACTION PLAN:
        
        HIGH PRIORITY (Do First):
        - Most impactful changes
        - Quick wins
        - Critical missing elements
        
        MEDIUM PRIORITY (Do Next):
        - Important improvements
        - Skill highlighting
        - Content reorganization
        
        LOW PRIORITY (Nice to Have):
        - Minor enhancements
        - Additional details
        - Formatting tweaks
        
        For each item, explain why it's important and how to implement it.
        """
        
        with st.spinner("📋 Creating improvement action plan..."):
            action_plan = self.client.generate_content(prompt)
        
        return action_plan

# Global analyzer instance
_analyzer = None

def get_resume_analyzer() -> ResumeAnalyzer:
    """Get or create the resume analyzer instance."""
    global _analyzer
    if _analyzer is None:
        _analyzer = ResumeAnalyzer()
    return _analyzer