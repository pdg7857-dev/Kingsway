import { prisma } from "./db";
import { sha256 } from "./text";
import { analyzeSolicitation } from "./anthropic";
import { extractFromFile } from "./extract";
import { storeFile } from "./storage";
import { runMatch } from "./match-run";

function toDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Analyze an opportunity's text and run client matching. No redirect; safe to
 *  call from server actions and route handlers alike. */
export async function processSolicitation(oppId: string, text: string, fallbackTitle: string): Promise<void> {
  try {
    const analysis = await analyzeSolicitation({ text, filename: fallbackTitle });
    const jurisdiction = analysis.solicitation.jurisdiction || null;
    const estimatedValue = analysis.estimated_value.amount;

    await prisma.opportunity.update({
      where: { id: oppId },
      data: {
        title: analysis.solicitation.title || fallbackTitle,
        buyer: analysis.solicitation.issuing_body || null,
        platform: analysis.solicitation.platform || null,
        jurisdiction,
        solicitationNo: analysis.solicitation.solicitation_number || null,
        type: analysis.solicitation.type || null,
        status: "open",
        closingDate: toDate(analysis.key_dates.closing),
        estimatedValue: estimatedValue ?? null,
        currency: analysis.estimated_value.currency || "CAD",
        analysis,
        analyzedAt: new Date(),
      },
    });

    await runMatch(oppId, analysis, { jurisdiction, estimatedValue });
    await prisma.auditLog.create({ data: { action: "analyze", detail: `${oppId} ${fallbackTitle}` } });
  } catch (err) {
    await prisma.opportunity.update({
      where: { id: oppId },
      data: { status: "open", analysis: { error: String(err instanceof Error ? err.message : err) } },
    });
  }
}

export async function analyzePastedText(text: string, source: string | null, title: string): Promise<string> {
  const opp = await prisma.opportunity.create({
    data: {
      title,
      status: "analyzing",
      documents: { create: { title, docType: "solicitation", source, sha256: sha256(text), extractedText: text } },
    },
  });
  await processSolicitation(opp.id, text, title);
  return opp.id;
}

export async function analyzeUploadedFile(file: File, source: string | null, titleIn?: string): Promise<string> {
  const buf = Buffer.from(await file.arrayBuffer());
  const extracted = await extractFromFile(file);
  const title = titleIn?.trim() || file.name || "Uploaded solicitation";

  if (extracted.needsOcr || extracted.text.length < 40) {
    const stored = await storeFile(buf, file.name);
    const opp = await prisma.opportunity.create({
      data: {
        title,
        status: "open",
        analysis: { error: "No extractable text (likely a scanned PDF). OCR is not yet wired; upload a text-based PDF or paste the text." },
        documents: { create: { title, docType: "solicitation", source, sha256: sha256(buf.toString("base64")), storagePath: stored.storagePath, pageCount: extracted.pageCount, extractedText: "" } },
      },
    });
    return opp.id;
  }

  const stored = await storeFile(buf, file.name);
  const opp = await prisma.opportunity.create({
    data: {
      title,
      status: "analyzing",
      documents: { create: { title, docType: "solicitation", source, sha256: sha256(extracted.text), storagePath: stored.storagePath, pageCount: extracted.pageCount, extractedText: extracted.text } },
    },
  });
  await processSolicitation(opp.id, extracted.text, title);
  return opp.id;
}
