import { prisma } from "./db";

// Semantic nearest-neighbour lookup via pgvector. Returns [] gracefully if the
// embedding column / pgvector is not set up yet (feature is opt-in).

export type SimilarAward = {
  id: string; title: string; buyer: string; supplier: string | null;
  value: number | null; currency: string; dist: number;
};

export async function similarAwardsForOpportunity(oppId: string, limit = 8): Promise<SimilarAward[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT a.id, a.title, a.buyer, a.supplier, a.value, a.currency,
              (a.embedding <=> o.embedding) AS dist
       FROM "AwardedContract" a, "Opportunity" o
       WHERE o.id = $1 AND o.embedding IS NOT NULL AND a.embedding IS NOT NULL
       ORDER BY a.embedding <=> o.embedding
       LIMIT $2`,
      oppId,
      limit,
    );
    return rows.map((r) => ({
      id: String(r.id),
      title: String(r.title),
      buyer: String(r.buyer),
      supplier: r.supplier == null ? null : String(r.supplier),
      value: r.value == null ? null : Number(r.value),
      currency: String(r.currency ?? "CAD"),
      dist: Number(r.dist),
    }));
  } catch {
    return [];
  }
}
