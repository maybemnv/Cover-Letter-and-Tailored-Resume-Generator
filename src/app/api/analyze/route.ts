import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";
import { calculateScores, getMissingKeywords } from "@/lib/nlpUtils";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jdText, creativity } = await req.json();
    if (!resumeText || !jdText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const preliminary = calculateScores(resumeText, jdText);
    const missingKeywords = getMissingKeywords(resumeText, jdText);

    const systemPrompt = `You are an expert ATS and resume analyst. Analyze the resume against the job description.
Return ONLY a valid JSON object — no markdown fences, no extra text — with exactly these fields:
{
  "overallScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "keywordsScore": number (0-100),
  "suggestions": [{ "priority": "high"|"medium"|"low", "text": string }] (max 6 items),
  "missingKeywords": string[] (max 10 items)
}
Preliminary NLP scores for context (use as hints, not limits): ${JSON.stringify(preliminary)}.`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: creativity ?? 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`,
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
