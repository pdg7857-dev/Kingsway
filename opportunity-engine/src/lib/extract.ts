// Document text extraction. Digital PDFs (unpdf) and DOCX (mammoth) are read
// directly; page markers like [p.N] are inserted so the analyzer can cite pages.
// Scanned PDFs (little or no extractable text) are flagged needsOcr; wiring an
// OCR engine (e.g. tesseract.js) is the remaining piece of this phase.

export type Extracted = {
  text: string;
  pageCount: number;
  needsOcr: boolean;
  kind: "pdf" | "docx" | "text";
};

const PAGE = (n: number, body: string) => `[p.${n}]\n${body}`;

export async function extractFromFile(file: File): Promise<Extracted> {
  const name = (file.name || "").toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const { getDocumentProxy, extractText } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { totalPages, text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? text : [String(text)];
    const joined = pages.map((p, i) => PAGE(i + 1, (p ?? "").trim())).join("\n\n");
    const stripped = joined.replace(/\[p\.\d+\]/g, "").trim();
    return { text: joined, pageCount: totalPages, needsOcr: stripped.length < 40, kind: "pdf" };
  }

  if (name.endsWith(".docx")) {
    const mammoth = (await import("mammoth")).default ?? (await import("mammoth"));
    const { value } = await (mammoth as { extractRawText: (o: { buffer: Buffer }) => Promise<{ value: string }> }).extractRawText({ buffer: buf });
    return { text: value.trim(), pageCount: 1, needsOcr: value.trim().length < 40, kind: "docx" };
  }

  // Plain text / fallback.
  const text = buf.toString("utf8");
  return { text: text.trim(), pageCount: 1, needsOcr: false, kind: "text" };
}
