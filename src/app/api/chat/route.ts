import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, CHAT_SYSTEM_PROMPT } from "@/lib/groq";
import type { ChatMessage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { messages, currentOutput, mode } = await req.json() as {
      messages: ChatMessage[];
      currentOutput: string;
      mode: string;
    };

    if (!messages?.length || !currentOutput) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.5,
      max_tokens: 2048,
      messages: [
        { role: "system", content: CHAT_SYSTEM_PROMPT },
        {
          role: "user",
          content: `CURRENT OUTPUT (mode: ${mode}):\n\n${currentOutput}`,
        },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    // Determine if the reply is an updated output or just a chat response
    const isUpdate = reply.length > 100 && (
      mode === "latex" ? reply.includes("\\") :
      mode === "cover-letter" ? reply.length > 200 :
      true
    );

    return NextResponse.json({
      reply,
      updatedOutput: isUpdate ? reply : currentOutput,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
