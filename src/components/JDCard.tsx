"use client";

import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

interface JDCardProps {
  hasError?: boolean;
}

export default function JDCard({ hasError }: JDCardProps) {
  const { jdText, setJdText } = useAppStore();

  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;
  const charCount = jdText.length;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-mono text-[11px] font-medium tracking-[0.15em] text-[#6b7280] uppercase">
            Job Description
          </label>
          {wordCount > 0 && (
            <span className="font-mono text-[10px] text-[#374151] bg-[#111213] px-1.5 py-0.5 rounded border border-[#1f2123]">
              {wordCount} words
            </span>
          )}
        </div>
        {jdText && (
          <button
            onClick={() => setJdText("")}
            className="font-mono text-[10px] px-2 py-0.5 rounded text-[#6b7280] hover:text-[#e76f51] transition-colors border border-[#1f2123] hover:border-[#e76f51]/30"
          >
            Clear
          </button>
        )}
      </div>

      {hasError && !jdText && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[11px] text-[#e76f51] flex items-center gap-1.5 bg-[#e76f51]/8 px-3 py-2 rounded-lg border border-[#e76f51]/20"
        >
          Please paste a job description before continuing
        </motion.p>
      )}

      <div className="relative flex-1">
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the complete job posting here... (title, responsibilities, requirements, benefits)"
          className={`w-full h-[400px] resize-none rounded-2xl bg-black/20 border text-[#f0f2ff] text-[14px] p-5 transition-all duration-300 placeholder:text-[#6b7280] focus:bg-black/40 font-mono leading-[1.8] ${
            hasError && !jdText ? "border-[#e76f51]/60" : "border-[rgba(255,255,255,0.06)]"
          }`}
        />
        <div className="absolute bottom-4 right-4">
          <span className="font-mono text-[10px] text-[#6b7280]">{charCount} chars</span>
        </div>
      </div>
    </div>
  );
}
