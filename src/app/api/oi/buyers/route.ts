import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({
  organization: z.string().min(1),
  department: z.string().optional().nullable(),
  agency: z.string().optional().nullable(),
  division: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactTitle: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  commodityCategories: z.array(z.string()).optional(),
  currentSuppliers: z.array(z.string()).optional(),
  typicalCycleMonths: z.coerce.number().int().optional().nullable(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const buyers = await prisma.buyer.findMany({
    where: { userId: user.id },
    orderBy: { totalAwardedDollars: "desc" },
  });
  return NextResponse.json({ buyers });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const b = create.parse(await req.json());
  const buyer = await prisma.buyer.create({
    data: {
      userId: user.id,
      organization: b.organization,
      department: b.department ?? null,
      agency: b.agency ?? null,
      division: b.division ?? null,
      contactName: b.contactName ?? null,
      contactTitle: b.contactTitle ?? null,
      email: b.email ?? null,
      phone: b.phone ?? null,
      region: b.region ?? null,
      platform: b.platform ?? null,
      commodityCategories: b.commodityCategories ?? [],
      currentSuppliers: b.currentSuppliers ?? [],
      typicalCycleMonths: b.typicalCycleMonths ?? null,
    },
  });
  return NextResponse.json({ buyer });
}
