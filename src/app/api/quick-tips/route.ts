import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, QUICK_TIPS_SYSTEM_PROMPT } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, creativity } = await req.json();
    if (!resumeText) {
      return NextResponse.json({ error: "Missing resume text" }, { status: 400 });
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: creativity ?? 0.5,
      max_tokens: 1024,
      messages: [
        { role: "system", content: QUICK_TIPS_SYSTEM_PROMPT },
        {
          role: "user",
          content: jdText
            ? `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`
            : `RESUME:\n${resumeText}`,
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
