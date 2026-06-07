// Friendly industry -> title-keyword lookup for filtering awards. Award records
// don't carry an internal industry tag, but their titles describe the work, so
// each industry expands to a set of title keywords matched case-insensitively.
// (GSIN/UNSPSC codes can still be filtered separately and exactly.)

export type IndustryFilter = { slug: string; name: string; keywords: string[] };

export const INDUSTRY_FILTERS: IndustryFilter[] = [
  { slug: "construction", name: "Construction & general contracting", keywords: ["construction", "building", "renovation", "addition", "demolition", "concrete", "carpentry"] },
  { slug: "janitorial", name: "Janitorial & cleaning", keywords: ["janitorial", "custodial", "cleaning", "housekeeping"] },
  { slug: "facilities", name: "Facilities maintenance", keywords: ["facility maintenance", "building maintenance", "property management", "operations and maintenance", "o&m", "maintenance services"] },
  { slug: "hvac", name: "HVAC & mechanical", keywords: ["hvac", "heating", "ventilation", "air conditioning", "mechanical", "boiler", "chiller"] },
  { slug: "electrical", name: "Electrical", keywords: ["electrical", "electrician", "lighting", "wiring", "generator"] },
  { slug: "plumbing", name: "Plumbing & water", keywords: ["plumbing", "plumber", "water main", "sewer", "wastewater"] },
  { slug: "landscaping", name: "Landscaping & grounds", keywords: ["landscaping", "grounds", "mowing", "grass", "vegetation", "snow removal", "lawn", "tree"] },
  { slug: "roofing", name: "Roofing", keywords: ["roof", "roofing", "membrane"] },
  { slug: "painting", name: "Painting & coatings", keywords: ["painting", "coating", "paint"] },
  { slug: "flooring", name: "Flooring", keywords: ["flooring", "carpet", "tile", "epoxy floor"] },
  { slug: "security", name: "Security & guarding", keywords: ["security", "guard", "surveillance", "access control"] },
  { slug: "it", name: "IT & software", keywords: ["software", "information technology", "it services", "licence", "license", "saas", "computer", "cloud", "cyber"] },
  { slug: "engineering", name: "Engineering & architecture", keywords: ["engineering", "architectural", "design services", "consulting engineer"] },
  { slug: "environmental", name: "Environmental", keywords: ["environmental", "remediation", "abatement", "hazardous", "asbestos", "contamination"] },
  { slug: "industrial-supplies", name: "Industrial supplies & equipment", keywords: ["supplies", "equipment", "parts", "materials", "hardware"] },
  { slug: "fencing", name: "Fencing", keywords: ["fencing", "fence"] },
];

export function getIndustryFilter(slug: string | undefined): IndustryFilter | undefined {
  return slug ? INDUSTRY_FILTERS.find((i) => i.slug === slug) : undefined;
}
