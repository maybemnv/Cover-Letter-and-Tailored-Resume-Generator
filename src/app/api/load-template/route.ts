import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "resume.tex");
    const latex = await readFile(filePath, "utf-8");
    return NextResponse.json({ latex });
  } catch {
    return NextResponse.json({ error: "Could not load resume.tex" }, { status: 500 });
  }
}
