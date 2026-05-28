import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  name: z.string().min(1),
  last4: z.string().min(2).max(4),
  network: z.string().optional().nullable(),
  limitCents: z.coerce.number().int().optional(),
  balanceCents: z.coerce.number().int().optional(),
  statementDay: z.coerce.number().int().optional().nullable(),
  paymentDueDay: z.coerce.number().int().optional().nullable(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const cards = await prisma.creditCard.findMany({ where: { userId: user.id } });
  return NextResponse.json({ cards });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  const card = await prisma.creditCard.create({
    data: {
      userId: user.id,
      name: body.name,
      last4: body.last4,
      network: body.network ?? null,
      limitCents: body.limitCents ?? 0,
      balanceCents: body.balanceCents ?? 0,
      statementDay: body.statementDay ?? null,
      paymentDueDay: body.paymentDueDay ?? null,
    },
  });
  return NextResponse.json({ card });
}
