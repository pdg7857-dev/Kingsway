import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pushEvent, pushReminder, pullEvents } from "@/lib/integrations/icloud";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const user = await requireCurrentUser();
  const cred = await prisma.integrationCredential.findUnique({
    where: { userId_provider: { userId: user.id, provider: "icloud" } },
  }).catch(() => null);
  if (!cred?.username || !cred?.secret) {
    return NextResponse.json({ ok: false, error: "iCloud not connected." }, { status: 400 });
  }

  const appleId = cred.username;
  const appPassword = cred.secret;
  const now = new Date();
  const in60 = new Date(now.getTime() + 60 * 86400000);
  const result = { eventsPushed: 0, remindersPushed: 0, eventsPulled: 0 };

  // Push upcoming Kingsway events → iCloud Calendar
  if (cred.calendarUrl) {
    const events = await prisma.calendarEvent.findMany({
      where: { userId: user.id, startAt: { gte: now, lte: in60 }, source: { not: "icloud" } },
      take: 100,
    });
    for (const e of events) {
      const ok = await pushEvent({
        appleId, appPassword, calendarUrl: cred.calendarUrl,
        uid: `kingsway-event-${e.id}`, summary: e.title, start: e.startAt, end: e.endAt,
        description: e.description ?? undefined, location: e.location ?? undefined,
      });
      if (ok) result.eventsPushed++;
    }
  }

  // Push open tasks with due dates → iCloud Reminders
  if (cred.remindersUrl) {
    const tasks = await prisma.task.findMany({
      where: { userId: user.id, status: { in: ["TODO", "IN_PROGRESS", "WAITING"] }, dueAt: { not: null } },
      take: 100,
    });
    for (const t of tasks) {
      const ok = await pushReminder({
        appleId, appPassword, remindersUrl: cred.remindersUrl,
        uid: `kingsway-task-${t.id}`, summary: t.title, due: t.dueAt, description: t.description ?? undefined,
      });
      if (ok) result.remindersPushed++;
    }
  }

  // Pull iCloud events → Kingsway (two-way)
  if (cred.calendarUrl) {
    const pulled = await pullEvents({ appleId, appPassword, calendarUrl: cred.calendarUrl, from: now, to: in60 });
    if (pulled.ok) {
      for (const ev of pulled.events) {
        if (ev.uid.startsWith("kingsway-")) continue; // skip our own pushes
        const existing = await prisma.calendarEvent.findFirst({ where: { userId: user.id, externalId: ev.uid } });
        if (existing) {
          await prisma.calendarEvent.update({ where: { id: existing.id }, data: { title: ev.summary, startAt: ev.start, endAt: ev.end } });
        } else {
          await prisma.calendarEvent.create({
            data: { userId: user.id, title: ev.summary, startAt: ev.start, endAt: ev.end, source: "icloud", externalId: ev.uid },
          });
          result.eventsPulled++;
        }
      }
    }
  }

  await prisma.integrationCredential.update({
    where: { userId_provider: { userId: user.id, provider: "icloud" } },
    data: { lastSyncAt: new Date() },
  });

  return NextResponse.json({ ok: true, ...result });
}
