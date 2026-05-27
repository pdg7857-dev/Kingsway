import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Meta WhatsApp Cloud API webhook.
 *  - GET: verification challenge.
 *  - POST: inbound messages get persisted to WhatsAppMessage.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Skeleton: store the raw payload in an insight for now if a user exists.
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ ok: true });
    const entries = body?.entry ?? [];
    for (const e of entries) {
      for (const c of e?.changes ?? []) {
        for (const m of c?.value?.messages ?? []) {
          await prisma.whatsAppMessage.create({
            data: {
              userId: user.id,
              contactPhone: m.from ?? "unknown",
              contactName: c?.value?.contacts?.[0]?.profile?.name ?? null,
              direction: "inbound",
              body: m?.text?.body ?? JSON.stringify(m),
              receivedAt: new Date(),
            },
          });
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ ok: true });
}
