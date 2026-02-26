"use client";

import { useAppStore } from "@/store/appStore";

export default function JDCard() {
  const { jdText, setJdText } = useAppStore();

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center justify-between mb-1">
        <label className="font-mono text-xs font-bold tracking-[0.2em] text-[#78828f] uppercase">
          Job Description
        </label>
        <span className="font-mono text-[10px] text-[#4b5563]">
          Supports raw text only
        </span>
      </div>
      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="Paste the complete job posting here..."
        className="w-full h-full min-h-[440px] resize-none rounded-2xl bg-[#0a0c10] border border-[#1e2530] text-[#f5f5f4] text-[13px] p-5 transition-all duration-300 placeholder:text-[#4b5563] focus:bg-[#12151a] font-mono leading-[1.8]"
      />
    </div>
  );
}
