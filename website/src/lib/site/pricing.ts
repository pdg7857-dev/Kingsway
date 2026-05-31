/**
 * Public coverage pricing. Positioned as Opportunity Intelligence Coverage,
 * never per-province, per-state, per-opportunity, or hourly.
 */

export type Plan = {
  name: string;
  price: string;
  priceNote?: string;
  scope: string;
  blurb: string;
  features: string[];
  featured?: boolean;
  startingAt?: boolean;
  /** Small clarifying line under the features (e.g. federal/military rules). */
  footnote?: string;
};

export const INCLUDED_EVERYWHERE: string[] = [
  "Continuous monitoring across every relevant platform",
  "Opportunity discovery, including bids your alerts never surface",
  "Bid document review (scope, requirements, evaluation criteria)",
  "Fit qualification against your trades, capacity and footprint",
  "Plain-language opportunity summaries",
  "Direct links to the source bid on the issuing platform",
];

export const CANADA_PLANS: Plan[] = [
  {
    name: "Single Province Coverage",
    price: "$599",
    priceNote: "/month",
    scope: "One province (Atlantic counts as one)",
    blurb: "Full intelligence coverage for the province where you do most of your work.",
    features: [
      "Monitoring across every platform that serves your province",
      "Opportunity discovery & screening",
      "Bid document review",
      "Fit qualification",
      "Opportunity summaries",
      "Direct bid links",
    ],
    footnote: "The four Atlantic provinces (Nova Scotia, New Brunswick, PEI and Newfoundland and Labrador) count as a single province on this plan.",
  },
  {
    name: "Multi-Province Coverage",
    price: "$999",
    priceNote: "/month",
    scope: "2-3 provinces",
    blurb: "For contractors bidding across a regional footprint.",
    featured: true,
    features: [
      "Everything in Single Province",
      "Coverage across 2-3 provinces",
      "Cross-jurisdiction de-duplication",
      "Consolidated weekly intelligence",
      "Priority on time-sensitive opportunities",
    ],
  },
  {
    name: "National Coverage",
    price: "$1,799",
    priceNote: "/month",
    startingAt: true,
    scope: "All provinces + federal",
    blurb: "Coast-to-coast coverage including federal procurement.",
    features: [
      "Everything in Multi-Province",
      "All provinces & territories",
      "Federal opportunities (CanadaBuys & more)",
      "Priority monitoring",
      "Dedicated intelligence cadence",
    ],
  },
];

export const USA_PLANS: Plan[] = [
  {
    name: "Single State Coverage",
    price: "$599",
    priceNote: "/month",
    scope: "One state (state & local)",
    blurb: "Full intelligence coverage for your home state.",
    features: [
      "Monitoring across every platform serving your state",
      "State, county, municipal & special-district opportunities",
      "Bid document review",
      "Fit qualification",
      "Opportunity summaries",
      "Direct bid links",
    ],
    footnote: "State and local only. Federal and U.S. military / DoD contracts require National coverage.",
  },
  {
    name: "Regional Coverage",
    price: "$999",
    priceNote: "/month",
    scope: "2-4 states (state & local)",
    blurb: "For contractors working a regional cluster of states.",
    features: [
      "Everything in Single State",
      "Coverage across 2-4 states",
      "Cross-state de-duplication",
      "Consolidated weekly intelligence",
      "Priority on time-sensitive opportunities",
    ],
    footnote: "State and local only. Federal and U.S. military / DoD contracts require National coverage.",
  },
  {
    name: "Multi-State Coverage",
    price: "$1,499",
    priceNote: "/month",
    scope: "5-12 states (state & local)",
    blurb: "Built for regional and national field operations.",
    featured: true,
    features: [
      "Everything in Regional",
      "Coverage across 5-12 states",
      "Portfolio-level prioritization",
      "Dedicated intelligence cadence",
    ],
    footnote: "State and local only. Federal and U.S. military / DoD contracts require National coverage.",
  },
  {
    name: "National Coverage",
    price: "$2,999",
    priceNote: "/month",
    startingAt: true,
    scope: "All states + federal & military",
    blurb: "Nationwide coverage, including federal and U.S. military contracts.",
    features: [
      "Everything in Multi-State",
      "All 50 states",
      "Federal contracts (SAM.gov, GSA eBuy & more)",
      "U.S. military and Department of Defense contracts",
      "Priority intelligence",
      "Dedicated intelligence cadence",
    ],
    footnote: "The only U.S. plan that includes federal and military / DoD coverage.",
  },
];

export const PRICING_PRINCIPLES = [
  "Priced as coverage, not per opportunity. Review as many as it takes.",
  "Never hourly. You never watch a clock or ration questions.",
  "Three-month commitment, long enough to build real pipeline, then continue or stop.",
  "One flat plan replaces estimator hours, missed bids and portal fatigue.",
];
