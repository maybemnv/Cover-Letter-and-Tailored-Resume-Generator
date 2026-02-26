"use client";

export async function exportTxt(content: string): Promise<void> {
  const blob = new Blob([content], { type: "text/plain" });
  download(blob, "export.txt");
}

export async function exportPdf(content: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(content, pageWidth);
  let y = margin;
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 16;
  }
  doc.save("export.pdf");
}

export async function exportDocx(content: string): Promise<void> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");
  const paragraphs = content.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 22 })],
        spacing: { after: 120 },
      })
  );
  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  download(blob, "export.docx");
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
