import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOutreach } from "@/lib/oi/ai";
import { scoreProspect } from "@/lib/oi/scoring";
import { OUTREACH_KINDS } from "@/lib/oi/constants";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const body = z.object({ kind: z.enum(OUTREACH_KINDS) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const p = await prisma.prospect.findUnique({ where: { id: params.id } });
  if (!p || p.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const { kind } = body.parse(await req.json());
  const { subject, body: text } = await generateOutreach(p, kind, scoreProspect(p), { userId: user.id });

  const outreach = await prisma.prospectOutreach.create({
    data: { userId: user.id, prospectId: p.id, kind, subject: subject ?? null, body: text },
  });
  return NextResponse.json({ outreach });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const outreach = await prisma.prospectOutreach.findMany({
    where: { userId: user.id, prospectId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ outreach });
}
