import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGoogleAccessToken, listGmailUnread, getGmailMessage } from "@/lib/integrations/google";
import { complete } from "@/lib/ai/client";
import { AGENTS } from "@/lib/ai/agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const user = await requireCurrentUser();
  const token = await getGoogleAccessToken(user.id);
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Gmail not connected. Sign in with Google (needs GOOGLE_CLIENT_ID/SECRET configured)." },
      { status: 400 }
    );
  }

  const list = await listGmailUnread(user.id, 20);
  if (!list.ok) return NextResponse.json({ ok: false, error: list.reason }, { status: 400 });

  let imported = 0;
  for (const ref of list.messages) {
    const existing = await prisma.emailImport.findUnique({ where: { messageId: ref.id } }).catch(() => null);
    if (existing) continue;
    const msg = await getGmailMessage(token, ref.id);
    if (!msg) continue;

    // Score importance 0–5 with the Email agent.
    let importance = 0;
    let isTask = false;
    const scored = await complete({
      system: `${AGENTS.EMAIL.system}\nReturn ONLY JSON: {"importance": 0-5, "isTask": boolean}`,
      prompt: `From: ${msg.from}\nSubject: ${msg.subject}\nSnippet: ${msg.snippet}`,
      maxTokens: 60,
      track: { userId: user.id, agent: "EMAIL", feature: "email" },
    });
    if (scored) {
      try {
        const j = JSON.parse(scored.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
        if (typeof j.importance === "number") importance = Math.max(0, Math.min(5, j.importance));
        isTask = !!j.isTask;
      } catch {}
    }

    await prisma.emailImport.create({
      data: {
        userId: user.id,
        threadId: msg.threadId,
        messageId: msg.id,
        from: msg.from,
        to: msg.to ? [msg.to] : [],
        subject: msg.subject,
        snippet: msg.snippet,
        importance,
        isTask,
        receivedAt: msg.date,
        labels: msg.labels,
      },
    });
    imported++;
  }

  return NextResponse.json({ ok: true, imported });
}
