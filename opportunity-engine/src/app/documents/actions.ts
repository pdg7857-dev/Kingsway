"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { sha256 } from "@/lib/text";
import { analyzeSolicitation } from "@/lib/anthropic";
import { matchOpportunity, type ClientForMatch } from "@/lib/matching";
import { extractFromFile } from "@/lib/extract";
import { storeFile } from "@/lib/storage";

function toDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Shared analyze + match pipeline. Runs against an opportunity that already
 *  has its source document stored, then redirects to the detail view. */
async function runPipeline(oppId: string, text: string, fallbackTitle: string) {
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

    const clients = await prisma.client.findMany({
      where: { status: { in: ["active", "prospect"] } },
      include: { codes: { include: { code: true } }, keywords: { include: { keyword: true } } },
    });
    const forMatch: ClientForMatch[] = clients.map((c) => ({
      id: c.id,
      name: c.name,
      jurisdictions: c.jurisdictions,
      codes: c.codes.map((cc) => cc.code.code),
      keywordsInclude: c.keywords.filter((k) => !k.exclude).map((k) => k.keyword.normalized),
      keywordsExclude: c.keywords.filter((k) => k.exclude).map((k) => k.keyword.normalized),
      clearances: c.clearances,
      valueMin: c.valueMin ? Number(c.valueMin) : null,
      valueMax: c.valueMax ? Number(c.valueMax) : null,
    }));

    const results = matchOpportunity(analysis, { jurisdiction, estimatedValue }, forMatch);
    for (const r of results) {
      if (r.recommendation === "no" && r.score === 0) continue;
      await prisma.match.upsert({
        where: { opportunityId_clientId: { opportunityId: oppId, clientId: r.clientId } },
        update: { score: r.score, recommendation: r.recommendation, rationale: r.rationale, matchedCodes: r.matchedCodes, matchedKeywords: r.matchedKeywords, geographyFit: r.geographyFit, valueFit: r.valueFit, blockers: r.blockers },
        create: { opportunityId: oppId, clientId: r.clientId, score: r.score, recommendation: r.recommendation, rationale: r.rationale, matchedCodes: r.matchedCodes, matchedKeywords: r.matchedKeywords, geographyFit: r.geographyFit, valueFit: r.valueFit, blockers: r.blockers },
      });
    }
    await prisma.auditLog.create({ data: { action: "analyze", detail: `${oppId} ${fallbackTitle}` } });
  } catch (err) {
    await prisma.opportunity.update({
      where: { id: oppId },
      data: { status: "open", analysis: { error: String(err instanceof Error ? err.message : err) } },
    });
  }
  redirect(`/documents/${oppId}`);
}

export async function analyzeText(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim() || "Untitled solicitation";
  const text = String(formData.get("text") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim() || null;
  if (!text) return;

  const opp = await prisma.opportunity.create({
    data: {
      title,
      status: "analyzing",
      documents: { create: { title, docType: "solicitation", source, sha256: sha256(text), extractedText: text } },
    },
  });
  await runPipeline(opp.id, text, title);
}

export async function analyzeUpload(formData: FormData) {
  const file = formData.get("file");
  const source = String(formData.get("source") ?? "").trim() || null;
  if (!(file instanceof File) || file.size === 0) return;

  const buf = Buffer.from(await file.arrayBuffer());
  const extracted = await extractFromFile(file);
  const title = String(formData.get("title") ?? "").trim() || file.name || "Uploaded solicitation";

  if (extracted.needsOcr || extracted.text.length < 40) {
    // No usable text layer (likely a scanned PDF). Store it and flag for OCR.
    const stored = await storeFile(buf, file.name);
    const opp = await prisma.opportunity.create({
      data: {
        title,
        status: "open",
        analysis: { error: "No extractable text (likely a scanned PDF). OCR is not yet wired; upload a text-based PDF or paste the text." },
        documents: { create: { title, docType: "solicitation", source, sha256: sha256(buf.toString("base64")), storagePath: stored.storagePath, pageCount: extracted.pageCount, extractedText: "" } },
      },
    });
    redirect(`/documents/${opp.id}`);
  }

  const stored = await storeFile(buf, file.name);
  const opp = await prisma.opportunity.create({
    data: {
      title,
      status: "analyzing",
      documents: { create: { title, docType: "solicitation", source, sha256: sha256(extracted.text), storagePath: stored.storagePath, pageCount: extracted.pageCount, extractedText: extracted.text } },
    },
  });
  await runPipeline(opp.id, extracted.text, title);
}
