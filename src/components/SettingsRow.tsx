"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import type { ExportFormat, Status } from "@/types";

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  idle:       { label: "idle",       color: "text-[#78828f]", dot: "bg-[#4b5563]" },
  processing: { label: "processing", color: "text-[#e9c46a]", dot: "bg-[#e9c46a] animate-pulse" },
  complete:   { label: "complete",   color: "text-[#2a9d8f]", dot: "bg-[#2a9d8f]" },
  error:      { label: "error",      color: "text-[#e76f51]", dot: "bg-[#e76f51]" },
};

const FORMATS: ExportFormat[] = ["docx", "pdf", "txt"];

// Fix #4 — tooltip for creativity slider
function CreativityTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-[#1e2530] border border-[#2a3540] text-[#4b5563] font-mono text-[10px] font-bold flex items-center justify-center hover:border-[#2a9d8f]/50 hover:text-[#78828f] transition-all"
      >
        ?
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-[#12151a] border border-[#1e2530] shadow-xl z-50">
          <p className="font-mono text-[11px] text-[#78828f] leading-relaxed">
            Controls how creative vs. conservative the AI rewrites your content.
            <br />
            <span className="text-[#4b5563]">0.0 = factual &amp; safe · 1.0 = bold &amp; inventive</span>
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1e2530]" />
        </div>
      )}
    </div>
  );
}

export default function SettingsRow() {
  const { creativity, setCreativity, exportFormat, setExportFormat, status } = useAppStore();
  const { label, color, dot } = STATUS_CONFIG[status];

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 px-2">
      <div className="flex items-center gap-8 md:gap-12 flex-1">
        {/* Creativity slider */}
        <div className="flex-1 min-w-[200px] max-w-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
                AI Creativity
              </span>
              <CreativityTooltip />
            </div>
            <span className="font-mono text-xs font-bold text-[#2a9d8f] bg-[#2a9d8f]/10 px-2 py-0.5 rounded border border-[#2a9d8f]/20">
              {creativity.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={creativity}
            onChange={(e) => setCreativity(parseFloat(e.target.value))}
          />
          <div className="flex justify-between font-mono text-[9px] text-[#4b5563] uppercase tracking-widest -mt-1">
            <span>Conservative</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="hidden sm:block w-px h-10 bg-[#1e2530]" />

        {/* Export format */}
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
            Export Format
          </span>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="bg-[#0a0c10] border border-[#1e2530] text-[#f5f5f4] text-xs font-bold rounded-lg px-4 py-2 cursor-pointer transition-colors hover:border-[#2a9d8f]/50 font-mono"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2.5 bg-[#0a0c10] border border-[#1e2530] px-3.5 py-1.5 rounded-full">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className={`font-mono text-[11px] uppercase font-bold tracking-widest ${color}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
