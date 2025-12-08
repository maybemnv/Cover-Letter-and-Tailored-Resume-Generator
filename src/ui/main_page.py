import streamlit as st
from typing import Dict, Optional, Tuple, List
from datetime import datetime
from pathlib import Path
import tempfile
import time

from .sidebar import render_sidebar
from ..service.file_processor import FileProcessor
from ..service.cover_letter_generation import get_cover_letter_generator
from ..service.resume_analyzer import get_resume_analyzer
from ..utils.export import create_cover_letter_docx, convert_text_to_pdf

def init_session_state():
    """Initialize session state variables."""
    # Core user inputs
    if 'resume_text' not in st.session_state:
        st.session_state.resume_text = ""
    if 'job_desc' not in st.session_state:
        st.session_state.job_desc = ""
        
    # Additional info
    if 'additional_info' not in st.session_state:
        st.session_state.additional_info = {}
        
    # Generated content
    if 'generated_content' not in st.session_state:
        st.session_state.generated_content = {}
        
    # UI state
    if 'processing' not in st.session_state:
        st.session_state.processing = False

def render_header():
    """Render the application header."""
    st.title("🚀 Smart Resume & Cover Letter Generator")
    st.markdown("""
    Generate tailored cover letters and analyze your resume against job descriptions using AI.
    Upload your resume and the job description to get started.
    """)

def render_input_section():
    """Render input section for Resume and Job Description."""
    with st.container():
        col1, col2 = st.columns(2)
        
        # Resume Section
        with col1:
            st.subheader("📄 Resume")
            
            # File Upload
            resume_file = st.file_uploader(
                "Upload your resume",
                type=["pdf", "docx"],
                help="Upload your resume in PDF or DOCX format",
                key="resume_uploader"
            )
            
            # Text Area (Fallback or Edit)
            st.text_area(
                "Or paste resume text",
                value=st.session_state.resume_text,
                height=150,
                key="resume_text_area",
                on_change=lambda: st.session_state.update({'resume_text': st.session_state.resume_text_area})
            )

            # Process uploaded file
            if resume_file:
                # Basic check to avoid re-processing same file if text is already present
                # Ideally, we track file ID, but for now, we just process if uploaded
                try:
                    # Only process if content changed or text is empty (to avoid overwriting manual edits on every rerun if file stays)
                    # Streamlit reruns script on interaction. file_uploader persists.
                    # We need a way to know if this is a NEW upload.
                    # A simple way is to check if text is empty, OR if we want to force overwrite on new file.
                    # For simplicity: File uploader takes precedence if provided.
                    # However, to allow text editing, we only update session_state.resume_text if it's different/new.
                    # But file_uploader return value persists. 
                    # Let's rely on explicit action or specific session state for "last processed file".
                    
                    if 'last_uploaded_file' not in st.session_state or st.session_state.last_uploaded_file != resume_file.name:
                        with st.spinner("Extracting text from resume..."):
                            file_processor = FileProcessor()
                            extracted_text = file_processor.extract_text(resume_file)
                            st.session_state.resume_text = extracted_text
                            st.session_state.last_uploaded_file = resume_file.name
                            st.rerun() # Rerun to update the text area value
                except Exception as e:
                    st.error(f"Error processing resume: {str(e)}")

        # Job Description Section
        with col2:
            st.subheader("💼 Job Description")
            st.text_area(
                "Paste job description",
                value=st.session_state.job_desc,
                height=300,
                placeholder="Paste the job posting here...",
                key="job_desc_area",
                on_change=lambda: st.session_state.update({'job_desc': st.session_state.job_desc_area})
            )

def render_additional_info_section():
    """Render expandable additional information section."""
    with st.expander("📋 Additional Information (Optional)", expanded=False):
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Company Details")
            company_name = st.text_input("Company Name", key="company_name")
            hiring_manager = st.text_input("Hiring Manager's Name", key="hiring_manager")
            
            st.subheader("Your Contact Info")
            full_name = st.text_input("Full Name", key="full_name")
            email = st.text_input("Email Address", key="email")
            phone = st.text_input("Phone Number", key="phone")
        
        with col2:
            st.subheader("Details")
            location = st.text_input("Location (City, State)", key="location")
            linkedin = st.text_input("LinkedIn Profile", key="linkedin")
            referral = st.text_input("Referral Name", key="referral")
            
            st.subheader("Context")
            achievements = st.text_area(
                "Key Achievements/Skills to Highlight",
                height=100,
                key="achievements",
                help="Enter specific achievements or skills you want to emphasize"
            )
            custom_notes = st.text_area(
                "Additional Notes",
                height=100,
                key="custom_notes",
                help="Any other information to include"
            )

        # Update session state with all current values
        st.session_state.additional_info = {
            'company_name': company_name,
            'hiring_manager': hiring_manager,
            'full_name': full_name,
            'email': email,
            'phone': phone,
            'location': location,
            'linkedin': linkedin,
            'referral': referral,
            'achievements': achievements,
            'custom_notes': custom_notes
        }

def validate_inputs() -> bool:
    """Validate that required inputs are present."""
    if not st.session_state.resume_text.strip():
        st.error("Please provide your resume text or upload a file.")
        return False
    if not st.session_state.job_desc.strip():
        st.error("Please provide the job description.")
        return False
    return True

