import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { researchProspect } from "@/lib/oi/ai";
import { enrichAndScore } from "@/lib/oi/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const p = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!p || p.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const r = await researchProspect(p, { userId: user.id });

  const merged = {
    industry: r.industry ?? p.industry,
    subIndustry: r.subIndustry ?? p.subIndustry,
    region: p.region,
    country: p.country,
    companySize: r.companySize ?? p.companySize,
    employeesEstimate: r.employeesEstimate ?? p.employeesEstimate,
    revenueEstimateDollars: r.revenueEstimateDollars ?? p.revenueEstimateDollars,
    locationsCount: r.locationsCount ?? p.locationsCount,
    govExperience: r.govExperience ?? p.govExperience,
    govClientTypes: r.govClientTypes?.length ? r.govClientTypes : p.govClientTypes,
    procurementMaturity: r.procurementMaturity ?? p.procurementMaturity,
    awardCount: p.awardCount,
    totalWonDollars: p.totalWonDollars,
    largestAwardDollars: p.largestAwardDollars,
    lastAwardAt: p.lastAwardAt,
  };

  const { fields } = enrichAndScore(merged);

  const prospect = await prisma.prospect.update({
    where: { id: p.id },
    data: {
      industry: merged.industry,
      subIndustry: merged.subIndustry ?? undefined,
      companySize: merged.companySize ?? undefined,
      employeesEstimate: merged.employeesEstimate ?? undefined,
      revenueEstimateDollars: merged.revenueEstimateDollars ?? undefined,
      locationsCount: merged.locationsCount ?? undefined,
      govExperience: merged.govExperience ?? false,
      govClientTypes: merged.govClientTypes ?? [],
      procurementMaturity: merged.procurementMaturity ?? "UNKNOWN",
      researchNotes: r.researchNotes,
      researchSources: r.researchSources ?? [],
      researchedAt: new Date(),
      stage: p.stage === "NEW" ? "RESEARCHED" : p.stage,
      ...fields,
    },
  });
  return NextResponse.json({ prospect });
}
