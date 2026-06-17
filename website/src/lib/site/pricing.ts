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

export const PRICING_PRINCIPLES = [
  "Priced as coverage, not per opportunity. Review as many as it takes.",
  "Never hourly. You never watch a clock or ration questions.",
  "Month-to-month. Coverage should earn its place every month.",
  "One flat plan replaces estimator hours, missed bids and portal fatigue.",
];
