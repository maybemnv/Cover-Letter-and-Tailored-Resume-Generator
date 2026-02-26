"use client";

import { useCallback, useRef, useState } from "react";
import { useAppStore } from "@/store/appStore";

export default function ResumeCard() {
  const { resumeText, setResumeText } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
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
  }, [setResumeText]);

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1">
        <label
          className="text-xs tracking-widest text-[#5a6470] uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Your Resume
        </label>
        {fileName && (
          <span
            className="flex items-center gap-1.5 text-xs text-[#2a9d8f]"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
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
        className={`relative flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-[#2a9d8f] bg-[#2a9d8f]/5"
            : "border-[#1e2530] bg-[#0f1215] hover:border-[#2a9d8f]/60"
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
          <svg className="animate-spin w-5 h-5 text-[#2a9d8f]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <>
            <svg className="w-5 h-5 text-[#5a6470]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-[#5a6470] text-sm" style={{ fontFamily: "var(--font-dm-mono)" }}>
              Drop PDF / DOCX or click to upload
            </p>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#1e2530]" />
        <span className="text-[11px] text-[#5a6470]" style={{ fontFamily: "var(--font-dm-mono)" }}>
          or paste text
        </span>
        <div className="flex-1 h-px bg-[#1e2530]" />
      </div>

      {/* Textarea */}
      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste your resume content here..."
        rows={10}
        className="w-full resize-none rounded-xl bg-[#0f1215] border border-[#1e2530] text-[#eae8e3] text-sm p-4 transition-all duration-200 placeholder:text-[#5a6470]"
        style={{ fontFamily: "var(--font-dm-mono)", lineHeight: "1.7" }}
      />
    </div>
  );
}
