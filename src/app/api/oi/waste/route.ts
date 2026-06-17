import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { estimateWaste } from "@/lib/oi/waste";
import { scoreProspect } from "@/lib/oi/scoring";

export const dynamic = "force-dynamic";

const body = z.object({
  industry: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  employeesEstimate: z.coerce.number().int().optional().nullable(),
  revenueEstimateDollars: z.coerce.number().int().optional().nullable(),
  locationsCount: z.coerce.number().int().optional().nullable(),
  govExperience: z.coerce.boolean().optional(),
  procurementMaturity: z.enum(["UNKNOWN", "LOW", "MEDIUM", "HIGH"]).optional(),
});

export async function POST(req: NextRequest) {
  const b = body.parse(await req.json());
  const waste = estimateWaste(b);
  const score = scoreProspect(b);
  return NextResponse.json({
    waste,
    index: score.score,
    label: score.label,
    recommendedPricingTier: score.recommendedPricingTier,
    recommendedMonthlyFeeCents: score.recommendedMonthlyFeeCents,
    primaryPlatforms: score.primaryPlatforms,
  });
}
