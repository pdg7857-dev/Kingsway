import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  title: z.string().min(1),
  agency: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  solicitationNumber: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  valueCents: z.coerce.number().int().optional().nullable(),
  responseDueAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});

async function eprocBusinessId(userId: string) {
  const biz = await prisma.business.findUnique({ where: { userId_slug: { userId, slug: "eprocurement" } } });
  return biz?.id;
}

export async function GET() {
  const user = await requireCurrentUser();
  const contracts = await prisma.govContract.findMany({
    where: { userId: user.id },
    orderBy: { responseDueAt: "asc" },
    include: { client: true },
  });
  return NextResponse.json({ contracts });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  const businessId = await eprocBusinessId(user.id);
  const contract = await prisma.govContract.create({
    data: {
      userId: user.id,
      businessId,
      title: body.title,
      agency: body.agency ?? null,
      industry: body.industry ?? null,
      solicitationNumber: body.solicitationNumber ?? null,
      url: body.url ?? null,
      valueCents: body.valueCents ?? null,
      responseDueAt: body.responseDueAt ?? null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json({ contract });
}
