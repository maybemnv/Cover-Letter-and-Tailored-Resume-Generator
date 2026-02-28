"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";

interface ResumeCardProps {
  hasError?: boolean;
  onFileProcessed?: () => void;
}

export default function ResumeCard({ hasError, onFileProcessed }: ResumeCardProps) {
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
        if (data.text) {
          setResumeText(data.text);
          onFileProcessed?.();
        }
      } finally {
        setUploading(false);
      }
    },
    [setResumeText, onFileProcessed]
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

  const handleClear = () => {
    setResumeText("");
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const charCount = resumeText.length;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-mono text-[11px] font-medium tracking-[0.15em] text-[#6b7280] uppercase">
            Resume
          </label>
          {wordCount > 0 && (
            <span className="font-mono text-[10px] text-[#374151] bg-[#111213] px-1.5 py-0.5 rounded border border-[#1f2123]">
              {wordCount} words
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fileName && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#2a9d8f] bg-[#2a9d8f]/8 px-2 py-0.5 rounded border border-[#2a9d8f]/20">
              {fileName.length > 20 ? fileName.slice(0, 20) + "..." : fileName}
            </span>
          )}
          {resumeText && (
            <button
              onClick={handleClear}
              className="font-mono text-[10px] px-2 py-0.5 rounded text-[#6b7280] hover:text-[#e76f51] transition-colors border border-[#1f2123] hover:border-[#e76f51]/30"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2.5 h-32 rounded-2xl border border-dashed cursor-pointer transition-all duration-200 select-none ${
          dragging
            ? "border-[#00c8b4] bg-[#00c8b4]/5"
            : hasError && !resumeText
            ? "border-[#e76f51]/60 bg-[#e76f51]/5"
            : "border-[rgba(255,255,255,0.1)] bg-black/10 hover:border-[#00c8b4]/40 hover:bg-black/20"
        }`}
      >
        <AnimatePresence>
          {dragging && (
            <>
              {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r",
                "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute w-4 h-4 border-[#00c8b4] ${c}`}
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
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin w-5 h-5 text-[#00c8b4]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="font-mono text-[11px] text-[#a1a1aa]">Processing {fileName}...</p>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 text-[#6b7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="font-mono text-[#a1a1aa] text-[12px] text-center">
              Drop <span className="text-[#f0f2ff]">PDF</span> / <span className="text-[#f0f2ff]">DOCX</span>{" "}
              or <span className="text-[#00c8b4]">click to upload</span>
            </p>
            <p className="font-mono text-[9px] text-[#6b7280] uppercase tracking-widest">Max 5MB</p>
          </>
        )}
      </div>

      {hasError && !resumeText && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[11px] text-[#e76f51] flex items-center gap-1.5 bg-[#e76f51]/8 px-3 py-2 rounded-lg border border-[#e76f51]/20"
        >
          Please add your resume before continuing
        </motion.p>
      )}

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">or paste text</span>
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
      </div>

      <div className="relative flex-1">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume here... (name, experience, skills, education)"
          className={`w-full h-64 resize-none rounded-2xl bg-black/20 border text-[#f0f2ff] text-[14px] p-5 transition-all duration-300 placeholder:text-[#6b7280] focus:bg-black/40 font-mono leading-[1.8] ${
            hasError && !resumeText ? "border-[#e76f51]/60" : "border-[rgba(255,255,255,0.06)]"
          }`}
        />
        <div className="absolute bottom-4 right-4">
          <span className="font-mono text-[10px] text-[#6b7280]">{charCount} chars</span>
        </div>
      </div>
    </div>
  );
}
