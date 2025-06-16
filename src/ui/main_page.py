import streamlit as st
from typing import Dict,List,Tuple,Optional
from datetime import datetime
from pathlib import Path
import base64
import tempfile
import pdfkit
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
    # Additional Information Section
    with st.expander("📋 Additional Information", expanded=False):
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Company Details")
            company_name = st.text_input("Company Name", key="company_name")
            hiring_manager = st.text_input("Hiring Manager's Name", key="hiring_manager")
            
            st.subheader("Your Contact Info")
            full_name = st.text_input("Full Name", key="full_name")
            email = st.text_input("Email Address", key="email")
            phone = st.text_input("Phone Number", key="phone")
            location = st.text_input("Location (City, State)", key="location")
            linkedin = st.text_input("LinkedIn Profile (optional)", key="linkedin")
        
        with col2:
            st.subheader("Additional Context")
            referral = st.text_input("Referral Name (if any)", key="referral")
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
                help="Any other information you'd like to include"
            )

    # Store additional info in session state
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
    
    # Horizontal line for visual separation
    st.markdown("---")
    
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

    # Display results if available
    if st.session_state.get('generated_content'):
        st.markdown("### Results")
        tab1, tab2, tab3 = st.tabs(["📝 Cover Letter", "🎯 Resume Analysis", "💡 Quick Tips"])
        
        # Cover Letter Tab
        with tab1:
            if 'cover_letter' in st.session_state.generated_content:
                st.markdown(st.session_state.generated_content['cover_letter'])
                
                col1, col2 = st.columns(2)
                with col1:
                    if st.button("Export to DOCX", key="export_docx"):
                        try:
                            temp_dir = Path("temp")
                            temp_dir.mkdir(exist_ok=True)
                            
                            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                            output_path = temp_dir / f"cover_letter_{timestamp}.docx"
                            
                            # Pass the content directly as a string
                            cover_letter_content = st.session_state.generated_content['cover_letter']
                            doc_path = create_cover_letter_docx(
                                content=cover_letter_content,
                                output_path=str(output_path)
                            )
                            
                            with open(doc_path, 'rb') as f:
                                docx_bytes = f.read()
                            st.download_button(
                                label="Download DOCX",
                                data=docx_bytes,
                                file_name=f"cover_letter_{timestamp}.docx",
                                mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            )
                            output_path.unlink(missing_ok=True)
                        except Exception as e:
                            st.error(f"Error creating DOCX: {str(e)}")
                
                with col2:
                    if st.button("Export to PDF", key="export_pdf"):
                        try:
                            # Create temp directory if it doesn't exist
                            temp_dir = Path("temp")
                            temp_dir.mkdir(exist_ok=True)
                            
                            # Generate unique filename using timestamp
                            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                            output_path = temp_dir / f"cover_letter_{timestamp}.pdf"
                            
                            pdf_path = convert_to_pdf(
                                st.session_state.generated_content['cover_letter'],
                                str(output_path)
                            )
                            with open(pdf_path, 'rb') as f:
                                pdf_bytes = f.read()
                            st.download_button(
                                label="Download PDF",
                                data=pdf_bytes,
                                file_name=f"cover_letter_{timestamp}.pdf",
                                mime="application/pdf"
                            )
                            # Clean up temp file
                            output_path.unlink(missing_ok=True)
                        except Exception as e:
                            st.error(f"Error exporting to PDF: {str(e)}")
            else:
                st.info("Generate a cover letter to see it here!")

        # Resume Analysis Tab
        with tab2:
            if 'analysis' in st.session_state.generated_content:
                st.markdown(st.session_state.generated_content['analysis'])
            else:
                st.info("Analyze your resume to see insights here!")

        # Quick Tips Tab
        with tab3:
            if 'tips' in st.session_state.generated_content:
                st.markdown(st.session_state.generated_content['tips'])
            else:
                st.info("Generate quick tips to see suggestions here!")

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
    """Render additional information inputs."""
    st.markdown("#### Additional Information")
    
    # Company Information
    company_name = st.text_input("Company Name", key="company_name")
    hiring_manager = st.text_input("Hiring Manager's Name (if known)", key="hiring_manager")
    
    # Contact Information
    with st.expander("Your Contact Information"):
        full_name = st.text_input("Full Name", key="full_name")
        email = st.text_input("Email Address", key="email")
        phone = st.text_input("Phone Number", key="phone")
        location = st.text_input("Location (City, State)", key="location")
        linkedin = st.text_input("LinkedIn Profile (optional)", key="linkedin")
    
    # Additional Context
    with st.expander("Additional Context"):
        referral = st.text_input("Referral Name (if any)", key="referral")
        specific_achievements = st.text_area(
            "Specific achievements/skills to highlight",
            key="achievements"
        )
        custom_notes = st.text_area(
            "Additional notes or requirements",
            key="custom_notes"
        )
    
    # Store all additional info in session state
    st.session_state.additional_info = {
        'company_name': company_name,
        'hiring_manager': hiring_manager,
        'full_name': full_name,
        'email': email,
        'phone': phone,
        'location': location,
        'linkedin': linkedin,
        'referral': referral,
        'achievements': specific_achievements,
        'custom_notes': custom_notes
    }