def handle_generate_cover_letter():
    """Handle cover letter generation."""
    if not validate_inputs():
        return
        
    with st.spinner("Generating tailored cover letter..."):
        try:
            generator = get_cover_letter_generator()
            cover_letter = generator.generate(
                resume=st.session_state.resume_text,
                job_description=st.session_state.job_desc,
                additional_info=st.session_state.additional_info
            )
            if cover_letter:
                st.session_state.generated_content['cover_letter'] = cover_letter
                st.success("Cover letter generated successfully")
        except ValueError as e:
            st.error(str(e))
        except Exception as e:
            st.error(f"Error generating cover letter: {str(e)}")

def handle_analyze_resume():
    """Handle resume analysis."""
    if not validate_inputs():
        return
        
    with st.spinner("Analyzing resume match..."):
        try:
            analyzer = get_resume_analyzer()
            analysis = analyzer.analyze(
                resume=st.session_state.resume_text,
                job_description=st.session_state.job_desc
            )
            if analysis:
                st.session_state.generated_content['analysis'] = analysis
                st.success("Analysis complete")
        except ValueError as e:
            st.error(str(e))
        except Exception as e:
            st.error(f"Error analyzing resume: {str(e)}")

def handle_quick_tips():
    """Handle quick tips generation."""
    if not validate_inputs():
        return
        
    with st.spinner("Generating quick tips..."):
        try:
            generator = get_cover_letter_generator()
            tips = generator.get_quick_improvements(
                resume=st.session_state.resume_text,
                job_description=st.session_state.job_desc
            )
            if tips:
                st.session_state.generated_content['tips'] = tips
                st.success("Tips generated")
        except ValueError as e:
            st.error(str(e))
        except Exception as e:
            st.error(f"Error generating tips: {str(e)}")

def render_action_buttons():
    """Render action buttons ("Generate", "Analyze", "Tips")."""
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("✨ Generate Cover Letter", type="primary", use_container_width=True):
            handle_generate_cover_letter()
    
    with col2:
        if st.button("🔍 Analyze Match", type="secondary", use_container_width=True):
            handle_analyze_resume()
            
    with col3:
        if st.button("💡 Quick Tips", type="secondary", use_container_width=True):
            handle_quick_tips()

def render_results_section():
    """Render the results in tabs."""
    if not st.session_state.generated_content:
        return

    st.markdown("### Results")
    tab1, tab2, tab3 = st.tabs(["📝 Cover Letter", "🎯 Resume Analysis", "💡 Quick Tips"])
    
    # Tab 1: Cover Letter
    with tab1:
        if 'cover_letter' in st.session_state.generated_content:
            content = st.session_state.generated_content['cover_letter']
            st.markdown(content)
            
            # Export Buttons
            st.markdown("#### Export options")
            col1, col2 = st.columns(2)
            with col1:
                if st.button("📄 Prepare DOCX Download"):
                    try:
                        temp_dir = Path("temp")
                        temp_dir.mkdir(exist_ok=True)
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        output_path = temp_dir / f"cover_letter_{timestamp}.docx"
                        
                        doc_path = create_cover_letter_docx(content, str(output_path))
                        
                        with open(doc_path, 'rb') as f:
                            st.download_button(
                                label="Download DOCX",
                                data=f,
                                file_name=f"cover_letter_{timestamp}.docx",
                                mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            )
                    except Exception as e:
                        st.error(f"Error preparing DOCX: {str(e)}")
            
            with col2:
                if st.button("📄 Prepare PDF Download"):
                    try:
                        temp_dir = Path("temp")
                        temp_dir.mkdir(exist_ok=True)
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        output_path = temp_dir / f"cover_letter_{timestamp}.pdf"
                        
                        # We use the existing function but need to be careful about its arguments
                        # convert_to_pdf takes (content, output_path) in one version found in export.py
                        # Wait, let's verify export.py signature again.
                        # line 15: def convert_to_pdf(content: str, output_path: str) -> str:
                        pdf_path = convert_text_to_pdf(content, str(output_path))
                        
                        with open(pdf_path, 'rb') as f:
                            st.download_button(
                                label="Download PDF",
                                data=f,
                                file_name=f"cover_letter_{timestamp}.pdf",
                                mime="application/pdf"
                            )
                    except Exception as e:
                        st.error(f"Error preparing PDF: {str(e)}")

        else:
            st.info("No cover letter generated yet.")

    # Tab 2: Analysis
    with tab2:
        if 'analysis' in st.session_state.generated_content:
            st.markdown(st.session_state.generated_content['analysis'])
        else:
            st.info("No analysis generated yet.")

    # Tab 3: Tips
    with tab3:
        if 'tips' in st.session_state.generated_content:
            st.markdown(st.session_state.generated_content['tips'])
        else:
            st.info("No tips generated yet.")

def render_main_page(sidebar_options: Optional[Dict] = None):
    """Main rendering function."""
    init_session_state()
    
    # Pass sidebar options if needed, or handle globally
    render_header()
    render_input_section()
    render_additional_info_section()
    render_action_buttons()
    render_results_section()