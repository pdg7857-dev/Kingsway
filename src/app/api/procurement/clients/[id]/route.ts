import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const patch = z.object({
  status: z.enum(["LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST", "ACTIVE", "PAUSED", "CHURNED"]).optional(),
  industry: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  businessInfo: z.string().nullable().optional(),
  monthlyFeeCents: z.coerce.number().int().optional(),
  lostReason: z.string().nullable().optional(),
  // increment touch counter
  touch: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const existing = await prisma.procurementClient.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = patch.parse(await req.json());
  const data: any = {};
  if (body.status) {
    data.status = body.status;
    if ((body.status === "WON" || body.status === "ACTIVE") && !existing.signedAt) {
      data.signedAt = new Date();
      data.touchesToSign = existing.touchCount;
    }
  }
  if (body.industry !== undefined) data.industry = body.industry;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.businessInfo !== undefined) data.businessInfo = body.businessInfo;
  if (body.monthlyFeeCents !== undefined) data.monthlyFeeCents = body.monthlyFeeCents;
  if (body.lostReason !== undefined) data.lostReason = body.lostReason;
  if (body.touch) {
    data.touchCount = existing.touchCount + 1;
    data.lastTouchAt = new Date();
  }

  const client = await prisma.procurementClient.update({ where: { id: params.id }, data });
  return NextResponse.json({ client });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const existing = await prisma.procurementClient.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.procurementClient.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
