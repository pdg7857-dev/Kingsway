import { prisma } from "@/lib/prisma";
import type { BusinessSlug } from "@prisma/client";

export async function getBusinessSnapshot(userId: string, slug: BusinessSlug) {
  const business = await prisma.business.findUnique({ where: { userId_slug: { userId, slug } } });
  if (!business) return null;
  const now = new Date();
  const back30 = new Date(now.getTime() - 30 * 86400000);

  const [tasks, deals, revenue30, expenses30, calendarEvents, inventory] = await Promise.all([
    prisma.task.findMany({
      where: { userId, businessId: business.id, status: { in: ["TODO", "IN_PROGRESS", "WAITING"] } },
      orderBy: [{ priority: "asc" }, { dueAt: "asc" }],
      include: { business: true },
      take: 12,
    }),
    prisma.deal.findMany({
      where: { userId, businessId: business.id, stage: { notIn: ["WON", "LOST"] } },
      orderBy: { valueCents: "desc" },
      include: { business: true, customer: true },
    }),
    prisma.revenue.aggregate({ where: { userId, businessId: business.id, date: { gte: back30 } }, _sum: { amountCents: true } }),
    prisma.expense.aggregate({ where: { userId, businessId: business.id, date: { gte: back30 } }, _sum: { amountCents: true } }),
    prisma.calendarEvent.findMany({
      where: { userId, businessId: business.id, startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      include: { business: true },
      take: 6,
    }),
    prisma.inventoryItem.findMany({
      where: { userId, businessId: business.id },
      orderBy: { quantity: "asc" },
    }),
  ]);

  return {
    business,
    tasks,
    deals,
    revenue30dCents: revenue30._sum.amountCents ?? 0,
    expenses30dCents: expenses30._sum.amountCents ?? 0,
    profit30dCents: (revenue30._sum.amountCents ?? 0) - (expenses30._sum.amountCents ?? 0),
    calendarEvents,
    inventory,
  };
}
