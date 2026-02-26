"use client";

import { useCallback, useRef, useState } from "react";
import { useAppStore } from "@/store/appStore";

export default function ResumeCard() {
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

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center justify-between mb-1">
        <label className="font-mono text-xs font-bold tracking-[0.2em] text-[#78828f] uppercase">
          Your Resume
        </label>
        {fileName && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-[#2a9d8f] bg-[#2a9d8f]/10 px-2.5 py-1 rounded-md border border-[#2a9d8f]/20">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            {fileName}
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 h-28 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          dragging
            ? "border-[#2a9d8f] bg-[#2a9d8f]/5 scale-[1.02]"
            : "border-[#1e2530] bg-[#0a0c10] hover:border-[#2a9d8f]/50 hover:bg-[#12151a]"
        }`}
      >
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
          <svg
            className="animate-spin w-6 h-6 text-[#2a9d8f]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          <>
            <div className="p-2.5 rounded-full bg-[#1e2530]/50 text-[#78828f]">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="font-mono text-[#78828f] text-xs">
              Drop PDF / DOCX or click upload
            </p>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1e2530] to-[#1e2530]" />
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#4b5563]">
          or paste text
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#1e2530] to-[#1e2530]" />
      </div>

      {/* Textarea */}
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your raw resume content here..."
        className="w-full h-full min-h-[240px] resize-none rounded-2xl bg-[#0a0c10] border border-[#1e2530] text-[#f5f5f4] text-[13px] p-5 transition-all duration-300 placeholder:text-[#4b5563] focus:bg-[#12151a] font-mono leading-[1.8]"
      />
    </div>
  );
}
