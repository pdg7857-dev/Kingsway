// Seed a demonstrative Opportunity Intelligence book: prospects (auto-scored on
// the GOII Index™), buyers, matched awards, and predicted renewals.
import type { PrismaClient } from "@prisma/client";
import { enrichAndScore } from "./pipeline";
import { rollupAwards, predictRenewal, normalizeName } from "./awards";

const months = (n: number) => new Date(Date.now() + n * 30.4 * 86400000);

type P = {
  companyName: string;
  contactName: string;
  contactTitle: string;
  industry: string;
  region: string;
  city: string;
  employeesEstimate: number;
  revenueEstimateDollars: number;
  locationsCount: number;
  govExperience: boolean;
  govClientTypes: string[];
  procurementMaturity: "LOW" | "MEDIUM" | "HIGH";
};

const PROSPECTS: P[] = [
  { companyName: "Summit Construction Group", contactName: "Mark Reyes", contactTitle: "VP Estimating", industry: "Construction", region: "Ontario", city: "Mississauga", employeesEstimate: 120, revenueEstimateDollars: 18_000_000, locationsCount: 2, govExperience: true, govClientTypes: ["municipal", "school"], procurementMaturity: "MEDIUM" },
  { companyName: "Titan General Contractors", contactName: "Dana Whitfield", contactTitle: "Director of Pre-Construction", industry: "General Contractors", region: "Ontario", city: "Toronto", employeesEstimate: 300, revenueEstimateDollars: 60_000_000, locationsCount: 4, govExperience: true, govClientTypes: ["municipal", "infrastructure", "provincial"], procurementMaturity: "HIGH" },
  { companyName: "Maple Leaf Facility Services", contactName: "Priya Nadeau", contactTitle: "Operations Manager", industry: "Facilities Maintenance", region: "Ontario", city: "Ottawa", employeesEstimate: 60, revenueEstimateDollars: 7_000_000, locationsCount: 2, govExperience: true, govClientTypes: ["municipal", "healthcare"], procurementMaturity: "MEDIUM" },
  { companyName: "PureClean Commercial", contactName: "Sam Okafor", contactTitle: "Owner", industry: "Commercial Cleaning", region: "British Columbia", city: "Vancouver", employeesEstimate: 35, revenueEstimateDollars: 3_000_000, locationsCount: 1, govExperience: true, govClientTypes: ["municipal"], procurementMaturity: "LOW" },
  { companyName: "NorthMRO Supply", contactName: "Elena Vasquez", contactTitle: "Sales Director", industry: "MRO Suppliers", region: "Alberta", city: "Calgary", employeesEstimate: 80, revenueEstimateDollars: 12_000_000, locationsCount: 3, govExperience: true, govClientTypes: ["federal", "provincial"], procurementMaturity: "HIGH" },
  { companyName: "Ironclad Security Services", contactName: "Marcus Bell", contactTitle: "GM", industry: "Security", region: "Ontario", city: "Hamilton", employeesEstimate: 210, revenueEstimateDollars: 22_000_000, locationsCount: 3, govExperience: true, govClientTypes: ["municipal", "healthcare"], procurementMaturity: "MEDIUM" },
  { companyName: "Apex HVAC Mechanical", contactName: "Julie Tremblay", contactTitle: "President", industry: "HVAC", region: "Quebec", city: "Montreal", employeesEstimate: 45, revenueEstimateDollars: 6_000_000, locationsCount: 1, govExperience: true, govClientTypes: ["school"], procurementMaturity: "MEDIUM" },
  { companyName: "EcoStream Environmental", contactName: "Aiden Clarke", contactTitle: "Business Dev Lead", industry: "Environmental Services", region: "British Columbia", city: "Victoria", employeesEstimate: 40, revenueEstimateDollars: 5_000_000, locationsCount: 1, govExperience: true, govClientTypes: ["provincial"], procurementMaturity: "MEDIUM" },
  { companyName: "GreenScape Landscaping", contactName: "Toni Russo", contactTitle: "Owner", industry: "Landscaping", region: "Ontario", city: "London", employeesEstimate: 25, revenueEstimateDollars: 2_000_000, locationsCount: 1, govExperience: false, govClientTypes: [], procurementMaturity: "LOW" },
  { companyName: "BrightSpark Electrical", contactName: "Devon Park", contactTitle: "Owner", industry: "Electrical", region: "Ontario", city: "Kitchener", employeesEstimate: 18, revenueEstimateDollars: 1_800_000, locationsCount: 1, govExperience: false, govClientTypes: [], procurementMaturity: "LOW" },
];

