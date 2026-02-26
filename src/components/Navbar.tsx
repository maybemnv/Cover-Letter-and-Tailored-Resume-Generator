"use client";

import { useAppStore } from "@/store/appStore";

export default function Navbar() {
  const loading = useAppStore((s) => s.loading);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-[#1e2530] bg-[#030405]/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="relative flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2a9d8f] absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2a9d8f] pulse-dot" />
          </div>
          <span className="font-syne text-[#f5f5f4] text-xl font-extrabold tracking-tight">
            Resume<span className="text-[#2a9d8f]">AI</span>
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#e9c46a] border border-[#e9c46a]/30 bg-[#e9c46a]/5 rounded px-2 py-1">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-4">
        {loading && (
          <div className="flex items-center gap-2 font-mono text-[#78828f] text-xs font-medium bg-[#12151a] px-3 py-1.5 rounded-full border border-[#1e2530]">
            <svg className="animate-spin w-3.5 h-3.5 text-[#2a9d8f]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            processing
          </div>
        )}
      </div>
    </nav>
  );
}
