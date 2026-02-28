"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import type { ExportFormat } from "@/types";

const FORMATS: ExportFormat[] = ["docx", "pdf", "txt"];

function CreativityTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-[#1f2123] text-[#374151] font-mono text-[9px] font-bold flex items-center justify-center hover:text-[#6b7280] transition-colors"
      >
        ?
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-xl bg-[#111213] border border-[#1f2123] shadow-xl z-50">
          <p className="font-mono text-[11px] text-[#6b7280] leading-relaxed">
            Controls how creative vs. conservative the AI rewrites your content.{" "}
            <span className="text-[#374151]">0.0 = factual · 1.0 = bold</span>
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1f2123]" />
        </div>
      )}
    </div>
  );
}

export default function SettingsRow() {
  const { creativity, setCreativity, exportFormat, setExportFormat, status } = useAppStore();
  const [open, setOpen] = useState(false);
  const isProcessing = status === "processing";

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-mono text-[11px] font-medium text-[#6b7280] hover:text-[#f5f5f4] transition-colors tracking-[0.1em] uppercase"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
        Settings
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 flex flex-wrap items-start gap-8">
              {/* Creativity Slider */}
              <div className="flex-1 min-w-[200px] max-w-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-[#6b7280] uppercase">
                      AI Creativity
                    </span>
                    <CreativityTooltip />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#2a9d8f]">
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
                  disabled={isProcessing}
                />
                <div className="flex justify-between font-mono text-[9px] text-[#374151] uppercase tracking-widest">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="w-px h-12 bg-[#1f2123] self-center hidden sm:block" />

              {/* Export Format */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-[#6b7280] uppercase">
                  Export As
                </span>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  disabled={isProcessing}
                  className="bg-[#0d0e0f] border border-[#1f2123] text-[#f5f5f4] text-[12px] font-mono rounded-lg px-3 py-2 cursor-pointer hover:border-[#2a9d8f]/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>{f.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
