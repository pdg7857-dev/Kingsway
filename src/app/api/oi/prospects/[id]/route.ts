import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrichAndScore } from "@/lib/oi/pipeline";

export const dynamic = "force-dynamic";

const patch = z.object({
  contactName: z.string().nullable().optional(),
  contactTitle: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  subIndustry: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  employeesEstimate: z.coerce.number().int().nullable().optional(),
  revenueEstimateDollars: z.coerce.number().int().nullable().optional(),
  locationsCount: z.coerce.number().int().nullable().optional(),
  govExperience: z.boolean().optional(),
  govClientTypes: z.array(z.string()).optional(),
  procurementMaturity: z.enum(["UNKNOWN", "LOW", "MEDIUM", "HIGH"]).optional(),
  stage: z.string().optional(),
  notes: z.string().nullable().optional(),
  touch: z.boolean().optional(),
  rescore: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const prospect = await prisma.prospect.findUnique({
    where: { id: params.id },
    include: { awards: { orderBy: { awardDate: "desc" } }, outreach: { orderBy: { createdAt: "desc" } }, renewals: true },
  });
  if (!prospect || prospect.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ prospect });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const existing = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = patch.parse(await req.json());
  const data: any = {};
  for (const k of [
    "contactName", "contactTitle", "email", "phone", "website", "linkedinUrl", "industry",
    "subIndustry", "city", "region", "country", "employeesEstimate", "revenueEstimateDollars",
    "locationsCount", "govExperience", "govClientTypes", "procurementMaturity", "stage", "notes",
  ] as const) {
    if (body[k] !== undefined) data[k] = body[k];
  }
  if (body.touch) {
    data.lastContactedAt = new Date();
    if (existing.stage === "NEW" || existing.stage === "RESEARCHED" || existing.stage === "SCORED") data.stage = "OUTREACH";
  }

  // Re-score when scoring inputs change (default true) so tier stays accurate.
  if (body.rescore !== false) {
    const merged = { ...existing, ...data };
    const { fields } = enrichAndScore({
      industry: merged.industry,
      region: merged.region,
      country: merged.country,
      employeesEstimate: merged.employeesEstimate,
      revenueEstimateDollars: merged.revenueEstimateDollars,
      locationsCount: merged.locationsCount,
      govExperience: merged.govExperience,
      govClientTypes: merged.govClientTypes,
      procurementMaturity: merged.procurementMaturity,
      awardCount: merged.awardCount,
      totalWonDollars: merged.totalWonDollars,
      largestAwardDollars: merged.largestAwardDollars,
      lastAwardAt: merged.lastAwardAt,
      primaryPlatforms: merged.primaryPlatforms,
      secondaryPlatforms: merged.secondaryPlatforms,
    });
    Object.assign(data, fields);
  }

  const prospect = await prisma.prospect.update({ where: { id: params.id }, data });
  return NextResponse.json({ prospect });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const existing = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.prospect.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
