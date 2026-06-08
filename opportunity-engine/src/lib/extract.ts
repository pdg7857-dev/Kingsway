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

export type BundlePart = { name: string; text: string; pageCount: number; needsOcr: boolean };

const PAGE = (n: number, body: string) => `[p.${n}]\n${body}`;

export async function extractFromBuffer(buf: Buffer, name: string): Promise<Extracted> {
  const lower = (name || "").toLowerCase();

  if (lower.endsWith(".pdf")) {
    const { getDocumentProxy, extractText } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { totalPages, text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? text : [String(text)];
    const joined = pages.map((p, i) => PAGE(i + 1, (p ?? "").trim())).join("\n\n");
    const stripped = joined.replace(/\[p\.\d+\]/g, "").trim();
    return { text: joined, pageCount: totalPages, needsOcr: stripped.length < 40, kind: "pdf" };
  }

  if (lower.endsWith(".docx")) {
    const mammoth = (await import("mammoth")).default ?? (await import("mammoth"));
    const { value } = await (mammoth as { extractRawText: (o: { buffer: Buffer }) => Promise<{ value: string }> }).extractRawText({ buffer: buf });
    return { text: value.trim(), pageCount: 1, needsOcr: value.trim().length < 40, kind: "docx" };
  }

  const text = buf.toString("utf8");
  return { text: text.trim(), pageCount: 1, needsOcr: false, kind: "text" };
}

export async function extractFromFile(file: File): Promise<Extracted> {
  return extractFromBuffer(Buffer.from(await file.arrayBuffer()), file.name || "");
}

/** Expand a zip and extract each supported file inside it (#2 bundles). */
export async function extractFromZip(buf: Buffer): Promise<BundlePart[]> {
  const AdmZip = (await import("adm-zip")).default;
  const zip = new AdmZip(buf);
  const out: BundlePart[] = [];
  for (const e of zip.getEntries()) {
    if (e.isDirectory) continue;
    const name = e.entryName;
    if (!/\.(pdf|docx|txt)$/i.test(name)) continue;
    const ex = await extractFromBuffer(e.getData(), name);
    out.push({ name: name.split("/").pop() || name, text: ex.text, pageCount: ex.pageCount, needsOcr: ex.needsOcr });
  }
  return out;
}
