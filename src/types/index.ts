export type TabMode = "analyze" | "cover-letter" | "quick-tips" | "latex";
export type ExportFormat = "docx" | "pdf" | "txt";
export type Priority = "high" | "medium" | "low";

export interface Suggestion {
  priority: Priority;
  text: string;
}

export interface MatchResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  keywordsScore: number;
  strengths: string[];
  gaps: string[];
  suggestions: Suggestion[];
  missingKeywords: string[];
  atsIssues: string[];
  actionPlan: {
    quickWins: string[];
    longTerm: string[];
  };
}

export interface AppOutput {
  matchResult?: MatchResult | null;
  coverLetter?: string | null;
  tips?: string[] | null;
  latexCode?: string | null;
}

export type Status = "idle" | "processing" | "complete" | "error";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
