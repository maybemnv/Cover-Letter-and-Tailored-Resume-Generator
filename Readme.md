<div align="center">
  <img src="public/globe.svg" alt="ResumeAI Logo" width="100" />
  <h1 align="center">ResumeAI</h1>
  <p align="center">
    <strong>The definitive AI toolkit for modern job seekers.</strong><br>
    Bypass the ATS, generate hyper-tailored cover letters, and export Overleaf-ready LaTeX artifacts in seconds.
  </p>
  <p align="center">
    <a href="#-the-solution">Intelligence</a> •
    <a href="#-architecture--stack">Architecture</a> •
    <a href="#-deployment">Deployment</a> •
    <a href="#-project-structure">Structure</a>
  </p>
</div>

---

## ✦ The Problem

Modern hiring is systematically broken. In an era where Applicant Tracking Systems (ATS) automatically filter out 75% of resumes before a human ever sees them, generic applications are no longer viable. Manually tailoring a resume and cover letter for every single application takes hours.

## ✦ The Solution

ResumeAI is a premium, edge-deployed intelligence platform that bridges the gap between your baseline experience and the target job description. By leveraging cutting-edge LLMs, it parses, analyzes, and rebuilds your application artifacts to guarantee **Maximum ATS Compatibility**.

### Intelligent Analysis

Drop your resume and the target Job Description into the interface. ResumeAI instantly computes a determinisitic **Match Score (1-100)**, breaking down your profile against the JD's exact requirements across Skills, Experience, and Keywords.

### Actionable Intelligence

Stop guessing. Instantly view critical **Gaps**, formatting **ATS Issues**, and missing **Keywords**. ResumeAI provides a prioritized Action Plan consisting of Quick Wins and Long-Term strategies to bridge the gap between your resume and the role.

### Hyper-Tailored Generation

Generate context-aware, highly persuasive cover letters that seamlessly map your historical achievements directly to the exact responsibilities and tone outlined in the Job Description.

### LaTeX ATS Optimization

Export a structurally perfect, heavily optimized `.tex` file. ResumeAI intelligently injects missing keywords and reorders your existing LaTeX structure based on the job requirements. Download and deploy directly to Overleaf.

---

## ✦ Architecture & Stack

ResumeAI is built for uncompromising speed, scale, and aesthetics.

- **Core Framework**: [Next.js 15.2 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript (Strict Mode)](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Motion & Interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Intelligence Engine**: [Groq SDK](https://groq.com/) (using `moonshotai/kimi-k2-instruct-0905`)
- **Document Processing**: `pdf-parse`, `mammoth`

### Interface Design

The application features a bespoke, ultra-premium glassmorphism aesthetic. It utilizes a noise-textured pure dark `#030405` canvas, punctuated by functional neon accents (`#2a9d8f` | `#e9c46a` | `#e76f51`). The UX is completely devoid of clutter, ensuring maximum focus on intelligence extraction.

---

## ✦ Deployment

ResumeAI is designed to be easily self-hosted on serverless edge networks like Vercel.

### 1. Engine Configuration

Obtain your ultra-low latency API key from the [Groq Console](https://console.groq.com/).

### 2. Initialization

```bash
git clone https://github.com/yourusername/ResumeAI.git
cd ResumeAI
npm install
```

### 3. Environment

```bash
cp .env.example .env.local
```

Add your `GROQ_API_KEY` to the newly created `.env.local` file.

### 4. Local Ignition

```bash
npm run dev
```

The platform will be live at `http://localhost:3000`.

---

## ✦ Project Structure

A strictly modular, highly maintainable component tree architecture.

```text
src/
├── app/                  # Next.js App Router (pages, API routes, layout)
│   ├── api/              # Serverless Edge endpoints (Analyze, Draft, ATS)
│   └── globals.css       # Tailwind configuration & Core Design System
├── components/           # Bespoke React Architecture
│   ├── output/           # Isolated rendering layer
│   └── ...               # Core interface elements
├── lib/                  # Processing utilities & typed API clients
├── store/                # Immutable Zustand data layer
└── types/                # End-to-end interface definitions
```
