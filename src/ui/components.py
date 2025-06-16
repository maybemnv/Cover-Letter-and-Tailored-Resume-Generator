"""
Reusable UI components for the application.
"""

import streamlit as st
from typing import Dict, List, Optional, Tuple
import pandas as pd

def render_header():
    """Render the main application header."""
    
    st.title("📝 Cover Letter & Resume Generator")
    st.markdown("Upload your resume and job description to get started!")

def render_feature_highlight():
    """Render feature highlights."""
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="feature-box">
            <h4>🎯 AI-Powered</h4>
            <p>Uses advanced AI to create personalized content</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="feature-box">
            <h4>⚡ Lightning Fast</h4>
            <p>Generate cover letters in under 30 seconds</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="feature-box">
            <h4>📊 Smart Analysis</h4>
            <p>Get detailed resume improvement suggestions</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class="feature-box">
            <h4>📄 Export Ready</h4>
            <p>Download in DOCX, PDF, or copy to clipboard</p>
        </div>
        """, unsafe_allow_html=True)

def render_progress_indicator(current_step: int, total_steps: int, step_names: List[str]):
    """
    Render a progress indicator.
    
    Args:
        current_step (int): Current step number (1-based)
        total_steps (int): Total number of steps
        step_names (List[str]): Names of each step
    """
    
    st.markdown("### Progress")
    
    cols = st.columns(total_steps)
    
    for i, (col, step_name) in enumerate(zip(cols, step_names)):
        with col:
            if i + 1 < current_step:
                # Completed step
                st.markdown(f"✅ **{step_name}**")
            elif i + 1 == current_step:
                # Current step
                st.markdown(f"🔄 **{step_name}**")
            else:
                # Future step
                st.markdown(f"⭕ {step_name}")
    
    # Progress bar
    progress = (current_step - 1) / total_steps
    st.progress(progress)

def render_input_section() -> Tuple[str, str]:
    """
    Render the input section for resume and job description.
    
    Returns:
        Tuple[str, str]: Resume text and job description text
    """
    resume_text = ""
    job_desc = ""
    
    with st.container():
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Resume")
            upload_type = st.radio("Choose input type:", ["Upload File", "Paste Text"], key="resume_input")
            
            if upload_type == "Upload File":
                resume_file = st.file_uploader("Upload Resume", type=["pdf", "docx"], key="resume_file")
                if resume_file:
                    # Process file content here
                    resume_text = "File content will be processed"
            else:
                resume_text = st.text_area("Paste Resume", height=300, key="resume_text")
        
        with col2:
            st.subheader("Job Description")
            jd_upload_type = st.radio("Choose input type:", ["Upload File", "Paste Text"], key="jd_input")
            
            if jd_upload_type == "Upload File":
                jd_file = st.file_uploader("Upload Job Description", type=["pdf", "docx", "txt"], key="jd_file")
                if jd_file:
                    # Process file content here
                    job_desc = "File content will be processed"
            else:
                job_desc = st.text_area("Paste Job Description", height=300, key="jd_text")
    
    return resume_text, job_desc

def render_results_section(content: dict):
    """Render the results section."""
    if content:
        st.subheader("Generated Content")
        st.write(content.get("text", ""))
        
        if st.button("Download"):
            # Add download functionality here
            pass

def render_analysis_section(analysis: dict):
    """Render the analysis section."""
    if analysis:
        st.subheader("Resume Analysis")
        st.write(f"Match Score: {analysis.get('score', 0)}%")
        
        with st.expander("Detailed Analysis"):
            st.write(analysis.get("details", ""))

def show_success_message(message: str):
    """Show a success message."""
    st.success(message)

def show_error_message(message: str):
    """Show an error message."""
    st.error(message)

def show_warning_message(message: str, details: str = None):
    """
    Show a warning message with optional details.
    
    Args:
        message (str): Main warning message
        details (str, optional): Additional details
    """
    
    st.warning(f"⚠️ {message}")
    if details:
        st.warning(details)

def show_info_message(message: str, details: str = None):
    """
    Show an info message with optional details.
    
    Args:
        message (str): Main info message
        details (str, optional): Additional details
    """
    
    st.info(f"ℹ️ {message}")
    if details:
        st.info(details)

def render_stats_cards(stats: Dict[str, any]):
    """
    Render statistics cards.
    
    Args:
        stats (Dict[str, any]): Dictionary of statistics to display
    """
    
    cols = st.columns(len(stats))
    
    for col, (label, value) in zip(cols, stats.items()):
        with col:
            st.metric(label=label, value=value)

def render_action_button(label: str, key: str, button_type: str = "primary", 
                        icon: str = None, disabled: bool = False) -> bool:
    """
    Render a styled action button.
    
    Args:
        label (str): Button label
        key (str): Unique key for the button
        button_type (str): Button type (primary, secondary)
        icon (str, optional): Icon to display
        disabled (bool): Whether button is disabled
        
    Returns:
        bool: True if button was clicked
    """
    
    button_label = f"{icon} {label}" if icon else label
    
    return st.button(
        button_label,
        key=key,
        type=button_type,
        disabled=disabled,
        use_container_width=True
    )

def render_file_uploader(label: str, file_types: List[str], key: str, 
                        help_text: str = None):
    """
    Render a styled file uploader.
    
    Args:
        label (str): Uploader label
        file_types (List[str]): Accepted file types
        key (str): Unique key
        help_text (str, optional): Help text to display
        
    Returns:
        Uploaded file object or None
    """
    
    return st.file_uploader(
        label,
        type=file_types,
        key=key,
        help=help_text
    )

def render_text_input_with_counter(label: str, key: str, max_chars: int = None, 
                                 height: int = None, placeholder: str = None):
    """
    Render a text input with character counter.
    
    Args:
        label (str): Input label
        key (str): Unique key
        max_chars (int, optional): Maximum character limit
        height (int, optional): Height of text area
        placeholder (str, optional): Placeholder text
        
    Returns:
        str: Input text
    """
    
    text = st.text_area(
        label,
        key=key,
        height=height,
        placeholder=placeholder,
        max_chars=max_chars
    )
    
    if max_chars and text:
        chars_used = len(text)
        chars_remaining = max_chars - chars_used
        
        color = "red" if chars_remaining < 100 else "orange" if chars_remaining < 300 else "green"
        
        st.markdown(f"""
        <div style="text-align: right; color: {color}; font-size: 0.8em;">
            {chars_used}/{max_chars} characters ({chars_remaining} remaining)
        </div>
        """, unsafe_allow_html=True)
    
    return text

def render_expandable_section(title: str, content: str, expanded: bool = False):
    """
    Render an expandable content section.
    
    Args:
        title (str): Section title
        content (str): Section content
        expanded (bool): Whether section starts expanded
    """
    
    with st.expander(title, expanded=expanded):
        st.markdown(content)

def render_copy_button(text: str, button_label: str = "📋 Copy", key: str = None):
    """
    Render a copy-to-clipboard button.
    
    Args:
        text (str): Text to copy
        button_label (str): Button label
        key (str, optional): Unique key
    """
    
    if st.button(button_label, key=key):
        # Note: Actual clipboard functionality would need additional JS
        st.success("Copied to clipboard!")
        return True
    return False

def render_download_buttons(content: str, filename_base: str, formats: List[str]):
    """
    Render download buttons for different formats.
    
    Args:
        content (str): Content to download
        filename_base (str): Base filename without extension
        formats (List[str]): List of formats to support
    """
    
    cols = st.columns(len(formats))
    
    for col, format_type in zip(cols, formats):
        with col:
            if format_type == "txt":
                st.download_button(
                    f"📄 Download {format_type.upper()}",
                    data=content,
                    file_name=f"{filename_base}.{format_type}",
                    mime="text/plain"
                )
            elif format_type == "docx":
                # This would need the export utility
                st.button(f"📄 Download {format_type.upper()}", disabled=True)
            elif format_type == "pdf":
                # This would need the export utility
                st.button(f"📄 Download {format_type.upper()}", disabled=True)

def render_loading_spinner(message: str = "Processing..."):
    """
    Render a loading spinner with message.
    
    Args:
        message (str): Loading message
    """
    
    with st.spinner(message):
        st.empty()  # Placeholder for actual loading content

def render_rating_widget(label: str, key: str, max_rating: int = 5) -> int:
    """
    Render a rating widget.
    
    Args:
        label (str): Rating label
        key (str): Unique key
        max_rating (int): Maximum rating value
        
    Returns:
        int: Selected rating
    """
    
    return st.slider(
        label,
        min_value=1,
        max_value=max_rating,
        value=3,
        key=key
    )

def render_feedback_form():
    """Render a feedback form for user input."""
    
    with st.expander("💬 Feedback & Suggestions"):
        
        feedback_type = st.selectbox(
            "Feedback Type",
            ["Bug Report", "Feature Request", "General Feedback"],
            key="feedback_type"
        )
        
        feedback_text = st.text_area(
            "Your Feedback",
            placeholder="Tell us what you think...",
            key="feedback_text"
        )
        
        rating = render_rating_widget("Overall Rating", "overall_rating")
        
        if st.button("Submit Feedback", key="submit_feedback"):
            if feedback_text:
                st.success("Thank you for your feedback!")
            else:
                st.error("Please provide feedback text")

def render_tutorial_steps():
    """Render tutorial steps for new users."""
    
    with st.expander("📖 How to Use This Tool"):
        
        st.markdown("""
        ### Quick Start Guide
        
        1. **📄 Input Your Resume**
           - Paste your resume text or upload a PDF/DOCX file
           - Make sure all important information is included
        
        2. **🎯 Add Job Description**
           - Copy and paste the job posting
           - Include requirements, responsibilities, and company info
        
        3. **⚙️ Optional: Add Details**
           - Company name, hiring manager, position title
           - Any special instructions or points to emphasize
        
        4. **🔥 Generate Content**
           - Click "Generate Cover Letter" for a tailored letter
           - Click "Analyze Resume" for improvement suggestions
           - Click "Quick Tips" for immediate actionable advice
        
        5. **📥 Export & Use**
           - Copy text to clipboard
           - Download as DOCX or PDF
           - Customize further if needed
        
        ### Pro Tips
        - The more detailed your inputs, the better the output
        - Review and customize the generated content
        - Use the analysis to improve your resume before applying
        """)