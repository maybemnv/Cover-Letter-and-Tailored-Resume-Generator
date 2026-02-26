import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, LATEX_SYSTEM_PROMPT } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { jdText, baseLatex, creativity } = await req.json();
    if (!jdText || !baseLatex) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: creativity ?? 0.4,
      messages: [
        { role: "system", content: LATEX_SYSTEM_PROMPT },
        {
          role: "user",
          content: `BASE LATEX RESUME:\n${baseLatex}\n\nJOB DESCRIPTION:\n${jdText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const latexCode = raw.replace(/^```(?:latex|tex)?\n?/i, "").replace(/```$/m, "").trim();

    return NextResponse.json({ latexCode });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "LaTeX generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
