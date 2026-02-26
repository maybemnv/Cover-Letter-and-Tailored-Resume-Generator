import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface LatexResultProps {
  latexCode: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}

export default function LatexResult({ latexCode, copied, onCopy, onDownload }: LatexResultProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden border border-[#1e2530] shadow-2xl relative">
        <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
          <div className="w-3 h-3 rounded-full bg-[#1e2530]" />
          <div className="w-3 h-3 rounded-full bg-[#1e2530]" />
          <div className="w-3 h-3 rounded-full bg-[#1e2530]" />
        </div>
        <SyntaxHighlighter
          language="latex"
          style={atomDark}
          customStyle={{
            background: "#080a0c",
            margin: 0,
            padding: "2rem",
            maxHeight: "600px",
            fontFamily: "var(--font-dm-mono-var)",
            fontSize: "13px",
            lineHeight: "1.8",
          }}
          showLineNumbers
          lineNumberStyle={{ color: "#2a3540", fontSize: "12px", minWidth: "3em" }}
        >
          {latexCode}
        </SyntaxHighlighter>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onCopy}
          className="flex-1 py-4 rounded-xl border border-[#e9c46a]/40 text-[#e9c46a] font-syne font-bold tracking-wide hover:bg-[#e9c46a] hover:text-[#030405] transition-all"
        >
          {copied ? "Copied to Clipboard" : "Copy to Overleaf"}
        </button>
        <button
          onClick={onDownload}
          className="flex-1 py-4 rounded-xl bg-[#2a9d8f]/10 border border-[#2a9d8f]/40 text-[#2a9d8f] font-syne font-bold tracking-wide hover:bg-[#2a9d8f] hover:text-[#030405] transition-all"
        >
          Download .tex
        </button>
      </div>
    </div>
  );
}
