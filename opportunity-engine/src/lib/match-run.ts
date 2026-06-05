import { prisma } from "./db";
import { matchOpportunity, type ClientForMatch, type MatchResult } from "./matching";
import type { DocumentAnalysis } from "./analysis-schema";

/** Load active/prospect clients in the shape the matcher needs. */
export async function loadMatchClients(): Promise<ClientForMatch[]> {
  const clients = await prisma.client.findMany({
    where: { status: { in: ["active", "prospect"] } },
    include: { codes: { include: { code: true } }, keywords: { include: { keyword: true } } },
  });
  return clients.map((c) => ({
    id: c.id,
    name: c.name,
    jurisdictions: c.jurisdictions,
    codes: c.codes.map((cc) => cc.code.code),
    keywordsInclude: c.keywords.filter((k) => !k.exclude).map((k) => k.keyword.normalized),
    keywordsExclude: c.keywords.filter((k) => k.exclude).map((k) => k.keyword.normalized),
    clearances: c.clearances,
    valueMin: c.valueMin ? Number(c.valueMin) : null,
    valueMax: c.valueMax ? Number(c.valueMax) : null,
  }));
}

export async function persistMatches(opportunityId: string, results: MatchResult[]) {
  for (const r of results) {
    if (r.recommendation === "no" && r.score === 0) continue;
    await prisma.match.upsert({
      where: { opportunityId_clientId: { opportunityId, clientId: r.clientId } },
      update: { score: r.score, recommendation: r.recommendation, rationale: r.rationale, matchedCodes: r.matchedCodes, matchedKeywords: r.matchedKeywords, geographyFit: r.geographyFit, valueFit: r.valueFit, blockers: r.blockers },
      create: { opportunityId, clientId: r.clientId, score: r.score, recommendation: r.recommendation, rationale: r.rationale, matchedCodes: r.matchedCodes, matchedKeywords: r.matchedKeywords, geographyFit: r.geographyFit, valueFit: r.valueFit, blockers: r.blockers },
    });
  }
}

export async function runMatch(
  opportunityId: string,
  analysis: DocumentAnalysis,
  opp: { jurisdiction?: string | null; estimatedValue?: number | null },
) {
  const clients = await loadMatchClients();
  const results = matchOpportunity(analysis, opp, clients);
  await persistMatches(opportunityId, results);
  return results.length;
}
