/**
 * CITATIONS REGISTRY
 * ------------------
 * Single source of truth for every statistic used anywhere on the site.
 *
 * HARD RULE: we never invent numbers, source names, years, or URLs. A stat is
 * only shown as "verified" once an operator has confirmed it against the
 * underlying research report and filled in `source`, `year` and `url`.
 *
 * The five claims below were supplied directly by the site owner from their
 * research. The numeric `value` is theirs to stand behind; the `source`,
 * `year` and `url` are left null and `verified: false` until the exact
 * citation is confirmed from the report. The UI renders unverified stats with
 * a visible "source pending verification" state so nothing reads as a hard,
 * falsely-attributed fact.
 *
 * To verify a stat: set source/year/url and flip `verified` to true.
 */

export type Citation = {
  /** Stable key referenced from content via <Stat id="..."/> and <Cite/>. */
  id: string;
  /** The statistic written as a short, self-contained claim. */
  claim: string;
  /** The headline figure, e.g. "166", "33 to 36 hours", "77%". */
  value: string;
  /** Plain-language unit/subject for inline use, e.g. "RFPs per year". */
  unit?: string;
  /** Confirmed source name. Null until verified. */
  source: string | null;
  /** Publisher/organization behind the source, if different. */
  publisher?: string | null;
  /** Publication year. Null until verified. */
  year: number | null;
  /** Reference link. Null until verified. */
  url: string | null;
  /** True only when an operator has confirmed source/year/url. */
  verified: boolean;
  /** Optional context for editors and for on-page framing. */
  note?: string;
};

export const CITATIONS: Record<string, Citation> = {
  "rfp-volume": {
    id: "rfp-volume",
    claim: "The average organization responds to 166 RFPs per year.",
    value: "166",
    unit: "RFPs per year",
    source: null,
    publisher: null,
    year: null,
    url: null,
    verified: false,
    note: "Supplied from owner research. Confirm exact source/year/link before publishing.",
  },
  "response-hours": {
    id: "response-hours",
    claim: "The average proposal response requires 33 to 36 hours of work.",
    value: "33 to 36 hours",
    unit: "per response",
    source: null,
    publisher: null,
    year: null,
    url: null,
    verified: false,
    note: "Supplied from owner research. Confirm exact source/year/link before publishing.",
  },
  "workload-increase": {
    id: "workload-increase",
    claim: "77% of teams report an increased proposal workload.",
    value: "77%",
    unit: "of teams report rising proposal workload",
    source: null,
    publisher: null,
    year: null,
    url: null,
    verified: false,
    note: "Supplied from owner research. Confirm exact source/year/link before publishing.",
  },
  "estimator-hiring": {
    id: "estimator-hiring",
    claim: "77% of firms struggle to hire estimators.",
    value: "77%",
    unit: "of firms struggle to hire estimators",
    source: null,
    publisher: null,
    year: null,
    url: null,
    verified: false,
    note: "Supplied from owner research. Confirm exact source/year/link before publishing.",
  },
  "single-bid-frequency": {
    id: "single-bid-frequency",
    claim: "One-bid procurements happen far more often than most contractors assume.",
    value: "One-bid procurements",
    unit: "are more common than assumed",
    source: null,
    publisher: null,
    year: null,
    url: null,
    verified: false,
    note: "Qualitative claim from owner research. Attach the specific single-bid share and source when available.",
  },
};

export function getCitation(id: string): Citation | undefined {
  return CITATIONS[id];
}

export const ALL_CITATIONS = Object.values(CITATIONS);

/** Citations with confirmed source/year/url. */
export const VERIFIED_CITATIONS = ALL_CITATIONS.filter((c) => c.verified);

/** How many stats still need an operator to attach a source. */
export const PENDING_CITATION_COUNT = ALL_CITATIONS.filter((c) => !c.verified).length;
