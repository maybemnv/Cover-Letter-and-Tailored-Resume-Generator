import streamlit as st
import sys
import os
from pathlib import Path

# Add project root to Python path
ROOT_DIR = Path(__file__).parent
sys.path.append(str(ROOT_DIR))

# Import project modules
from src.config.settings import APP_CONFIG
from src.ui.main_page import render_main_page
from src.ui.sidebar import render_sidebar
from src.utils.helpers import load_css

def main():
    """Main application entry point."""
    try:
        # Configure Streamlit page
        st.set_page_config(
            page_title=APP_CONFIG["page_title"],
            page_icon=APP_CONFIG["page_icon"],
            layout=APP_CONFIG["layout"],
            initial_sidebar_state=APP_CONFIG["initial_sidebar_state"]
        )

        # Load custom CSS
        css_path = ROOT_DIR / 'src' / 'assets' / 'styles.css'
        if css_path.exists():
            load_css(css_path)
        else:
            st.warning("CSS file not found. Using default styling.")

        # Initialize session state
        if 'generated_content' not in st.session_state:
            st.session_state.generated_content = {}
        
        if 'settings' not in st.session_state:
            st.session_state.settings = {}

        # Render UI components
        sidebar_options = render_sidebar()
        render_main_page(sidebar_options)

    except Exception as e:
        st.error(f"Application Error: {str(e)}")
        st.stop()

if __name__ == "__main__":
    main()