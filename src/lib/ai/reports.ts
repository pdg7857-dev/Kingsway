import { prisma } from "@/lib/prisma";
import { complete } from "./client";
import { AGENTS } from "./agents";
import type { AgentKind } from "@prisma/client";

const TITLES: Record<string, string> = {
  daily: "Daily Report",
  weekly: "Weekly CEO Report",
  monthly: "Monthly Financial Report",
  business: "Business Performance Report",
  pipeline: "Sales Pipeline Report",
  content: "Content Performance Report",
  retention: "Client Retention Report",
  inventory: "Inventory Report",
};

const AGENT_FOR: Record<string, AgentKind> = {
  daily: "MASTER",
  weekly: "MASTER",
  monthly: "FINANCE",
  business: "MASTER",
  pipeline: "SALES",
  content: "CONTENT",
  retention: "FITNESS",
  inventory: "SUPPLEMENT",
};

async function gather(userId: string, kind: string) {
  const now = new Date();
  const back30 = new Date(now.getTime() - 30 * 86400000);
  const back7 = new Date(now.getTime() - 7 * 86400000);

  if (kind === "pipeline") {
    const deals = await prisma.deal.findMany({ where: { userId }, include: { business: true } });
    return { deals: deals.map((d) => ({ title: d.title, stage: d.stage, value: d.valueCents / 100, prob: d.probability, nextAction: d.nextAction })) };
  }
  if (kind === "content") {
    const items = await prisma.contentItem.findMany({ where: { userId }, include: { analytics: true } });
    return { content: items.map((c) => ({ platform: c.platform, status: c.status, hook: c.hook, views: c.analytics[0]?.views ?? 0, revenue: (c.analytics[0]?.revenueCents ?? 0) / 100 })) };
  }
  if (kind === "retention") {
    const clients = await prisma.fitnessClient.findMany({ where: { userId } });
    const procs = await prisma.procurementClient.findMany({ where: { userId } });
    return {
      fitnessClients: clients.map((c) => ({ name: c.name, status: c.status, mrr: c.mrrCents / 100, lastCheckIn: c.lastCheckInAt, renewal: c.renewalAt })),
      eprocClients: procs.map((c) => ({ company: c.company, status: c.status, mrr: c.monthlyFeeCents / 100, touches: c.touchCount })),
    };
  }
  if (kind === "inventory") {
    const items = await prisma.inventoryItem.findMany({ where: { userId }, include: { business: true } });
    return { inventory: items.map((i) => ({ name: i.name, business: i.business?.name, qty: i.quantity, reorderAt: i.reorderAt, value: (i.quantity * i.costCents) / 100 })) };
  }

  // default: money + tasks snapshot (daily/weekly/monthly/business)
  const since = kind === "monthly" ? back30 : kind === "weekly" ? back7 : back7;
  const [rev, exp, revByBiz, expByBiz, businesses, tasksOpen, overdue, bills] = await Promise.all([
    prisma.revenue.aggregate({ where: { userId, date: { gte: since } }, _sum: { amountCents: true } }),
    prisma.expense.aggregate({ where: { userId, date: { gte: since } }, _sum: { amountCents: true } }),
    prisma.revenue.groupBy({ by: ["businessId"], where: { userId, date: { gte: since } }, _sum: { amountCents: true } }),
    prisma.expense.groupBy({ by: ["businessId"], where: { userId, date: { gte: since } }, _sum: { amountCents: true } }),
    prisma.business.findMany({ where: { userId } }),
    prisma.task.count({ where: { userId, status: { in: ["TODO", "IN_PROGRESS", "WAITING"] } } }),
    prisma.task.count({ where: { userId, status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { lt: now } } }),
    prisma.bill.findMany({ where: { userId, status: { in: ["PENDING", "OVERDUE"] } }, orderBy: { dueAt: "asc" }, take: 8 }),
  ]);
  const bizName = new Map(businesses.map((b) => [b.id, b.name]));
  return {
    window: kind,
    revenue: (rev._sum.amountCents ?? 0) / 100,
    expenses: (exp._sum.amountCents ?? 0) / 100,
    byBusiness: businesses.map((b) => ({
      name: b.name,
      revenue: (revByBiz.find((r) => r.businessId === b.id)?._sum.amountCents ?? 0) / 100,
      expenses: (expByBiz.find((e) => e.businessId === b.id)?._sum.amountCents ?? 0) / 100,
    })),
    openTasks: tasksOpen,
    overdueTasks: overdue,
    bills: bills.map((b) => ({ vendor: b.vendor, due: b.dueAt, amount: b.amountCents / 100 })),
  };
}

export async function generateReport(userId: string, kind: string) {
  const agent = AGENT_FOR[kind] ?? "MASTER";
  const data = await gather(userId, kind);
  const title = TITLES[kind] ?? "Report";

  const prompt = `Generate a "${title}" in clean markdown for a multi-business CEO.
Data (JSON):
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
Structure it with clear headers, key numbers called out, what's working, what's at risk, and a short "Recommended actions" list at the end. Be specific and use the real numbers. Under 450 words.`;

  const body = await complete({
    system: AGENTS[agent].system,
    prompt,
    maxTokens: 1600,
    track: { userId, agent, feature: "report" },
  });

  const finalBody = body ?? fallback(title, data);
  const report = await prisma.report.create({
    data: { userId, kind, title, body: finalBody, payload: data as any },
  });
  return report;
}

function fallback(title: string, data: any) {
  return [
    `# ${title}`,
    "",
    "*(AI key not configured — showing a data snapshot. Set ANTHROPIC_API_KEY for a written report.)*",
    "",
    "```json",
    JSON.stringify(data, null, 2),
    "```",
  ].join("\n");
}
