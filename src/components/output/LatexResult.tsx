"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface LatexResultProps {
  latexCode: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export default function LatexResult({ latexCode, copied, onCopy, onDownload }: LatexResultProps) {
  const [view, setView] = useState<"preview" | "code">("code");

  const handleCopy = () => {
    onCopy();
    toast.success("LaTeX copied to clipboard");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2a9d8f] animate-pulse" />
          <span className="font-mono text-[10px] text-[#4b5563] uppercase tracking-wider">
            ATS-Optimized LaTeX Resume
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#12151a] border border-[#1e2530]">
            <button
              onClick={() => setView("code")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                view === "code"
                  ? "bg-[#2a9d8f] text-black"
                  : "text-[#78828f] hover:text-[#f5f5f4]"
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setView("preview")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                view === "preview"
                  ? "bg-[#2a9d8f] text-black"
                  : "text-[#78828f] hover:text-[#f5f5f4]"
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {view === "code" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden border border-[#1e2530] shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-[#080a0c]/90 backdrop-blur-sm">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="font-mono text-[10px] text-[#4b5563]">resume.tex</span>
          </div>
          
          <SyntaxHighlighter
            language="latex"
            style={atomDark}
            customStyle={{
              background: "#080a0c",
              margin: 0,
              padding: "3.5rem 1.5rem 1.5rem",
              maxHeight: "500px",
              fontFamily: "var(--font-dm-mono-var, 'DM Mono')",
              fontSize: "12px",
              lineHeight: "1.8",
              borderRadius: "0",
            }}
            showLineNumbers
            lineNumberStyle={{ 
              color: "#2a3540", 
              fontSize: "11px", 
              minWidth: "3em",
              paddingRight: "12px",
              borderRight: "1px solid #1e2530",
              marginRight: "12px",
            }}
          >
            {latexCode}
          </SyntaxHighlighter>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden border border-[#1e2530] bg-[#12151a]/50 p-8 min-h-[400px]"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2a9d8f]/10 border border-[#2a9d8f]/30">
              <svg className="w-8 h-8 text-[#2a9d8f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="font-syne text-lg font-bold text-[#f5f5f4]">Preview Mode</p>
              <p className="font-mono text-[11px] text-[#78828f] mt-1">
                Compile this LaTeX code on Overleaf or your preferred editor
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-4">
              <a
                href="https://www.overleaf.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-[#2a9d8f] text-black hover:bg-[#228578] transition-all"
              >
                Open Overleaf
              </a>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className="flex-1 py-4 rounded-xl border border-[#e9c46a]/40 text-[#e9c46a] font-syne font-bold tracking-wide hover:bg-[#e9c46a] hover:text-[#030405] transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy to Clipboard"}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownload}
          className="flex-1 py-4 rounded-xl bg-[#2a9d8f]/10 border border-[#2a9d8f]/40 text-[#2a9d8f] font-syne font-bold tracking-wide hover:bg-[#2a9d8f] hover:text-[#030405] transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download .tex
        </motion.button>
      </div>
    </div>
  );
}
