// AI layer for the Opportunity Intelligence platform.
// Every function degrades gracefully: when ANTHROPIC_API_KEY is absent (or a
// call fails) it returns a research-driven template so the product is fully
// usable for demos and offline development.

import { complete, type AITrack } from "@/lib/ai/client";
import { type ScoreResult } from "./scoring";
import { wasteBand } from "./waste";
import { fmtDollars } from "./constants";
import type { OutreachKind } from "./constants";

const AGENT = "opportunity-intelligence";

export type ProspectLike = {
  companyName: string;
  contactName?: string | null;
  contactTitle?: string | null;
  industry?: string | null;
  subIndustry?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  website?: string | null;
  employeesEstimate?: number | null;
  revenueEstimateDollars?: number | null;
  locationsCount?: number | null;
  govExperience?: boolean;
  govClientTypes?: string[];
  procurementMaturity?: string | null;
  hasWonGov?: boolean;
  awardCount?: number | null;
  totalWonDollars?: number | null;
  largestAwardDollars?: number | null;
  lastAwardAt?: Date | string | null;
  awardCategories?: string[];
  awardingDepts?: string[];
  primaryPlatforms?: string[];
  secondaryPlatforms?: string[];
  researchNotes?: string | null;
};

function firstName(name?: string | null) {
  return (name ?? "there").trim().split(/\s+/)[0] || "there";
}

