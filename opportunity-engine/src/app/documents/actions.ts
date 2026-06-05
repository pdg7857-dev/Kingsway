"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { sha256 } from "@/lib/text";
import { analyzeSolicitation } from "@/lib/anthropic";
import { matchOpportunity, type ClientForMatch } from "@/lib/matching";

function toDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function analyzeText(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim() || "Untitled solicitation";
  const text = String(formData.get("text") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim() || null;
  if (!text) return;

  // Create the opportunity + stored document first so nothing is lost.
  const opp = await prisma.opportunity.create({
    data: {
      title,
      status: "analyzing",
      documents: {
        create: { title, docType: "solicitation", source, sha256: sha256(text), extractedText: text },
      },
    },
  });

  try {
    const analysis = await analyzeSolicitation({ text, filename: title });

    const jurisdiction = analysis.solicitation.jurisdiction || null;
    const estimatedValue = analysis.estimated_value.amount;

    await prisma.opportunity.update({
      where: { id: opp.id },
      data: {
        title: analysis.solicitation.title || title,
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

    // Pull client profiles and run the matcher.
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
        where: { opportunityId_clientId: { opportunityId: opp.id, clientId: r.clientId } },
        update: {
          score: r.score, recommendation: r.recommendation, rationale: r.rationale,
          matchedCodes: r.matchedCodes, matchedKeywords: r.matchedKeywords,
          geographyFit: r.geographyFit, valueFit: r.valueFit, blockers: r.blockers,
        },
        create: {
          opportunityId: opp.id, clientId: r.clientId,
          score: r.score, recommendation: r.recommendation, rationale: r.rationale,
          matchedCodes: r.matchedCodes, matchedKeywords: r.matchedKeywords,
          geographyFit: r.geographyFit, valueFit: r.valueFit, blockers: r.blockers,
        },
      });
    }

    await prisma.auditLog.create({ data: { action: "analyze", detail: `${opp.id} ${title}` } });
  } catch (err) {
    // Keep the opportunity; record that analysis did not complete.
    await prisma.opportunity.update({
      where: { id: opp.id },
      data: { status: "open", analysis: { error: String(err instanceof Error ? err.message : err) } },
    });
  }

  redirect(`/documents/${opp.id}`);
}
