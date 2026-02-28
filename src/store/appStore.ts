import { create } from "zustand";
import type { TabMode, ExportFormat, AppOutput, Status, ChatMessage } from "@/types";

interface AppState {
  resumeText: string;
  jdText: string;
  creativity: number;
  exportFormat: ExportFormat;
  
  // Consolidated output
  output: AppOutput | null;
  loading: boolean;
  status: Status;
  
  baseLatexTemplate: string;
  chatHistory: ChatMessage[];
  chatOpen: boolean;

  setResumeText: (text: string) => void;
  setJdText: (text: string) => void;
  setCreativity: (val: number) => void;
  setExportFormat: (fmt: ExportFormat) => void;
  
  // Output update action merges new data into existing output
  updateOutput: (partialOutput: Partial<AppOutput>) => void;
  resetOutput: () => void;
  
  setLoading: (loading: boolean) => void;
  setStatus: (status: Status) => void;
  setBaseLatexTemplate: (tpl: string) => void;
  
  addChatMessage: (msg: ChatMessage) => void;
  setChatOpen: (open: boolean) => void;
  resetChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  resumeText: "",
  jdText: "",
  creativity: 0.7,
  exportFormat: "docx",
  
  output: null,
  loading: false,
  status: "idle",
  
  baseLatexTemplate: "",
  chatHistory: [],
  chatOpen: false,

  setResumeText: (resumeText) => set({ resumeText }),
  setJdText: (jdText) => set({ jdText }),
  setCreativity: (creativity) => set({ creativity }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  
  updateOutput: (partial) => set((state) => ({ 
    output: state.output ? { ...state.output, ...partial } : { ...partial } 
  })),
  resetOutput: () => set({ output: null, status: "idle" }),
  
  setLoading: (loading) => set({ loading }),
  setStatus: (status) => set({ status }),
  setBaseLatexTemplate: (baseLatexTemplate) => set({ baseLatexTemplate }),
  
  addChatMessage: (msg) =>
    set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
  setChatOpen: (chatOpen) => set({ chatOpen }),
  resetChat: () => set({ chatHistory: [], chatOpen: false }),
}));
