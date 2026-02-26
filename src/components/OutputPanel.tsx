"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import { exportDocx, exportPdf, exportTxt } from "@/lib/exporter";
import type { Priority } from "@/types";
import ChatPanel from "./ChatPanel";

const PRIORITY_COLOR: Record<Priority, string> = {
  high:   "bg-[#e76f51] shadow-[0_0_12px_rgba(231,111,81,0.6)]",
  medium: "bg-[#e9c46a] shadow-[0_0_12px_rgba(233,196,106,0.5)]",
  low:    "bg-[#2a9d8f] shadow-[0_0_12px_rgba(42,157,143,0.5)]",
};

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
      "\nSuggestions:",
      ...(r.suggestions ?? []).map((s) => `[${s.priority.toUpperCase()}] ${s.text}`),
      "\nMissing Keywords:",
      (r.missingKeywords ?? []).join(", "),
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
          {/* Subtle background glow based on output type */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2a9d8f] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2530] pb-6">
            <h2 className="font-mono text-xs font-bold tracking-[0.25em] text-[#78828f] uppercase">
              {output.type === "analyze" ? "Match Analysis"
                : output.type === "cover-letter" ? "Cover Letter"
                : output.type === "latex" ? "LaTeX Resume"
                : "Quick Tips"}
            </h2>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#12151a] border border-[#1e2530] text-[#78828f] hover:text-[#f5f5f4] hover:border-[#2a9d8f]/50 transition-all hover:bg-[#2a9d8f]/5"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              {output.type !== "latex" && (
                <button
                  onClick={handleExport}
                  className="font-mono text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#1e2530] border border-[#1e2530] text-[#e9c46a] hover:bg-[#e9c46a] hover:text-[#030405] transition-all shadow-lg shadow-[#1e2530]/50"
                >
                  Export {exportFormat}
                </button>
              )}
            </div>
          </div>

          {/* ── Analyze Mode ── */}
          {output.type === "analyze" && output.matchResult && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
                <div className="flex items-baseline gap-4 relative">
                  <span className="font-syne text-8xl md:text-[8rem] font-extrabold text-[#2a9d8f] leading-none tracking-tighter drop-shadow-[0_0_32px_rgba(42,157,143,0.3)]">
                    {output.matchResult.overallScore}
                  </span>
                  <span className="font-mono text-[#78828f] text-sm uppercase font-bold tracking-widest">
                    / 100 <br/> Match
                  </span>
                </div>

                <div className="flex-1 space-y-5 pb-2">
                  {[
                    { label: "Skills",     value: output.matchResult.skillsScore,     color: "bg-[#2a9d8f]" },
                    { label: "Experience", value: output.matchResult.experienceScore, color: "bg-[#e9c46a]" },
                    { label: "Keywords",   value: output.matchResult.keywordsScore,   color: "bg-[#e76f51]" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between font-mono text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-[#78828f]">{label}</span>
                        <span className="text-[#f5f5f4]">{value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#1e2530] overflow-hidden shadow-inner">
                        <div className={`h-full rounded-full bar-fill ${color} shadow-[0_0_10px_currentColor] opacity-90`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {output.matchResult.suggestions?.length > 0 && (
                <div className="space-y-4">
                  <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
                    Critical Suggestions
                  </p>
                  <div className="grid gap-3">
                    {output.matchResult.suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-4 p-5 rounded-2xl border border-[#1e2530] bg-[#12151a]/50 hover:bg-[#12151a] hover:border-[#2a9d8f]/40 transition-all group"
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLOR[s.priority]}`} />
                        <p className="font-syne text-[#f5f5f4] text-[15px] leading-relaxed group-hover:text-white transition-colors">
                          {s.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {output.matchResult.missingKeywords?.length > 0 && (
                <div className="space-y-4">
                  <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
                    Missing Keywords
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {output.matchResult.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-[#1e2530]/40 border border-[#1e2530] text-[#8a939e]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Cover Letter Mode ── */}
          {output.type === "cover-letter" && output.coverLetter && (
            <div className="font-serif text-[#f5f5f4] text-lg leading-[2.2] whitespace-pre-wrap p-8 md:p-12 rounded-[2rem] bg-[#12151a]/30 border border-[#1e2530] shadow-inner selection:bg-[#2a9d8f]/30">
              {output.coverLetter}
            </div>
          )}

          {/* ── Quick Tips Mode ── */}
          {output.type === "quick-tips" && output.tips && (
            <div className="space-y-4">
              {output.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-5 p-6 rounded-2xl border border-[#1e2530] bg-[#12151a]/30 hover:bg-[#12151a] hover:border-[#e9c46a]/30 transition-all"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e9c46a]/10 border border-[#e9c46a]/30 text-[#e9c46a] font-mono text-sm flex items-center justify-center font-bold shadow-[0_0_12px_rgba(233,196,106,0.15)]">
                    {i + 1}
                  </span>
                  <p className="font-syne text-[#f5f5f4] text-[15px] md:text-base leading-relaxed mt-0.5">
                    {tip}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── LaTeX Mode ── */}
          {output.type === "latex" && output.latexCode && (
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden border border-[#1e2530] shadow-2xl relative">
                <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-[#1e2530]" />
                  <div className="w-3 h-3 rounded-full bg-[#1e2530]" />
                  <div className="w-3 h-3 rounded-full bg-[#1e2530]" />
                </div>
                <SyntaxHighlighter
                  language="latex"
                  style={atomDark}
                  customStyle={{
                    background: "#080a0c",
                    margin: 0,
                    padding: "2rem",
                    maxHeight: "600px",
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "13px",
                    lineHeight: "1.8",
                  }}
                  showLineNumbers
                  lineNumberStyle={{ color: "#2a3540", fontSize: "12px", minWidth: "3em" }}
                >
                  {output.latexCode}
                </SyntaxHighlighter>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-4 rounded-xl border border-[#e9c46a]/40 text-[#e9c46a] font-syne font-bold tracking-wide hover:bg-[#e9c46a] hover:text-[#030405] transition-all shadow-lg"
                >
                  {copied ? "✓ Copied to Clipboard" : "Copy to Overleaf"}
                </button>
                <button
                  onClick={downloadTex}
                  className="flex-1 py-4 rounded-xl bg-[#2a9d8f]/10 border border-[#2a9d8f]/40 text-[#2a9d8f] font-syne font-bold tracking-wide hover:bg-[#2a9d8f] hover:text-[#030405] transition-all shadow-lg"
                >
                  Download .tex
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat refine panel */}
        <ChatPanel />
      </motion.div>
    </AnimatePresence>
  );
}
