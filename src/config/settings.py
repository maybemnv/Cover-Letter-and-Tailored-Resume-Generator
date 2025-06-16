"""
Configuration settings for the application.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# App Configuration
APP_CONFIG = {
    "page_title": "🔥 AI Cover Letter & Resume Tailor",
    "page_icon": "🔥",
    "layout": "wide",
    "initial_sidebar_state": "expanded"
}

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-1.5-flash"

# File Processing Configuration
SUPPORTED_FILE_TYPES = {
    "resume": ["pdf", "docx"],
    "job_description": ["txt"]
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
PREVIEW_LENGTH = 500

# AI Generation Configuration
MAX_TOKENS = 4000
TEMPERATURE = 0.7

# Export Configuration
EXPORT_FORMATS = ["docx", "pdf", "txt"]

# UI Configuration
COLORS = {
    "primary": "#ff6b6b",
    "secondary": "#ee5a24",
    "success": "#28a745",
    "warning": "#ffc107",
    "danger": "#dc3545",
    "info": "#17a2b8"
}

# Validation Rules
VALIDATION_RULES = {
    "min_resume_length": 100,
    "min_job_description_length": 50,
    "max_input_length": 10000
}

# Feature Flags
FEATURES = {
    "pdf_export": True,
    "docx_export": True,
    "resume_analysis": True,
    "cover_letter_generation": True,
    "file_upload": True
}