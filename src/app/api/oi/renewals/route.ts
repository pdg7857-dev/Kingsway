import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { predictRenewal } from "@/lib/oi/awards";

export const dynamic = "force-dynamic";

const create = z.object({
  title: z.string().min(1),
  agency: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  valueDollars: z.coerce.number().int().optional().nullable(),
  awardDate: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  contractLengthMonths: z.coerce.number().int().optional().nullable(),
  likelyPlatform: z.string().optional().nullable(),
  incumbentAdvantage: z.coerce.number().int().optional().nullable(),
  buyerId: z.string().optional().nullable(),
  incumbentId: z.string().optional().nullable(),
  awardId: z.string().optional().nullable(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const renewals = await prisma.renewal.findMany({
    where: { userId: user.id },
    include: { buyer: true, incumbent: true },
    orderBy: [{ likelyRebidStart: "asc" }],
  });
  return NextResponse.json({ renewals });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const b = create.parse(await req.json());
  const pred = predictRenewal({
    endDate: b.endDate,
    startDate: b.startDate,
    awardDate: b.awardDate,
    contractLengthMonths: b.contractLengthMonths,
    valueDollars: b.valueDollars,
  });
  const status = pred.alertWindow === "PAST" || pred.alertWindow === "D30" ? "IMMINENT" : pred.alertWindow === "M3" ? "UPCOMING" : "WATCHING";

  const renewal = await prisma.renewal.create({
    data: {
      userId: user.id,
      title: b.title,
      agency: b.agency ?? null,
      department: b.department ?? null,
      category: b.category ?? null,
      region: b.region ?? null,
      valueDollars: b.valueDollars ?? null,
      awardDate: b.awardDate ? new Date(b.awardDate) : null,
      startDate: b.startDate ? new Date(b.startDate) : null,
      endDate: pred.endDate,
      contractLengthMonths: b.contractLengthMonths ?? null,
      likelyRenewalDate: pred.likelyRenewalDate,
      likelyRebidStart: pred.likelyRebidStart,
      expectedValueDollars: pred.expectedValueDollars,
      alertWindow: pred.alertWindow,
      incumbentAdvantage: b.incumbentAdvantage ?? null,
      likelyPlatform: b.likelyPlatform ?? null,
      status,
      buyerId: b.buyerId ?? null,
      incumbentId: b.incumbentId ?? null,
      awardId: b.awardId ?? null,
    },
  });
  return NextResponse.json({ renewal });
}
