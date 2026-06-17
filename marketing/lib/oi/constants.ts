// Government Opportunity Intelligence — shared vocabulary & config.
// These string constants back the "enum-like" columns on Prospect/Renewal/etc.
// (kept as TEXT in Postgres; validated here at the app layer).

export const PROSPECT_TIERS = ["A", "B", "C", "D"] as const;
export type ProspectTier = (typeof PROSPECT_TIERS)[number];

// Tiers map onto the GOII Index™ bands (Module 7):
//   90-100 Immediate Outreach · 80-89 High Priority → Tier A
//   70-79 Warm Prospect                              → Tier B
//   60-69 Nurture                                    → Tier C
//   <60   Low Priority                               → Tier D
export const TIER_META: Record<
  ProspectTier,
  { label: string; action: string; min: number; tone: string; blurb: string }
> = {
  A: { label: "Tier A", action: "Immediate outreach", min: 80, tone: "success", blurb: "Contact today — high intent, high value." },
  B: { label: "Tier B", action: "Warm prospect", min: 70, tone: "accent", blurb: "Strong fit — work this week." },
  C: { label: "Tier C", action: "Nurture", min: 60, tone: "info", blurb: "Qualified — nurture into a conversation." },
  D: { label: "Tier D", action: "Low priority", min: 0, tone: "muted", blurb: "Low fit — park or recycle." },
};

export function tierFromScore(score: number): ProspectTier {
  if (score >= TIER_META.A.min) return "A";
  if (score >= TIER_META.B.min) return "B";
  if (score >= TIER_META.C.min) return "C";
  return "D";
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Immediate Outreach";
  if (score >= 80) return "High Priority";
  if (score >= 70) return "Warm Prospect";
  if (score >= 60) return "Nurture";
  return "Low Priority";
}

export const OI_STAGES = [
  "NEW",
  "RESEARCHED",
  "SCORED",
  "OUTREACH",
  "ENGAGED",
  "CLIENT",
  "NURTURE",
  "DISQUALIFIED",
] as const;
export type OIStage = (typeof OI_STAGES)[number];

export const STAGE_LABEL: Record<OIStage, string> = {
  NEW: "New",
  RESEARCHED: "Researched",
  SCORED: "Scored",
  OUTREACH: "Outreach",
  ENGAGED: "Engaged",
  CLIENT: "Client",
  NURTURE: "Nurture",
  DISQUALIFIED: "Disqualified",
};

export const PROCUREMENT_MATURITY = ["UNKNOWN", "LOW", "MEDIUM", "HIGH"] as const;
export type ProcurementMaturity = (typeof PROCUREMENT_MATURITY)[number];

export const GOV_CLIENT_TYPES = [
  "municipal",
  "provincial",
  "federal",
  "school",
  "healthcare",
  "infrastructure",
] as const;

export const OUTREACH_KINDS = ["COLD_EMAIL", "LINKEDIN", "COLD_CALL", "LOOM", "FOLLOWUP"] as const;
export type OutreachKind = (typeof OUTREACH_KINDS)[number];

export const OUTREACH_META: Record<OutreachKind, { label: string; icon: string }> = {
  COLD_EMAIL: { label: "Cold Email", icon: "mail" },
  LINKEDIN: { label: "LinkedIn Message", icon: "linkedin" },
  COLD_CALL: { label: "Cold Call Script", icon: "phone" },
  LOOM: { label: "Loom Video Script", icon: "video" },
  FOLLOWUP: { label: "Follow-Up Sequence", icon: "repeat" },
};

export const ALERT_WINDOWS = ["M12", "M9", "M6", "M3", "D30", "PAST"] as const;
export type AlertWindow = (typeof ALERT_WINDOWS)[number];

export const ALERT_WINDOW_META: Record<AlertWindow, { label: string; days: number; tone: string }> = {
  M12: { label: "12 months", days: 365, tone: "muted" },
  M9: { label: "9 months", days: 274, tone: "info" },
  M6: { label: "6 months", days: 183, tone: "info" },
  M3: { label: "3 months", days: 91, tone: "warn" },
  D30: { label: "30 days", days: 30, tone: "danger" },
  PAST: { label: "Window open / past", days: 0, tone: "danger" },
};

export const RENEWAL_STATUSES = ["WATCHING", "UPCOMING", "IMMINENT", "REBID_OPEN", "CLOSED"] as const;
export type RenewalStatus = (typeof RENEWAL_STATUSES)[number];

// Phil's target market.
export const PRIMARY_INDUSTRIES = [
  "Construction",
  "Janitorial",
  "Facilities Maintenance",
  "Commercial Cleaning",
  "Industrial Supplies",
  "MRO Suppliers",
  "Building Services",
  "General Contractors",
  "Subcontractors",
] as const;

export const SECONDARY_INDUSTRIES = [
  "Security",
  "Landscaping",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Engineering",
  "Environmental Services",
] as const;

export const ALL_INDUSTRIES = [...PRIMARY_INDUSTRIES, ...SECONDARY_INDUSTRIES] as string[];

// Pricing tiers Phil recommends (monthly retainer, in cents).
export const PRICING_TIERS = {
  Starter: { monthlyFeeCents: 29900, retentionMonths: 24, label: "Starter — $299/mo" },
  Pro: { monthlyFeeCents: 79900, retentionMonths: 36, label: "Pro — $799/mo" },
  Enterprise: { monthlyFeeCents: 199900, retentionMonths: 48, label: "Enterprise — $1,999/mo" },
} as const;
export type PricingTierName = keyof typeof PRICING_TIERS;

export const fmtDollars = (n: number | null | undefined) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
