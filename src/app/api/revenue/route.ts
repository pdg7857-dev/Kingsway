import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  source: z.string().min(1),
  amountCents: z.coerce.number().int(),
  date: z.coerce.date().optional(),
  description: z.string().optional().nullable(),
  businessSlug: z.string().nullable().optional(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const revenue = await prisma.revenue.findMany({ where: { userId: user.id }, orderBy: { date: "desc" }, include: { business: true }, take: 200 });
  return NextResponse.json({ revenue });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  let businessId: string | undefined;
  if (body.businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: body.businessSlug as any } } });
    businessId = biz?.id;
  }
  const revenue = await prisma.revenue.create({
    data: { userId: user.id, businessId, source: body.source, amountCents: body.amountCents, date: body.date ?? new Date(), description: body.description ?? null },
  });
  return NextResponse.json({ revenue });
}
