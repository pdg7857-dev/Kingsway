import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { complete } from "@/lib/ai/client";
import { AGENTS } from "@/lib/ai/agents";

export const dynamic = "force-dynamic";

const create = z.object({
  text: z.string().optional(),
  vendor: z.string().optional(),
  amountCents: z.number().int().optional(),
  date: z.coerce.date().optional(),
  businessSlug: z.string().nullable().optional(),
});

export async function GET() {
  const user = await requireCurrentUser();
  const expenses = await prisma.expense.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    include: { business: true, creditCard: true },
    take: 250,
  });
  return NextResponse.json({ expenses });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = create.parse(await req.json());
  let businessId: string | undefined;
  if (body.businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: body.businessSlug as any } } });
    businessId = biz?.id;
  }

  // If the user passed freeform text, ask AI to extract vendor/amount/category.
  let vendor = body.vendor ?? "Unknown";
  let amountCents = body.amountCents ?? 0;
  let date = body.date ?? new Date();
  let aiCategory: string | undefined;

  if (body.text && (!body.vendor || !body.amountCents)) {
    const ai = await complete({
      system: `${AGENTS.FINANCE.system}\nReturn ONLY JSON: {"vendor": string, "amountCents": int, "category": string}`,
      prompt: `Extract structured fields from this expense note: "${body.text}"`,
      maxTokens: 200,
    });
    if (ai) {
      try {
        const j = JSON.parse(ai.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
        if (j.vendor) vendor = j.vendor;
        if (typeof j.amountCents === "number") amountCents = j.amountCents;
        if (j.category) aiCategory = j.category;
      } catch {}
    }
  }

  const expense = await prisma.expense.create({
    data: {
      userId: user.id,
      businessId,
      vendor,
      amountCents,
      date,
      status: "PAID",
      paymentMethod: "CREDIT_CARD",
      aiCategory,
    },
  });
  return NextResponse.json({ expense });
}
