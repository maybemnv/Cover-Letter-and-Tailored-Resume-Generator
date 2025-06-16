import streamlit as st
from typing import Dict,List,Tuple,Optional
from datetime import datetime
from pathlib import Path
import base64
from .sidebar import render_sidebar
from ..service.file_processor import FileProcessor
from ..service.cover_letter_generation import get_cover_letter_generator
from ..service.resume_analyzer import get_resume_analyzer
from ..utils.export import ExportManager, create_cover_letter_docx, convert_to_pdf, export_resume_docx
from .components import (
    render_header, render_input_section, render_results_section,
    render_analysis_section, show_success_message, show_error_message
)                     
def render_main_page(sidebar_options: Optional[Dict] = None):
    """Render the main page content with input handling and validation."""
    options = sidebar_options or render_sidebar()
    
    # Initialize session state if not exists
    if 'resume_text' not in st.session_state:
        st.session_state.resume_text = None
    if 'job_desc' not in st.session_state:
        st.session_state.job_desc = None
    if 'generated_content' not in st.session_state:
        st.session_state.generated_content = {}
    
    st.title("🚀 Smart Resume & Cover Letter Generator")
    
    # Input Section
    with st.container():
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📄 Resume")
            resume_file = st.file_uploader(
                "Upload your resume",
                type=["pdf", "docx"],
                help="Upload your resume in PDF or DOCX format"
            )
            
            if resume_file:
                try:
                    file_processor = FileProcessor()
                    resume_text = file_processor.extract_text(resume_file)
                    st.session_state.resume_text = resume_text  # Store in session state
                    st.success("Resume uploaded successfully!")
                    with st.expander("Preview Resume Content"):
                        st.text(resume_text[:500] + "..." if len(resume_text) > 500 else resume_text)
                except Exception as e:
                    st.error(f"Error processing resume: {str(e)}")
        
        with col2:
            st.subheader("💼 Job Description")
            job_desc = st.text_area(
                "Paste job description",
                height=300,
                placeholder="Paste the job posting here..."
            )
            if job_desc:
                st.session_state.job_desc = job_desc  # Store in session state
    
    # Action Buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("✨ Generate Cover Letter", type="primary", use_container_width=True):
            if st.session_state.resume_text is None:
                st.error("Please upload your resume")
            elif not st.session_state.job_desc:
                st.error("Please provide the job description")
            else:
                with st.spinner("Generating cover letter..."):
                    generator = get_cover_letter_generator()
                    cover_letter = generator.generate(
                        st.session_state.resume_text,
                        st.session_state.job_desc
                    )
                    if cover_letter:
                        st.session_state.generated_content['cover_letter'] = cover_letter
                        st.success("Cover letter generated successfully!")
                        st.markdown(cover_letter)
    
    with col2:
        if st.button("🔍 Analyze Match", type="secondary", use_container_width=True):
            if st.session_state.resume_text is None:
                st.error("Please upload your resume")
            elif not st.session_state.job_desc:
                st.error("Please provide the job description")
            else:
                with st.spinner("Analyzing resume..."):
                    analyzer = get_resume_analyzer()
                    analysis = analyzer.analyze(
                        st.session_state.resume_text,
                        st.session_state.job_desc
                    )
                    if analysis:
                        st.session_state.generated_content['analysis'] = analysis
                        st.success("Analysis complete!")
                        st.markdown(analysis)
    
    with col3:
        if st.button("💡 Quick Tips", type="secondary", use_container_width=True):
            if st.session_state.resume_text is None:
                st.error("Please upload your resume")
            elif not st.session_state.job_desc:
                st.error("Please provide the job description")
            else:
                with st.spinner("Generating tips..."):
                    generator = get_cover_letter_generator()
                    tips = generator.get_quick_improvements(
                        st.session_state.resume_text,
                        st.session_state.job_desc
                    )
                    if tips:
                        st.session_state.generated_content['tips'] = tips
                        st.success("Tips generated!")
                        st.markdown(tips)

    # Display results if available
    if st.session_state.get('generated_content'):
        render_results_section(st.session_state.generated_content)

def render_input_section() -> Tuple[str, str]:
    """
    Render the input section for resume upload and job description text.
    Returns:
        Tuple[str, str]: Resume text and job description text
    """
    resume_text = ""
    job_desc = ""
    
    with st.container():
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📄 Resume")
            resume_file = st.file_uploader(
                "Upload your resume",
                type=["pdf", "docx"],
                help="Upload your resume in PDF or DOCX format"
            )
            
            if resume_file:
                try:
                    file_processor = FileProcessor()
                    resume_text = file_processor.extract_text(resume_file)
                    st.success("Resume uploaded successfully!")
                    with st.expander("Preview Resume Content"):
                        st.text(resume_text)
                except Exception as e:
                    st.error(f"Error processing resume: {str(e)}")
        
        with col2:
            st.subheader("💼 Job Description")
            job_desc = st.text_area(
                "Paste job description",
                height=300,
                placeholder="Paste the job posting here...",
                help="Copy and paste the complete job description"
            )

    # Action buttons below inputs
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("✨ Generate Cover Letter", type="primary", use_container_width=True):
            if validate_inputs(resume_text, job_desc):
                with st.spinner("Generating cover letter..."):
                    generate_cover_letter()
    
    with col2:
        if st.button("🔍 Analyze Match", type="secondary", use_container_width=True):
            if validate_inputs(resume_text, job_desc):
                with st.spinner("Analyzing resume..."):
                    analyze_resume()
    
    with col3:
        if st.button("💡 Quick Tips", type="secondary", use_container_width=True):
            if validate_inputs(resume_text, job_desc):
                with st.spinner("Generating tips..."):
                    get_quick_tips()
    
    return resume_text, job_desc

