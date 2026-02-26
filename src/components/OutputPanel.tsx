"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { exportDocx, exportPdf, exportTxt } from "@/lib/exporter";
import ChatPanel from "./ChatPanel";

import AnalyzeResult from "./output/AnalyzeResult";
import CoverLetterResult from "./output/CoverLetterResult";
import QuickTipsResult from "./output/QuickTipsResult";
import LatexResult from "./output/LatexResult";

export default function OutputPanel() {
  const { output, exportFormat } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (!output) return null;

  const getTextContent = (): string => {
    if (output.type === "cover-letter") return output.coverLetter ?? "";
    if (output.type === "latex") return output.latexCode ?? "";
    if (output.type === "quick-tips") return (output.tips ?? []).join("\n\n");
    const r = output.matchResult;
    if (!r) return "";
    return [
      `Match Score: ${r.overallScore}%`,
      `Skills: ${r.skillsScore}% | Experience: ${r.experienceScore}% | Keywords: ${r.keywordsScore}%`,
      "\nStrengths:", ...(r.strengths ?? []).map((s) => `• ${s}`),
      "\nGaps:", ...(r.gaps ?? []).map((g) => `• ${g}`),
      "\nSuggestions:", ...(r.suggestions ?? []).map((s) => `[${s.priority.toUpperCase()}] ${s.text}`),
      "\nMissing Keywords:", (r.missingKeywords ?? []).join(", "),
      "\nATS Issues:", ...(r.atsIssues ?? []).map((a) => `• ${a}`),
      "\nQuick Wins:", ...(r.actionPlan?.quickWins ?? []).map((w) => `• ${w}`),
    ].join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getTextContent());
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    const content = getTextContent();
    try {
      if (exportFormat === "pdf") await exportPdf(content);
      else if (exportFormat === "docx") await exportDocx(content);
      else await exportTxt(content);
      toast.success(`Downloaded as ${exportFormat.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    }
  };

  const downloadTex = () => {
    const blob = new Blob([output.latexCode ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_tailored.tex";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded resume_tailored.tex");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="glass-panel rounded-[2rem] p-6 sm:p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2a9d8f] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />


          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2530] pb-6">
            <h2 className="font-mono text-xs font-bold tracking-[0.25em] text-[#78828f] uppercase">
              {output.type === "analyze" ? "Match Analysis"
                : output.type === "cover-letter" ? "Cover Letter"
                : output.type === "latex" ? "LaTeX Resume"
                : "Quick Tips"}
            </h2>
            <div className="flex gap-3">
              {output.type !== "latex" && (
                <button
                  onClick={handleCopy}
                  className="font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#12151a] border border-[#1e2530] text-[#78828f] hover:text-[#f5f5f4] hover:border-[#2a9d8f]/50 transition-all hover:bg-[#2a9d8f]/5"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
              {output.type !== "latex" && (
                <button
                  onClick={handleExport}
                  className="font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#1e2530] border border-[#1e2530] text-[#e9c46a] hover:bg-[#e9c46a] hover:text-[#030405] transition-all"
                >
                  Export {exportFormat}
                </button>
              )}
            </div>
          </div>


          {output.type === "analyze" && output.matchResult && <AnalyzeResult matchResult={output.matchResult} />}
          {output.type === "cover-letter" && output.coverLetter && <CoverLetterResult coverLetter={output.coverLetter} />}
          {output.type === "quick-tips" && output.tips && <QuickTipsResult tips={output.tips} />}
          {output.type === "latex" && output.latexCode && (
            <LatexResult latexCode={output.latexCode} copied={copied} onCopy={handleCopy} onDownload={downloadTex} />
          )}
        </div>

        <ChatPanel />
      </motion.div>
    </AnimatePresence>
  );
}
