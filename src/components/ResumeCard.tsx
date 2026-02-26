"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";

export default function ResumeCard({ hasError }: { hasError?: boolean }) {
  const { resumeText, setResumeText } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setFileName(file.name);
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await fetch("/api/parse-file", { method: "POST", body: form });
        const data = await res.json();
        if (data.text) setResumeText(data.text);
      } finally {
        setUploading(false);
      }
    },
    [setResumeText]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const borderColor = hasError && !resumeText
    ? "border-[#e76f51]"
    : dragging
    ? "border-[#2a9d8f]"
    : "border-[#1e2530] hover:border-[#2a9d8f]/50";

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs font-bold tracking-[0.2em] text-[#78828f] uppercase">
          Your Resume
        </label>
        {fileName && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-[#2a9d8f] bg-[#2a9d8f]/10 px-2.5 py-1 rounded-md border border-[#2a9d8f]/20">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            {fileName}
          </span>
        )}
      </div>

      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 select-none ${
          dragging
            ? "bg-[#2a9d8f]/5 scale-[1.01] shadow-[inset_0_0_40px_rgba(42,157,143,0.05)]"
            : hasError && !resumeText
            ? "bg-[#e76f51]/5"
            : "bg-[#0a0c10] hover:bg-[#12151a]"
        } ${borderColor}`}
      >
        <AnimatePresence>
          {dragging && (
            <>
              {["top-2 left-2 border-t-2 border-l-2", "top-2 right-2 border-t-2 border-r-2",
                "bottom-2 left-2 border-b-2 border-l-2", "bottom-2 right-2 border-b-2 border-r-2"].map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute w-5 h-5 border-[#2a9d8f] rounded-sm ${c}`}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />

        {uploading ? (
          <svg className="animate-spin w-7 h-7 text-[#2a9d8f]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <>
            <motion.div
              animate={dragging ? { scale: 1.2, rotate: -5 } : { scale: 1, rotate: 0 }}
              className="p-3 rounded-full bg-[#1e2530]/50 text-[#78828f]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </motion.div>
            <p className="font-mono text-[#78828f] text-[13px]">
              Drop <span className="text-[#f5f5f4]">PDF</span> / <span className="text-[#f5f5f4]">DOCX</span> here or click to upload
            </p>
            <p className="font-mono text-[10px] text-[#4b5563] uppercase tracking-widest">Max 5MB</p>
          </>
        )}
      </div>

      {hasError && !resumeText && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs text-[#e76f51] flex items-center gap-1.5">
          <span>!</span> Please add your resume before continuing.
        </motion.p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[#1e2530]" />
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#4b5563]">or paste text</span>
        <div className="flex-1 h-px bg-[#1e2530]" />
      </div>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your raw resume content here..."
        className={`w-full flex-1 min-h-[200px] resize-none rounded-2xl bg-[#0a0c10] border text-[#f5f5f4] text-[13px] p-5 transition-all duration-300 placeholder:text-[#4b5563] focus:bg-[#12151a] font-mono leading-[1.8] ${
          hasError && !resumeText ? "border-[#e76f51]" : "border-[#1e2530]"
        }`}
      />
    </div>
  );
}
