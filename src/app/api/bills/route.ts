import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  vendor: z.string().min(1),
  amountCents: z.coerce.number().int(),
  dueAt: z.coerce.date(),
  recurrence: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  autopay: z.boolean().optional(),
  businessSlug: z.string().nullable().optional(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const bills = await prisma.bill.findMany({ where: { userId: user.id }, orderBy: { dueAt: "asc" } });
  return NextResponse.json({ bills });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  let businessId: string | undefined;
  if (body.businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: body.businessSlug as any } } });
    businessId = biz?.id;
  }
  const bill = await prisma.bill.create({
    data: {
      userId: user.id,
      businessId,
      vendor: body.vendor,
      amountCents: body.amountCents,
      dueAt: body.dueAt,
      recurrence: body.recurrence ?? "MONTHLY",
      autopay: body.autopay ?? false,
      status: "PENDING",
    },
  });
  return NextResponse.json({ bill });
}
