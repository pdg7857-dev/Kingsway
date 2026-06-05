import type { DocumentAnalysis } from "./analysis-schema";
import { abbrsFromText } from "./jurisdictions";

/**
 * Client matching engine. Pure function: given an analyzed opportunity and a
 * set of client profiles, score each client and explain the result.
 *
 * Weighting: classification-code overlap 35, keyword/scope match 35,
 * value/capacity fit 20, geography 10. Geography is also a hard filter, and
 * unmet disqualifying qualifications are surfaced as blockers.
 */

export type ClientForMatch = {
  id: string;
  name: string;
  jurisdictions: string[]; // abbreviations the client covers, e.g. ["ON","AB"]
  codes: string[]; // classification code strings the client sells under
  keywordsInclude: string[]; // normalized
  keywordsExclude: string[]; // normalized
  clearances: string[]; // licenses / certs / clearances held (lowercased)
  valueMin?: number | null;
  valueMax?: number | null;
};

export type MatchResult = {
  clientId: string;
  score: number; // 0-100
  recommendation: "strong" | "worth_a_look" | "weak" | "no";
  rationale: string;
  matchedCodes: string[];
  matchedKeywords: string[];
  geographyFit: boolean;
  valueFit: boolean;
  blockers: string[];
};

function recommend(score: number, blocked: boolean): MatchResult["recommendation"] {
  if (score <= 0) return "no";
  if (blocked) return score >= 45 ? "worth_a_look" : "weak";
  if (score >= 70) return "strong";
  if (score >= 45) return "worth_a_look";
  if (score >= 20) return "weak";
  return "no";
}

export function matchOpportunity(
  analysis: DocumentAnalysis,
  opp: { jurisdiction?: string | null; estimatedValue?: number | null },
  clients: ClientForMatch[],
): MatchResult[] {
  // Build the text haystack the keyword matcher reads.
  const haystack = [
    analysis.solicitation.title,
    analysis.summary,
    ...analysis.scope_of_work,
  ]
    .join(" ")
    .toLowerCase();

  // All codes attached to the opportunity, across systems.
  const oppCodes = new Set(
    [
      ...analysis.classification_codes.unspsc,
      ...analysis.classification_codes.nigp,
      ...analysis.classification_codes.gsin,
      ...analysis.classification_codes.naics,
    ].map((c) => c.trim()),
  );

  const oppAbbrs = new Set([
    ...abbrsFromText(opp.jurisdiction),
    ...abbrsFromText(analysis.solicitation.jurisdiction),
  ]);
  const value = opp.estimatedValue ?? analysis.estimated_value.amount ?? null;

  // Disqualifying qualifications the engine can reason about by keyword.
  const hardQuals = analysis.mandatory_qualifications.filter(
    (q) => q.disqualifying_if_unmet,
  );

  return clients
    .map((c): MatchResult => {
      // Geography: hard filter when we know the opportunity's jurisdiction.
      let geographyFit = true;
      if (oppAbbrs.size > 0) {
        geographyFit = c.jurisdictions.some((j) => oppAbbrs.has(j));
      }
      if (oppAbbrs.size > 0 && !geographyFit) {
        return {
          clientId: c.id,
          score: 0,
          recommendation: "no",
          rationale: `Outside coverage. Opportunity is in ${[...oppAbbrs].join(", ")}; ${c.name} covers ${c.jurisdictions.join(", ") || "no listed jurisdictions"}.`,
          matchedCodes: [],
          matchedKeywords: [],
          geographyFit: false,
          valueFit: false,
          blockers: [],
        };
      }

      // Code overlap.
      const matchedCodes = c.codes.filter((code) => oppCodes.has(code.trim()));
      const codeScore = oppCodes.size
        ? Math.min(1, matchedCodes.length / Math.min(oppCodes.size, 3)) * 35
        : 0;

      // Keyword / scope match, minus exclude penalties.
      const matchedKeywords = c.keywordsInclude.filter(
        (k) => k && haystack.includes(k),
      );
      const excluded = c.keywordsExclude.filter((k) => k && haystack.includes(k));
      const kwBase = c.keywordsInclude.length
        ? Math.min(1, matchedKeywords.length / Math.min(c.keywordsInclude.length, 4))
        : 0;
      const keywordScore = Math.max(0, kwBase * 35 - excluded.length * 8);

      // Value / capacity fit.
      let valueFit = true;
      if (value != null && (c.valueMin != null || c.valueMax != null)) {
        valueFit =
          (c.valueMin == null || value >= c.valueMin) &&
          (c.valueMax == null || value <= c.valueMax);
      }
      const valueScore = valueFit ? 20 : 0;

      const geoScore = geographyFit ? 10 : 0;

      // Blockers: disqualifying qualifications the client does not visibly hold.
      const held = c.clearances.map((x) => x.toLowerCase());
      const blockers = hardQuals
        .filter((q) => ["clearance", "license", "certification", "bonding"].includes(q.type))
        .filter((q) => {
          const hay = `${q.requirement} ${q.detail}`.toLowerCase();
          return !held.some((h) => h && hay.includes(h));
        })
        .map((q) => q.requirement);

      let score = Math.round(codeScore + keywordScore + valueScore + geoScore);
      if (excluded.length) score = Math.max(0, score);
      score = Math.max(0, Math.min(100, score));

      const bits: string[] = [];
      if (matchedCodes.length) bits.push(`codes ${matchedCodes.join(", ")}`);
      if (matchedKeywords.length) bits.push(`keywords ${matchedKeywords.slice(0, 6).join(", ")}`);
      if (oppAbbrs.size) bits.push(geographyFit ? "in coverage" : "out of coverage");
      if (value != null) bits.push(valueFit ? "value in range" : "value outside range");
      if (excluded.length) bits.push(`excluded terms hit: ${excluded.join(", ")}`);
      if (blockers.length) bits.push(`possible blockers: ${blockers.join("; ")}`);
      const rationale = bits.length ? bits.join("; ") + "." : "No strong signals matched.";

      return {
        clientId: c.id,
        score,
        recommendation: recommend(score, blockers.length > 0),
        rationale,
        matchedCodes,
        matchedKeywords,
        geographyFit,
        valueFit,
        blockers,
      };
    })
    .sort((a, b) => b.score - a.score);
}
