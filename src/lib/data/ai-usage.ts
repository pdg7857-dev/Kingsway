import { prisma } from "@/lib/prisma";

export async function getAIUsage(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const last30 = new Date(now.getTime() - 30 * 86400000);

  const [user, monthAgg, allAgg, byFeature, recent, daily] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.aIUsage.aggregate({
      where: { userId, createdAt: { gte: monthStart } },
      _sum: { costCents: true, inputTokens: true, outputTokens: true },
      _count: true,
    }),
    prisma.aIUsage.aggregate({
      where: { userId },
      _sum: { costCents: true, inputTokens: true, outputTokens: true },
      _count: true,
    }),
    prisma.aIUsage.groupBy({
      by: ["feature"],
      where: { userId, createdAt: { gte: monthStart } },
      _sum: { costCents: true, inputTokens: true, outputTokens: true },
      _count: true,
    }),
    prisma.aIUsage.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.aIUsage.findMany({
      where: { userId, createdAt: { gte: last30 } },
      select: { createdAt: true, costCents: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const budgetCents = user?.aiMonthlyBudgetCents ?? 2000;
  const monthSpendCents = monthAgg._sum.costCents ?? 0;
  const pctUsed = budgetCents > 0 ? (monthSpendCents / budgetCents) * 100 : 0;

  // bucket daily spend
  const dayMap = new Map<string, number>();
  daily.forEach((d) => {
    const k = new Date(d.createdAt).toISOString().slice(5, 10); // MM-DD
    dayMap.set(k, (dayMap.get(k) ?? 0) + d.costCents);
  });
  const series = [...dayMap.entries()].map(([day, cents]) => ({ day, cents }));

  return {
    budgetCents,
    monthSpendCents,
    monthTokens: (monthAgg._sum.inputTokens ?? 0) + (monthAgg._sum.outputTokens ?? 0),
    monthCalls: monthAgg._count,
    allSpendCents: allAgg._sum.costCents ?? 0,
    allTokens: (allAgg._sum.inputTokens ?? 0) + (allAgg._sum.outputTokens ?? 0),
    allCalls: allAgg._count,
    pctUsed,
    low: pctUsed >= 80,
    byFeature: byFeature
      .map((f) => ({ feature: f.feature ?? "other", costCents: f._sum.costCents ?? 0, calls: f._count }))
      .sort((a, b) => b.costCents - a.costCents),
    recent,
    series,
  };
}
