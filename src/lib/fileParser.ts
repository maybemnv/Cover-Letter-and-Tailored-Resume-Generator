export async function parseFile(buffer: Buffer, ext: string): Promise<string> {
  if (ext === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text.trim();
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (ext === "txt") {
    return new TextDecoder().decode(buffer).trim();
  }

  throw new Error(`Unsupported file type: .${ext}`);
}
