// Module 6 — Platform Intelligence Engine.
// Knowledge base of the procurement platforms that matter, plus a
// deterministic relevance model that maps a prospect to the platforms
// they most likely need monitored.

export type Region = "CA" | "US" | "BOTH";

export type PlatformInfo = {
  key: string;
  name: string;
  region: Region;
  kind: string; // tender aggregator | eSourcing suite | gov marketplace
  // Industries / buyer types this platform is most relevant to.
  industries: string[];
  govLevels: string[]; // municipal, provincial, federal, school, healthcare, infrastructure
  note: string;
};

export const PLATFORMS: PlatformInfo[] = [
  { key: "MERX", name: "MERX", region: "CA", kind: "Tender aggregator", industries: ["Construction", "General Contractors", "Subcontractors", "Facilities Maintenance", "Building Services"], govLevels: ["federal", "provincial", "municipal"], note: "Largest Canadian public tender network — construction-heavy." },
  { key: "BIDNET", name: "BidNet Direct", region: "BOTH", kind: "Tender aggregator", industries: ["Janitorial", "Commercial Cleaning", "Industrial Supplies", "MRO Suppliers", "Facilities Maintenance"], govLevels: ["municipal", "provincial"], note: "Regional purchasing groups across Canada & US." },
  { key: "CANADABUYS", name: "CanadaBuys", region: "CA", kind: "Gov marketplace", industries: ["Construction", "Industrial Supplies", "MRO Suppliers", "Engineering", "Environmental Services"], govLevels: ["federal"], note: "Government of Canada's official tendering service." },
  { key: "SAMGOV", name: "SAM.gov", region: "US", kind: "Gov marketplace", industries: ["Industrial Supplies", "MRO Suppliers", "Construction", "Facilities Maintenance"], govLevels: ["federal"], note: "US federal contracting system of record." },
  { key: "BONFIRE", name: "Bonfire", region: "BOTH", kind: "eSourcing suite", industries: ["Construction", "Janitorial", "Facilities Maintenance", "Building Services", "Security"], govLevels: ["municipal", "school", "healthcare"], note: "Popular with Canadian municipalities, school boards & health authorities." },
  { key: "BIDDINGO", name: "Biddingo", region: "CA", kind: "Tender aggregator", industries: ["Construction", "Janitorial", "Facilities Maintenance", "General Contractors"], govLevels: ["municipal", "school", "healthcare"], note: "Ontario MASH sector (municipal, academic, school, hospital)." },
  { key: "BIDSANDTENDERS", name: "bids&tenders", region: "CA", kind: "eSourcing suite", industries: ["Construction", "Building Services", "Landscaping", "HVAC", "Electrical", "Plumbing"], govLevels: ["municipal"], note: "Widely used by Canadian municipalities." },
  { key: "PLANETBIDS", name: "PlanetBids", region: "US", kind: "eSourcing suite", industries: ["Construction", "Facilities Maintenance", "Landscaping"], govLevels: ["municipal"], note: "California & US local government." },
  { key: "OPENGOV", name: "OpenGov", region: "US", kind: "eSourcing suite", industries: ["Industrial Supplies", "MRO Suppliers", "Facilities Maintenance"], govLevels: ["municipal"], note: "US local government procurement." },
  { key: "DEMANDSTAR", name: "DemandStar", region: "US", kind: "Tender aggregator", industries: ["Janitorial", "Commercial Cleaning", "MRO Suppliers", "Industrial Supplies"], govLevels: ["municipal"], note: "US local agency bid network." },
  { key: "IONWAVE", name: "Ion Wave", region: "US", kind: "eSourcing suite", industries: ["Industrial Supplies", "MRO Suppliers"], govLevels: ["municipal", "school"], note: "US e-procurement for cities & school districts." },
  { key: "GOVWIN", name: "GovWin", region: "BOTH", kind: "Market intelligence", industries: ["Engineering", "Construction", "Industrial Supplies"], govLevels: ["federal", "provincial"], note: "Pre-RFP pipeline intelligence." },
  { key: "PERISCOPE", name: "Periscope", region: "US", kind: "eSourcing suite", industries: ["MRO Suppliers", "Industrial Supplies", "Facilities Maintenance"], govLevels: ["municipal", "provincial"], note: "State & local sourcing (now mdf commerce)." },
  { key: "ARIBA", name: "SAP Ariba", region: "BOTH", kind: "eSourcing suite", industries: ["Industrial Supplies", "MRO Suppliers"], govLevels: ["healthcare", "provincial"], note: "Enterprise/health-sector supplier network." },
  { key: "JAGGAER", name: "Jaggaer", region: "BOTH", kind: "eSourcing suite", industries: ["Industrial Supplies", "MRO Suppliers", "Engineering"], govLevels: ["healthcare", "provincial"], note: "Higher-ed & healthcare sourcing." },
  { key: "COUPA", name: "Coupa", region: "BOTH", kind: "eSourcing suite", industries: ["Industrial Supplies", "MRO Suppliers"], govLevels: ["provincial", "healthcare"], note: "Enterprise spend management." },
  { key: "GSAEBUY", name: "GSA eBuy", region: "US", kind: "Gov marketplace", industries: ["Industrial Supplies", "MRO Suppliers", "Facilities Maintenance"], govLevels: ["federal"], note: "US federal schedule RFQ system." },
];

