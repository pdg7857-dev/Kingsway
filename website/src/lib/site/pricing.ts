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
    scope: "One province",
    blurb: "Full intelligence coverage for the province where you do most of your work.",
    features: [
      "Monitoring across every platform that serves your province",
      "Opportunity discovery & screening",
      "Bid document review",
      "Fit qualification",
      "Opportunity summaries",
      "Direct bid links",
    ],
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
    scope: "One state",
    blurb: "Full intelligence coverage for your home state.",
    features: [
      "Monitoring across every platform serving your state",
      "Opportunity discovery & screening",
      "Bid document review",
      "Fit qualification",
      "Opportunity summaries",
      "Direct bid links",
    ],
  },
  {
    name: "Regional Coverage",
    price: "$999",
    priceNote: "/month",
    scope: "2-4 states",
    blurb: "For contractors working a regional cluster of states.",
    features: [
      "Everything in Single State",
      "Coverage across 2-4 states",
      "Cross-state de-duplication",
      "Consolidated weekly intelligence",
      "Priority on time-sensitive opportunities",
    ],
  },
  {
    name: "Multi-State Coverage",
    price: "$1,499",
    priceNote: "/month",
    scope: "5-12 states",
    blurb: "Built for regional and national field operations.",
    featured: true,
    features: [
      "Everything in Regional",
      "Coverage across 5-12 states",
      "Portfolio-level prioritization",
      "Dedicated intelligence cadence",
    ],
  },
  {
    name: "National Coverage",
    price: "$2,999",
    priceNote: "/month",
    startingAt: true,
    scope: "All states + federal",
    blurb: "Nationwide coverage including federal procurement.",
    features: [
      "Everything in Multi-State",
      "All 50 states",
      "Federal opportunities (SAM.gov, GSA eBuy & more)",
      "Priority intelligence",
      "Dedicated intelligence cadence",
    ],
  },
];

export const NORTH_AMERICA_PLAN: Plan = {
  name: "North America Coverage",
  price: "$3,999",
  priceNote: "/month USD",
  scope: "All of Canada + all 50 U.S. states + federal",
  blurb:
    "One service for contractors who bid on both sides of the border. Complete coverage of every Canadian province and U.S. state, plus federal procurement in both countries.",
  features: [
    "Everything in both National plans",
    "All 13 provinces & territories and all 50 states",
    "Federal procurement both sides of the border (CanadaBuys, SAM.gov, GSA eBuy & more)",
    "Cross-border de-duplication in one consolidated feed",
    "One point of contact for your entire North American footprint",
  ],
};

export const PRICING_PRINCIPLES = [
  "Priced as coverage, not per opportunity. Review as many as it takes.",
  "Never hourly. You never watch a clock or ration questions.",
  "A 12-month commitment — it takes a full year to catch your complete opportunity cycle, including annual renewals and seasonal bids that only come around once.",
  "One flat plan replaces estimator hours, missed bids and portal fatigue.",
];
