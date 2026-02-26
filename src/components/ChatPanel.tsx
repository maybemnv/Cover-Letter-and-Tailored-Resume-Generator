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
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Chat failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3">
      {/* Toggle */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="flex items-center gap-2 text-sm text-[#5a6470] hover:text-[#eae8e3] transition-colors"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        <span className="text-[#2a9d8f]">✦</span>
        {chatOpen ? "Close chat" : "Refine with chat"}
        <motion.span animate={{ rotate: chatOpen ? 180 : 0 }} className="text-xs">
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl bg-[#0f1215] border border-[#1e2530] overflow-hidden">
              {/* Messages */}
              <div className="h-56 overflow-y-auto p-4 space-y-3">
                {chatHistory.length === 0 && (
                  <p
                    className="text-[#5a6470] text-xs text-center mt-16"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    Ask me to refine the output above...
                  </p>
                )}
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] text-xs px-3 py-2 rounded-xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#2a9d8f]/15 border border-[#2a9d8f]/25 text-[#eae8e3]"
                          : "bg-[#161b20] border border-[#1e2530] text-[#8a939e]"
                      }`}
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {msg.content.length > 200
                        ? msg.content.slice(0, 200) + "..."
                        : msg.content}
                    </div>
                  </div>
                ))}
                {chatHistory.length >= 18 && (
                  <p className="text-[#e9c46a] text-xs text-center" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    Approaching session limit — switch modes to reset.
                  </p>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[#1e2530] p-3 flex gap-2">
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
                  placeholder="e.g. make the first paragraph shorter..."
                  className="flex-1 resize-none bg-transparent text-[#eae8e3] text-xs placeholder:text-[#5a6470] border-0 focus:outline-none"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-[#2a9d8f] text-black text-xs font-bold disabled:opacity-40 transition-all hover:shadow-[0_0_12px_rgba(42,157,143,0.4)]"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
