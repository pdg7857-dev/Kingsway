import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { discoverICloud } from "@/lib/integrations/icloud";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const connect = z.object({
  appleId: z.string().email(),
  appPassword: z.string().min(8),
});

export async function GET() {
  const user = await requireCurrentUser();
  const cred = await prisma.integrationCredential.findUnique({
    where: { userId_provider: { userId: user.id, provider: "icloud" } },
  }).catch(() => null);
  return NextResponse.json({
    connected: !!cred,
    username: cred?.username ?? null,
    calendarUrl: cred?.calendarUrl ?? null,
    remindersUrl: cred?.remindersUrl ?? null,
    lastSyncAt: cred?.lastSyncAt ?? null,
  });
}

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const body = connect.parse(await req.json());

  let disc;
  try {
    disc = await discoverICloud(body.appleId, body.appPassword);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: `Network error reaching iCloud: ${e?.message ?? e}` }, { status: 502 });
  }
  if (!disc.ok) return NextResponse.json({ ok: false, error: disc.reason }, { status: 400 });

  await prisma.integrationCredential.upsert({
    where: { userId_provider: { userId: user.id, provider: "icloud" } },
    update: {
      username: body.appleId,
      secret: body.appPassword,
      calendarUrl: disc.calendarUrl,
      remindersUrl: disc.remindersUrl,
      data: { principalUrl: disc.principalUrl },
    },
    create: {
      userId: user.id,
      provider: "icloud",
      label: "iCloud",
      username: body.appleId,
      secret: body.appPassword,
      calendarUrl: disc.calendarUrl,
      remindersUrl: disc.remindersUrl,
      data: { principalUrl: disc.principalUrl },
    },
  });

  return NextResponse.json({ ok: true, calendarUrl: disc.calendarUrl, remindersUrl: disc.remindersUrl });
}

export async function DELETE() {
  const user = await requireCurrentUser();
  await prisma.integrationCredential.deleteMany({ where: { userId: user.id, provider: "icloud" } });
  return NextResponse.json({ ok: true });
}
