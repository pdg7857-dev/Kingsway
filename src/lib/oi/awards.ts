// Module 3/5 helpers — award normalisation, prospect rollups, renewal windows.

import type { AlertWindow } from "./constants";

/** Normalise a supplier / company name for fuzzy matching across datasets. */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\b(inc|incorporated|ltd|limited|llc|llp|corp|corporation|co|company|services|service|group|holdings|enterprises|the)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type AwardLike = {
  valueDollars?: number | null;
  awardDate?: Date | string | null;
  category?: string | null;
  department?: string | null;
  agency?: string | null;
};

/** Recompute a prospect's denormalised award rollup from its awards. */
export function rollupAwards(awards: AwardLike[]) {
  const values = awards.map((a) => a.valueDollars ?? 0);
  const dates = awards
    .map((a) => (a.awardDate ? new Date(a.awardDate).getTime() : 0))
    .filter((t) => t > 0);
  const categories = Array.from(new Set(awards.map((a) => a.category).filter(Boolean))) as string[];
  const depts = Array.from(
    new Set(awards.map((a) => a.department ?? a.agency).filter(Boolean))
  ) as string[];

  return {
    hasWonGov: awards.length > 0,
    awardCount: awards.length,
    totalWonDollars: values.reduce((a, b) => a + b, 0),
    largestAwardDollars: values.length ? Math.max(...values) : 0,
    lastAwardAt: dates.length ? new Date(Math.max(...dates)) : null,
    awardCategories: categories.slice(0, 12),
    awardingDepts: depts.slice(0, 12),
  };
}

/** Bucket a future date into the spec's alert windows. */
export function alertWindowFor(target?: Date | string | null): AlertWindow | null {
  if (!target) return null;
  const days = (new Date(target).getTime() - Date.now()) / 86_400_000;
  if (days <= 0) return "PAST";
  if (days <= 30) return "D30";
  if (days <= 91) return "M3";
  if (days <= 183) return "M6";
  if (days <= 274) return "M9";
  if (days <= 365) return "M12";
  return null; // further out than 12 months — not yet on a watch window
}

/**
 * Predict renewal timing from an award. Assumes a rebid process typically
 * opens ~4 months before the contract ends.
 */
export function predictRenewal(award: {
  endDate?: Date | string | null;
  startDate?: Date | string | null;
  awardDate?: Date | string | null;
  contractLengthMonths?: number | null;
  valueDollars?: number | null;
}) {
  let end = award.endDate ? new Date(award.endDate) : null;
  if (!end && award.startDate && award.contractLengthMonths) {
    end = new Date(award.startDate);
    end.setMonth(end.getMonth() + award.contractLengthMonths);
  }
  if (!end && award.awardDate && award.contractLengthMonths) {
    end = new Date(award.awardDate);
    end.setMonth(end.getMonth() + award.contractLengthMonths);
  }
  const likelyRebidStart = end ? new Date(end) : null;
  if (likelyRebidStart) likelyRebidStart.setMonth(likelyRebidStart.getMonth() - 4);
  return {
    endDate: end,
    likelyRenewalDate: end,
    likelyRebidStart,
    expectedValueDollars: award.valueDollars ?? null,
    alertWindow: alertWindowFor(likelyRebidStart),
  };
}
