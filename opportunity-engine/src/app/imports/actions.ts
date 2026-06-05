"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { parseTenders, parseAwards, synthAnalysis } from "@/lib/canadabuys";
import { forecastRenewal } from "@/lib/renewals";
import { runMatch } from "@/lib/match-run";

function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function csvFromForm(formData: FormData): Promise<string> {
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) return Buffer.from(await file.arrayBuffer()).toString("utf8");
  return String(formData.get("csv") ?? "");
}

export async function importTenders(formData: FormData) {
  const text = await csvFromForm(formData);
  const tenders = parseTenders(text);
  let created = 0;
  for (const t of tenders) {
    // Dedupe on solicitation number + platform when available.
    if (t.solicitationNo) {
      const existing = await prisma.opportunity.findFirst({
        where: { solicitationNo: t.solicitationNo, platform: "CanadaBuys" },
        select: { id: true },
      });
      if (existing) continue;
    }
    const analysis = synthAnalysis(t);
    const opp = await prisma.opportunity.create({
      data: {
        title: t.title,
        buyer: t.buyer || null,
        platform: "CanadaBuys",
        jurisdiction: t.jurisdiction || null,
        solicitationNo: t.solicitationNo || null,
        status: "open",
        closingDate: toDate(t.closingDate),
        estimatedValue: t.value ?? null,
        analysis,
        analyzedAt: new Date(),
      },
    });
    await runMatch(opp.id, analysis, { jurisdiction: t.jurisdiction, estimatedValue: t.value });
    created++;
  }
  await prisma.auditLog.create({ data: { action: "import_tenders", detail: `${created} of ${tenders.length}` } });
  revalidatePath("/documents");
  revalidatePath("/imports");
}

export async function importAwards(formData: FormData) {
  const text = await csvFromForm(formData);
  const awards = parseAwards(text);
  let created = 0;
  for (const a of awards) {
    const awardDate = toDate(a.awardDate);
    const startDate = toDate(a.startDate);
    const endDate = toDate(a.endDate);
    const f = forecastRenewal({ awardDate, startDate, endDate });
    await prisma.awardedContract.create({
      data: {
        buyer: a.buyer, supplier: a.supplier || null, title: a.title,
        jurisdiction: a.jurisdiction || null, platform: "CanadaBuys",
        value: a.value ?? null, awardDate, startDate,
        endDate: f.endDate, endEstimated: f.endEstimated, rebidWindow: f.rebidWindow,
        status: f.status, codes: [...a.gsin, ...a.unspsc],
      },
    });
    created++;
  }
  await prisma.auditLog.create({ data: { action: "import_awards", detail: `${created} of ${awards.length}` } });
  revalidatePath("/awards");
  revalidatePath("/imports");
}
