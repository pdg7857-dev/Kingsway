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

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const PRIMARY_NAV: NavItem[] = [
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "Platforms",
    href: "/platforms",
    children: [
      { label: "MERX Expert", href: "/platforms/merx" },
      { label: "BidNet Direct Expert", href: "/platforms/bidnet-direct" },
      { label: "CanadaBuys Expert", href: "/platforms/canadabuys" },
      { label: "SAM.gov Expert", href: "/platforms/sam-gov" },
      { label: "All platforms", href: "/platforms" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Construction", href: "/industries/construction" },
      { label: "Janitorial", href: "/industries/janitorial" },
      { label: "Facilities Maintenance", href: "/industries/facilities-maintenance" },
      { label: "All industries", href: "/industries" },
    ],
  },
  {
    label: "Coverage",
    href: "/coverage",
    children: [
      { label: "Canada", href: "/coverage/canada" },
      { label: "United States", href: "/coverage/usa" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Government Contracting by the Numbers", href: "/statistics" },
      { label: "Opportunity Cost Calculator", href: "/tools/opportunity-cost-calculator" },
      { label: "Free guides & tools", href: "/resources" },
    ],
  },
];

export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: "Intelligence",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Government Opportunity Intelligence", href: "/government-opportunity-intelligence" },
      { label: "Pricing & coverage", href: "/pricing" },
      { label: "Request a sample opportunity", href: "/sample-opportunity" },
      { label: "Book a discovery call", href: "/book" },
    ],
  },
  {
    title: "Platforms",
    links: [
      { label: "MERX expert", href: "/platforms/merx" },
      { label: "BidNet Direct expert", href: "/platforms/bidnet-direct" },
      { label: "CanadaBuys expert", href: "/platforms/canadabuys" },
      { label: "SAM.gov expert", href: "/platforms/sam-gov" },
      { label: "Bonfire, Biddingo, bids&tenders...", href: "/platforms" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Construction", href: "/industries/construction" },
      { label: "Janitorial", href: "/industries/janitorial" },
      { label: "Facilities maintenance", href: "/industries/facilities-maintenance" },
      { label: "HVAC, electrical, plumbing...", href: "/industries" },
    ],
  },
  {
    title: "Coverage",
    links: [
      { label: "Canadian provinces", href: "/coverage/canada" },
      { label: "U.S. states", href: "/coverage/usa" },
      { label: "Federal (Canada & U.S.)", href: "/coverage" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "By the numbers", href: "/statistics" },
      { label: "Cost calculator", href: "/tools/opportunity-cost-calculator" },
      { label: "Free guides", href: "/resources" },
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
