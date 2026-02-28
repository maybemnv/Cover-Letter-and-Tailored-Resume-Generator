"use client";

import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

interface JDCardProps {
  hasError?: boolean;
}

export default function JDCard({ hasError }: JDCardProps) {
  const { jdText, setJdText } = useAppStore();

  const handleClear = () => {
    setJdText("");
  };

  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;
  const charCount = jdText.length;

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-mono text-xs font-bold tracking-[0.2em] text-[#78828f] uppercase">
            Job Description
          </label>
          {wordCount > 0 && (
            <span className="font-mono text-[10px] text-[#4b5563] bg-[#12151a] px-2 py-0.5 rounded border border-[#1e2530]">
              {wordCount} words
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#4b5563] hidden sm:inline">
            Paste full JD text
          </span>
          {jdText && (
            <button
              onClick={handleClear}
              className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#1e2530]/50 text-[#78828f] hover:text-[#e76f51] hover:bg-[#e76f51]/10 transition-all border border-[#1e2530]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {hasError && !jdText && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs text-[#e76f51] flex items-center gap-1.5 bg-[#e76f51]/10 px-3 py-2 rounded-lg border border-[#e76f51]/20"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Please paste a job description before continuing
        </motion.p>
      )}

      <div className="relative flex-1">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the complete job posting here... (title, responsibilities, requirements, benefits)"
          className={`w-full h-[400px] resize-none rounded-2xl bg-[#0a0c10] border text-[#f5f5f4] text-[13px] p-5 transition-all duration-300 placeholder:text-[#4b5563] focus:bg-[#12151a] font-mono leading-[1.8] ${
            hasError && !jdText ? "border-[#e76f51]" : "border-[#1e2530]"
          }`}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#4b5563]">
            {charCount} chars
          </span>
        </div>
      </div>
    </div>
  );
}
