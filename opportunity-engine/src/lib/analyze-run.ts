import { prisma } from "./db";
import { sha256 } from "./text";
import { analyzeSolicitation, costUsd } from "./anthropic";
import { extractFromFile, extractFromBuffer, extractFromZip, type BundlePart } from "./extract";
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
    const { analysis, usage } = await analyzeSolicitation({ text, filename: fallbackTitle });
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
        needsReview: analysis.confidence_overall < 0.5,
        analysis,
        analyzedAt: new Date(),
        analysisTokensIn: usage.input,
        analysisTokensOut: usage.output,
        analysisCostUsd: costUsd(usage),
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

/** Analyze one or more uploaded files together (#2). Zips are expanded; all
 *  extracted text is combined with file markers and analyzed as one tender. */
export async function analyzeUploadedBundle(files: File[], source: string | null, titleIn?: string): Promise<string> {
  const parts: BundlePart[] = [];
  let firstBuf: Buffer | null = null;
  let firstName = "";
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer());
    if (!firstBuf) { firstBuf = buf; firstName = file.name; }
    if (/\.zip$/i.test(file.name)) parts.push(...(await extractFromZip(buf)));
    else {
      const ex = await extractFromBuffer(buf, file.name);
      parts.push({ name: file.name, text: ex.text, pageCount: ex.pageCount, needsOcr: ex.needsOcr });
    }
  }

  const usable = parts.filter((p) => p.text && p.text.length >= 40);
  const totalPages = parts.reduce((s, p) => s + (p.pageCount || 0), 0);
  const longest = [...usable].sort((a, b) => b.text.length - a.text.length)[0];
  const title = titleIn?.trim() || (longest ? longest.name.replace(/\.[^.]+$/, "") : "") || firstName || "Solicitation bundle";
  const stored = firstBuf ? await storeFile(firstBuf, firstName) : null;

  if (usable.length === 0) {
    const opp = await prisma.opportunity.create({
      data: {
        title, status: "open", needsReview: true,
        analysis: { error: "No extractable text in the uploaded files (likely scanned). OCR is not yet wired." },
        documents: { create: { title, docType: "solicitation", source, sha256: sha256(`${firstName}:${Date.now()}`), storagePath: stored?.storagePath ?? null, pageCount: totalPages, extractedText: "" } },
      },
    });
    return opp.id;
  }

  const combined = usable.map((p) => `===== FILE: ${p.name} =====\n${p.text}`).join("\n\n");
  const opp = await prisma.opportunity.create({
    data: {
      title, status: "analyzing",
      documents: { create: { title, docType: "solicitation", source, sha256: sha256(combined), storagePath: stored?.storagePath ?? null, pageCount: totalPages, extractedText: combined } },
    },
  });
  await processSolicitation(opp.id, combined, title);
  return opp.id;
}
