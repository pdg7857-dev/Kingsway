import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrichAndScore } from "@/lib/oi/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const row = z.object({
  companyName: z.string().min(1),
  contactName: z.string().optional().nullable(),
  contactTitle: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  govExperience: z.coerce.boolean().optional(),
});

const schema = z.object({ rows: z.array(row).min(1).max(2000) });

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const { rows } = schema.parse(await req.json());
  const biz = await prisma.business.findUnique({
    where: { userId_slug: { userId: user.id, slug: "eprocurement" } },
  });

  const data = rows.map((r) => {
    const { fields } = enrichAndScore({
      industry: r.industry,
      region: r.region,
      country: r.country ?? "Canada",
      govExperience: r.govExperience,
    });
    return {
      userId: user.id,
      businessId: biz?.id ?? null,
      companyName: r.companyName,
      contactName: r.contactName ?? null,
      contactTitle: r.contactTitle ?? null,
      email: r.email ?? null,
      phone: r.phone ?? null,
      website: r.website ?? null,
      linkedinUrl: r.linkedinUrl ?? null,
      industry: r.industry ?? null,
      city: r.city ?? null,
      region: r.region ?? null,
      country: r.country ?? "Canada",
      govExperience: r.govExperience ?? false,
      stage: "SCORED",
      ...fields,
    };
  });

  const result = await prisma.prospect.createMany({ data });
  return NextResponse.json({ imported: result.count });
}
