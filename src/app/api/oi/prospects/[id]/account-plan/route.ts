import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAccountPlan } from "@/lib/oi/ai";
import { scoreProspect } from "@/lib/oi/scoring";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const p = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!p || p.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });
  const aiAccountPlan = await generateAccountPlan(p, scoreProspect(p), { userId: user.id });
  const prospect = await prisma.prospect.update({ where: { id: p.id }, data: { aiAccountPlan } });
  return NextResponse.json({ prospect });
}
