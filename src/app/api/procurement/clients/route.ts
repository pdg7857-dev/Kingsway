import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  name: z.string().min(1),
  company: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  status: z.enum(["LEAD", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST", "ACTIVE", "PAUSED", "CHURNED"]).optional(),
  monthlyFeeCents: z.coerce.number().int().optional(),
  businessInfo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

async function eprocBusinessId(userId: string) {
  const biz = await prisma.business.findUnique({ where: { userId_slug: { userId, slug: "eprocurement" } } });
  return biz?.id;
}

export async function GET() {
  const user = await requireCurrentUser();
  const clients = await prisma.procurementClient.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  const businessId = await eprocBusinessId(user.id);
  const client = await prisma.procurementClient.create({
    data: {
      userId: user.id,
      businessId,
      name: body.name,
      company: body.company ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      industry: body.industry ?? null,
      status: body.status ?? "LEAD",
      monthlyFeeCents: body.monthlyFeeCents ?? 25000,
      businessInfo: body.businessInfo ?? null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json({ client });
}
