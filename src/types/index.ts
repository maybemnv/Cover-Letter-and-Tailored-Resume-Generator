export type Mode = "analyze" | "cover-letter" | "quick-tips" | "latex";
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
  suggestions: Suggestion[];
  missingKeywords: string[];
}

export interface AppOutput {
  type: Mode;
  matchResult?: MatchResult;
  coverLetter?: string;
  tips?: string[];
  latexCode?: string;
}

export type Status = "idle" | "processing" | "complete" | "error";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
