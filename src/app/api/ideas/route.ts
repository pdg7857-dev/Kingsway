import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const create = z.object({ text: z.string().min(1), businessSlug: z.string().nullable().optional() });

export async function GET() {
  const user = await requireCurrentUser();
  const ideas = await prisma.idea.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { business: true },
  });
  return NextResponse.json({ ideas });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const { text, businessSlug } = create.parse(await req.json());
  let businessId: string | undefined;
  if (businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: businessSlug as any } } });
    businessId = biz?.id;
  }
  const idea = await prisma.idea.create({
    data: {
      userId: user.id,
      businessId,
      title: text.length > 80 ? text.slice(0, 77) + "…" : text,
      body: text,
      status: "INBOX",
      priority: "MEDIUM",
    },
  });
  return NextResponse.json({ idea });
}
