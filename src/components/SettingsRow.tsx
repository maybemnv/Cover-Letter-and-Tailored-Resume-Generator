"use client";

import { useAppStore } from "@/store/appStore";
import type { ExportFormat, Status } from "@/types";

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  idle:       { label: "idle",       color: "text-[#5a6470]", dot: "bg-[#5a6470]" },
  processing: { label: "processing", color: "text-[#e9c46a]", dot: "bg-[#e9c46a] animate-pulse" },
  complete:   { label: "complete",   color: "text-[#2a9d8f]", dot: "bg-[#2a9d8f]" },
  error:      { label: "error",      color: "text-[#e76f51]", dot: "bg-[#e76f51]" },
};

const FORMATS: ExportFormat[] = ["docx", "pdf", "txt"];

export default function SettingsRow() {
  const { creativity, setCreativity, exportFormat, setExportFormat, status } = useAppStore();
  const { label, color, dot } = STATUS_CONFIG[status];

  return (
    <div className="flex flex-wrap items-center gap-6 px-1">
      {/* Creativity slider */}
      <div className="flex-1 min-w-[180px] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] tracking-widest text-[#5a6470] uppercase"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Creativity
          </span>
          <span
            className="text-xs text-[#2a9d8f]"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
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
      </div>

      {/* Export format */}
      <div className="flex flex-col gap-2">
        <span
          className="text-[11px] tracking-widest text-[#5a6470] uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Export as
        </span>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
          className="bg-[#0f1215] border border-[#1e2530] text-[#eae8e3] text-xs rounded-lg px-3 py-2 cursor-pointer"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span
          className={`text-xs ${color}`}
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
