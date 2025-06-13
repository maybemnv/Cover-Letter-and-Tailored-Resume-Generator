import streamlit as st
import openai

openai.api_key = st.secrets["OPENAI_API_KEY"]

def generate_documents(resume_text, jd_text):
    prompt = f"""You are a resume and cover letter assistant...
'''You are a helpful assistant that writes professional cover letters and updates resumes to match job descriptions. 
Given this resume: {resume_text}
And this job description: {jd_text}
Generate a tailored cover letter. Then suggest bullet-point updates to make the resume align with the JD.'''
"""
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response['choices'][0]['message']['content']

st.title("🔥 Auto Cover Letter & Resume Tailor")

resume = st.text_area("Paste your Resume here")
jd = st.text_area("Paste Job Description here")

if st.button("Generate CL & Resume Edits"):
    output = generate_documents(resume, jd)
    st.markdown("### ✍️ Cover Letter & Resume Suggestions")
    st.text_area("Output", value=output, height=500)
