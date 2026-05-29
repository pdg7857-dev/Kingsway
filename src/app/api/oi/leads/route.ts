import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { enrichAndScore } from "@/lib/oi/pipeline";

export const dynamic = "force-dynamic";

// PUBLIC endpoint — inbound leads from the marketing site's
// Opportunity Waste Calculator. Captures the company as a scored Prospect in
// the operator's CRM so website traffic lands directly in the pipeline.
const schema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().max(200).optional().nullable(),
  email: z.string().email().max(200).optional().nullable(),
  phone: z.string().max(60).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  industry: z.string().max(120).optional().nullable(),
  region: z.string().max(120).optional().nullable(),
  country: z.string().max(120).optional().nullable(),
  employeesEstimate: z.coerce.number().int().min(0).max(1_000_000).optional().nullable(),
  revenueEstimateDollars: z.coerce.number().int().min(0).optional().nullable(),
  locationsCount: z.coerce.number().int().min(0).max(10_000).optional().nullable(),
  govExperience: z.coerce.boolean().optional(),
  procurementMaturity: z.enum(["UNKNOWN", "LOW", "MEDIUM", "HIGH"]).optional(),
});

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());

  // Attach the inbound lead to the operator account.
  const operator = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!operator) return NextResponse.json({ error: "Not configured." }, { status: 503 });

  const biz = await prisma.business.findUnique({
    where: { userId_slug: { userId: operator.id, slug: "eprocurement" } },
  });

  const { fields, result } = enrichAndScore({
    industry: body.industry,
    region: body.region,
    country: body.country ?? "Canada",
    employeesEstimate: body.employeesEstimate,
    revenueEstimateDollars: body.revenueEstimateDollars,
    locationsCount: body.locationsCount,
    govExperience: body.govExperience,
    procurementMaturity: body.procurementMaturity,
  });

  const prospect = await prisma.prospect.create({
    data: {
      userId: operator.id,
      businessId: biz?.id ?? null,
      companyName: body.companyName,
      contactName: body.contactName ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      website: body.website ?? null,
      industry: body.industry ?? null,
      region: body.region ?? null,
      country: body.country ?? "Canada",
      employeesEstimate: body.employeesEstimate ?? null,
      revenueEstimateDollars: body.revenueEstimateDollars ?? null,
      locationsCount: body.locationsCount ?? null,
      govExperience: body.govExperience ?? false,
      procurementMaturity: body.procurementMaturity ?? "UNKNOWN",
      stage: "NEW",
      notes: "Inbound — Opportunity Waste Calculator (website)",
      ...fields,
    },
  });

  return NextResponse.json({
    ok: true,
    prospectId: prospect.id,
    index: result.score,
    tier: result.tier,
    label: result.label,
    opportunityWasteCents: result.opportunityWasteCents,
    recommendedPricingTier: result.recommendedPricingTier,
  });
}
