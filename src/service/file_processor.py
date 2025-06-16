from typing import Optional, Union
from streamlit.runtime.uploaded_file_manager import UploadedFile
import PyPDF2
import docx2txt
import io
import streamlit as st

class FileProcessor:
    """Handles file processing and text extraction for various file formats."""
    
    def extract_text(self, file: UploadedFile) -> str:
        """
        Extract text from uploaded file based on file type.
        
        Args:
            file (UploadedFile): The uploaded file object
            
        Returns:
            str: Extracted text from the file
            
        Raises:
            Exception: If file processing fails
        """
        try:
            file_extension = file.name.lower().split('.')[-1]
            
            if file_extension == 'pdf':
                return self._extract_from_pdf(file)
            elif file_extension == 'docx':
                return self._extract_from_docx(file)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
                
        except Exception as e:
            raise Exception(f"Error extracting text: {str(e)}")

    def _extract_from_pdf(self, file: UploadedFile) -> str:
        """Extract text from PDF file."""
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")

    def _extract_from_docx(self, file: UploadedFile) -> str:
        """Extract text from DOCX file."""
        try:
            text = docx2txt.process(file)
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")

    @staticmethod
    def clean_text(text: str) -> str:
        """Clean extracted text by removing extra whitespace and normalizing line endings."""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Normalize line endings
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        return text.strip()