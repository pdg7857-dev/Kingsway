import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeName, rollupAwards } from "@/lib/oi/awards";
import { enrichAndScore } from "@/lib/oi/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const award = z.object({
  supplierName: z.string().min(1),
  title: z.string().min(1),
  agency: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  valueDollars: z.coerce.number().int().optional().nullable(),
  awardDate: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  contractLengthMonths: z.coerce.number().int().optional().nullable(),
  renewalOption: z.boolean().optional(),
  platform: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
  sourceRef: z.string().optional().nullable(),
  prospectId: z.string().optional().nullable(),
});

const schema = z.object({ awards: z.array(award).min(1).max(1000) });

export async function GET() {
  const user = await requireCurrentUser();
  const awards = await prisma.govAward.findMany({
    where: { userId: user.id },
    include: { prospect: true, buyer: true },
    orderBy: { awardDate: "desc" },
    take: 500,
  });
  return NextResponse.json({ awards });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const { awards } = schema.parse(await req.json());

  // Pre-load prospects to match suppliers by normalised name.
  const prospects = await prisma.prospect.findMany({ where: { userId: user.id } });
  const byNorm = new Map(prospects.map((p) => [normalizeName(p.companyName), p.id]));

  const touched = new Set<string>();
  for (const a of awards) {
    const norm = normalizeName(a.supplierName);
    const prospectId = a.prospectId ?? byNorm.get(norm) ?? null;
    if (prospectId) touched.add(prospectId);
    await prisma.govAward.create({
      data: {
        userId: user.id,
        prospectId,
        supplierName: a.supplierName,
        supplierNorm: norm,
        title: a.title,
        agency: a.agency ?? null,
        department: a.department ?? null,
        category: a.category ?? null,
        region: a.region ?? null,
        location: a.location ?? null,
        valueDollars: a.valueDollars ?? null,
        awardDate: a.awardDate ? new Date(a.awardDate) : null,
        startDate: a.startDate ? new Date(a.startDate) : null,
        endDate: a.endDate ? new Date(a.endDate) : null,
        contractLengthMonths: a.contractLengthMonths ?? null,
        renewalOption: a.renewalOption ?? false,
        platform: a.platform ?? null,
        sourceUrl: a.sourceUrl ?? null,
        sourceRef: a.sourceRef ?? null,
      },
    });
  }

  // Recompute rollups + GOII Index™ for every matched prospect.
  for (const id of touched) {
    const p = prospects.find((x) => x.id === id)!;
    const list = await prisma.govAward.findMany({ where: { userId: user.id, prospectId: id } });
    const rollup = rollupAwards(list);
    const { fields } = enrichAndScore({
      industry: p.industry,
      region: p.region,
      country: p.country,
      employeesEstimate: p.employeesEstimate,
      revenueEstimateDollars: p.revenueEstimateDollars,
      locationsCount: p.locationsCount,
      govExperience: true,
      govClientTypes: p.govClientTypes,
      procurementMaturity: p.procurementMaturity,
      awardCount: rollup.awardCount,
      totalWonDollars: rollup.totalWonDollars,
      largestAwardDollars: rollup.largestAwardDollars,
      lastAwardAt: rollup.lastAwardAt,
    });
    await prisma.prospect.update({
      where: { id },
      data: { ...rollup, govExperience: true, ...fields },
    });
  }

  return NextResponse.json({ ingested: awards.length, matchedProspects: touched.size });
}