function tryParseJson<T>(text: string | null): T | null {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

// ── Module 1: research ──────────────────────────────────────────────────────

export type ResearchResult = {
  industry?: string;
  subIndustry?: string;
  companySize?: string;
  employeesEstimate?: number;
  revenueEstimateDollars?: number;
  locationsCount?: number;
  govExperience?: boolean;
  govClientTypes?: string[];
  procurementMaturity?: "LOW" | "MEDIUM" | "HIGH";
  researchNotes: string;
  researchSources?: string[];
};

export async function researchProspect(p: ProspectLike, track: AITrack): Promise<ResearchResult> {
  const system =
    "You are a B2B procurement research analyst supporting a Government Opportunity Intelligence consultant in Canada. " +
    "Given limited public information about a company, infer a realistic research profile. Be conservative and explicit about uncertainty. " +
    "Respond with ONLY a JSON object, no prose.";

  const prompt = `Company: ${p.companyName}
Website: ${p.website ?? "unknown"}
Known industry: ${p.industry ?? "unknown"}
Location: ${[p.city, p.region, p.country].filter(Boolean).join(", ") || "unknown"}
Contact: ${[p.contactName, p.contactTitle].filter(Boolean).join(", ") || "unknown"}

Return JSON with keys:
{
  "industry": string,                 // best-fit industry
  "subIndustry": string,
  "companySize": "micro|small|mid|large",
  "employeesEstimate": number,
  "revenueEstimateDollars": number,
  "locationsCount": number,
  "govExperience": boolean,           // do they appear to sell to government?
  "govClientTypes": string[],         // any of: municipal, provincial, federal, school, healthcare, infrastructure
  "procurementMaturity": "LOW|MEDIUM|HIGH",
  "researchNotes": string,            // 2-4 sentence narrative profile
  "researchSources": string[]         // the kinds of sources you'd check
}`;

  const raw = await complete({ system, prompt, maxTokens: 700, track: { ...track, agent: AGENT, feature: "research" } });
  const parsed = tryParseJson<ResearchResult>(raw);
  if (parsed && parsed.researchNotes) {
    return {
      ...parsed,
      researchSources:
        parsed.researchSources ?? ["company website", "LinkedIn", "Google Business Profile", "CanadaBuys", "news"],
    };
  }
  // Offline / failure fallback — deterministic profile from what we know.
  return fallbackResearch(p);
}

function fallbackResearch(p: ProspectLike): ResearchResult {
  const gov = p.govExperience ?? (p.awardCount ?? 0) > 0;
  return {
    industry: p.industry ?? undefined,
    govExperience: gov,
    govClientTypes: p.govClientTypes?.length ? p.govClientTypes : gov ? ["municipal"] : [],
    procurementMaturity: (p.procurementMaturity as ResearchResult["procurementMaturity"]) ?? (gov ? "MEDIUM" : "LOW"),
    employeesEstimate: p.employeesEstimate ?? undefined,
    locationsCount: p.locationsCount ?? 1,
    researchNotes:
      `${p.companyName} appears to operate in ${p.industry ?? "an unverified industry"}` +
      `${p.region ? ` out of ${p.region}` : ""}. ` +
      (gov
        ? "Public records suggest some public-sector activity worth qualifying further."
        : "No public-sector footprint confirmed yet — qualify whether they bid on government work.") +
      " (Generated offline — connect ANTHROPIC_API_KEY for live research.)",
    researchSources: ["company website", "LinkedIn", "CanadaBuys", "public directories"],
  };
}

// ── AI summaries ─────────────────────────────────────────────────────────────

export async function summarizeProspect(p: ProspectLike, score: ScoreResult, track: AITrack): Promise<string> {
  const system =
    "You are the analyst arm of a Government Opportunity Intelligence service. Write a crisp prospect summary for the sales operator. Use plain text, short paragraphs, no markdown headers.";
  const prompt = `Summarize this prospect in 4-6 sentences covering: who they are, their government footprint, why they would buy opportunity-monitoring services, and the single best reason to reach out now.

${describe(p, score)}`;
  const out = await complete({ system, prompt, maxTokens: 500, track: { ...track, agent: AGENT, feature: "prospect-summary" } });
  return out ?? fallbackSummary(p, score);
}

function fallbackSummary(p: ProspectLike, s: ScoreResult): string {
  const plats = (p.primaryPlatforms ?? []).join(", ") || "multiple procurement portals";
  return (
    `${p.companyName} scores ${s.score}/100 (${s.label}). ` +
    `As a ${p.industry ?? "target-industry"} firm${p.region ? ` in ${p.region}` : ""}, they are ` +
    `${p.hasWonGov ? `an active government supplier with ${p.awardCount ?? 0} known award(s)` : "a candidate to qualify for public-sector work"}. ` +
    `They likely monitor ${plats}, which is exactly the estimator time Phil's service removes. ` +
    `Recommended tier: ${s.recommendedPricingTier} (~${fmtDollars(s.recommendedMonthlyFeeCents / 100)}/mo). ` +
    (s.shouldContactToday ? "Contact today." : "Add to the nurture cadence.")
  );
}

export async function generateAccountPlan(p: ProspectLike, score: ScoreResult, track: AITrack): Promise<string> {
  const system = "You are a strategic account planner for a Government Opportunity Intelligence service. Produce a concise account plan in plain text with clear sections (Why them, Angle, Platforms to pitch, Pricing, Next 3 steps).";
  const prompt = `Build an account plan for this prospect.\n\n${describe(p, score)}`;
  const out = await complete({ system, prompt, maxTokens: 800, track: { ...track, agent: AGENT, feature: "account-plan" } });
  return out ?? fallbackAccountPlan(p, score);
}

function fallbackAccountPlan(p: ProspectLike, s: ScoreResult): string {
  return [
    `ACCOUNT PLAN — ${p.companyName}`,
    ``,
    `Why them: ${s.label} (GOII Index™ ${s.score}/100). Likelihood to buy ${s.likelihoodToBuy}/100, est. opportunity waste ${fmtDollars(s.opportunityWasteCents / 100)}/yr.`,
    `Angle: position monitoring + qualification of opportunities so their estimators stop scanning portals.`,
    `Platforms to pitch: ${(p.primaryPlatforms ?? []).join(", ") || "to be confirmed in research"}.`,
    `Pricing: ${s.recommendedPricingTier} (~${fmtDollars(s.recommendedMonthlyFeeCents / 100)}/mo) · est. LTV ${fmtDollars(s.estLtvCents / 100)}.`,
    `Next 3 steps: 1) ${s.shouldContactToday ? "Send cold email today" : "Warm via LinkedIn"} 2) Reference their gov footprint 3) Offer a sample opportunity brief.`,
    ``,
    `(Generated offline — connect ANTHROPIC_API_KEY for a richer plan.)`,
  ].join("\n");
}

// ── Module 7: outreach ────────────────────────────────────────────────────────

export async function generateOutreach(
  p: ProspectLike,
  kind: OutreachKind,
  score: ScoreResult,
  track: AITrack
): Promise<{ subject?: string; body: string }> {
  const kindLabel: Record<OutreachKind, string> = {
    COLD_EMAIL: "a short cold email (with a subject line)",
    LINKEDIN: "a brief LinkedIn connection message under 300 characters",
    COLD_CALL: "a cold call opener script with 2 likely objections + responses",
    LOOM: "a 60-second Loom video script (spoken, with a hook and a single CTA)",
    FOLLOWUP: "a 3-touch follow-up sequence (email 1, email 2, breakup email)",
  };
  const system =
    "You write outreach for a Government Opportunity Intelligence consultant. Tone: peer-to-peer, specific, never generic. " +
    "Always reference the prospect's real research (industry, region, government experience, platforms). " +
    "The service MONITORS, DISCOVERS, REVIEWS, QUALIFIES and SUMMARISES public-sector opportunities. It does NOT write proposals or submit bids. " +
    "Keep it tight. For a cold email, start the body with 'Subject: ...' on the first line.";
  const prompt = `Write ${kindLabel[kind]} for this prospect.\n\n${describe(p, score)}`;
  const out = await complete({ system, prompt, maxTokens: 700, track: { ...track, agent: AGENT, feature: `outreach-${kind}` } });
  if (out) {
    if (kind === "COLD_EMAIL") {
      const m = out.match(/subject:\s*(.+)/i);
      const subject = m?.[1]?.trim();
      const body = subject ? out.replace(/subject:\s*.+\n?/i, "").trim() : out;
      return { subject, body };
    }
    return { body: out };
  }
  return fallbackOutreach(p, kind, score);
}

function fallbackOutreach(p: ProspectLike, kind: OutreachKind, s: ScoreResult): { subject?: string; body: string } {
  const fn = firstName(p.contactName);
  const where = p.region ? `in ${p.region}` : "in your region";
  const plats = (p.primaryPlatforms ?? []).slice(0, 3).join(", ") || "MERX, Bonfire, and bids&tenders";
  const footprint = p.hasWonGov ? "your public-sector work" : "your interest in government work";

  const band = wasteBand(s.opportunityWasteCents);
  const coreLine = `While reviewing ${footprint} ${where}, I noticed your team appears active in ${p.industry ?? "public-sector"} projects. Based on our analysis, firms like yours may be spending ${band} annually reviewing opportunities across ${plats} that never become bids. I help filter, qualify, and summarize the right opportunities before they ever reach your estimators.`;

  switch (kind) {
    case "COLD_EMAIL":
      return {
        subject: `${p.companyName} + government bids ${where}`,
        body: `Hi ${fn},\n\n${coreLine}\n\nWorth a 15-minute look at how this would apply to ${p.companyName}?\n\n— Phil`,
      };
    case "LINKEDIN":
      return {
        body: `Hi ${fn} — I work with ${p.industry ?? "contractors"} ${where} to cut the estimator time spent scanning ${plats}. We monitor + qualify gov opportunities so only the right ones reach you. Open to connecting?`,
      };
    case "COLD_CALL":
      return {
        body: `OPENER:\n"Hi ${fn}, Phil here — I'll be quick. I help ${p.industry ?? "firms"} ${where} stop burning estimator hours scanning ${plats}. We monitor and summarize the gov opportunities that actually fit, so you only see the live ones."\n\nOBJECTION: "We already check the portals."\n→ "Most do — and that's the time cost. We watch them daily and only flag what fits your shop, with a one-page brief."\n\nOBJECTION: "We're busy."\n→ "Exactly why this helps — 15 minutes now saves your estimators hours every week. Can I send a sample brief?"`,
      };
    case "LOOM":
      return {
        body: `[0-5s HOOK] "${fn}, made you a quick video about ${p.companyName} and government bids ${where}."\n[5-30s] Walk through ${plats} and how many irrelevant postings their team sifts through.\n[30-50s] Show a sample one-page opportunity brief — monitored, qualified, summarized.\n[50-60s CTA] "If useful, reply and I'll set up a live watch for ${p.companyName}."`,
      };
    case "FOLLOWUP":
      return {
        body: `EMAIL 1 (Day 0):\n${coreLine}\n\nEMAIL 2 (Day 3):\nHi ${fn}, following up — I pulled a couple of live opportunities ${where} that fit ${p.companyName}. Want me to send the briefs?\n\nBREAKUP (Day 7):\nHi ${fn}, I'll close the loop here. If cutting estimator time on ${plats} becomes a priority, I'm one reply away.`,
      };
  }
}

// ── Module 5: renewal briefs ───────────────────────────────────────────────

export async function generateRenewalBrief(
  r: {
    title: string;
    agency?: string | null;
    category?: string | null;
    region?: string | null;
    valueDollars?: number | null;
    endDate?: Date | string | null;
    likelyRebidStart?: Date | string | null;
    likelyPlatform?: string | null;
    incumbentName?: string | null;
    buyerName?: string | null;
  },
  track: AITrack
): Promise<{ opportunityBrief: string; monitoringPlan: string }> {
  const system =
    "You are a renewal-intelligence analyst. Given a public contract approaching its end, write (1) an opportunity brief and (2) a suggested monitoring plan for a Government Opportunity Intelligence service. Plain text, concise, sectioned. Return JSON {\"opportunityBrief\": string, \"monitoringPlan\": string}.";
  const prompt = `Contract: ${r.title}
Buyer: ${r.buyerName ?? r.agency ?? "unknown"}
Category: ${r.category ?? "unknown"}
Region: ${r.region ?? "unknown"}
Value: ${r.valueDollars ? fmtDollars(r.valueDollars) : "unknown"}
Ends: ${r.endDate ? new Date(r.endDate).toISOString().slice(0, 10) : "unknown"}
Likely rebid: ${r.likelyRebidStart ? new Date(r.likelyRebidStart).toISOString().slice(0, 10) : "unknown"}
Likely platform: ${r.likelyPlatform ?? "unknown"}
Incumbent: ${r.incumbentName ?? "unknown"}`;
  const out = await complete({ system, prompt, maxTokens: 700, track: { ...track, agent: AGENT, feature: "renewal-brief" } });
  const parsed = tryParseJson<{ opportunityBrief: string; monitoringPlan: string }>(out);
  if (parsed?.opportunityBrief) return parsed;
  return {
    opportunityBrief:
      `${r.title} (${r.buyerName ?? r.agency ?? "buyer"}) is ${r.valueDollars ? `worth ~${fmtDollars(r.valueDollars)} and ` : ""}` +
      `approaching the end of its term${r.endDate ? ` on ${new Date(r.endDate).toISOString().slice(0, 10)}` : ""}. ` +
      `Expect a rebid${r.likelyRebidStart ? ` opening around ${new Date(r.likelyRebidStart).toISOString().slice(0, 10)}` : ""}` +
      `${r.likelyPlatform ? ` on ${r.likelyPlatform}` : ""}. Incumbent: ${r.incumbentName ?? "unknown"}.`,
    monitoringPlan:
      `Set a watch on ${r.likelyPlatform ?? "the buyer's procurement platform"} now; alert at 12/9/6/3 months and 30 days before the likely rebid. ` +
      `Track the buyer's award notices for early signals and prep a qualified brief the moment the solicitation posts.`,
  };
}

export async function summarizeBuyer(
  b: { organization: string; region?: string | null; commodityCategories?: string[]; awardCount?: number; totalAwardedDollars?: number; currentSuppliers?: string[] },
  track: AITrack
): Promise<string> {
  const system = "You are a buyer-intelligence analyst for a Government Opportunity Intelligence service. Summarize this public buyer in 3-5 sentences: what they buy, how often, who from, and the likely next opportunity. Plain text.";
  const prompt = `Buyer: ${b.organization}
Region: ${b.region ?? "unknown"}
Buys: ${(b.commodityCategories ?? []).join(", ") || "unknown"}
Awards on record: ${b.awardCount ?? 0} totalling ${b.totalAwardedDollars ? fmtDollars(b.totalAwardedDollars) : "unknown"}
Known suppliers: ${(b.currentSuppliers ?? []).join(", ") || "unknown"}`;
  const out = await complete({ system, prompt, maxTokens: 400, track: { ...track, agent: AGENT, feature: "buyer-summary" } });
  return (
    out ??
    `${b.organization}${b.region ? ` (${b.region})` : ""} procures ${(b.commodityCategories ?? []).join(", ") || "a range of goods/services"} ` +
      `with ${b.awardCount ?? 0} award(s) on record${b.totalAwardedDollars ? ` totalling ${fmtDollars(b.totalAwardedDollars)}` : ""}. ` +
      `Watch for recurring rebids in these categories.`
  );
}

// ── shared describe() block fed into prompts & fallbacks ────────────────────

function describe(p: ProspectLike, s: ScoreResult): string {
  return `Company: ${p.companyName}
Contact: ${[p.contactName, p.contactTitle].filter(Boolean).join(", ") || "unknown"}
Industry: ${p.industry ?? "unknown"}${p.subIndustry ? ` / ${p.subIndustry}` : ""}
Location: ${[p.city, p.region, p.country].filter(Boolean).join(", ") || "unknown"}
Employees: ${p.employeesEstimate ?? "?"} · Locations: ${p.locationsCount ?? "?"} · Est. revenue: ${p.revenueEstimateDollars ? fmtDollars(p.revenueEstimateDollars) : "?"}
Government experience: ${p.hasWonGov || p.govExperience ? "yes" : "unconfirmed"} (${(p.govClientTypes ?? []).join(", ") || "levels unknown"})
Awards: ${p.awardCount ?? 0}${p.totalWonDollars ? `, total ${fmtDollars(p.totalWonDollars)}` : ""}${p.largestAwardDollars ? `, largest ${fmtDollars(p.largestAwardDollars)}` : ""}
Award categories: ${(p.awardCategories ?? []).join(", ") || "none"}
Primary platforms: ${(p.primaryPlatforms ?? []).join(", ") || "to be determined"}
Secondary platforms: ${(p.secondaryPlatforms ?? []).join(", ") || "—"}
GOII Index™: ${s.score}/100 (${s.label}) · likelihood ${s.likelihoodToBuy}
Estimated opportunity waste: ${fmtDollars(s.opportunityWasteCents / 100)}/yr (top drivers: ${s.waste.topDrivers.join("; ")})
Recommended tier: ${s.recommendedPricingTier} · expected ROI ${s.expectedRoiPct}%
Research notes: ${p.researchNotes ?? "none yet"}`;
}