def render_file_input():
    """Render file upload interface."""
    
    st.markdown("#### Upload Resume")
    resume_file = st.file_uploader(
        "Choose your resume file",
        type=['pdf', 'docx', 'txt'],
        key="resume_file"
    )
    
    if resume_file:
        with st.spinner("Processing resume..."):
            resume_content = FileProcessor.process_file(resume_file, "resume")
            if resume_content:
                st.session_state.resume_content = resume_content
                st.success("✅ Resume processed successfully!")
            else:
                st.error("❌ Failed to process resume file")
    
    st.markdown("#### Upload Job Description")
    job_file = st.file_uploader(
        "Choose job description file",
        type=['pdf', 'docx', 'txt'],
        key="job_file"
    )
    
    if job_file:
        with st.spinner("Processing job description..."):
            job_content = FileProcessor.process_file(job_file, "job_description")
            if job_content:
                st.session_state.job_desc_content = job_content
                st.success("✅ Job description processed successfully!")
            else:
                st.error("❌ Failed to process job description file")

def render_additional_info():
    """Render additional information input."""
    
    with st.expander("⚙️ Additional Information (Optional)"):
        
        col1, col2 = st.columns(2)
        
        with col1:
            company_name = st.text_input("Company Name", key="company_name")
            hiring_manager = st.text_input("Hiring Manager Name", key="hiring_manager")
        
        with col2:
            position_title = st.text_input("Position Title", key="position_title")
            salary_range = st.text_input("Salary Range", key="salary_range")
        
        special_instructions = st.text_area(
            "Special Instructions or Notes",
            placeholder="Any specific requirements or points to emphasize...",
            key="special_instructions"
        )
        
        # Store additional info in session state
        st.session_state.additional_info = {
            "company_name": company_name,
            "hiring_manager": hiring_manager,
            "position_title": position_title,
            "salary_range": salary_range,
            "special_instructions": special_instructions
        }


def render_results_section(generated_content: Dict):
    """Render the results section with tabbed layout."""
    
    if not generated_content:
        return

    # Create tabs for different content sections
    tab1, tab2, tab3 = st.tabs(["📝 Cover Letter", "🎯 Resume Analysis", "💡 Quick Tips"])
    
    # Cover Letter Tab
    with tab1:
        if 'cover_letter' in generated_content:
            st.markdown(generated_content['cover_letter'])
            
            col1, col2 = st.columns(2)
            with col1:
                # Export to DOCX
                if st.button("Export to DOCX", key="export_docx"):
                    try:
                        doc_path = create_cover_letter_docx(generated_content['cover_letter'])
                        with open(doc_path, 'rb') as f:
                            docx_bytes = f.read()
                        st.download_button(
                            label="Download DOCX",
                            data=docx_bytes,
                            file_name="cover_letter.docx",
                            mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        )
                    except Exception as e:
                        st.error(f"Error exporting to DOCX: {str(e)}")
            
            with col2:
                # Export to PDF
                if st.button("Export to PDF", key="export_pdf"):
                    try:
                        pdf_path = convert_to_pdf(generated_content['cover_letter'])
                        with open(pdf_path, 'rb') as f:
                            pdf_bytes = f.read()
                        st.download_button(
                            label="Download PDF",
                            data=pdf_bytes,
                            file_name="cover_letter.pdf",
                            mime="application/pdf"
                        )
                    except Exception as e:
                        st.error(f"Error exporting to PDF: {str(e)}")
        else:
            st.info("Generate a cover letter to see it here!")

    # Resume Analysis Tab  
    with tab2:
        if 'analysis' in generated_content:
            st.markdown(generated_content['analysis'])
        else:
            st.info("Analyze your resume to see insights here!")

    # Quick Tips Tab
    with tab3:
        if 'tips' in generated_content:
            st.markdown(generated_content['tips'])
        else:
            st.info("Generate quick tips to see suggestions here!")

# Remove or comment out the other render_* functions that are duplicating functionality

def generate_cover_letter():
    """Generate cover letter using the AI service."""
    
    if not validate_inputs():
        return
    
    generator = get_cover_letter_generator()
    
    cover_letter = generator.generate(
        resume=st.session_state.resume_content,
        job_description=st.session_state.job_desc_content,
        additional_info=st.session_state.get('additional_info', {})
    )
    
    if cover_letter:
        st.session_state.generated_content['cover_letter'] = cover_letter
        st.rerun()

def analyze_resume():
    """Analyze resume using the AI service."""
    
    if not validate_inputs():
        return
    
    analyzer = get_resume_analyzer()
    
    analysis = analyzer.analyze(
        resume=st.session_state.resume_content,
        job_description=st.session_state.job_desc_content
    )
    
    if analysis:
        st.session_state.generated_content['analysis'] = analysis
        st.rerun()

def get_quick_tips():
    """Get quick improvement tips."""
    
    if not validate_inputs():
        return
    
    generator = get_cover_letter_generator()
    
    tips = generator.get_quick_improvements(
        resume=st.session_state.resume_content,
        job_description=st.session_state.job_desc_content
    )
    
    if tips:
        st.session_state.generated_content['tips'] = tips
        st.rerun()

def validate_inputs(resume_text: str = "", job_desc: str = "") -> bool:
    """Validate that required inputs are provided."""
    
    if not resume_text and (not hasattr(st.session_state, 'resume_content') or not st.session_state.resume_content):
        st.error("Please provide your resume content")
        return False
    
    if not job_desc and (not hasattr(st.session_state, 'job_desc_content') or not st.session_state.job_desc_content):
        st.error("Please provide the job description")
        return False
    
    return True