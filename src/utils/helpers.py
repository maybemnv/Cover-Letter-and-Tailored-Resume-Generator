import re
from typing import Dict, List, Any
from datetime import datetime
import json
from pathlib import Path
import streamlit as st

def extract_contact_info(text: str) -> Dict[str, str]:
    """Extract contact information from text."""
    contact_info = {
        'email': '',
        'phone': '',
        'linkedin': ''
    }
    
    # Email pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    if emails:
        contact_info['email'] = emails[0]
    
    # Phone pattern
    phone_pattern = r'\b(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b'
    phones = re.findall(phone_pattern, text)
    if phones:
        contact_info['phone'] = phones[0]
    
    # LinkedIn pattern
    linkedin_pattern = r'linkedin\.com/in/[\w-]+'
    linkedin = re.findall(linkedin_pattern, text)
    if linkedin:
        contact_info['linkedin'] = linkedin[0]
    
    return contact_info

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using common skill keywords."""
    # Example skill keywords (expand as needed)
    skill_keywords = [
        'python', 'java', 'javascript', 'react', 'node.js', 'sql',
        'machine learning', 'data analysis', 'project management',
        'leadership', 'communication', 'problem solving'
    ]
    
    found_skills = []
    for skill in skill_keywords:
        if re.search(r'\b' + re.escape(skill) + r'\b', text.lower()):
            found_skills.append(skill)
    
    return found_skills

def format_date(date_str: str = None) -> str:
    """Format date string or return current date."""
    if date_str:
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            return date_obj.strftime('%B %d, %Y')
        except ValueError:
            return datetime.now().strftime('%B %d, %Y')
    return datetime.now().strftime('%B %d, %Y')

def clean_text(text: str) -> str:
    """Clean and normalize text content."""
    if not text:
        return ""
    
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters
    text = re.sub(r'[^\w\s@.-]', '', text)
    
    # Convert multiple newlines to single newline
    text = re.sub(r'\n+', '\n', text)
    
    return text.strip()

def save_to_json(data: Dict[str, Any], filename: str) -> bool:
    """Save data to JSON file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving to JSON: {str(e)}")
        return False

def load_from_json(filename: str) -> Dict[str, Any]:
    """Load data from JSON file."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {str(e)}")
        return {}

def load_css(css_path: Path) -> None:
    """Load and inject custom CSS.
    
    Args:
        css_path (Path): Path to CSS file
    """
    try:
        with open(css_path) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except Exception as e:
        st.warning(f"Error loading CSS: {str(e)}")