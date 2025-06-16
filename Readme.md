# Cover Letter and Tailored Resume Generator

## 🚀 Project Overview
The **Cover Letter and Tailored Resume Generator** is a Streamlit-based application designed to help users create professional cover letters and analyze resumes against job descriptions. It leverages AI-powered tools to provide tailored suggestions, quick tips, and exportable results.

---

## 🛠 Features
- **Resume Upload**: Upload your resume in PDF or DOCX format.
- **Job Description Input**: Paste job descriptions directly from job postings.
- **Cover Letter Generation**: Generate tailored cover letters using AI.
- **Resume Analysis**: Analyze your resume against job descriptions and get match scores.
- **Quick Tips**: Receive actionable improvement suggestions for your resume.
- **Export Options**: Save generated content as DOCX or PDF files.
- **Interactive UI**: User-friendly interface with expandable sections and progress indicators.

---

## 🖥️ Installation

### Prerequisites
- Python 3.8 or higher
- Streamlit
- Required Python libraries (see `requirements.txt`)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cover-letter-generator.git
   cd cover-letter-generator
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Download the spaCy model:
   ```bash
   python -m spacy download en_core_web_sm
   ```

4. Run the application:
   ```bash
   streamlit run main.py
   ```

---

## 🛠 Technologies Used
- **Streamlit**: Interactive web application framework
- **Python**: Core programming language
- **PyPDF2**: PDF text extraction
- **docx2txt**: DOCX text extraction
- **spaCy**: Natural Language Processing for resume analysis
- **pdfkit**: PDF generation
- **Custom CSS**: UI styling

---

## 📄 Usage
1. **Upload Resume**: Upload your resume in PDF or DOCX format.
2. **Paste Job Description**: Copy and paste the job description from the job posting.
3. **Generate Cover Letter**: Click the "Generate Cover Letter" button to create a tailored cover letter.
4. **Analyze Resume**: Click "Analyze Match" to get a match score and improvement suggestions.
5. **Quick Tips**: Click "Quick Tips" for actionable resume improvement suggestions.
6. **Export Results**: Save generated content as DOCX or PDF files.

---

## 📂 Export Options
- **DOCX**: Download your cover letter or resume analysis as a Word document.
- **PDF**: Save your content as a PDF file.

---

## 🛡️ Validation
- Resume upload supports **PDF** and **DOCX** formats only.
- Job description input requires text (copy-paste).
- File size limit: **5MB**.

---

## 📖 Future Enhancements
- Add support for additional file formats.
- Improve AI prompts for better content generation.
- Add user authentication for saving progress.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📧 Contact
For questions or feedback, reach out to [manvakauahal99@gmail.com](mailto:manvakauahal99@gmail.com).

---

## 📝 License
This project is licensed under the MIT License.