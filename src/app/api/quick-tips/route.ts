import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, creativity } = await req.json();
    if (!resumeText) {
      return NextResponse.json({ error: "Missing resume text" }, { status: 400 });
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: creativity ?? 0.7,
      messages: [
        {
          role: "system",
          content: `You are a professional resume coach. Return ONLY a valid JSON array of exactly 5 strings — no markdown, no extra text. Each string is a specific, actionable resume improvement tip under 60 words.`,
        },
        {
          role: "user",
          content: `RESUME:\n${resumeText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const tips: string[] = JSON.parse(cleaned);

    return NextResponse.json({ tips });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Quick tips generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
