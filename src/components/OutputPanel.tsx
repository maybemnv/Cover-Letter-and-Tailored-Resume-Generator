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
  high:   "bg-[#e76f51]",
  medium: "bg-[#e9c46a]",
  low:    "bg-[#2a9d8f]",
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
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        <div className="rounded-2xl bg-[#0f1215] border border-[#1e2530] p-6 md:p-8 space-y-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2
              className="text-xs tracking-widest text-[#5a6470] uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {output.type === "analyze" ? "Match Analysis"
                : output.type === "cover-letter" ? "Cover Letter"
                : output.type === "latex" ? "LaTeX Resume"
                : "Quick Tips"}
            </h2>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#1e2530] text-[#8a939e] hover:text-[#eae8e3] hover:border-[#2a9d8f]/50 transition-all"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              {output.type !== "latex" && (
                <button
                  onClick={handleExport}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#161b20] border border-[#1e2530] text-[#8a939e] hover:text-[#e9c46a] hover:border-[#e9c46a]/50 transition-all"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Export {exportFormat.toUpperCase()}
                </button>
              )}
            </div>
          </div>

          {/* ── Analyze Mode ── */}
          {output.type === "analyze" && output.matchResult && (
            <div className="space-y-8">
              <div className="flex items-baseline gap-3">
                <span
                  className="text-7xl font-extrabold text-[#2a9d8f] leading-none tabular-nums"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {output.matchResult.overallScore}
                </span>
                <span className="text-[#5a6470] text-sm" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  / 100 match
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Skills",     value: output.matchResult.skillsScore,     color: "bg-[#2a9d8f]" },
                  { label: "Experience", value: output.matchResult.experienceScore,  color: "bg-[#e9c46a]" },
                  { label: "Keywords",   value: output.matchResult.keywordsScore,    color: "bg-[#e76f51]" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-xs" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      <span className="text-[#8a939e]">{label}</span>
                      <span className="text-[#eae8e3]">{value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1e2530] overflow-hidden">
                      <div className={`h-full rounded-full bar-fill ${color}`} style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {output.matchResult.suggestions?.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs tracking-widest text-[#5a6470] uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    Suggestions
                  </p>
                  {output.matchResult.suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-[#1e2530] bg-[#0d1014] hover:border-[#2a9d8f]/30 transition-all"
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_COLOR[s.priority]}`} />
                      <p className="text-[#eae8e3] text-sm leading-relaxed" style={{ fontFamily: "var(--font-syne)" }}>
                        {s.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {output.matchResult.missingKeywords?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs tracking-widest text-[#5a6470] uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    Missing Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {output.matchResult.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-3 py-1 rounded-full bg-[#161b20] border border-[#1e2530] text-[#8a939e]"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
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
            <div
              className="text-[#eae8e3] text-sm leading-[1.9] whitespace-pre-wrap p-5 rounded-xl bg-[#0d1014] border border-[#1e2530]"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {output.coverLetter}
            </div>
          )}

          {/* ── Quick Tips Mode ── */}
          {output.type === "quick-tips" && output.tips && (
            <div className="space-y-2.5">
              {output.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[#1e2530] bg-[#0d1014] hover:border-[#2a9d8f]/30 transition-all"
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2a9d8f]/12 border border-[#2a9d8f]/25 text-[#2a9d8f] text-xs flex items-center justify-center font-bold"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[#eae8e3] text-sm leading-relaxed" style={{ fontFamily: "var(--font-syne)" }}>
                    {tip}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── LaTeX Mode ── */}
          {output.type === "latex" && output.latexCode && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-[#1e2530] text-[13px]">
                <SyntaxHighlighter
                  language="latex"
                  style={atomDark}
                  customStyle={{
                    background: "#0d1014",
                    margin: 0,
                    padding: "1.25rem",
                    maxHeight: "480px",
                    fontSize: "12px",
                    lineHeight: "1.7",
                  }}
                  showLineNumbers
                  lineNumberStyle={{ color: "#2a3540", fontSize: "11px" }}
                >
                  {output.latexCode}
                </SyntaxHighlighter>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3 rounded-xl border border-[#e9c46a]/40 text-[#e9c46a] font-bold text-sm hover:bg-[#e9c46a]/8 transition-all"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {copied ? "✓ Copied" : "Copy LaTeX"}
                </button>
                <button
                  onClick={downloadTex}
                  className="flex-1 py-3 rounded-xl bg-[#2a9d8f]/15 border border-[#2a9d8f]/40 text-[#2a9d8f] font-bold text-sm hover:bg-[#2a9d8f]/25 transition-all"
                  style={{ fontFamily: "var(--font-syne)" }}
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
