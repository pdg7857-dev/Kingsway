import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { completeWithImage } from "@/lib/ai/client";
import { AGENTS } from "@/lib/ai/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  imageBase64: z.string().min(10),
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]).default("image/jpeg"),
  businessSlug: z.string().nullable().optional(),
  // When true, create the expense immediately. When false, just return extracted fields.
  create: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = schema.parse(await req.json());

  const text = await completeWithImage({
    system: `${AGENTS.FINANCE.system}\nYou read receipts. Return ONLY a JSON object with these keys (no prose):
{
  "vendor": string,            // store / merchant name
  "amountCents": int,          // grand total in cents
  "taxCents": int|null,        // tax in cents
  "date": string|null,         // ISO-8601 date(time) printed on the receipt
  "category": string|null,     // best-guess expense category
  "cardLast4": string|null,    // last 4 digits of the card if shown
  "paymentMethod": "CASH"|"DEBIT"|"CREDIT_CARD"|"ACH"|"ZELLE"|"WIRE"|"CHECK"|"CRYPTO"|"OTHER"|null,
  "lineItems": [{"name": string, "amountCents": int}] | null
}`,
    prompt: "Extract the receipt data. If a value isn't visible, use null. Amounts in cents.",
    imageBase64: body.imageBase64,
    mediaType: body.mediaType,
    maxTokens: 800,
  });

  if (!text) {
    return NextResponse.json(
      { ok: false, error: "AI vision not configured. Set ANTHROPIC_API_KEY to enable the receipt scanner." },
      { status: 400 }
    );
  }

  let extracted: any = {};
  try {
    extracted = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
  } catch {
    return NextResponse.json({ ok: false, error: "Could not parse receipt.", raw: text }, { status: 422 });
  }

  let businessId: string | undefined;
  if (body.businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: body.businessSlug as any } } });
    businessId = biz?.id;
  }

  if (!body.create) {
    return NextResponse.json({ ok: true, extracted, businessId });
  }

  // Match a credit card by last 4 if we can.
  let creditCardId: string | undefined;
  if (extracted.cardLast4) {
    const card = await prisma.creditCard.findFirst({ where: { userId: user.id, last4: String(extracted.cardLast4) } });
    creditCardId = card?.id;
  }

  const expense = await prisma.expense.create({
    data: {
      userId: user.id,
      businessId,
      vendor: extracted.vendor ?? "Unknown merchant",
      amountCents: Number.isFinite(extracted.amountCents) ? extracted.amountCents : 0,
      taxCents: Number.isFinite(extracted.taxCents) ? extracted.taxCents : null,
      date: extracted.date ? new Date(extracted.date) : new Date(),
      status: "PAID",
      paymentMethod: extracted.paymentMethod ?? (creditCardId ? "CREDIT_CARD" : "OTHER"),
      creditCardId,
      aiCategory: extracted.category ?? null,
      category: extracted.category ?? null,
      notes: extracted.lineItems ? `Scanned receipt — ${extracted.lineItems.length} line items` : "Scanned receipt",
    },
  });

  return NextResponse.json({ ok: true, extracted, expense });
}
