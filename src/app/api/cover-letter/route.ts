import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, COVER_LETTER_SYSTEM_PROMPT } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, creativity } = await req.json();
    if (!resumeText || !jdText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: creativity ?? 0.7,
      max_tokens: 1024,
      messages: [
        { role: "system", content: COVER_LETTER_SYSTEM_PROMPT },
        {
          role: "user",
          content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`,
        },
      ],
    });

    const coverLetter = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ coverLetter });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Cover letter generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