export const PLATFORM_BY_KEY = Object.fromEntries(PLATFORMS.map((p) => [p.key, p]));
export const PLATFORM_BY_NAME = Object.fromEntries(PLATFORMS.map((p) => [p.name, p]));

export function platformName(key: string): string {
  return PLATFORM_BY_KEY[key]?.name ?? PLATFORM_BY_NAME[key]?.name ?? key;
}

type RelevanceInput = {
  industry?: string | null;
  region?: string | null;
  country?: string | null;
  govClientTypes?: string[];
};

// Canadian provinces / common region tokens used to bias CA vs US platforms.
const CA_TOKENS = ["canada", "ontario", "quebec", "british columbia", "bc", "alberta", "manitoba", "saskatchewan", "nova scotia", "new brunswick", "on", "qc", "ab", "mb", "sk", "ns", "nb", "pei", "newfoundland"];

function regionOf(input: RelevanceInput): Region {
  const hay = `${input.country ?? ""} ${input.region ?? ""}`.toLowerCase();
  if (CA_TOKENS.some((t) => hay.includes(t))) return "CA";
  if (/\b(us|usa|united states|california|texas|florida|new york|ny|tx|ca-us)\b/.test(hay)) return "US";
  return "CA"; // default to Canada — Phil's core market
}

/**
 * Score each platform 0-100 for a prospect and split into primary/secondary.
 * Pure & deterministic so it runs without an API key.
 */
export function computePlatformRelevance(input: RelevanceInput): {
  primary: string[];
  secondary: string[];
  scored: { key: string; name: string; score: number; reason: string }[];
} {
  const region = regionOf(input);
  const industry = input.industry ?? "";
  const levels = new Set((input.govClientTypes ?? []).map((l) => l.toLowerCase()));

  const scored = PLATFORMS.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    // Region match
    if (p.region === region || p.region === "BOTH") {
      score += 35;
    } else {
      score -= 25; // wrong-country platform is unlikely to matter
    }

    // Industry match
    if (industry && p.industries.includes(industry)) {
      score += 40;
      reasons.push("industry match");
    } else if (industry && p.industries.some((i) => i.toLowerCase().includes(industry.toLowerCase().split(" ")[0]))) {
      score += 18;
    }

    // Government level overlap
    const levelOverlap = p.govLevels.filter((l) => levels.has(l)).length;
    if (levelOverlap > 0) {
      score += Math.min(25, levelOverlap * 12);
      reasons.push(`${p.govLevels.filter((l) => levels.has(l)).join("/")} buyer`);
    } else if (levels.size === 0) {
      score += 6; // unknown gov footprint — small generic credit
    }

    score = Math.max(0, Math.min(100, score));
    return { key: p.key, name: p.name, score, reason: reasons.join(", ") || p.kind };
  }).sort((a, b) => b.score - a.score);

  const primary = scored.filter((s) => s.score >= 60).slice(0, 4).map((s) => s.name);
  const secondary = scored
    .filter((s) => s.score >= 40 && !primary.includes(s.name))
    .slice(0, 3)
    .map((s) => s.name);

  // Always surface at least one platform so the report is never empty.
  if (primary.length === 0 && scored[0]) primary.push(scored[0].name);

  return { primary, secondary, scored };
}