def render_results_section(generated_content: Dict):
    """Render the results section with tabbed layout."""
    
    if not generated_content:
        return

    # Create tabs for different content sections
    tab1, tab2, tab3 = st.tabs(["📝 Cover Letter", "🎯 Resume Analysis", "💡 Quick Tips"])
    
    # Cover Letter Tab
    with tab1:
        if 'cover_letter' in st.session_state.generated_content:
            st.markdown(st.session_state.generated_content['cover_letter'])
            
            col1, col2 = st.columns(2)
            with col1:
                try:
                    # Create temp file and get bytes for DOCX
                    with tempfile.NamedTemporaryFile(suffix='.docx', delete=False) as tmp_docx:
                        doc_path = create_cover_letter_docx(
                            st.session_state.generated_content['cover_letter'],
                            tmp_docx.name
                        )
                        with open(doc_path, 'rb') as f:
                            docx_bytes = f.read()
                        
                    # Direct download button for DOCX
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    st.download_button(
                        label="📄 Download DOCX",
                        data=docx_bytes,
                        file_name=f"cover_letter_{timestamp}.docx",
                        mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        use_container_width=True
                    )
                    
                    # Cleanup temp file
                    Path(doc_path).unlink(missing_ok=True)
                except Exception as e:
                    st.error(f"Error creating DOCX: {str(e)}")
            
            with col2:
                try:
                    # Create temp file and get bytes for PDF
                    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp_pdf:
                        pdf_path = convert_to_pdf(
                            st.session_state.generated_content['cover_letter'],
                            tmp_pdf.name
                        )
                        with open(pdf_path, 'rb') as f:
                            pdf_bytes = f.read()
                        
                    # Direct download button for PDF
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    st.download_button(
                        label="📄 Download PDF",
                        data=pdf_bytes,
                        file_name=f"cover_letter_{timestamp}.pdf",
                        mime="application/pdf",
                        use_container_width=True
                    )
                    
                    # Cleanup temp file
                    Path(pdf_path).unlink(missing_ok=True)
                except Exception as e:
                    st.error(f"Error creating PDF: {str(e)}")
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
    """Generate cover letter using all available information."""
    generator = get_cover_letter_generator()
    
    # Get additional info from session state
    additional_info = st.session_state.get('additional_info', {})
    
    # Create context dictionary
    context = {
        'resume_text': st.session_state.resume_text,
        'job_description': st.session_state.job_desc,
        **additional_info  # Unpack all additional info
    }
    
    try:
        cover_letter = generator.generate(context)
        if cover_letter:
            st.session_state.generated_content['cover_letter'] = cover_letter
            return cover_letter
    except Exception as e:
        st.error(f"Error generating cover letter: {str(e)}")
        return None

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