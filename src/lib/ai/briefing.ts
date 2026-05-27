import { prisma } from "../prisma";
import { AGENTS } from "./agents";
import { complete } from "./client";

export async function generateDailyBriefing(userId: string) {
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 86400000);

  const [tasks, overdue, bills, cards, expenses, revenue, inventory, leads, deals, clients] = await Promise.all([
    prisma.task.findMany({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS", "WAITING"] }, dueAt: { gte: now, lte: in7 } },
      orderBy: { dueAt: "asc" },
      take: 25,
    }),
    prisma.task.findMany({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { lt: now } },
      orderBy: { dueAt: "asc" },
      take: 25,
    }),
    prisma.bill.findMany({ where: { userId, status: { in: ["PENDING", "OVERDUE"] } }, orderBy: { dueAt: "asc" }, take: 10 }),
    prisma.creditCard.findMany({ where: { userId } }),
    prisma.expense.findMany({ where: { userId, date: { gte: new Date(now.getTime() - 30 * 86400000) } } }),
    prisma.revenue.findMany({ where: { userId, date: { gte: new Date(now.getTime() - 30 * 86400000) } } }),
    prisma.inventoryItem.findMany({ where: { userId } }),
    prisma.lead.count({ where: { userId, status: { not: "lost" } } }),
    prisma.deal.findMany({ where: { userId, stage: { notIn: ["WON", "LOST"] } }, orderBy: { valueCents: "desc" }, take: 5 }),
    prisma.fitnessClient.findMany({ where: { userId, status: "ACTIVE" } }),
  ]);

  const revenueTotal = revenue.reduce((s, r) => s + r.amountCents, 0);
  const expenseTotal = expenses.reduce((s, e) => s + e.amountCents, 0);
  const lowStock = inventory.filter((i) => i.quantity <= i.reorderAt);

  const context = {
    todayISO: now.toISOString(),
    upcomingTasks: tasks.map((t) => ({ title: t.title, due: t.dueAt, priority: t.priority })),
    overdueTasks: overdue.map((t) => ({ title: t.title, due: t.dueAt, priority: t.priority })),
    bills: bills.map((b) => ({ vendor: b.vendor, due: b.dueAt, amount: b.amountCents / 100 })),
    creditCards: cards.map((c) => ({ name: c.name, balance: c.balanceCents / 100, nextDue: c.nextDueAt })),
    revenue30d: revenueTotal / 100,
    expenses30d: expenseTotal / 100,
    lowStock: lowStock.map((i) => ({ name: i.name, qty: i.quantity, reorderAt: i.reorderAt })),
    openLeads: leads,
    topDeals: deals.map((d) => ({ title: d.title, stage: d.stage, value: d.valueCents / 100, nextAction: d.nextAction })),
    activeClients: clients.length,
  };

  const prompt = `Today's CEO context (JSON):\n\`\`\`json\n${JSON.stringify(context, null, 2)}\n\`\`\`\n\nWrite the Daily CEO Briefing. Markdown. Sections:\n1. **Top 3 priorities** for the morning.\n2. **Risks** — cash, inventory, overdue tasks, missed follow-ups.\n3. **Opportunities** — leads, deals, content angles, retention.\n4. **Numbers** — quick read on revenue/expenses last 30d and notable items.\n5. **Schedule suggestion** — propose how to spend the next 8 hours in a tight list.\nKeep it under 350 words. No fluff.`;

  const text = await complete({
    system: AGENTS.MASTER.system,
    prompt,
    maxTokens: 1400,
  });

  return text ?? fallbackBriefing(context);
}

function fallbackBriefing(ctx: any) {
  const top = ctx.upcomingTasks.slice(0, 3).map((t: any) => `- ${t.title} (${t.priority})`).join("\n");
  return [
    "**Top priorities**",
    top || "- Plan your morning intentionally.",
    "",
    "**Risks**",
    ctx.overdueTasks.length ? `- ${ctx.overdueTasks.length} overdue task(s) — clear before noon.` : "- No overdue tasks.",
    ctx.lowStock.length ? `- ${ctx.lowStock.length} item(s) below reorder threshold.` : "- Inventory healthy.",
    "",
    "**Numbers (last 30d)**",
    `- Revenue: $${(ctx.revenue30d ?? 0).toLocaleString()}`,
    `- Expenses: $${(ctx.expenses30d ?? 0).toLocaleString()}`,
    "",
    "*(AI key not configured — showing rule-based fallback briefing. Set ANTHROPIC_API_KEY to enable richer output.)*",
  ].join("\n");
}
