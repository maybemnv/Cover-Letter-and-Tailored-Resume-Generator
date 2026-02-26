"use client";

import { useAppStore } from "@/store/appStore";
import type { ExportFormat, Status } from "@/types";

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  idle:       { label: "idle",       color: "text-[#78828f]", dot: "bg-[#4b5563]" },
  processing: { label: "processing", color: "text-[#e9c46a]", dot: "bg-[#e9c46a] animate-pulse glow-accent" },
  complete:   { label: "complete",   color: "text-[#2a9d8f]", dot: "bg-[#2a9d8f] glow-accent" },
  error:      { label: "error",      color: "text-[#e76f51]", dot: "bg-[#e76f51]" },
};

const FORMATS: ExportFormat[] = ["docx", "pdf", "txt"];

export default function SettingsRow() {
  const { creativity, setCreativity, exportFormat, setExportFormat, status } = useAppStore();
  const { label, color, dot } = STATUS_CONFIG[status];

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 px-2">
      {/* Settings Group */}
      <div className="flex items-center gap-8 md:gap-12 flex-1 relative">
        {/* Creativity slider */}
        <div className="flex-1 min-w-[200px] max-w-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
              AI Creativity
            </span>
            <span className="font-mono text-xs font-bold text-[#2a9d8f] bg-[#2a9d8f]/10 px-2 py-0.5 rounded border border-[#2a9d8f]/20">
              {creativity.toFixed(1)}
            </span>
          </div>
          <div className="px-1">
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-px h-10 bg-[#1e2530]" />

        {/* Export format */}
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#78828f] uppercase">
            Export Format
          </span>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            className="bg-[#0a0c10] border border-[#1e2530] text-[#f5f5f4] text-xs font-semibold rounded-lg px-4 py-2 cursor-pointer transition-colors hover:border-[#2a9d8f]/50 font-mono shadow-sm"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2.5 bg-[#0a0c10] border border-[#1e2530] px-3.5 py-1.5 rounded-full shadow-inner">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className={`font-mono text-[11px] uppercase font-bold tracking-widest ${color}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
