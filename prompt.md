I want to rebuild this Python Streamlit app as a modern Next.js 14 (App Router) + TypeScript application with a premium dark UI. Here's the full context:

What This App Does
Upload a resume (PDF/DOCX) or paste text
Paste a job description
Three modes: Analyze Match | Generate Cover Letter | Quick Tips
AI (Groq API, model: moonshotai/kimi-k2-instruct-0905) processes both inputs
Returns: match score (overall + skills/experience/keywords breakdown), AI suggestions, or a tailored cover letter
Export results as DOCX/PDF/TXT
Creativity level slider (maps to LLM temperature 0.0–1.0)
Tech Stack
Framework: Next.js 14 App Router
Language: TypeScript (strict mode)
Styling: Tailwind CSS + shadcn/ui
AI: Groq SDK (@groq/groq-sdk) — model: moonshotai/kimi-k2-instruct-0905
NLP/keyword extraction: done server-side in API routes using simple token matching (no spaCy, we're in JS now)
File parsing: pdf-parse for PDF, mammoth for DOCX
Export: docx npm package for DOCX export, jsPDF for PDF
State: Zustand for global app state
Animations: Framer Motion
Design System
Dark editorial aesthetic. Implement exactly this:

Background: #080A0C with subtle grid lines overlay (1px lines at 60px intervals, rgba white 0.015 opacity)
Surface: #0F1215, Surface2: #161B20
Border: #1E2530, Border glow: #2A9D8F
Accent (teal): #2A9D8F, Accent2 (gold): #E9C46A, Accent3 (coral): #E76F51
Text: #EAE8E3, Text muted: #5A6470, Text dim: #8A939E
Fonts: Syne (display, 400–800) + DM Mono (labels, metadata, values) + Instrument Serif (italic accents) — all from Google Fonts via next/font
Project Structure to Create
app/
layout.tsx — fonts, metadata, global styles
page.tsx — main app page
api/
analyze/route.ts — POST: resume + JD → match score + suggestions
cover-letter/route.ts — POST: resume + JD → cover letter text
quick-tips/route.ts — POST: resume text → improvement tips
parse-file/route.ts — POST: file upload → extracted text

components/
Hero.tsx — eyebrow + title with serif italic + subtitle
ModeSwitcher.tsx — three-button pill switcher (Analyze Match | Cover Letter | Quick Tips)
ResumeCard.tsx — drag-drop upload zone + paste textarea + file name display
JDCard.tsx — job description textarea
SettingsRow.tsx — creativity slider + export format select + status badge
ActionBar.tsx — primary CTA + two secondary buttons
OutputPanel.tsx — match score + three animated bars + suggestions list OR cover letter text
Navbar.tsx — logo with pulse dot + beta badge + loading indicator

lib/
groq.ts — Groq client singleton
fileParser.ts — pdf-parse + mammoth extraction logic
nlpUtils.ts — keyword extraction, skill matching, scoring logic
exporter.ts — DOCX + PDF export logic

store/
appStore.ts — Zustand store: mode, resumeText, jdText, creativity, exportFormat, output, loading

types/
index.ts — MatchResult, Suggestion, Mode, ExportFormat types

API Route Details
POST /api/parse-file
Accepts multipart form with file field
Returns { text: string }
Uses pdf-parse for .pdf, mammoth for .docx, plain read for .txt
POST /api/analyze
Body: { resumeText: string, jdText: string, creativity: number }
Server-side: run keyword matching with nlpUtils to get preliminary scores
Send to Groq with this system prompt structure:
"You are an expert ATS and resume analyst. Analyze the resume against the job description. Return a JSON object with: { overallScore: number (0-100), skillsScore: number, experienceScore: number, keywordsScore: number, suggestions: [{ priority: 'high'|'medium'|'low', text: string }] (max 6), missingKeywords: string[] }"
Temperature = creativity param
Return parsed JSON
POST /api/cover-letter
Body: { resumeText: string, jdText: string, creativity: number }
Groq prompt: generate a tailored professional cover letter, 3 paragraphs, no placeholder brackets, confident tone
Return { coverLetter: string }
POST /api/quick-tips
Body: { resumeText: string, creativity: number }
Groq prompt: return 5 specific, actionable resume improvement tips as JSON array of strings
Return { tips: string[] }
Component Behavior
ResumeCard
Drag-drop zone with dashed border (#1E2530), on hover border becomes #2A9D8F
On file drop: parse via /api/parse-file, populate store resumeText
Shows filename on success with teal checkmark
Below: divider "or paste text" + textarea
ModeSwitcher
Active button: bg #2A9D8F, text black, rounded-lg
Inactive: transparent, text muted, hover gets surface2 bg
Switching mode resets output state
SettingsRow
Creativity slider: custom styled, thumb is teal circle with glow
Status badge: cycles idle → processing → complete with color changes
OutputPanel
Hidden until analysis complete, animates in (slide up + fade)
Score badge: large number in Syne 800 weight, teal color
Three match bars: animate width from 0 to value on mount (CSS transition 1s cubic-bezier(0.16,1,0.3,1))
Skills bar = teal, Experience bar = gold, Keywords bar = coral
Suggestions: each item has colored priority dot + text, hover lifts border to teal
Cover letter mode: shows formatted text in mono font, copy button
ActionBar
Primary button (Analyze): full teal bg, black text, Syne bold, hover lifts with teal glow shadow
Secondary buttons: surface bg, border, hover tints to gold/teal respectively
Animations
Page load: hero fades up 0.6s, workspace 0.7s with 0.1s delay, stagger each card
Use Framer Motion for OutputPanel reveal and suggestion items staggered entrance
Navbar pulse dot: infinite 2s ease-in-out opacity pulse
Spinner in navbar during loading
Environment Variables
GROQ_API_KEY=

Additional Requirements
Mobile responsive: stack cards vertically below md breakpoint
No placeholder text like "[Your Name]" in generated cover letters — use "the applicant" or infer from resume
Error states: red border flash on empty submission, toast notification using sonner
Loading state blocks all buttons, shows spinner in nav
Copy to clipboard button on all text outputs
shadcn/ui components: use Button, Textarea, Select, Slider, Badge, Separator from shadcn
Add a subtle noise texture overlay (SVG filter, opacity 0.025) over the entire page
Dark scrollbar: thumb #2A9D8F, track #0F1215
Start by scaffolding the full project structure, then implement each file. Do not use placeholder comments — write complete working code for every file.
User uploaded media 1

Additional Features to Add
Mode 4: LaTeX Resume
Add a fourth mode button: "LaTeX Resume" to the ModeSwitcher
There is a file called resume.tex in the project root — this is the user's base LaTeX resume template. Read it at startup and store it in the Zustand store as baseLatexTemplate
In LaTeX mode: hide the upload zone, show only the JD textarea
On submit: send the base LaTeX template + JD to Groq with this instruction:
"You are an expert LaTeX resume writer. Given this base LaTeX resume and this job description, return ONLY the complete updated .tex file content with tailored bullet points, reordered sections, and keywords from the JD injected naturally. Do not change the LaTeX structure or preamble. Return raw LaTeX only, no markdown, no explanation."
Output panel in LaTeX mode shows:
A dark code block (monospace, syntax-highlighted with react-syntax-highlighter using atomOneDark theme) displaying the full .tex output
A large "Copy LaTeX" button (gold accent color #E9C46A) that copies the entire code to clipboard — user pastes directly into Overleaf
Below that: a green "Download .tex" button that saves the file
Inline Chat Panel
Below the OutputPanel, add a collapsible ChatPanel component
Trigger: a subtle button "✦ Refine with chat" that appears after any output is generated
When opened: slides down with Framer Motion (height animation)
UI: minimal chat interface — message history at top, input at bottom
Input: single textarea + send button (teal accent)
System context: the chat always has the current output (cover letter / LaTeX / suggestions) as context
User can say things like "make the first paragraph shorter" or "add more ML keywords" or "change the tone to be more confident"
Groq processes each message with the full output as context and returns the updated version
Updated output replaces the current OutputPanel content with a smooth fade transition
Chat history persists within the session (Zustand), resets on mode switch
Max 10 messages before showing "Start a new session" nudge
Chat messages styled: user messages right-aligned with teal bubble, AI responses left-aligned with surface2 bg
Hero Section Change
Remove the current text-only hero
New hero layout: full-width asymmetric split
Left 55%: headline + subtitle + mode switcher
Right 45%: a live animated "terminal" style preview card showing a fake resume analysis running (typewriter effect cycling through: "Parsing resume...", "Extracting keywords...", "Matching against JD...", "Score: 84% ↑", looping every 4s)
Headline: "Your resume,`<br/><em>`perfectly matched.`</em>`" — em tag uses Instrument Serif italic, gold color #E9C46A
Subtitle in DM Mono: "Paste your resume. Drop a JD. Get a match score, a tailored cover letter, and an Overleaf-ready LaTeX file in seconds."
The terminal card: dark surface (#0F1215), green-tinted monospace text (#2A9D8F), subtle scanline overlay, blinking cursor, Syne font for the score number
Store Updates (Zustand)
Add to appStore.ts:

mode: 'analyze' | 'cover' | 'tips' | 'latex'
baseLatexTemplate: string (loaded from resume.tex via API on mount)
latexOutput: string
chatHistory: { role: 'user' | 'assistant', content: string }[]
chatOpen: boolean
New API Routes
app/api/
latex/route.ts — POST: { jdText, baseLatex, creativity } → { latexCode: string }
chat/route.ts — POST: { messages, currentOutput, mode } → { reply: string, updatedOutput: string }
load-template/route.ts — GET: reads resume.tex from project root, returns { latex: string }

LaTeX API Prompt (groq.ts)
const LATEX_SYSTEM_PROMPT = `You are an expert LaTeX resume writer and ATS optimization specialist.
You will receive a base LaTeX resume and a job description.
Your task: return ONLY the complete modified .tex file.
Rules:

Keep all LaTeX commands, packages, and structure identical
Only modify the content inside sections (bullet points, summary, skills list)
Inject relevant keywords from the JD naturally
Reorder bullet points to lead with most relevant experience
Quantify achievements where possible based on existing content
Never add placeholder text or comments
Return raw LaTeX only — no markdown fences, no explanation`
Chat System Prompt
const CHAT_SYSTEM_PROMPT = You are a resume editing assistant. The user has just generated an output (cover letter, LaTeX resume, or analysis). You have the full current output as context. When the user asks for changes, return the complete updated output — not just the changed part. If the output is LaTeX, return raw LaTeX only. If the output is a cover letter, return the full letter. Be precise and make exactly the changes requested.
Go on and pls keep in mind of the existing logic and just change it
Improvise the ui and use prompts.py and resume_analyzer.py take theses in cosnodieration and change the prompt for the llm and make it ui more clean sleak and focus on usability
