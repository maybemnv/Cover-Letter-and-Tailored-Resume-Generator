"""
Export utilities for generating document files.
"""

from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
import pdfkit
from typing import Dict, Any, Optional, List  # Added List import
from datetime import datetime
import os
from io import BytesIO

class ExportManager:
    """Manages document export operations."""
    
    def __init__(self):
        self.doc = None
    
    def export_to_docx(self, content: str, doc_type: str) -> Optional[bytes]:
        """
        Export content to DOCX format.
        
        Args:
            content (str): Content to export
            doc_type (str): Type of document ('cover_letter' or 'resume')
            
        Returns:
            bytes: DOCX file as bytes or None if failed
        """
        try:
            doc = Document()
            
            # Configure document
            sections = doc.sections
            for section in sections:
                section.top_margin = Inches(1)
                section.bottom_margin = Inches(1)
                section.left_margin = Inches(1)
                section.right_margin = Inches(1)
            
            # Add content
            doc.add_paragraph(content)
            
            # Save to bytes
            docx_bytes = BytesIO()
            doc.save(docx_bytes)
            docx_bytes.seek(0)
            
            return docx_bytes.getvalue()
            
        except Exception as e:
            print(f"Error exporting to DOCX: {str(e)}")
            return None
    
    def export_to_pdf(self, content: str) -> Optional[bytes]:
        """
        Export content to PDF format.
        
        Args:
            content (str): Content to export
            
        Returns:
            bytes: PDF file as bytes or None if failed
        """
        try:
            # Create temporary HTML file
            with open('temp.html', 'w', encoding='utf-8') as f:
                f.write(f"<html><body>{content}</body></html>")
            
            # Convert to PDF
            pdf_bytes = BytesIO()
            pdfkit.from_file('temp.html', pdf_bytes)
            
            # Clean up
            os.remove('temp.html')
            
            return pdf_bytes.getvalue()
            
        except Exception as e:
            print(f"Error exporting to PDF: {str(e)}")
            return None

def create_cover_letter_docx(content: Dict[str, str], output_path: str) -> bool:
    """
    Create a formatted cover letter DOCX file.
    
    Args:
        content (Dict[str, str]): Cover letter content and metadata
        output_path (str): Path to save the document
    
    Returns:
        bool: Success status
    """
    try:
        doc = Document()
        
        # Set margins
        sections = doc.sections
        for section in sections:
            section.top_margin = Inches(1)
            section.bottom_margin = Inches(1)
            section.left_margin = Inches(1)
            section.right_margin = Inches(1)
        
        # Add sender's information
        for info in [content.get('name', ''), 
                    content.get('address', ''),
                    content.get('email', ''),
                    content.get('phone', '')]:
            if info:
                p = doc.add_paragraph()
                p.add_run(info).bold = True
        
        # Add date
        doc.add_paragraph()
        doc.add_paragraph(datetime.now().strftime('%B %d, %Y'))
        
        # Add recipient's information
        doc.add_paragraph()
        for info in [content.get('recipient_name', ''),
                    content.get('company_name', ''),
                    content.get('company_address', '')]:
            if info:
                doc.add_paragraph(info)
        
        # Add salutation
        doc.add_paragraph()
        doc.add_paragraph(content.get('salutation', 'Dear Hiring Manager,'))
        
        # Add body
        doc.add_paragraph()
        doc.add_paragraph(content.get('body', ''))
        
        # Add closing
        doc.add_paragraph()
        doc.add_paragraph(content.get('closing', 'Sincerely,'))
        doc.add_paragraph()
        doc.add_paragraph(content.get('name', ''))
        
        # Save document
        doc.save(output_path)
        return True
        
    except Exception as e:
        print(f"Error creating DOCX: {str(e)}")
        return False

def convert_to_pdf(docx_path: str, pdf_path: str) -> bool:
    """
    Convert DOCX to PDF using pdfkit.
    
    Args:
        docx_path (str): Path to source DOCX file
        pdf_path (str): Path to save PDF file
    
    Returns:
        bool: Success status
    """
    try:
        # Convert DOCX to HTML first (simplified approach)
        os.system(f'pandoc -f docx -t html "{docx_path}" -o temp.html')
        
        # Convert HTML to PDF
        pdfkit.from_file('temp.html', pdf_path)
        
        # Clean up temporary file
        os.remove('temp.html')
        return True
        
    except Exception as e:
        print(f"Error converting to PDF: {str(e)}")
        return False

def export_resume_docx(content: Dict[str, Any], output_path: str) -> bool:
    """
    Create a formatted resume DOCX file.
    
    Args:
        content (Dict[str, Any]): Resume content and sections
        output_path (str): Path to save the document
    
    Returns:
        bool: Success status
    """
    try:
        doc = Document()
        
        # Add name and contact info
        name = doc.add_paragraph()
        name.alignment = WD_ALIGN_PARAGRAPH.CENTER
        name.add_run(content.get('name', '')).bold = True
        
        contact = doc.add_paragraph()
        contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
        contact.add_run(f"{content.get('email', '')} | {content.get('phone', '')}")
        
        # Add sections
        for section in content.get('sections', []):
            # Add section heading
            doc.add_paragraph()
            heading = doc.add_paragraph()
            heading.add_run(section['title'].upper()).bold = True
            
            # Add section content
            if isinstance(section['content'], list):
                for item in section['content']:
                    p = doc.add_paragraph(item, style='List Bullet')
            else:
                doc.add_paragraph(section['content'])
        
        # Save document
        doc.save(output_path)
        return True
        
    except Exception as e:
        print(f"Error creating resume DOCX: {str(e)}")
        return False

def generate_exports(content: Dict[str, Any], base_filename: str, formats: List[str]) -> Dict[str, str]:
    """
    Generate exports in specified formats.
    
    Args:
        content: Dictionary containing document content
        base_filename: Base name for output files
        formats: List of formats to generate ("DOCX", "PDF", or "Both")
    
    Returns:
        Dictionary with paths to generated files
    """
    results = {}
    
    try:
        # Create temp directory if it doesn't exist
        temp_dir = Path("temp")
        temp_dir.mkdir(exist_ok=True)
        
        # Generate DOCX
        if "DOCX" in formats or "Both" in formats:
            docx_path = temp_dir / f"{base_filename}.docx"
            create_cover_letter_docx(content, str(docx_path))
            results["docx"] = str(docx_path)
        
        # Generate PDF
        if "PDF" in formats or "Both" in formats:
            pdf_path = temp_dir / f"{base_filename}.pdf"
            if "docx" in results:
                convert_to_pdf(results["docx"], str(pdf_path))
            results["pdf"] = str(pdf_path)
        
        return results
    
    except Exception as e:
        print(f"Error generating exports: {str(e)}")
        return {}