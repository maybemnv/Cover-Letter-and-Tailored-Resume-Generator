"use client";

import { useAppStore } from "@/store/appStore";

export default function Navbar() {
  const loading = useAppStore((s) => s.loading);

  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#1e2530]">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2a9d8f] pulse-dot" />
          <span
            className="text-[#eae8e3] text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Resume<span className="text-[#2a9d8f]">AI</span>
          </span>
        </div>
        <span
          className="text-[10px] tracking-widest text-[#2a9d8f] border border-[#2a9d8f]/40 rounded px-2 py-0.5"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          BETA
        </span>
      </div>

      <div className="flex items-center gap-3">
        {loading && (
          <div className="flex items-center gap-2 text-[#5a6470] text-sm" style={{ fontFamily: "var(--font-dm-mono)" }}>
            <svg className="animate-spin w-4 h-4 text-[#2a9d8f]" viewBox="0 0 24 24" fill="none">
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
