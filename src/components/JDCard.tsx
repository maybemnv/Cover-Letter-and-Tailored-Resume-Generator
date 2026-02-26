"use client";

import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

export default function JDCard({ hasError }: { hasError?: boolean }) {
  const { jdText, setJdText } = useAppStore();

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs font-bold tracking-[0.2em] text-[#78828f] uppercase">
          Job Description
        </label>
        <span className="font-mono text-[10px] text-[#4b5563]">Raw text only</span>
      </div>

      {hasError && !jdText && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs text-[#e76f51] flex items-center gap-1.5">
          <span>!</span> Please paste a job description before continuing.
        </motion.p>
      )}

      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="Paste the complete job posting here..."
        className={`w-full flex-1 min-h-[440px] resize-none rounded-2xl bg-[#0a0c10] border text-[#f5f5f4] text-[13px] p-5 transition-all duration-300 placeholder:text-[#4b5563] focus:bg-[#12151a] font-mono leading-[1.8] ${
          hasError && !jdText ? "border-[#e76f51]" : "border-[#1e2530]"
        }`}
      />
    </div>
  );
}
