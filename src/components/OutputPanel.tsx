"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { exportDocx, exportPdf, exportTxt } from "@/lib/exporter";
import ChatPanel from "./ChatPanel";
import { ScoreSkeleton, CoverLetterSkeleton, TipsSkeleton, CardSkeleton } from "./loading";
import AnalyzeResult from "./output/AnalyzeResult";
import CoverLetterResult from "./output/CoverLetterResult";
import QuickTipsResult from "./output/QuickTipsResult";
import LatexResult from "./output/LatexResult";

export default function OutputPanel() {
  const { output, exportFormat, loading, status } = useAppStore();
  const [copied, setCopied] = useState(false);

  const isLoading = loading && status === "processing";

  if (!output && !isLoading) return null;

  const getTextContent = (): string => {
    if (output?.type === "cover-letter") return output.coverLetter ?? "";
    if (output?.type === "latex") return output.latexCode ?? "";
    if (output?.type === "quick-tips") return (output.tips ?? []).join("\n\n");
    const r = output?.matchResult;
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
    if (!output) return;
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
    if (!output || output.type !== "latex") return;
    const blob = new Blob([output.latexCode ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_tailored.tex";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded resume_tailored.tex");
  };

  const outputLabel =
    output?.type === "analyze" ? "Match Analysis"
    : output?.type === "cover-letter" ? "Cover Letter"
    : output?.type === "latex" ? "LaTeX Resume"
    : output?.type === "quick-tips" ? "Quick Tips"
    : "Processing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="surface-card rounded-xl overflow-hidden">
        {/* Tab-style header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1f2123]">
          <div className="flex items-center gap-3">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-[#e9c46a] animate-pulse" : "bg-[#2a9d8f]"}`} />
            <h2 className="font-mono text-[11px] font-medium tracking-[0.15em] text-[#6b7280] uppercase">
              {outputLabel}
            </h2>
          </div>

          {!isLoading && output && output.type !== "latex" && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="font-mono text-[10px] px-3 py-1.5 rounded-lg surface-card text-[#6b7280] hover:text-[#f5f5f4] hover:border-[#2a9d8f]/40 transition-all"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleExport}
                className="font-mono text-[10px] px-3 py-1.5 rounded-lg bg-[#1f2123] border border-[#1f2123] text-[#e9c46a] hover:bg-[#e9c46a] hover:text-[#08090a] transition-all"
              >
                Export {exportFormat}
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              {!output && (
                <>
                  {useAppStore.getState().mode === "analyze" && <ScoreSkeleton />}
                  {useAppStore.getState().mode === "cover-letter" && <CoverLetterSkeleton />}
                  {useAppStore.getState().mode === "quick-tips" && <TipsSkeleton />}
                  {useAppStore.getState().mode === "latex" && <CardSkeleton />}
                </>
              )}
              {output?.type === "analyze" && <ScoreSkeleton />}
              {output?.type === "cover-letter" && <CoverLetterSkeleton />}
              {output?.type === "quick-tips" && <TipsSkeleton />}
            </div>
          ) : output ? (
            <>
              {output.type === "analyze" && output.matchResult && (
                <AnalyzeResult matchResult={output.matchResult} compact />
              )}
              {output.type === "cover-letter" && output.coverLetter && (
                <CoverLetterResult coverLetter={output.coverLetter} />
              )}
              {output.type === "quick-tips" && output.tips && (
                <QuickTipsResult tips={output.tips} />
              )}
              {output.type === "latex" && output.latexCode && (
                <LatexResult latexCode={output.latexCode} copied={copied} onCopy={handleCopy} onDownload={downloadTex} />
              )}
            </>
          ) : null}
        </div>
      </div>

      <ChatPanel />
    </motion.div>
  );
}
