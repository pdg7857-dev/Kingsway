// Module 6 — Opportunity Waste Engine.
//
// Estimates how much time & money a company burns reviewing government
// opportunities that never become bids (or never should have been pursued).
// Deterministic and explainable — the output feeds the GOII Index™ (Module 7)
// and the outreach engine ("you may be wasting $40,000-$80,000 annually...").

import { computePlatformRelevance } from "./platforms";
import { PRIMARY_INDUSTRIES } from "./constants";

export type WasteInput = {
  industry?: string | null;
  region?: string | null;
  country?: string | null;
  employeesEstimate?: number | null;
  revenueEstimateDollars?: number | null;
  locationsCount?: number | null;
  govExperience?: boolean;
  govClientTypes?: string[];
  awardCount?: number | null;
  procurementMaturity?: string | null;
  primaryPlatforms?: string[];
  secondaryPlatforms?: string[];
};

export type WasteResult = {
  annualOpportunitiesReviewed: number;
  annualQualified: number;
  annualBidsPursued: number;
  annualBidsLost: number;
  costLines: {
    reviewCost: number; // triage / scanning time
    estimatorCost: number; // estimating opps that never convert
    proposalCost: number; // proposal effort on lost bids
    qualificationCost: number; // poor bid/no-bid decisions
    managementCost: number; // oversight overhead
  };
  annualWasteCents: number;
  potentialSavingsCents: number; // what Phil's service recovers
  wasteScore: number; // 0-100
  topDrivers: string[];
  expectedRoiPct: number;
};

const LOADED_HOURLY = 75; // blended estimator/proposal loaded labour rate ($/hr)

function sizeFactor(emp?: number | null, rev?: number | null): number {
  const e = emp ?? 0;
  const r = rev ?? 0;
  if (e >= 200 || r >= 25_000_000) return 2.4;
  if (e >= 75 || r >= 8_000_000) return 1.8;
  if (e >= 25 || r >= 2_000_000) return 1.3;
  if (e >= 8 || r >= 500_000) return 1.0;
  return 0.7;
}

export function estimateWaste(input: WasteInput): WasteResult {
  // Relevant platform load.
  let primary = input.primaryPlatforms ?? [];
  let secondary = input.secondaryPlatforms ?? [];
  if (primary.length === 0 && secondary.length === 0) {
    const rel = computePlatformRelevance({
      industry: input.industry,
      region: input.region,
      country: input.country,
      govClientTypes: input.govClientTypes,
    });
    primary = rel.primary;
    secondary = rel.secondary;
  }
  const platformLoad = primary.length + secondary.length * 0.5;
  const sf = sizeFactor(input.employeesEstimate, input.revenueEstimateDollars);
  const locs = Math.max(1, input.locationsCount ?? 1);
  const govActive = input.govExperience || (input.awardCount ?? 0) > 0;

  // Funnel — postings surfaced & scanned per year.
  const perPlatform = govActive ? 165 : 90;
  const annualOpportunitiesReviewed = Math.round(
    Math.min(4000, (platformLoad || 1) * perPlatform * sf * Math.min(2, 0.8 + locs * 0.15))
  );

  // Qualification discipline depends on procurement maturity (the core thesis).
  const qualRate = input.procurementMaturity === "HIGH" ? 0.22 : input.procurementMaturity === "MEDIUM" ? 0.16 : 0.1;
  const bidRate = input.procurementMaturity === "HIGH" ? 0.55 : input.procurementMaturity === "MEDIUM" ? 0.4 : 0.3;
  const winRate = 0.3;

  const annualQualified = Math.round(annualOpportunitiesReviewed * qualRate);
  const annualBidsPursued = Math.round(annualQualified * bidRate);
  const annualBidsLost = Math.round(annualBidsPursued * (1 - winRate));

  // Cost lines (annual $).
  const reviewMins = 11; // triage minutes per posting
  const reviewCost = (annualOpportunitiesReviewed * reviewMins / 60) * LOADED_HOURLY;
  // Estimator time spent on opportunities that get reviewed deeply but never bid.
  const deepReviewed = annualQualified - annualBidsPursued;
  const estimatorCost = Math.max(0, deepReviewed) * 2.5 * LOADED_HOURLY;
  // Proposal effort sunk on lost bids.
  const proposalCost = annualBidsLost * 14 * LOADED_HOURLY;
  // Poor bid/no-bid discipline — fraction of pursued bids that shouldn't have been.
  const qualificationCost = annualBidsPursued * 0.35 * 6 * LOADED_HOURLY;
  // Management oversight overhead across the funnel.
  const managementCost = (reviewCost + estimatorCost + proposalCost) * 0.12;

  const costLines = {
    reviewCost: Math.round(reviewCost),
    estimatorCost: Math.round(estimatorCost),
    proposalCost: Math.round(proposalCost),
    qualificationCost: Math.round(qualificationCost),
    managementCost: Math.round(managementCost),
  };
  const annualWasteDollars = Math.round(
    costLines.reviewCost + costLines.estimatorCost + costLines.proposalCost + costLines.qualificationCost + costLines.managementCost
  );
  const annualWasteCents = annualWasteDollars * 100;

  // Phil recovers the avoidable share: most triage + a chunk of estimator/qual.
  const potentialSavingsDollars = Math.round(
    costLines.reviewCost * 0.7 + costLines.estimatorCost * 0.6 + costLines.qualificationCost * 0.5
  );
  const potentialSavingsCents = potentialSavingsDollars * 100;

  // Waste score — map $0..$200k+ onto 0..100.
  const wasteScore = Math.max(0, Math.min(100, Math.round((annualWasteDollars / 200_000) * 100)));

  // Top drivers (largest cost lines, named).
  const driverNames: Record<string, string> = {
    reviewCost: "Portal scanning / triage time",
    estimatorCost: "Estimator time on dead-end opportunities",
    proposalCost: "Proposal effort on lost bids",
    qualificationCost: "Weak bid/no-bid qualification",
    managementCost: "Management oversight overhead",
  };
  const topDrivers = Object.entries(costLines)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${driverNames[k]} (~$${Math.round(v / 1000)}k/yr)`);

  // Expected ROI of Phil's service vs. recovered waste (rough multiple).
  const expectedRoiPct = potentialSavingsDollars > 0 ? Math.round((potentialSavingsDollars / 10_000) * 100) : 0;

  return {
    annualOpportunitiesReviewed,
    annualQualified,
    annualBidsPursued,
    annualBidsLost,
    costLines,
    annualWasteCents,
    potentialSavingsCents,
    wasteScore,
    topDrivers,
    expectedRoiPct: Math.min(900, expectedRoiPct),
  };
}

/** Human-friendly band used in outreach copy. */
export function wasteBand(cents: number): string {
  const d = cents / 100;
  if (d >= 250_000) return "$250,000+";
  if (d >= 145_000) return "$145,000-$250,000";
  if (d >= 83_000) return "$83,000-$145,000";
  if (d >= 42_000) return "$42,000-$83,000";
  if (d >= 18_000) return "$18,000-$42,000";
  return "under $18,000";
}

export function isPrimaryIndustry(industry?: string | null): boolean {
  return !!industry && (PRIMARY_INDUSTRIES as readonly string[]).includes(industry);
}
