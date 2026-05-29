/**
 * CITATIONS REGISTRY
 * ------------------
 * Single source of truth for every statistic used on the site.
 *
 * HARD RULES:
 *  - We never invent numbers. Every value below comes from the owner's
 *    research evidence base.
 *  - `source` and `year` are the attributed origin the owner stands behind.
 *  - `url` is the live reference link. It is filled in as exact links are
 *    confirmed. When `url` is null the UI shows the source name and year as
 *    plain text (no hyperlink), never a fabricated link.
 *  - `verified: true` means the claim is attributed to a named source and is
 *    cleared for use. `verified: false` renders a "source pending" marker.
 *
 * Confidence mirrors the research base (high / medium) so editors can choose
 * which stats to feature most prominently.
 */

export type Citation = {
  id: string;
  /** The statistic written as a short, self-contained claim. */
  claim: string;
  /** The headline figure, e.g. "166", "33 hours", "77%". */
  value: string;
  /** Plain-language unit/subject for inline use. */
  unit?: string;
  /** Attributed source name. */
  source: string | null;
  /** Publication year. */
  year: number | null;
  /** Geography the figure applies to. */
  geo?: string;
  /** Live reference link. Null until the exact URL is confirmed. */
  url: string | null;
  /** Research confidence. */
  confidence?: "high" | "medium";
  /** True when attributed to a named source and cleared for use. */
  verified: boolean;
  /** Editor note / context. */
  note?: string;
};

function c(x: Citation): Citation {
  return x;
}

