import { create } from "zustand";
import type { Mode, ExportFormat, AppOutput, Status, ChatMessage } from "@/types";

interface AppState {
  mode: Mode;
  resumeText: string;
  jdText: string;
  creativity: number;
  exportFormat: ExportFormat;
  output: AppOutput | null;
  loading: boolean;
  status: Status;
  baseLatexTemplate: string;
  latexOutput: string;
  chatHistory: ChatMessage[];
  chatOpen: boolean;

  setMode: (mode: Mode) => void;
  setResumeText: (text: string) => void;
  setJdText: (text: string) => void;
  setCreativity: (val: number) => void;
  setExportFormat: (fmt: ExportFormat) => void;
  setOutput: (output: AppOutput) => void;
  setLoading: (loading: boolean) => void;
  setStatus: (status: Status) => void;
  setBaseLatexTemplate: (tpl: string) => void;
  setLatexOutput: (code: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setChatOpen: (open: boolean) => void;
  resetOutput: () => void;
  resetChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: "analyze",
  resumeText: "",
  jdText: "",
  creativity: 0.7,
  exportFormat: "docx",
  output: null,
  loading: false,
  status: "idle",
  baseLatexTemplate: "",
  latexOutput: "",
  chatHistory: [],
  chatOpen: false,

  setMode: (mode) => set({ mode, output: null, status: "idle", chatHistory: [], chatOpen: false }),
  setResumeText: (resumeText) => set({ resumeText }),
  setJdText: (jdText) => set({ jdText }),
  setCreativity: (creativity) => set({ creativity }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setOutput: (output) => set({ output }),
  setLoading: (loading) => set({ loading }),
  setStatus: (status) => set({ status }),
  setBaseLatexTemplate: (baseLatexTemplate) => set({ baseLatexTemplate }),
  setLatexOutput: (latexOutput) => set({ latexOutput }),
  addChatMessage: (msg) =>
    set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
  setChatOpen: (chatOpen) => set({ chatOpen }),
  resetOutput: () => set({ output: null, status: "idle" }),
  resetChat: () => set({ chatHistory: [], chatOpen: false }),
}));
