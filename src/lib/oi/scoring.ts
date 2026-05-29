// Module 7 — Government Opportunity Intelligence Index™ (GOII Index™).
//
// The proprietary 0-100 score that ranks every company by likelihood to become
// a recurring Government Opportunity Intelligence client. Deterministic and
// fully explainable — Claude fills the inputs (research), this produces the
// number. Component weights are fixed by the spec:
//
//   Government Experience   20
//   Award History           20
//   Opportunity Waste       20
//   Labor Scarcity          15
//   Platform Complexity     10
//   Geographic Complexity    5
//   Renewal Opportunity      5
//   Revenue Potential        5
//   ──────────────────────────
//   TOTAL                  100

import {
  PRIMARY_INDUSTRIES,
  SECONDARY_INDUSTRIES,
  PRICING_TIERS,
  tierFromScore,
  scoreLabel,
  type ProspectTier,
  type PricingTierName,
  type ProcurementMaturity,
} from "./constants";
import { computePlatformRelevance } from "./platforms";
import { estimateWaste, type WasteResult } from "./waste";

export type ScoringInput = {
  industry?: string | null;
  subIndustry?: string | null;
  region?: string | null;
  country?: string | null;
  employeesEstimate?: number | null;
  revenueEstimateDollars?: number | null;
  locationsCount?: number | null;
  govExperience?: boolean;
  govClientTypes?: string[];
  procurementMaturity?: ProcurementMaturity | string | null;
  awardCount?: number | null;
  totalWonDollars?: number | null;
  largestAwardDollars?: number | null;
  lastAwardAt?: Date | string | null;
  primaryPlatforms?: string[];
  secondaryPlatforms?: string[];
};

export type ScoreComponent = { key: string; label: string; points: number; max: number; note: string };

