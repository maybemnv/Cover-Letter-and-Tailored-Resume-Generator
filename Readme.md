<div align="center">
  <img src="public/globe.svg" alt="Logo" width="80" height="80">
  <h1 align="center">ResumeAI: Intelligent Resume & Cover Letter Generator</h1>

  <p align="center">
    A premium, AI-powered toolkit to analyze resumes, tailor cover letters, and generate ATS-optimized LaTeX exports.
    <br />
    <a href="#-features"><strong>Explore Features »</strong></a>
    <br />
    <br />
    <a href="https://github.com/yourusername/resume-ai">View Demo</a>
    ·
    <a href="https://github.com/yourusername/resume-ai/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/resume-ai/issues">Request Feature</a>
  </p>
</div>

---

<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-about-the-project">About The Project</a></li>
    <li><a href="#-tech-stack">Tech Stack</a></li>
    <li><a href="#-features">Features</a></li>
    <li><a href="#-getting-started">Getting Started</a></li>
    <li><a href="#-project-structure">Project Structure</a></li>
    <li><a href="#-license">License</a></li>
  </ol>
</details>

## 🚀 About The Project

ResumeAI is a modern, ultra-premium web application designed to help job seekers bypass ATS (Applicant Tracking Systems) and impress recruiters. It deeply analyzes your resume against a specific job description using cutting-edge NLP and LLMs to provide actionable insights, tailored cover letters, and exportable artifacts.

### 🎨 Design Philosophy

- **Glassmorphism & Dark Mode**: A stunning, immersive dark theme with frosted glass panels, subtle glows, and responsive styling.
- **Fluid Animations**: Meaningful micro-interactions and Framer Motion transitions that make the app feel alive.
- **Zero Clutter**: Clean, intuitive UX where every element serves a precise purpose.

## 💻 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI/LLM**: [Groq SDK](https://groq.com/) (using `moonshotai/kimi-k2-instruct-0905`)
- **Document Parsing**: `pdf-parse`, `mammoth` (for DOCX)
- **Document Export**: `docx`, `jspdf`

## 🌟 Features

1. **Deep Resume Analysis**:
   - Get a weighted Match Score (1-100).
   - See detailed breakdowns of Skills, Experience, and Keyword match rates.
   - Instantly view **Strengths**, **Gaps**, and **ATS Formatting Issues**.
   - Receive a prioritized **Action Plan** (Quick Wins vs. Long-Term).
2. **Context-Aware Cover Letters**:
   - Generates hyper-tailored cover letters that map your specific achievements to the job description perfectly.
3. **Actionable Quick Tips**:
   - Get 7 hyper-specific, actionable tips to improve your application instantly.
4. **LaTeX ATS-Optimization**:
   - Automatically injects missing keywords and reorders your existing LaTeX template based on the job description.
   - Download the tailored `.tex` file directly, ready for Overleaf.
5. **Multi-Format Export**:
   - Export analyses and cover letters to PDF, DOCX, or TXT.

## 🏁 Getting Started

### Prerequisites

You will need Node.js (v18+) and an API key from Groq.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/yourusername/resume-ai.git
   cd resume-ai
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Set up your environment variables by creating a `.env.local` file:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```
4. Run the development server
   ```sh
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

The codebase is highly modular and strictly typed:

```text
src/
├── app/                  # Next.js App Router (pages, API routes, layout)
│   ├── api/              # Serverless API routes for parsing, AI, exports
│   └── globals.css       # Tailwind v4 configuration & base styles
├── components/           # Reusable React components
│   ├── output/           # Modularized result panels (Analyze, Cover Letter, etc.)
│   └── ...               # UI building blocks (Hero, Navbar, Action Bar)
├── lib/                  # Utility functions (Groq client, Exporter, NLP tools)
├── store/                # Zustand global state management
└── types/                # TypeScript interface definitions
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <i>Built with precision for the modern job seeker.</i>
</div>
