/**
 * Single source of truth for brand, contact, navigation, pricing and
 * social-proof placeholders. Phil-first personal brand.
 *
 * Anything a future operator might want to rename (brand name, email,
 * booking URL, prices) lives here so it can be changed in one place.
 */

export const SITE = {
  // Phil-first personal brand.
  brand: "Phil",
  brandFull: "Phil, Government Opportunity Intelligence",
  tagline: "Government Opportunity Intelligence",
  // First-person promise that runs through the whole site.
  promise: "You focus on winning contracts. I focus on finding them.",
  // Update before launch.
  domain: "https://www.governmentopportunityintelligence.com",
  email: "phil@governmentopportunityintelligence.com",
  // Discovery-call booking destination (Calendly/SavvyCal/etc.). Internal route
  // /book falls back to the contact form until this is wired to a real calendar.
  bookingUrl: "/book",
  sampleUrl: "/sample-opportunity",
  founded: 2014,
} as const;

/**
 * URL of the interactive GOIR report app (the separate `goir/` Vercel project).
 * Set NEXT_PUBLIC_REPORT_URL to its deployed URL to funnel every report CTA
 * straight into the live assessment. Until then, CTAs fall back to the internal
 * marketing landing page so the funnel still works.
 */
export const REPORT_LANDING = "/government-opportunity-intelligence-report";
export const REPORT_URL = process.env.NEXT_PUBLIC_REPORT_URL || REPORT_LANDING;

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Services",
    href: "/government-opportunity-intelligence",
    children: [
      { label: "Government Opportunity Intelligence", href: "/government-opportunity-intelligence" },
      { label: "Government Bid Monitoring", href: "/government-bid-monitoring" },
      { label: "Government Bid Alerts", href: "/government-bid-alerts" },
      { label: "Bid Qualification", href: "/government-bid-qualification" },
      { label: "Bid / No-Bid Analysis", href: "/bid-no-bid-analysis" },
      { label: "Tender Review Service", href: "/tender-review-service" },
      { label: "Opportunity Screening", href: "/opportunity-screening" },
      { label: "How it works", href: "/how-it-works" },
    ],
  },
  {
    label: "Platforms",
    href: "/platforms",
    children: [
      { label: "MERX Expert", href: "/merx-expert" },
      { label: "BidNet Direct Expert", href: "/bidnet-direct-expert" },
      { label: "CanadaBuys Expert", href: "/canadabuys-expert" },
      { label: "SAM.gov Expert", href: "/sam-gov-expert" },
      { label: "All platforms", href: "/platforms" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Construction", href: "/construction-government-contracts" },
      { label: "Janitorial", href: "/janitorial-government-contracts" },
      { label: "Facilities", href: "/facilities-government-contracts" },
      { label: "Industrial Supplies", href: "/industrial-supplies-government-contracts" },
      { label: "All industries", href: "/industries" },
    ],
  },
  {
    label: "Renewals",
    href: "/government-contract-renewals",
    children: [
      { label: "Government Contract Renewals", href: "/government-contract-renewals" },
      { label: "Renewal Alerts", href: "/government-contract-renewal-alerts" },
      { label: "Upcoming Renewals", href: "/upcoming-government-contract-renewals" },
      { label: "Incumbent Contract Tracking", href: "/incumbent-contract-tracking" },
      { label: "Contract Expirations", href: "/government-contract-expirations" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Free GOIR", href: "/government-opportunity-intelligence-report" },
      { label: "Opportunity Waste Calculator", href: "/opportunity-waste-calculator" },
      { label: "Procurement Statistics", href: "/government-procurement-statistics" },
      { label: "The GOII Index", href: "/government-opportunity-intelligence-index" },
      { label: "Coverage map", href: "/coverage" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: "Services",
    links: [
      { label: "Government Opportunity Intelligence", href: "/government-opportunity-intelligence" },
      { label: "Bid monitoring", href: "/government-bid-monitoring" },
      { label: "Bid qualification", href: "/government-bid-qualification" },
      { label: "Bid / no-bid analysis", href: "/bid-no-bid-analysis" },
      { label: "Tender review", href: "/tender-review-service" },
      { label: "How it works", href: "/how-it-works" },
    ],
  },
  {
    title: "Platforms",
    links: [
      { label: "MERX expert", href: "/merx-expert" },
      { label: "BidNet Direct expert", href: "/bidnet-direct-expert" },
      { label: "CanadaBuys expert", href: "/canadabuys-expert" },
      { label: "SAM.gov expert", href: "/sam-gov-expert" },
      { label: "Bonfire, Biddingo, bids&tenders...", href: "/platforms" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Construction", href: "/construction-government-contracts" },
      { label: "Janitorial", href: "/janitorial-government-contracts" },
      { label: "Facilities maintenance", href: "/facilities-government-contracts" },
      { label: "HVAC, electrical, plumbing...", href: "/industries" },
    ],
  },
  {
    title: "Renewals",
    links: [
      { label: "Contract renewals", href: "/government-contract-renewals" },
      { label: "Renewal alerts", href: "/government-contract-renewal-alerts" },
      { label: "Upcoming renewals", href: "/upcoming-government-contract-renewals" },
      { label: "Incumbent tracking", href: "/incumbent-contract-tracking" },
      { label: "Contract expirations", href: "/government-contract-expirations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Free GOIR", href: "/government-opportunity-intelligence-report" },
      { label: "Opportunity waste calculator", href: "/opportunity-waste-calculator" },
      { label: "Procurement statistics", href: "/government-procurement-statistics" },
      { label: "Coverage map", href: "/coverage" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

/**
 * Social-proof placeholders. DO NOT fabricate numbers. These are clearly
 * marked placeholders an operator fills in with verified figures before
 * launch. `value: null` renders as a neutral placeholder in the UI.
 */
export type Stat = { value: string | null; label: string; placeholder: string };

export const SOCIAL_PROOF: Stat[] = [
  { value: null, label: "Opportunities reviewed", placeholder: "..." },
  { value: null, label: "Procurement platforms monitored", placeholder: "18+" },
  { value: null, label: "Industries served", placeholder: "12" },
  { value: null, label: "U.S. states covered", placeholder: "50" },
  { value: null, label: "Canadian provinces & territories", placeholder: "13" },
  { value: null, label: "Clients served", placeholder: "..." },
  { value: null, label: "Years in government procurement", placeholder: "10+" },
];
