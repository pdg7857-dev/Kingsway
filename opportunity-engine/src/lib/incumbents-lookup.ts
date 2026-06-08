import { prisma } from "./db";
import type { AwardedContract } from "@prisma/client";

// Given a live opportunity (buyer / codes / title), find the most likely related
// awarded contracts in history, identify the probable incumbent, and compute a
// "price to beat" benchmark. This connects an open tender to who holds the work
// now and at what value.

const STOP = new Set([
  "the", "and", "for", "of", "to", "a", "an", "in", "on", "services", "service",
  "request", "proposal", "proposals", "tender", "rfp", "rfq", "itt", "various",
  "supply", "provision", "contract", "canada", "inc", "ltd", "national", "with",
]);

function tokens(s: string | null | undefined, max = 6): string[] {
  if (!s) return [];
  return Array.from(
    new Set(
      s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)),
    ),
  ).slice(0, max);
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

export type RelatedAwards = {
  related: (AwardedContract & { _score: number })[];
  incumbent: AwardedContract | null;
  stats: { count: number; median: number | null; min: number | null; max: number | null };
};

export async function findRelatedAwards(input: {
  buyer?: string | null;
  codes?: string[];
  title?: string | null;
}): Promise<RelatedAwards> {
  const codeCandidates = Array.from(
    new Set((input.codes ?? []).flatMap((c) => [c, c.replace(/^\*/, ""), `*${c}`])),
  ).filter(Boolean);
  const buyerTok = tokens(input.buyer, 2);
  const titleTok = tokens(input.title, 6);

  const or: object[] = [];
  if (codeCandidates.length) or.push({ codes: { hasSome: codeCandidates } });
  for (const t of buyerTok) or.push({ buyer: { contains: t, mode: "insensitive" } });
  for (const t of titleTok) or.push({ title: { contains: t, mode: "insensitive" } });
  if (or.length === 0) return { related: [], incumbent: null, stats: { count: 0, median: null, min: null, max: null } };

  const candidates = await prisma.awardedContract
    .findMany({ where: { OR: or as never }, take: 400 })
    .catch(() => [] as AwardedContract[]);

  const buyerKey = (input.buyer ?? "").toLowerCase();
  const scored = candidates
    .map((a) => {
      let score = 0;
      const codeOverlap = a.codes.filter((c) => codeCandidates.includes(c)).length;
      score += codeOverlap * 3;
      if (buyerKey && a.buyer && (a.buyer.toLowerCase().includes(buyerKey) || buyerTok.some((t) => a.buyer.toLowerCase().includes(t)))) score += 2;
      const title = (a.title ?? "").toLowerCase();
      score += titleTok.filter((t) => title.includes(t)).length;
      return { ...a, _score: score };
    })
    .filter((a) => a._score > 0)
    .sort((a, b) => b._score - a._score || (Number(b.value ?? 0) - Number(a.value ?? 0)))
    .slice(0, 12);

  const values = scored.map((a) => (a.value ? Number(a.value) : 0)).filter((v) => v > 0);
  const incumbent = scored.find((a) => a.supplier && a.value) ?? scored[0] ?? null;

  return {
    related: scored,
    incumbent: incumbent ?? null,
    stats: {
      count: scored.length,
      median: median(values),
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
    },
  };
}
