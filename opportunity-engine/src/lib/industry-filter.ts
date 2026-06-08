// Friendly industry -> title-keyword lookup for filtering awards, plus the
// UNSPSC segment codes (the reliable, hierarchical 2-digit prefixes) each
// industry maps to. Award titles drive the awards filter (their codes are
// mostly GSIN); the UNSPSC segments drive the Codes-registry industry filter
// via startsWith, which is exact.

export type IndustryFilter = { slug: string; name: string; keywords: string[]; unspscSegments: string[] };

export const INDUSTRY_FILTERS: IndustryFilter[] = [
  { slug: "construction", name: "Construction & general contracting", keywords: ["construction", "building", "renovation", "addition", "demolition", "concrete", "carpentry"], unspscSegments: ["72", "95"] },
  { slug: "janitorial", name: "Janitorial & cleaning", keywords: ["janitorial", "custodial", "cleaning", "housekeeping"], unspscSegments: ["76"] },
  { slug: "facilities", name: "Facilities maintenance", keywords: ["facility maintenance", "building maintenance", "property management", "operations and maintenance", "o&m", "maintenance services"], unspscSegments: ["72"] },
  { slug: "hvac", name: "HVAC & mechanical", keywords: ["hvac", "heating", "ventilation", "air conditioning", "mechanical", "boiler", "chiller"], unspscSegments: ["72", "40"] },
  { slug: "electrical", name: "Electrical", keywords: ["electrical", "electrician", "lighting", "wiring", "generator"], unspscSegments: ["72", "39"] },
  { slug: "plumbing", name: "Plumbing & water", keywords: ["plumbing", "plumber", "water main", "sewer", "wastewater"], unspscSegments: ["72", "40"] },
  { slug: "landscaping", name: "Landscaping & grounds", keywords: ["landscaping", "grounds", "mowing", "grass", "vegetation", "snow removal", "lawn", "tree"], unspscSegments: ["72", "70"] },
  { slug: "roofing", name: "Roofing", keywords: ["roof", "roofing", "membrane"], unspscSegments: ["72", "30"] },
  { slug: "painting", name: "Painting & coatings", keywords: ["painting", "coating", "paint"], unspscSegments: ["72"] },
  { slug: "flooring", name: "Flooring", keywords: ["flooring", "carpet", "tile", "epoxy floor"], unspscSegments: ["72", "30"] },
  { slug: "security", name: "Security & guarding", keywords: ["security", "guard", "surveillance", "access control"], unspscSegments: ["92", "46"] },
  { slug: "it", name: "IT & software", keywords: ["software", "information technology", "it services", "licence", "license", "saas", "computer", "cloud", "cyber"], unspscSegments: ["43", "81"] },
  { slug: "engineering", name: "Engineering & architecture", keywords: ["engineering", "architectural", "design services", "consulting engineer"], unspscSegments: ["81"] },
  { slug: "environmental", name: "Environmental", keywords: ["environmental", "remediation", "abatement", "hazardous", "asbestos", "contamination"], unspscSegments: ["77"] },
  { slug: "industrial-supplies", name: "Industrial supplies & equipment", keywords: ["supplies", "equipment", "parts", "materials", "hardware"], unspscSegments: ["31", "40", "27"] },
  { slug: "fencing", name: "Fencing", keywords: ["fencing", "fence"], unspscSegments: ["72", "30"] },
];

export function getIndustryFilter(slug: string | undefined): IndustryFilter | undefined {
  return slug ? INDUSTRY_FILTERS.find((i) => i.slug === slug) : undefined;
}
