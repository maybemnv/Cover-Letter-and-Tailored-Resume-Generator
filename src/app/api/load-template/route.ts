import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // On Vercel, use the bundled file path
    const filePath = join(process.cwd(), "resume.tex");
    const latex = await readFile(filePath, "utf-8");
    return NextResponse.json({ latex });
  } catch {
    // Return empty string instead of 500 — template is optional
    return NextResponse.json({ latex: "" });
  }
}

// Bundle resume.tex with the serverless function
export const dynamic = "force-dynamic";
