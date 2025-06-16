"""
Input validation utilities.
"""

from typing import Tuple
import re
from ..config.settings import VALIDATION_RULES

def validate_inputs(resume: str, job_description: str) -> Tuple[bool, str]:
    """
    Validate resume and job description inputs.
    
    Args:
        resume (str): Resume content
        job_description (str): Job description content
        
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    
    # Check if inputs are provided
    if not resume or not resume.strip():
        return False, "Resume content is required"
    
    if not job_description or not job_description.strip():
        return False, "Job description is required"
    
    # Check minimum length
    if len(resume.strip()) < VALIDATION_RULES["min_resume_length"]:
        return False, f"Resume must be at least {VALIDATION_RULES['min_resume_length']} characters long"
    
    if len(job_description.strip()) < VALIDATION_RULES["min_job_description_length"]:
        return False, f"Job description must be at least {VALIDATION_RULES['min_job_description_length']} characters long"
    
    # Check maximum length
    if len(resume) > VALIDATION_RULES["max_input_length"]:
        return False, f"Resume exceeds maximum length of {VALIDATION_RULES['max_input_length']} characters"
    
    if len(job_description) > VALIDATION_RULES["max_input_length"]:
        return False, f"Job description exceeds maximum length of {VALIDATION_RULES['max_input_length']} characters"
    
    return True, ""

def validate_email(email: str) -> bool:
    """
    Validate email format.
    
    Args:
        email (str): Email address to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not email:
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """
    Validate phone number format.
    
    Args:
        phone (str): Phone number to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not phone:
        return False
    
    # Remove common separators
    cleaned = re.sub(r'[^\d+]', '', phone)
    
    # Check if it's a reasonable phone number length
    return len(cleaned) >= 10 and len(cleaned) <= 15

def validate_url(url: str) -> bool:
    """
    Validate URL format.
    
    Args:
        url (str): URL to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not url:
        return False
    
    pattern = r'^https?://(?:[-\w.])+(?:\:[0-9]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$'
    return re.match(pattern, url) is not None

def sanitize_text(text: str) -> str:
    """
    Sanitize text input by removing potentially harmful content.
    
    Args:
        text (str): Text to sanitize
        
    Returns:
        str: Sanitized text
    """
    if not text:
        return ""
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove script tags and content
    text = re.sub(r'<script.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

def validate_file_content(content: str, content_type: str) -> Tuple[bool, str]:
    """
    Validate uploaded file content based on type.
    
    Args:
        content (str): File content
        content_type (str): Type of content ('resume' or 'job_description')
        
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    if not content:
        return False, f"Empty {content_type} file"
    
    # Sanitize content
    cleaned_content = sanitize_text(content)
    
    # Validate based on content type
    if content_type == 'resume':
        if len(cleaned_content) < VALIDATION_RULES["min_resume_length"]:
            return False, f"Resume content too short (minimum {VALIDATION_RULES['min_resume_length']} characters)"
        if len(cleaned_content) > VALIDATION_RULES["max_input_length"]:
            return False, f"Resume content too long (maximum {VALIDATION_RULES['max_input_length']} characters)"
    
    elif content_type == 'job_description':
        if len(cleaned_content) < VALIDATION_RULES["min_job_description_length"]:
            return False, f"Job description too short (minimum {VALIDATION_RULES['min_job_description_length']} characters)"
        if len(cleaned_content) > VALIDATION_RULES["max_input_length"]:
            return False, f"Job description too long (maximum {VALIDATION_RULES['max_input_length']} characters)"
    
    else:
        return False, "Invalid content type"
    
    return True, ""

def validate_file_type(filename: str) -> Tuple[bool, str]:
    """
    Validate file type based on extension.
    
    Args:
        filename (str): Name of the uploaded file
        
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    allowed_extensions = {'.pdf', '.docx', '.doc', '.txt'}
    file_ext = os.path.splitext(filename.lower())[1]
    
    if not file_ext:
        return False, "No file extension found"
    
    if file_ext not in allowed_extensions:
        return False, f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
    
    return True, ""

def validate_file_size(file_size: int) -> Tuple[bool, str]:
    """
    Validate file size.
    
    Args:
        file_size (int): Size of file in bytes
        
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    max_size = VALIDATION_RULES.get("max_file_size", 5 * 1024 * 1024)  # Default 5MB
    
    if file_size > max_size:
        return False, f"File too large. Maximum size: {max_size // (1024 * 1024)}MB"
    
    return True, ""

def validate_name(name: str) -> Tuple[bool, str]:
    """
    Validate person name.
    
    Args:
        name (str): Name to validate
        
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    if not name or not name.strip():
        return False, "Name is required"
    
    # Remove extra spaces and check length
    cleaned_name = " ".join(name.split())
    if len(cleaned_name) < 2:
        return False, "Name too short"
    
    if len(cleaned_name) > 100:
        return False, "Name too long"
    
    # Check for valid characters
    if not re.match(r'^[A-Za-z\s\'-]+$', cleaned_name):
        return False, "Name contains invalid characters"
    
    return True, ""

def validate_company_name(company: str) -> Tuple[bool, str]:
    """
    Validate company name.
    
    Args:
        company (str): Company name to validate
        
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    if not company or not company.strip():
        return False, "Company name is required"
    
    cleaned_company = company.strip()
    if len(cleaned_company) < 2:
        return False, "Company name too short"
    
    if len(cleaned_company) > 200:
        return False, "Company name too long"
    
    # Allow alphanumeric characters, spaces, and common symbols
    if not re.match(r'^[A-Za-z0-9\s\'-&.,]+$', cleaned_company):
        return False, "Company name contains invalid characters"
    
    return True, ""