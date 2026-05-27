import { prisma } from "@/lib/prisma";

export async function getMasterDashboardData(userId: string) {
  const now = new Date();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday.getTime() + 86400000);
  const in7 = new Date(now.getTime() + 7 * 86400000);
  const in30 = new Date(now.getTime() + 30 * 86400000);
  const back30 = new Date(now.getTime() - 30 * 86400000);

  const [
    businesses,
    upcomingTasks,
    overdueTasks,
    todayTasks,
    upcomingCosts,
    bills,
    creditCards,
    revenue30d,
    expenses30d,
    revenueByBiz,
    expensesByBiz,
    events,
    importantEmails,
    importantWhatsapp,
    deals,
    inventory,
    customers,
    contentScheduled,
    ideas,
    fitnessClients,
    notifications,
    latestInsight,
  ] = await Promise.all([
    prisma.business.findMany({ where: { userId }, orderBy: { slug: "asc" } }),

    prisma.task.findMany({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS", "WAITING"] }, dueAt: { gte: now, lte: in7 } },
      orderBy: { dueAt: "asc" },
      take: 8,
      include: { business: true },
    }),
    prisma.task.findMany({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { lt: now } },
      orderBy: { dueAt: "asc" },
      take: 8,
      include: { business: true },
    }),
    prisma.task.findMany({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS"] }, OR: [
        { dueAt: { gte: startOfToday, lt: endOfToday } },
        { priority: "URGENT" },
      ] },
      orderBy: [{ priority: "asc" }, { dueAt: "asc" }],
      take: 6,
      include: { business: true },
    }),

    prisma.expense.findMany({
      where: { userId, OR: [{ status: "PENDING" }, { isUpcoming: true }], dueAt: { gte: now, lte: in30 } },
      orderBy: { dueAt: "asc" },
      take: 6,
      include: { business: true, creditCard: true },
    }),
    prisma.bill.findMany({
      where: { userId, status: { in: ["PENDING", "OVERDUE"] } },
      orderBy: { dueAt: "asc" },
      take: 6,
    }),
    prisma.creditCard.findMany({ where: { userId } }),

    prisma.revenue.aggregate({ where: { userId, date: { gte: back30 } }, _sum: { amountCents: true } }),
    prisma.expense.aggregate({ where: { userId, date: { gte: back30 } }, _sum: { amountCents: true } }),

    prisma.revenue.groupBy({
      by: ["businessId"],
      where: { userId, date: { gte: back30 } },
      _sum: { amountCents: true },
    }),
    prisma.expense.groupBy({
      by: ["businessId"],
      where: { userId, date: { gte: back30 } },
      _sum: { amountCents: true },
    }),

    prisma.calendarEvent.findMany({
      where: { userId, startAt: { gte: now, lte: in7 } },
      orderBy: { startAt: "asc" },
      take: 6,
      include: { business: true },
    }),

    prisma.emailImport.findMany({
      where: { userId, importance: { gte: 3 } },
      orderBy: { receivedAt: "desc" },
      take: 4,
    }),
    prisma.whatsAppMessage.findMany({
      where: { userId, importance: { gte: 3 } },
      orderBy: { receivedAt: "desc" },
      take: 4,
    }),

    prisma.deal.findMany({
      where: { userId, stage: { notIn: ["WON", "LOST"] } },
      orderBy: { valueCents: "desc" },
      take: 5,
      include: { business: true, customer: true },
    }),

    prisma.inventoryItem.findMany({
      where: { userId },
      orderBy: { quantity: "asc" },
      take: 5,
      include: { business: true },
    }),

    prisma.customer.findMany({
      where: { userId, OR: [{ lastTouchAt: null }, { lastTouchAt: { lt: new Date(now.getTime() - 14 * 86400000) } }] },
      orderBy: { lastTouchAt: "asc" },
      take: 5,
      include: { business: true },
    }),

    prisma.contentItem.findMany({
      where: { userId, status: { in: ["SCHEDULED", "EDITING", "SCRIPTED"] }, scheduledAt: { gte: now } },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),

    prisma.idea.findMany({
      where: { userId, status: { in: ["INBOX", "EXPLORING"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { business: true },
    }),

    prisma.fitnessClient.findMany({ where: { userId, status: "ACTIVE" } }),

    prisma.notification.findMany({
      where: { userId, readAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),

    prisma.aIInsight.findFirst({
      where: { userId, kind: "DAILY_BRIEFING" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Build per-business health snapshot
  const revenueMap = new Map(revenueByBiz.map((r) => [r.businessId, r._sum.amountCents ?? 0]));
  const expenseMap = new Map(expensesByBiz.map((r) => [r.businessId, r._sum.amountCents ?? 0]));

  const businessSnapshots = businesses.map((b) => {
    const rev = revenueMap.get(b.id) ?? 0;
    const exp = expenseMap.get(b.id) ?? 0;
    const profit = rev - exp;
    // Naive health score: profit margin contribution + activity
    const margin = rev > 0 ? profit / rev : 0;
    const score = Math.max(0, Math.min(100, Math.round(50 + margin * 40 + (rev > 0 ? 10 : 0))));
    return { business: b, revenueCents: rev, expensesCents: exp, profitCents: profit, score };
  });

  const totalRevenue30d = revenue30d._sum.amountCents ?? 0;
  const totalExpenses30d = expenses30d._sum.amountCents ?? 0;
  const cashFlow30d = totalRevenue30d - totalExpenses30d;

  return {
    now,
    businesses,
    todayTasks,
    overdueTasks,
    upcomingTasks,
    upcomingCosts,
    bills,
    creditCards,
    totalRevenue30d,
    totalExpenses30d,
    cashFlow30d,
    businessSnapshots,
    events,
    importantEmails,
    importantWhatsapp,
    deals,
    inventory,
    customers,
    contentScheduled,
    ideas,
    fitnessClients,
    notifications,
    latestInsight,
  };
}

export type MasterDashboardData = Awaited<ReturnType<typeof getMasterDashboardData>>;
