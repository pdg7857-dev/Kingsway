// Aggregation queries for the Opportunity Intelligence CEO dashboard.

import { prisma } from "@/lib/prisma";
import { PROSPECT_TIERS, type ProspectTier } from "@/lib/oi/constants";

export async function getOiOverview(userId: string) {
  const [prospects, renewals, buyers] = await Promise.all([
    prisma.prospect.findMany({ where: { userId } }),
    prisma.renewal.findMany({
      where: { userId, status: { not: "CLOSED" } },
      include: { buyer: true, incumbent: true },
      orderBy: { likelyRebidStart: "asc" },
    }),
    prisma.buyer.findMany({ where: { userId }, orderBy: { totalAwardedDollars: "desc" } }),
  ]);

  const scored = prospects.filter((p) => p.score != null);

  // Tier distribution
  const tierCounts: Record<ProspectTier, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const p of prospects) if (p.tier && p.tier in tierCounts) tierCounts[p.tier as ProspectTier]++;

  // Top prospects by score
  const topProspects = [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 10);

  // Highest-value accounts by estimated LTV
  const highestValue = [...scored]
    .filter((p) => p.estLtvCents)
    .sort((a, b) => (b.estLtvCents ?? 0) - (a.estLtvCents ?? 0))
    .slice(0, 8);

  // Platform frequency across the book
  const platformFreq = new Map<string, number>();
  for (const p of prospects) {
    for (const pl of [...p.primaryPlatforms, ...p.secondaryPlatforms]) {
      platformFreq.set(pl, (platformFreq.get(pl) ?? 0) + 1);
    }
  }
  const topPlatforms = [...platformFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Most valuable industries (by summed est LTV)
  const industryValue = new Map<string, { count: number; ltv: number }>();
  for (const p of scored) {
    const key = p.industry ?? "Unknown";
    const cur = industryValue.get(key) ?? { count: 0, ltv: 0 };
    cur.count++;
    cur.ltv += p.estLtvCents ?? 0;
    industryValue.set(key, cur);
  }
  const topIndustries = [...industryValue.entries()].sort((a, b) => b[1].ltv - a[1].ltv).slice(0, 6);

  // Pipeline est value (sum of A/B/C est annual value)
  const pipelineAnnualCents = scored
    .filter((p) => p.tier && p.tier !== "D")
    .reduce((s, p) => s + (p.estAnnualValueCents ?? 0), 0);
  const pipelineLtvCents = scored.reduce((s, p) => s + (p.estLtvCents ?? 0), 0);

  const contactToday = topProspects.filter((p) => (p.score ?? 0) >= 85);

  return {
    counts: {
      total: prospects.length,
      scored: scored.length,
      tier: tierCounts,
      buyers: buyers.length,
      renewals: renewals.length,
      contactToday: contactToday.length,
    },
    topProspects,
    highestValue,
    contactToday,
    topPlatforms,
    topIndustries,
    topBuyers: buyers.slice(0, 8),
    upcomingRenewals: renewals.slice(0, 10),
    pipelineAnnualCents,
    pipelineLtvCents,
  };
}

export const TIER_ORDER = PROSPECT_TIERS;
