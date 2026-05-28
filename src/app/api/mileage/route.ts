import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  fromLocation: z.string().min(1),
  toLocation: z.string().min(1),
  reason: z.string().optional().nullable(),
  miles: z.coerce.number().positive(),
  purpose: z.enum(["BUSINESS", "PERSONAL"]).default("BUSINESS"),
  businessSlug: z.string().nullable().optional(),
  vehicle: z.string().optional().nullable(),
  roundTrip: z.boolean().optional(),
  ratePerMile: z.coerce.number().optional(),
  date: z.coerce.date().optional(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const logs = await prisma.mileageLog.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    include: { business: true },
    take: 250,
  });
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());

  let businessId: string | undefined;
  if (body.businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: body.businessSlug as any } } });
    businessId = biz?.id;
  }

  const miles = body.roundTrip ? body.miles * 2 : body.miles;

  const log = await prisma.mileageLog.create({
    data: {
      userId: user.id,
      businessId,
      fromLocation: body.fromLocation,
      toLocation: body.toLocation,
      reason: body.reason ?? null,
      miles,
      purpose: body.purpose,
      vehicle: body.vehicle ?? null,
      roundTrip: body.roundTrip ?? false,
      ratePerMile: body.ratePerMile ?? 0.7,
      date: body.date ?? new Date(),
    },
  });
  return NextResponse.json({ log });
}
