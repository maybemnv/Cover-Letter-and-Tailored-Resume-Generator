COVER_LETTER_PROMPT = """
You are an expert career counselor and professional writer. Create a compelling, personalized cover letter based on the following information:

RESUME:
{resume}

JOB DESCRIPTION:
{job_description}

ADDITIONAL INFORMATION:
{additional_info}

INSTRUCTIONS:
1. Write a professional cover letter that specifically addresses the job requirements
2. Highlight relevant skills and experiences from the resume that match the job
3. Use a professional but engaging tone
4. Keep it concise (3-4 paragraphs maximum)
5. Include specific examples from the resume when possible
6. Show enthusiasm for the role and company
7. End with a strong call to action
8. Feels personalized and tailored
9. Reflects a confident, warm tone
10. Avoids generic phrases
11. Emphasizes relevant experience & passion
FORMAT:
- Start with proper business letter format (Dear Hiring Manager or specific name if provided)
- Opening paragraph: Hook and position applied for
- Body paragraph(s): Relevant qualifications and achievements
- Closing paragraph: Enthusiasm and next steps
- Professional closing (Sincerely, Best regards, etc.)

Make the cover letter sound natural and authentic, not generic or template-like.
"""

RESUME_ANALYSIS_PROMPT = """
You are an expert resume reviewer and career coach. Analyze the following resume against the job description and provide detailed, actionable feedback.

RESUME:
{resume}

JOB DESCRIPTION:
{job_description}

ANALYSIS REQUIREMENTS:
Provide a comprehensive analysis with the following sections:

1. **OVERALL MATCH SCORE** (1-10 scale)
   - Rate how well the resume matches the job requirements
   - Brief explanation of the score

2. **STRENGTHS**
   - What the resume does well for this position
   - Strong points that align with job requirements
   - Impressive achievements or experiences

3. **GAPS & WEAKNESSES**
   - Missing skills or experiences mentioned in the job description
   - Areas where the resume could be stronger
   - Content that doesn't add value for this position

4. **SPECIFIC IMPROVEMENTS**
   - Concrete suggestions for resume content changes
   - Keywords to add based on the job description
   - Skills or experiences to emphasize more
   - Sections that need strengthening

5. **KEYWORD OPTIMIZATION**
   - Important keywords from the job description missing from resume
   - Suggested phrases to incorporate naturally
   - ATS (Applicant Tracking System) optimization tips

6. **FORMATTING & STRUCTURE SUGGESTIONS**
   - Layout and organization improvements
   - Section ordering recommendations
   - Content prioritization advice

7. **ACTION ITEMS**
   - Prioritized list of changes to make
   - Quick wins vs. long-term improvements
8. **ATS FRIENDLY RESUME**
   - Return a new ATS-friendly version of the resume on the basis of the analysis
   - Ensure the format is simple, with clear headings and bullet points
   - Follow the whole analysis to ensure it is tailored to the job description

Be specific, actionable, and constructive. Focus on helping the candidate improve their chances of getting an interview.
"""

QUICK_TIPS_PROMPT = """
Based on this resume and job description, provide 5 quick, actionable tips to improve the application:

RESUME: {resume}
JOB DESCRIPTION: {job_description}

Provide exactly 7 bullet points with specific, actionable advice. Keep each tip under 50 words and focus on practical suggestions.
And a new ATS friendly format for the resume and summary for the Job Description.
"""

SKILLS_EXTRACTION_PROMPT = """
Extract and categorize the key skills from this resume:

RESUME: {resume}

Categorize skills into:
- Technical Skills
- Soft Skills  
- Industry-Specific Skills
- Certifications/Qualifications

Return as a structured list with each category clearly labeled.
"""