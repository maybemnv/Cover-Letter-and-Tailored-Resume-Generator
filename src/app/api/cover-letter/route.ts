import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";

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
      messages: [
        {
          role: "system",
          content: `You are an expert career counselor and professional writer. Write a tailored, confident cover letter in exactly 3 paragraphs. Do NOT use placeholder brackets like [Company Name] or [Your Name]. Use natural confident prose. No generic phrases. End with a strong call to action.`,
        },
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
