import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDailyBriefing } from "@/lib/ai/briefing";
import { dispatchNotification, smsConfigured, slackConfigured } from "@/lib/notify";
import { fmtCents } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // not locked down — Vercel cron can call it
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token === secret;
}

async function run() {
  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!user) return { ok: false, error: "no user" };

  const now = new Date();
  const in3 = new Date(now.getTime() + 3 * 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Generate + persist the briefing
  const summary = await generateDailyBriefing(user.id);
  await prisma.aIInsight.create({
    data: { userId: user.id, agent: "MASTER", kind: "DAILY_BRIEFING", title: "Daily CEO Briefing", summary },
  });

  // Gather the day's alert signals
  const [overdue, billsDue, inventory, aiSpend] = await Promise.all([
    prisma.task.count({ where: { userId: user.id, status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { lt: now } } }),
    prisma.bill.findMany({ where: { userId: user.id, status: { in: ["PENDING", "OVERDUE"] }, dueAt: { lte: in3 } }, orderBy: { dueAt: "asc" } }),
    prisma.inventoryItem.findMany({ where: { userId: user.id } }),
    prisma.aIUsage.aggregate({ where: { userId: user.id, createdAt: { gte: monthStart } }, _sum: { costCents: true } }),
  ]);
  const lowStock = inventory.filter((i) => i.quantity <= i.reorderAt);
  const budget = user.aiMonthlyBudgetCents ?? 2000;
  const spend = aiSpend._sum.costCents ?? 0;

  const parts: string[] = [];
  if (overdue) parts.push(`${overdue} overdue task${overdue > 1 ? "s" : ""}`);
  if (billsDue.length) parts.push(`${billsDue.length} bill${billsDue.length > 1 ? "s" : ""} due ≤3d (${fmtCents(billsDue.reduce((s, b) => s + b.amountCents, 0))})`);
  if (lowStock.length) parts.push(`${lowStock.length} low-stock`);
  if (budget > 0 && spend / budget >= 0.8) parts.push(`AI budget ${Math.round((spend / budget) * 100)}% used`);

  const smsBody = parts.length ? parts.join(" · ") : "All clear. Open Kingsway for your full briefing.";

  await dispatchNotification({
    userId: user.id,
    kind: "GENERIC",
    title: "Daily briefing ready",
    body: smsBody,
    slackText: `*Kingsway — Daily CEO Briefing*\n\n${summary}`,
  });

  return { ok: true, smsBody, channels: { sms: smsConfigured(), slack: slackConfigured() }, alerts: { overdue, billsDue: billsDue.length, lowStock: lowStock.length } };
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await run());
}
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await run());
}
