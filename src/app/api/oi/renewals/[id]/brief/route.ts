import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRenewalBrief } from "@/lib/oi/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const r = await prisma.renewal.findUnique({ where: { id: params.id }, include: { buyer: true, incumbent: true } });
  if (!r || r.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { opportunityBrief, monitoringPlan } = await generateRenewalBrief(
    {
      title: r.title,
      agency: r.agency,
      category: r.category,
      region: r.region,
      valueDollars: r.valueDollars,
      endDate: r.endDate,
      likelyRebidStart: r.likelyRebidStart,
      likelyPlatform: r.likelyPlatform,
      incumbentName: r.incumbent?.companyName,
      buyerName: r.buyer?.organization,
    },
    { userId: user.id }
  );

  const renewal = await prisma.renewal.update({ where: { id: r.id }, data: { opportunityBrief, monitoringPlan } });
  return NextResponse.json({ renewal });
}
