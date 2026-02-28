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

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, icon, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#1e2530] rounded-2xl overflow-hidden bg-[#0a0c10]/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#12151a]/50 hover:bg-[#12151a] transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
            {title}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#4b5563]"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  const getOutputType = () => {
    if (output) {
      return output.type === "analyze" ? "Match Analysis"
        : output.type === "cover-letter" ? "Cover Letter"
        : output.type === "latex" ? "LaTeX Resume"
        : "Quick Tips";
    }
    return "Processing";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="glass-panel rounded-[2rem] p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2a9d8f] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2530] pb-5">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${isLoading ? "bg-[#e9c46a] animate-pulse" : "bg-[#2a9d8f]"}`} />
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-[#78828f] uppercase">
              {getOutputType()}
            </h2>
          </div>
          {!isLoading && output && output.type !== "latex" && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl bg-[#12151a] border border-[#1e2530] text-[#78828f] hover:text-[#f5f5f4] hover:border-[#2a9d8f]/50 transition-all hover:bg-[#2a9d8f]/5"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleExport}
                className="font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl bg-[#1e2530] border border-[#1e2530] text-[#e9c46a] hover:bg-[#e9c46a] hover:text-[#030405] transition-all"
              >
                Export {exportFormat}
              </button>
            </div>
          )}
        </div>

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
            {output && output.type === "analyze" && <ScoreSkeleton />}
            {output && output.type === "cover-letter" && <CoverLetterSkeleton />}
            {output && output.type === "quick-tips" && <TipsSkeleton />}
          </div>
        ) : output ? (
          <>
            {output.type === "analyze" && output.matchResult && (
              <div className="space-y-6">
                <CollapsibleSection title="Overview" icon="◎" defaultOpen={true}>
                  <AnalyzeResult matchResult={output.matchResult} compact />
                </CollapsibleSection>
              </div>
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

      <ChatPanel />
    </motion.div>
  );
}
