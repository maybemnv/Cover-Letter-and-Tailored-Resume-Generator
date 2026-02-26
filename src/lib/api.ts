// Client-side API helpers for Next.js

import type { MatchResult } from "@/types";

export async function analyzeMatch(resumeText: string, jdText: string, creativity: number): Promise<MatchResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jdText, creativity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Analysis failed");
  return data;
}

export async function generateCoverLetter(resumeText: string, jdText: string, creativity: number): Promise<string> {
  const res = await fetch("/api/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jdText, creativity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Cover letter generation failed");
  return data.coverLetter;
}

export async function getQuickTips(resumeText: string, jdText: string, creativity: number): Promise<string[]> {
  const res = await fetch("/api/quick-tips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jdText, creativity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Quick tips generation failed");
  return data.tips;
}

export async function generateLatexResume(jdText: string, baseLatex: string, creativity: number): Promise<string> {
  const res = await fetch("/api/latex", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jdText, baseLatex, creativity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "LaTeX resume generation failed");
  return data.latexCode;
}
