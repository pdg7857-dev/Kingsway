/**
 * Single source of truth for brand, contact, navigation, pricing and
 * social-proof placeholders. Phil-first personal brand.
 *
 * Anything a future operator might want to rename (brand name, email,
 * booking URL, prices) lives here so it can be changed in one place.
 */

export const SITE = {
  // Personal authority brand.
  brand: "Phil Dave",
  brandFull: "Phil Dave, Government Opportunity Intelligence",
  // Square monogram used in the seal/logo lockup.
  monogram: "PD",
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
  /**
   * Intro video. Drop in a YouTube, Vimeo or direct .mp4 URL and it goes live
   * everywhere the VideoFeature appears (home, about, how it works). While
   * `url` is null, a polished "coming soon" placeholder renders in its place.
   */
  video: {
    url: null as string | null,
    poster: null as string | null, // optional poster image path in /public
    title: "Meet Phil Dave",
    caption: "Two minutes on what I do, how it works, and why it changes your bidding.",
  },
} as const;

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
  { value: "10,000+", label: "Opportunities reviewed", placeholder: "10,000+" },
  { value: "20,000+", label: "Government business accounts managed", placeholder: "20,000+" },
  { value: "18+", label: "Procurement platforms monitored", placeholder: "18+" },
  { value: "50", label: "U.S. states covered", placeholder: "50" },
  { value: "13", label: "Canadian provinces & territories", placeholder: "13" },
  { value: null, label: "Industries served", placeholder: "12" },
  { value: null, label: "Years in government procurement", placeholder: "10+" },
];
