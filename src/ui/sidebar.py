import streamlit as st

def render_sidebar():
    """Render the sidebar navigation and options."""
    with st.sidebar:
        st.title("⚙️ Options")
        
        # Mode Selection
        mode = st.radio(
            "Select Mode",
            ["Cover Letter Generator", "Resume Analyzer", "Quick Tips"]
        )
        
        # AI Model Settings
        st.subheader("AI Settings")
        temperature = st.slider(
            "Creativity Level",
            min_value=0.0,
            max_value=1.0,
            value=0.7,
            help="Higher values make the output more creative but less focused"
        )
        
        # Export Options
        st.subheader("Export Format")
        export_format = st.selectbox(
            "Choose format",
            ["DOCX", "PDF", "Both"]
        )
        
        return {
            "mode": mode,
            "temperature": temperature,
            "export_format": export_format
        }