export async function seedOpportunityIntelligence(prisma: PrismaClient, userId: string, businessId?: string) {
  // Skip if already seeded.
  if ((await prisma.prospect.count({ where: { userId } })) > 0) return { skipped: true };

  // Buyers.
  const buyerSeeds = [
    { organization: "City of Toronto", department: "Purchasing & Materials Management", region: "Ontario", platform: "Bonfire", commodityCategories: ["Facilities Maintenance", "Janitorial", "Construction"], typicalCycleMonths: 36, awardCount: 0, totalAwardedDollars: 0, avgContractDollars: 0 },
    { organization: "Toronto District School Board", department: "Procurement Services", region: "Ontario", platform: "Biddingo", commodityCategories: ["HVAC", "Commercial Cleaning", "Building Services"], typicalCycleMonths: 24, awardCount: 0, totalAwardedDollars: 0, avgContractDollars: 0 },
    { organization: "Public Services and Procurement Canada", department: "Real Property Services", region: "Federal", platform: "CanadaBuys", commodityCategories: ["MRO Suppliers", "Industrial Supplies", "Construction"], typicalCycleMonths: 48, awardCount: 0, totalAwardedDollars: 0, avgContractDollars: 0 },
  ];
  const buyers: Record<string, string> = {};
  for (const b of buyerSeeds) {
    const created = await prisma.buyer.create({ data: { userId, ...b } });
    buyers[b.organization] = created.id;
  }

  // Prospects, scored.
  const ids: Record<string, string> = {};
  for (const p of PROSPECTS) {
    const { fields } = enrichAndScore(p);
    const created = await prisma.prospect.create({
      data: { userId, businessId: businessId ?? null, ...p, country: "Canada", stage: "SCORED", ...fields },
    });
    ids[p.companyName] = created.id;
  }

  // Awards (matched to prospects + buyers).
  const awardSeeds = [
    { supplier: "Titan General Contractors", buyer: "City of Toronto", title: "Roadway Rehabilitation — District 2", category: "Construction", valueDollars: 4_200_000, awardMonthsAgo: 10, lengthMonths: 24, platform: "bids&tenders" },
    { supplier: "Titan General Contractors", buyer: "Public Services and Procurement Canada", title: "Federal Building Envelope Renewal", category: "Construction", valueDollars: 6_800_000, awardMonthsAgo: 20, lengthMonths: 30, platform: "CanadaBuys" },
    { supplier: "Summit Construction Group", buyer: "Toronto District School Board", title: "School Roofing Replacement Program", category: "Construction", valueDollars: 1_350_000, awardMonthsAgo: 8, lengthMonths: 18, platform: "Biddingo" },
    { supplier: "Summit Construction Group", buyer: "City of Toronto", title: "Community Centre Renovation", category: "Construction", valueDollars: 980_000, awardMonthsAgo: 26, lengthMonths: 14, platform: "Bonfire" },
    { supplier: "Maple Leaf Facility Services", buyer: "City of Toronto", title: "Custodial Services — Civic Buildings", category: "Janitorial", valueDollars: 720_000, awardMonthsAgo: 14, lengthMonths: 36, platform: "Bonfire" },
    { supplier: "NorthMRO Supply", buyer: "Public Services and Procurement Canada", title: "MRO Consumables Standing Offer", category: "MRO Suppliers", valueDollars: 2_100_000, awardMonthsAgo: 6, lengthMonths: 36, platform: "CanadaBuys" },
    { supplier: "NorthMRO Supply", buyer: "Public Services and Procurement Canada", title: "Industrial Hardware Supply", category: "Industrial Supplies", valueDollars: 540_000, awardMonthsAgo: 30, lengthMonths: 24, platform: "CanadaBuys" },
    { supplier: "Ironclad Security Services", buyer: "Toronto District School Board", title: "Security Guard Services", category: "Security", valueDollars: 1_100_000, awardMonthsAgo: 16, lengthMonths: 36, platform: "Biddingo" },
    { supplier: "Apex HVAC Mechanical", buyer: "Toronto District School Board", title: "HVAC Preventive Maintenance", category: "HVAC", valueDollars: 460_000, awardMonthsAgo: 12, lengthMonths: 24, platform: "Biddingo" },
  ];

  const touched = new Set<string>();
  for (const a of awardSeeds) {
    const prospectId = ids[a.supplier] ?? null;
    if (prospectId) touched.add(prospectId);
    await prisma.govAward.create({
      data: {
        userId,
        prospectId,
        buyerId: buyers[a.buyer] ?? null,
        supplierName: a.supplier,
        supplierNorm: normalizeName(a.supplier),
        title: a.title,
        agency: a.buyer,
        department: a.buyer,
        category: a.category,
        region: "Canada",
        valueDollars: a.valueDollars,
        awardDate: months(-a.awardMonthsAgo),
        startDate: months(-a.awardMonthsAgo + 1),
        endDate: months(-a.awardMonthsAgo + 1 + a.lengthMonths),
        contractLengthMonths: a.lengthMonths,
        renewalOption: true,
        platform: a.platform,
      },
    });
  }

  // Recompute rollups + rescore matched prospects, and update buyer totals.
  for (const id of touched) {
    const list = await prisma.govAward.findMany({ where: { userId, prospectId: id } });
    const rollup = rollupAwards(list);
    const p = await prisma.prospect.findUnique({ where: { id } });
    if (!p) continue;
    const { fields } = enrichAndScore({
      industry: p.industry, region: p.region, country: p.country,
      employeesEstimate: p.employeesEstimate, revenueEstimateDollars: p.revenueEstimateDollars,
      locationsCount: p.locationsCount, govExperience: true, govClientTypes: p.govClientTypes,
      procurementMaturity: p.procurementMaturity, awardCount: rollup.awardCount,
      totalWonDollars: rollup.totalWonDollars, largestAwardDollars: rollup.largestAwardDollars, lastAwardAt: rollup.lastAwardAt,
    });
    await prisma.prospect.update({ where: { id }, data: { ...rollup, govExperience: true, ...fields } });
  }

  // Buyer rollups.
  for (const [org, bid] of Object.entries(buyers)) {
    const list = await prisma.govAward.findMany({ where: { userId, buyerId: bid } });
    const total = list.reduce((s, a) => s + (a.valueDollars ?? 0), 0);
    const suppliers = Array.from(new Set(list.map((a) => a.supplierName)));
    await prisma.buyer.update({
      where: { id: bid },
      data: { awardCount: list.length, totalAwardedDollars: total, avgContractDollars: list.length ? Math.round(total / list.length) : 0, currentSuppliers: suppliers },
    });
  }

  // Renewals — predict from the soonest-ending awards.
  const ending = await prisma.govAward.findMany({ where: { userId, endDate: { not: null } }, include: { prospect: true, buyer: true }, orderBy: { endDate: "asc" }, take: 6 });
  for (const a of ending) {
    const pred = predictRenewal({ endDate: a.endDate, startDate: a.startDate, awardDate: a.awardDate, contractLengthMonths: a.contractLengthMonths, valueDollars: a.valueDollars });
    const status = pred.alertWindow === "PAST" || pred.alertWindow === "D30" ? "IMMINENT" : pred.alertWindow === "M3" ? "UPCOMING" : "WATCHING";
    await prisma.renewal.create({
      data: {
        userId,
        awardId: a.id,
        buyerId: a.buyerId,
        incumbentId: a.prospectId,
        title: a.title,
        agency: a.agency,
        category: a.category,
        region: a.region,
        valueDollars: a.valueDollars,
        awardDate: a.awardDate,
        startDate: a.startDate,
        endDate: a.endDate,
        contractLengthMonths: a.contractLengthMonths,
        likelyRenewalDate: pred.likelyRenewalDate,
        likelyRebidStart: pred.likelyRebidStart,
        expectedValueDollars: pred.expectedValueDollars,
        alertWindow: pred.alertWindow,
        likelyPlatform: a.platform,
        incumbentAdvantage: 65,
        status,
      },
    });
  }

  return { skipped: false, prospects: PROSPECTS.length, buyers: buyerSeeds.length, awards: awardSeeds.length };
}
