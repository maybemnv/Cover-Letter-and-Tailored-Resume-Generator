import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, ANALYZE_SYSTEM_PROMPT } from "@/lib/groq";
import { calculateScores, getMissingKeywords } from "@/lib/nlpUtils";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, creativity } = await req.json();
    if (!resumeText || !jdText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const preliminary = calculateScores(resumeText, jdText);
    const missingKeywords = getMissingKeywords(resumeText, jdText);

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: creativity ?? 0.3,
      messages: [
        { role: "system", content: ANALYZE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Preliminary NLP scores (use as context, not constraints): ${JSON.stringify(preliminary)}\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      ...parsed,
      missingKeywords: parsed.missingKeywords?.length ? parsed.missingKeywords : missingKeywords,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
