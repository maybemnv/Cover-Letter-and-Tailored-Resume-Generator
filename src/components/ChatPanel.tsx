"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/appStore";
import type { ChatMessage } from "@/types";

export default function ChatPanel() {
  const { output, mode, chatHistory, chatOpen, addChatMessage, setChatOpen, setOutput } =
    useAppStore();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  if (!output) return null;

  const getCurrentOutputText = (): string => {
    if (output.type === "cover-letter") return output.coverLetter ?? "";
    if (output.type === "latex") return output.latexCode ?? "";
    if (output.type === "quick-tips") return (output.tips ?? []).join("\n\n");
    const r = output.matchResult;
    if (!r) return "";
    return JSON.stringify(r, null, 2);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    if (chatHistory.length >= 20) {
      toast("Start a new session — max messages reached.");
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: text };
    addChatMessage(userMsg);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          currentOutput: getCurrentOutputText(),
          mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      addChatMessage({ role: "assistant", content: data.reply });

      if (data.updatedOutput !== getCurrentOutputText()) {
        const updated = { ...output };
        if (output.type === "cover-letter") updated.coverLetter = data.updatedOutput;
        else if (output.type === "latex") updated.latexCode = data.updatedOutput;
        else if (output.type === "quick-tips")
          updated.tips = data.updatedOutput.split("\n\n");
        setOutput(updated);
        toast.success("Output updated by AI!");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center max-w-2xl mx-auto">
      {/* Toggle */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#12151a]/80 border border-[#1e2530] hover:border-[#2a9d8f]/50 hover:bg-[#12151a] shadow-lg transition-all"
      >
        <span className="text-[#2a9d8f] group-hover:drop-shadow-[0_0_8px_rgba(42,157,143,0.8)] transition-all">✦</span>
        <span className="font-mono text-[11px] font-bold tracking-widest uppercase text-[#78828f] group-hover:text-[#f5f5f4] transition-colors">
          {chatOpen ? "Close chat refine" : "Refine with AI"}
        </span>
        <motion.span animate={{ rotate: chatOpen ? 180 : 0 }} className="text-[#4b5563] text-xs transition-colors group-hover:text-[#2a9d8f]">
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: "auto", opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-4"
          >
            <div className="glass-panel w-full rounded-[2rem] border border-[#1e2530] overflow-hidden shadow-2xl">
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-5 space-y-4">
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                    <span className="text-3xl">🪄</span>
                    <p className="font-mono text-[#78828f] text-xs">
                      Tell me how to refine the output above... <br />
                      e.g. &quot;Shorter first paragraph&quot;, &quot;Add Python to skills&quot;
                    </p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] font-mono text-[13px] px-4 py-3 rounded-2xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#2a9d8f] text-black shadow-[0_4px_16px_rgba(42,157,143,0.2)] rounded-br-sm"
                          : "bg-[#1e2530]/50 border border-[#1e2530] text-[#eae8e3] rounded-bl-sm"
                      }`}
                    >
                      {msg.content.length > 200
                        ? msg.content.slice(0, 200) + "..."
                        : msg.content}
                    </div>
                  </motion.div>
                ))}
                <div ref={bottomRef} className="h-1" />
              </div>

              {/* Input */}
              <div className="border-t border-[#1e2530] p-3 bg-[#0a0c10]/50">
                <div className="flex items-end gap-2 bg-[#12151a] rounded-xl border border-[#1e2530] p-1.5 focus-within:border-[#2a9d8f]/50 focus-within:ring-1 focus-within:ring-[#2a9d8f]/30 transition-all">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Refine it..."
                    className="flex-1 max-h-32 min-h-[44px] resize-none bg-transparent text-[#f5f5f4] text-sm placeholder:text-[#4b5563] border-0 focus:outline-none p-3 font-mono"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !input.trim()}
                    className="flex-shrink-0 h-11 w-11 flex items-center justify-center rounded-lg bg-[#2a9d8f] text-black disabled:opacity-30 transition-all hover:bg-[#228578] disabled:hover:bg-[#2a9d8f] mb-[1px] mr-[1px]"
                  >
                    {sending ? (
                      <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
