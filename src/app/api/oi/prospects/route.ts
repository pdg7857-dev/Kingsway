import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrichAndScore } from "@/lib/oi/pipeline";

export const dynamic = "force-dynamic";

const create = z.object({
  companyName: z.string().min(1),
  contactName: z.string().optional().nullable(),
  contactTitle: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  subIndustry: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  employeesEstimate: z.coerce.number().int().optional().nullable(),
  revenueEstimateDollars: z.coerce.number().int().optional().nullable(),
  locationsCount: z.coerce.number().int().optional().nullable(),
  govExperience: z.boolean().optional(),
  govClientTypes: z.array(z.string()).optional(),
  procurementMaturity: z.enum(["UNKNOWN", "LOW", "MEDIUM", "HIGH"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const user = await requireCurrentUser();
  const sp = new URL(req.url).searchParams;
  const where: any = { userId: user.id };
  if (sp.get("tier")) where.tier = sp.get("tier");
  if (sp.get("industry")) where.industry = sp.get("industry");
  if (sp.get("stage")) where.stage = sp.get("stage");
  if (sp.get("region")) where.region = { contains: sp.get("region")!, mode: "insensitive" };
  if (sp.get("govExperience") === "true") where.hasWonGov = true;
  if (sp.get("minScore")) where.score = { gte: Number(sp.get("minScore")) };
  if (sp.get("q")) where.companyName = { contains: sp.get("q")!, mode: "insensitive" };

  const prospects = await prisma.prospect.findMany({
    where,
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    take: 500,
  });
  return NextResponse.json({ prospects });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  const biz = await prisma.business.findUnique({
    where: { userId_slug: { userId: user.id, slug: "eprocurement" } },
  });

  const { fields } = enrichAndScore({
    industry: body.industry,
    region: body.region,
    country: body.country ?? "Canada",
    employeesEstimate: body.employeesEstimate,
    revenueEstimateDollars: body.revenueEstimateDollars,
    locationsCount: body.locationsCount,
    govExperience: body.govExperience,
    govClientTypes: body.govClientTypes,
    procurementMaturity: body.procurementMaturity,
  });

  const prospect = await prisma.prospect.create({
    data: {
      userId: user.id,
      businessId: biz?.id,
      companyName: body.companyName,
      contactName: body.contactName ?? null,
      contactTitle: body.contactTitle ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      website: body.website ?? null,
      linkedinUrl: body.linkedinUrl ?? null,
      industry: body.industry ?? null,
      subIndustry: body.subIndustry ?? null,
      city: body.city ?? null,
      region: body.region ?? null,
      country: body.country ?? "Canada",
      employeesEstimate: body.employeesEstimate ?? null,
      revenueEstimateDollars: body.revenueEstimateDollars ?? null,
      locationsCount: body.locationsCount ?? null,
      govExperience: body.govExperience ?? false,
      govClientTypes: body.govClientTypes ?? [],
      procurementMaturity: body.procurementMaturity ?? "UNKNOWN",
      notes: body.notes ?? null,
      stage: "SCORED",
      ...fields,
    },
  });
  return NextResponse.json({ prospect });
}