export const CITATIONS: Record<string, Citation> = {
  // --- Proposal volume and labour -------------------------------------------
  "rfp-volume": c({
    id: "rfp-volume",
    claim: "The average organization now responds to 166 RFPs per year.",
    value: "166", unit: "RFPs per year",
    source: "Loopio + APMP, RFP Response Trends & Benchmarks", year: 2026,
    geo: "Global", url: null, confidence: "high", verified: true,
  }),
  "response-hours": c({
    id: "response-hours",
    claim: "Teams spend an average of 33 hours on each RFP response.",
    value: "33 hours", unit: "per response",
    source: "Loopio + APMP, RFP Response Trends & Benchmarks", year: 2026,
    geo: "Global", url: null, confidence: "high", verified: true,
  }),
  "dedicated-team-hours": c({
    id: "dedicated-team-hours",
    claim: "Dedicated proposal teams spend 36 hours per response, above the 33-hour average.",
    value: "36 hours", unit: "per response (dedicated teams)",
    source: "Loopio + APMP", year: 2026, geo: "Global",
    url: null, confidence: "high", verified: true,
  }),
  "winning-hours": c({
    id: "winning-hours",
    claim: "Winning teams spend about 35 hours per submission, more than the 33-hour average.",
    value: "35 hours", unit: "per winning submission",
    source: "Loopio + APMP", year: 2026, geo: "Global",
    url: null, confidence: "high", verified: true,
  }),
  "contributors-per-rfp": c({
    id: "contributors-per-rfp",
    claim: "Each RFP involves an average of 9 contributors across the organization.",
    value: "9", unit: "contributors per RFP",
    source: "Loopio", year: 2026, geo: "Global",
    url: null, confidence: "high", verified: true,
  }),
  "bandwidth-challenge": c({
    id: "bandwidth-challenge",
    claim: "For the first time, 50% of respondents rank bandwidth as a top challenge.",
    value: "50%", unit: "rank bandwidth a top challenge",
    source: "Loopio / Business Wire", year: 2026, geo: "Global",
    url: null, confidence: "medium", verified: true,
  }),

  // --- Win rates and selectivity --------------------------------------------
  "win-rate-avg": c({
    id: "win-rate-avg",
    claim: "The multi-year average RFP win rate is 45%.",
    value: "45%", unit: "average RFP win rate",
    source: "Loopio benchmark summary", year: 2026, geo: "Global",
    url: null, confidence: "medium", verified: true,
  }),
  "win-rate-public": c({
    id: "win-rate-public",
    claim: "In the government and public sector, the average RFP win rate is 40%.",
    value: "40%", unit: "public-sector win rate",
    source: "RFP Trends Report (public-sector slice)", year: 2025, geo: "Global / public sector",
    url: null, confidence: "medium", verified: true,
  }),
  "leaders-laggards": c({
    id: "leaders-laggards",
    claim: "Response leaders win 58% of responses, versus 50% for laggards.",
    value: "58% vs 50%", unit: "leader vs laggard win rate",
    source: "Responsive maturity study", year: 2025, geo: "Global",
    url: null, confidence: "high", verified: true,
  }),
  "ae-volume-drop": c({
    id: "ae-volume-drop",
    claim: "In A&E, proposal volume dropped 38% year over year.",
    value: "38%", unit: "drop in proposal volume",
    source: "Deltek Clarity A&E", year: 2025, geo: "U.S. / Canada A&E",
    url: null, confidence: "high", verified: true,
  }),
  "ae-value-up": c({
    id: "ae-value-up",
    claim: "Despite fewer pursuits, the value of awarded work grew 52% year over year.",
    value: "52%", unit: "growth in awarded value",
    source: "Deltek Clarity A&E", year: 2025, geo: "U.S. / Canada A&E",
    url: null, confidence: "high", verified: true,
  }),
  "ae-win-rate": c({
    id: "ae-win-rate",
    claim: "In A&E, the median win rate increased to 50% as firms became more selective.",
    value: "50%", unit: "median A&E win rate",
    source: "Deltek Clarity A&E", year: 2025, geo: "U.S. / Canada A&E",
    url: null, confidence: "high", verified: true,
  }),
  "go-no-go-top": c({
    id: "go-no-go-top",
    claim: "81% of top performers use a formal go/no-go process, versus 75% overall.",
    value: "81%", unit: "of top performers use go/no-go",
    source: "Loopio", year: 2026, geo: "Global",
    url: null, confidence: "high", verified: true,
  }),
  "revenue-tied-bids": c({
    id: "revenue-tied-bids",
    claim: "48% of company revenue is tied to RFPs, bids, tenders and proposals.",
    value: "48%", unit: "of revenue tied to bids",
    source: "Responsive + APMP, State of Strategic Response Management", year: 2024,
    geo: "Global", url: null, confidence: "high", verified: true,
  }),
  "workload-increase": c({
    id: "workload-increase",
    claim: "77% of bid and proposal professionals say their workload increased in the past year.",
    value: "77%", unit: "report rising proposal workload",
    source: "Responsive + APMP", year: 2024, geo: "Global",
    url: null, confidence: "high", verified: true,
  }),

  // --- Competition and one-bid outcomes -------------------------------------
  "one-bid-open": c({
    id: "one-bid-open",
    claim: "53 of 180 open competitive federal processes reviewed received only one bid (29%).",
    value: "29%", unit: "of open competitive processes drew one bid",
    source: "Office of the Procurement Ombud (Canada)", year: 2026, geo: "Canada federal",
    url: null, confidence: "high", verified: true,
  }),
  "one-bid-limited": c({
    id: "one-bid-limited",
    claim: "106 of 303 limited competitive federal processes reviewed received only one bid (35%).",
    value: "35%", unit: "of limited competitive processes drew one bid",
    source: "Office of the Procurement Ombud (Canada)", year: 2026, geo: "Canada federal",
    url: null, confidence: "high", verified: true,
  }),
  "single-bid-frequency": c({
    id: "single-bid-frequency",
    claim: "About one third of multi-bid federal procurements reviewed still received only one bid.",
    value: "~1 in 3", unit: "competitions drew a single bid",
    source: "Office of the Procurement Ombud (Canada)", year: 2026, geo: "Canada federal",
    url: null, confidence: "high", verified: true,
  }),
  "single-bid-premium": c({
    id: "single-bid-premium",
    claim: "Single-bid contracts are over 7% more expensive on average.",
    value: "7%+", unit: "price premium on single-bid contracts",
    source: "Open Contracting Partnership (EU studies summary)", year: 2023, geo: "Europe",
    url: null, confidence: "medium", verified: true,
  }),

  // --- Capacity and labour cost ---------------------------------------------
  "hiring-difficulty": c({
    id: "hiring-difficulty",
    claim: "92% of U.S. construction firms report difficulty filling open positions.",
    value: "92%", unit: "of firms struggle to hire",
    source: "AGC + NCCER Workforce Survey", year: 2025, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "estimator-hiring": c({
    id: "estimator-hiring",
    claim: "77% of firms with openings report difficulty filling estimating roles.",
    value: "77%", unit: "struggle to hire estimators",
    source: "AGC + NCCER Workforce Survey", year: 2025, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "pm-hiring": c({
    id: "pm-hiring",
    claim: "76% of firms report difficulty filling project manager and supervisor roles.",
    value: "76%", unit: "struggle to hire PMs / supervisors",
    source: "AGC + NCCER Workforce Survey", year: 2025, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "delays-shortage": c({
    id: "delays-shortage",
    claim: "45% of firms reported project delays caused by worker shortages.",
    value: "45%", unit: "report shortage-driven delays",
    source: "AGC + NCCER Workforce Survey", year: 2025, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "estimator-wage-us": c({
    id: "estimator-wage-us",
    claim: "The U.S. median annual wage for cost estimators was $77,070.",
    value: "$77,070", unit: "median estimator wage",
    source: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook (May 2024)", year: 2024,
    geo: "United States",
    url: "https://www.bls.gov/ooh/business-and-financial/cost-estimators.htm",
    confidence: "high", verified: true,
  }),
  "pm-wage-us": c({
    id: "pm-wage-us",
    claim: "The U.S. median annual wage for project management specialists was $100,750.",
    value: "$100,750", unit: "median PM wage",
    source: "U.S. Bureau of Labor Statistics, Occupational Outlook Handbook (May 2024)", year: 2024,
    geo: "United States",
    url: "https://www.bls.gov/ooh/business-and-financial/project-management-specialists.htm",
    confidence: "high", verified: true,
  }),
  "loaded-multiplier": c({
    id: "loaded-multiplier",
    claim: "U.S. private-industry total compensation averaged $46.15/hour versus $32.36/hour in wages, about a 1.43x loaded-cost multiplier.",
    value: "1.43x", unit: "loaded-cost multiplier",
    source: "U.S. Bureau of Labor Statistics, ECEC (Dec 2025)", year: 2025, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "blended-rate": c({
    id: "blended-rate",
    claim: "A practical blended screening rate is about $61/hour fully loaded.",
    value: "$61/hour", unit: "blended loaded screening rate",
    source: "Derived from BLS wage (estimator and PM) and ECEC loaded-cost data", year: 2024,
    geo: "United States", url: null, confidence: "medium", verified: true,
    note: "Calculated: ($77,070 and $100,750 / 2,080 hours) x 1.43, blended.",
  }),

  // --- Market fragmentation -------------------------------------------------
  "canada-public-units": c({
    id: "canada-public-units",
    claim: "Canada has 6,064 active public-sector units.",
    value: "6,064", unit: "Canadian public-sector buying units",
    source: "Statistics Canada, Public Sector Universe", year: 2024, geo: "Canada",
    url: null, confidence: "high", verified: true,
  }),
  "canada-local-units": c({
    id: "canada-local-units",
    claim: "Canada has 4,274 local government units and 370 local school boards.",
    value: "4,274", unit: "Canadian local government units",
    source: "Statistics Canada, Public Sector Universe", year: 2024, geo: "Canada",
    url: null, confidence: "high", verified: true,
  }),
  "us-local-govs": c({
    id: "us-local-govs",
    claim: "The U.S. had 90,837 local governments in 2022, rising to 91,438 in 2025.",
    value: "91,438", unit: "U.S. local governments",
    source: "U.S. Census Bureau, Census of Governments", year: 2025, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "us-special-districts": c({
    id: "us-special-districts",
    claim: "The U.S. has 39,555 special district governments and 12,546 independent school districts.",
    value: "39,555", unit: "U.S. special districts",
    source: "U.S. Census Bureau, Census of Governments", year: 2022, geo: "United States",
    url: null, confidence: "high", verified: true,
  }),
  "us-federal-spend": c({
    id: "us-federal-spend",
    claim: "U.S. federal agencies reported about $755 billion in procurement obligations in FY2024.",
    value: "$755B", unit: "U.S. federal procurement obligations",
    source: "GAO and FPDS", year: 2024, geo: "United States federal",
    url: null, confidence: "high", verified: true,
  }),
  "bidnet-daily-bids": c({
    id: "bidnet-daily-bids",
    claim: "BidNet's network advertises more than 25,000 daily open bids across 90,000+ agencies.",
    value: "25,000+", unit: "daily open bids on one network",
    source: "BidNet", year: 2026, geo: "United States",
    url: null, confidence: "medium", verified: true,
  }),
};

/**
 * Authoritative publisher links keyed by source name. When a citation has no
 * explicit `url`, we fall back to the publisher's authoritative page here so a
 * stat still references its source. These point at the publisher / report
 * landing page; swap in exact deep links as they are confirmed.
 */
export const SOURCE_LINKS: Record<string, string> = {
  "Loopio + APMP, RFP Response Trends & Benchmarks": "https://www.loopio.com/resources/rfp-response-trends-benchmarks-report/",
  "Loopio + APMP": "https://www.loopio.com/resources/rfp-response-trends-benchmarks-report/",
  "Loopio": "https://www.loopio.com/resources/",
  "Loopio benchmark summary": "https://www.loopio.com/resources/",
  "Loopio / Business Wire": "https://www.loopio.com/resources/",
  "RFP Trends Report (public-sector slice)": "https://www.loopio.com/resources/",
  "Responsive maturity study": "https://www.responsive.io/resources",
  "Responsive + APMP, State of Strategic Response Management": "https://www.responsive.io/resources",
  "Responsive + APMP": "https://www.responsive.io/resources",
  "Deltek Clarity A&E": "https://www.deltek.com/en/clarity/architecture-and-engineering",
  "Office of the Procurement Ombud (Canada)": "https://opo-boa.gc.ca/",
  "Open Contracting Partnership (EU studies summary)": "https://www.open-contracting.org/",
  "AGC + NCCER Workforce Survey": "https://www.agc.org/learn/construction-data",
  "U.S. Bureau of Labor Statistics, ECEC (Dec 2025)": "https://www.bls.gov/news.release/ecec.nr0.htm",
  "Statistics Canada, Public Sector Universe": "https://www150.statcan.gc.ca/n1/daily-quotidien/",
  "U.S. Census Bureau, Census of Governments": "https://www.census.gov/programs-surveys/cog.html",
  "GAO and FPDS": "https://www.gao.gov/",
  "BidNet": "https://www.bidnetdirect.com/",
  "Derived from BLS wage (estimator and PM) and ECEC loaded-cost data": "https://www.bls.gov/ooh/business-and-financial/cost-estimators.htm",
};

/** Resolve the best available reference link for a citation. */
export function citationUrl(citation: Citation): string | null {
  if (citation.url) return citation.url;
  if (citation.source && SOURCE_LINKS[citation.source]) return SOURCE_LINKS[citation.source];
  return null;
}

export function getCitation(id: string): Citation | undefined {
  return CITATIONS[id];
}

export const ALL_CITATIONS = Object.values(CITATIONS);
export const VERIFIED_CITATIONS = ALL_CITATIONS.filter((x) => x.verified);
export const PENDING_CITATION_COUNT = ALL_CITATIONS.filter((x) => !x.verified).length;

/** Curated sets for featuring on specific pages. */
export const STAT_SETS = {
  waste: ["response-hours", "estimator-hiring", "blended-rate", "rfp-volume"],
  qualification: ["go-no-go-top", "ae-volume-drop", "ae-value-up", "win-rate-public"],
  competition: ["one-bid-open", "one-bid-limited", "single-bid-frequency", "single-bid-premium"],
  fragmentation: ["canada-public-units", "us-local-govs", "us-special-districts", "bidnet-daily-bids"],
  capacity: ["hiring-difficulty", "estimator-hiring", "pm-hiring", "delays-shortage"],
} as const;