export type ScoreResult = {
  score: number; // GOII Index™
  tier: ProspectTier;
  label: string;
  components: ScoreComponent[];
  // Sub-scores (raw points earned per component).
  govExperienceScore: number;
  awardScore: number;
  wasteScore: number;
  laborScarcityScore: number;
  platformComplexityScore: number;
  geoComplexityScore: number;
  renewalOppScore: number;
  revenuePotentialScore: number;
  likelihoodToBuy: number;
  // Module 6 outputs.
  waste: WasteResult;
  opportunityWasteCents: number;
  expectedRoiPct: number;
  // Resolved platforms.
  primaryPlatforms: string[];
  secondaryPlatforms: string[];
  // Commercials.
  estAnnualValueCents: number;
  estLtvCents: number;
  recommendedPricingTier: PricingTierName;
  recommendedMonthlyFeeCents: number;
  shouldContactToday: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function monthsSince(date?: Date | string | null): number | null {
  if (!date) return null;
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return null;
  return (Date.now() - t) / (1000 * 60 * 60 * 24 * 30.4);
}

export function scoreProspect(input: ScoringInput): ScoreResult {
  // Resolve platforms once (drives several components + waste).
  let primaryPlatforms = input.primaryPlatforms ?? [];
  let secondaryPlatforms = input.secondaryPlatforms ?? [];
  if (primaryPlatforms.length === 0 && secondaryPlatforms.length === 0) {
    const rel = computePlatformRelevance({
      industry: input.industry,
      region: input.region,
      country: input.country,
      govClientTypes: input.govClientTypes,
    });
    primaryPlatforms = rel.primary;
    secondaryPlatforms = rel.secondary;
  }

  const waste = estimateWaste({ ...input, primaryPlatforms, secondaryPlatforms });

  const govActive = !!input.govExperience || (input.awardCount ?? 0) > 0;
  const ind = input.industry ?? "";
  const isPrimary = (PRIMARY_INDUSTRIES as readonly string[]).includes(ind);
  const isSecondary = (SECONDARY_INDUSTRIES as readonly string[]).includes(ind);
  const emp = input.employeesEstimate ?? 0;
  const rev = input.revenueEstimateDollars ?? 0;
  const locs = Math.max(1, input.locationsCount ?? 1);
  const platformLoad = primaryPlatforms.length + secondaryPlatforms.length * 0.5;

  // 1) Government Experience /20
  let govFrac = input.govExperience ? 0.55 : 0.12;
  govFrac += Math.min(0.3, (input.govClientTypes?.length ?? 0) * 0.08);
  if (input.procurementMaturity === "HIGH") govFrac += 0.15;
  else if (input.procurementMaturity === "MEDIUM") govFrac += 0.1;
  const govExperienceScore = Math.round(clamp01(govFrac) * 20);

  // 2) Award History /20
  const awards = input.awardCount ?? 0;
  const m = monthsSince(input.lastAwardAt);
  let awardFrac = Math.min(0.5, awards * 0.12);
  if (m != null) awardFrac += m <= 12 ? 0.3 : m <= 24 ? 0.2 : m <= 48 ? 0.08 : 0;
  const largest = input.largestAwardDollars ?? 0;
  if (largest >= 1_000_000) awardFrac += 0.2;
  else if (largest >= 250_000) awardFrac += 0.12;
  else if (largest >= 50_000) awardFrac += 0.06;
  const awardScore = Math.round(clamp01(awardFrac) * 20);

  // 3) Opportunity Waste /20 (from Module 6)
  const wasteScore = Math.round((waste.wasteScore / 100) * 20);

  // 4) Labor Scarcity /15 — trades & contractors face acute estimator scarcity;
  //    bigger teams juggling more bids feel it most.
  let laborFrac = isPrimary ? 0.55 : isSecondary ? 0.45 : 0.3;
  if (emp >= 200) laborFrac += 0.3;
  else if (emp >= 50) laborFrac += 0.22;
  else if (emp >= 15) laborFrac += 0.12;
  if (govActive) laborFrac += 0.1;
  const laborScarcityScore = Math.round(clamp01(laborFrac) * 15);

  // 5) Platform Complexity /10
  const platformComplexityScore = Math.round(clamp01(platformLoad / 5) * 10);

  // 6) Geographic Complexity /5
  const geoComplexityScore = Math.round(clamp01((locs - 1) / 4 + (govActive ? 0.2 : 0)) * 5);

  // 7) Renewal Opportunity /5 — recurring award activity signals future rebids.
  const renewalFrac = clamp01((awards >= 1 ? 0.4 : 0) + Math.min(0.4, awards * 0.1) + (govActive ? 0.2 : 0));
  const renewalOppScore = Math.round(renewalFrac * 5);

  // 8) Revenue Potential /5
  let revFrac = 0.3;
  if (rev >= 25_000_000) revFrac = 1;
  else if (rev >= 8_000_000) revFrac = 0.8;
  else if (rev >= 2_000_000) revFrac = 0.6;
  else if (rev >= 500_000) revFrac = 0.45;
  const revenuePotentialScore = Math.round(revFrac * 5);

  const components: ScoreComponent[] = [
    { key: "gov", label: "Government Experience", points: govExperienceScore, max: 20, note: govActive ? `${input.govClientTypes?.join(", ") || "public-sector active"}` : "No public-sector footprint yet" },
    { key: "award", label: "Award History", points: awardScore, max: 20, note: awards ? `${awards} award(s)${m != null ? `, last ~${Math.round(m)}mo ago` : ""}` : "No awards matched" },
    { key: "waste", label: "Opportunity Waste", points: wasteScore, max: 20, note: `~$${Math.round(waste.annualWasteCents / 100000) / 10}k/yr wasted` },
    { key: "labor", label: "Labor Scarcity", points: laborScarcityScore, max: 15, note: `${emp || "?"} employees · ${isPrimary ? "core trade" : isSecondary ? "trade-adjacent" : "industry"}` },
    { key: "platform", label: "Platform Complexity", points: platformComplexityScore, max: 10, note: `${primaryPlatforms.length} primary / ${secondaryPlatforms.length} secondary` },
    { key: "geo", label: "Geographic Complexity", points: geoComplexityScore, max: 5, note: `${locs} location(s)` },
    { key: "renewal", label: "Renewal Opportunity", points: renewalOppScore, max: 5, note: awards ? "recurring award activity" : "limited renewal signal" },
    { key: "revenue", label: "Revenue Potential", points: revenuePotentialScore, max: 5, note: rev ? `~$${Math.round(rev / 1000)}k est. revenue` : "revenue unknown" },
  ];

  const score = Math.max(0, Math.min(100, components.reduce((acc, c) => acc + c.points, 0)));

  const likelihoodToBuy = Math.round(
    Math.max(0, Math.min(100, waste.wasteScore * 0.4 + (isPrimary ? 90 : isSecondary ? 70 : 40) * 0.25 + (govActive ? 85 : 35) * 0.2 + (input.procurementMaturity === "MEDIUM" || input.procurementMaturity === "LOW" ? 85 : 55) * 0.15))
  );

  // Commercials.
  let recommendedPricingTier: PricingTierName = "Starter";
  if (waste.annualWasteCents >= 12_000_000 || score >= 85) recommendedPricingTier = "Enterprise";
  else if (waste.annualWasteCents >= 5_000_000 || score >= 72) recommendedPricingTier = "Pro";
  const pricing = PRICING_TIERS[recommendedPricingTier];
  const recommendedMonthlyFeeCents = pricing.monthlyFeeCents;
  const estAnnualValueCents = recommendedMonthlyFeeCents * 12;
  const retentionMonths = Math.round(pricing.retentionMonths * (0.6 + likelihoodToBuy / 250));
  const estLtvCents = recommendedMonthlyFeeCents * retentionMonths;

  return {
    score,
    tier: tierFromScore(score),
    label: scoreLabel(score),
    components,
    govExperienceScore,
    awardScore,
    wasteScore,
    laborScarcityScore,
    platformComplexityScore,
    geoComplexityScore,
    renewalOppScore,
    revenuePotentialScore,
    likelihoodToBuy,
    waste,
    opportunityWasteCents: waste.annualWasteCents,
    expectedRoiPct: waste.expectedRoiPct,
    primaryPlatforms,
    secondaryPlatforms,
    estAnnualValueCents,
    estLtvCents,
    recommendedPricingTier,
    recommendedMonthlyFeeCents,
    shouldContactToday: score >= 80,
  };
}

/** Maps a ScoreResult into the Prisma column shape for persistence. */
export function scoreToProspectFields(r: ScoreResult) {
  return {
    score: r.score,
    tier: r.tier,
    scoreBreakdown: r.components as unknown as object,
    govExperienceScore: r.govExperienceScore,
    awardScore: r.awardScore,
    wasteScore: r.wasteScore,
    laborScarcityScore: r.laborScarcityScore,
    platformComplexityScore: r.platformComplexityScore,
    geoComplexityScore: r.geoComplexityScore,
    renewalOppScore: r.renewalOppScore,
    revenuePotentialScore: r.revenuePotentialScore,
    likelihoodToBuy: r.likelihoodToBuy,
    opportunityWasteCents: r.opportunityWasteCents,
    wasteBreakdown: { costLines: r.waste.costLines, topDrivers: r.waste.topDrivers, funnel: { reviewed: r.waste.annualOpportunitiesReviewed, qualified: r.waste.annualQualified, pursued: r.waste.annualBidsPursued, lost: r.waste.annualBidsLost }, potentialSavingsCents: r.waste.potentialSavingsCents } as unknown as object,
    expectedRoiPct: r.expectedRoiPct,
    estAnnualValueCents: r.estAnnualValueCents,
    estLtvCents: r.estLtvCents,
    recommendedPricingTier: r.recommendedPricingTier,
    recommendedMonthlyFeeCents: r.recommendedMonthlyFeeCents,
    scoredAt: new Date(),
  };
}
