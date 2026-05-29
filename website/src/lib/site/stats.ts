/**
 * "Government Contracting by the Numbers."
 *
 * Every figure here is a PLACEHOLDER an operator must replace with a cited,
 * verifiable number before publishing. We do not fabricate statistics. Each
 * row carries the claim, a blank `value`, the kind of source that would
 * support it, and a note on where to find it. The UI renders a clear
 * "citation needed" state until a real value and source URL are filled in.
 */

export type StatClaim = {
  /** What the number describes. */
  label: string;
  /** Replace with the verified figure, e.g. "$200B". Null = needs sourcing. */
  value: string | null;
  /** Short framing of why it matters to a contractor. */
  context: string;
  /** The type of source that can substantiate this. */
  sourceType: string;
  /** Citation URL once verified. */
  sourceUrl: string | null;
};

export const STAT_GROUPS: { group: string; claims: StatClaim[] }[] = [
  {
    group: "Market size",
    claims: [
      {
        label: "Annual U.S. federal procurement spending",
        value: null,
        context: "The size of the federal market your competitors are already bidding.",
        sourceType: "USASpending / GAO annual figures",
        sourceUrl: null,
      },
      {
        label: "Annual U.S. state & local procurement spending",
        value: null,
        context: "State and local buyers issue far more contracts than the federal government by count.",
        sourceType: "Census of Governments / state CAFRs",
        sourceUrl: null,
      },
      {
        label: "Annual Canadian public procurement spending",
        value: null,
        context: "Federal, provincial and MASH spending combined across Canada.",
        sourceType: "PSPC / StatCan / OECD",
        sourceUrl: null,
      },
    ],
  },
  {
    group: "Opportunity volume",
    claims: [
      {
        label: "Open opportunities posted per year (North America)",
        value: null,
        context: "The number of notices spread across dozens of platforms no single team can watch.",
        sourceType: "Aggregated platform reporting",
        sourceUrl: null,
      },
      {
        label: "Procurement platforms a mid-market contractor may need to watch",
        value: null,
        context: "Each jurisdiction can add another portal, login and notification setting.",
        sourceType: "Internal coverage map",
        sourceUrl: null,
      },
    ],
  },
  {
    group: "Competition & outcomes",
    claims: [
      {
        label: "Average number of bidders per public solicitation",
        value: null,
        context: "Thinner fields than most contractors assume, when you find the right bids.",
        sourceType: "Agency award data / academic studies",
        sourceUrl: null,
      },
      {
        label: "Share of solicitations that receive a single bid",
        value: null,
        context: "Single-bid contracts signal where competition is weakest.",
        sourceType: "GAO / OECD single-bid analyses",
        sourceUrl: null,
      },
      {
        label: "Share of opportunities that go unbid in a given category",
        value: null,
        context: "Work left on the table because nobody qualified it in time.",
        sourceType: "Agency procurement reports",
        sourceUrl: null,
      },
    ],
  },
  {
    group: "The cost of doing it yourself",
    claims: [
      {
        label: "Average fully-loaded estimator hourly cost",
        value: null,
        context: "What every hour spent reading the wrong bid actually costs you.",
        sourceType: "BLS / industry compensation surveys",
        sourceUrl: null,
      },
      {
        label: "Average cost to prepare a single public bid",
        value: null,
        context: "Pursuit cost rises fast when you chase the wrong opportunities.",
        sourceType: "Industry estimating benchmarks",
        sourceUrl: null,
      },
      {
        label: "Hours per week a contractor spends monitoring portals",
        value: null,
        context: "Time that disappears before a single proposal is written.",
        sourceType: "Customer surveys",
        sourceUrl: null,
      },
    ],
  },
];
