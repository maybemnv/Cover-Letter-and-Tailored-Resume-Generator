"use client";

import { useAppStore } from "@/store/appStore";

export default function JDCard() {
  const { jdText, setJdText } = useAppStore();

  return (
    <div className="flex flex-col gap-4">
      <label
        className="text-xs tracking-widest text-[#5a6470] uppercase"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        Job Description
      </label>
      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="Paste the job posting here..."
        rows={17}
        className="w-full resize-none rounded-xl bg-[#0f1215] border border-[#1e2530] text-[#eae8e3] text-sm p-4 transition-all duration-200 placeholder:text-[#5a6470]"
        style={{ fontFamily: "var(--font-dm-mono)", lineHeight: "1.7" }}
      />
    </div>
  );
}
