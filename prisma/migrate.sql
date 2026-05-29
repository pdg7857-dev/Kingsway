-- Idempotent incremental migration for already-provisioned databases.
-- Safe to run repeatedly. Applied automatically by /api/setup after init.sql.
-- Only ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS / CREATE INDEX IF NOT EXISTS
-- (all transaction-safe — no ALTER TYPE ... ADD VALUE).

-- Mileage: km + transport mode + fare
ALTER TABLE "MileageLog" ADD COLUMN IF NOT EXISTS "distanceKm" DOUBLE PRECISION;
ALTER TABLE "MileageLog" ADD COLUMN IF NOT EXISTS "transportMode" TEXT NOT NULL DEFAULT 'CAR';
ALTER TABLE "MileageLog" ADD COLUMN IF NOT EXISTS "ratePerKm" DOUBLE PRECISION DEFAULT 0.43;
ALTER TABLE "MileageLog" ADD COLUMN IF NOT EXISTS "costCents" INTEGER;

-- AI usage / spend tracking + per-user monthly budget
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "aiMonthlyBudgetCents" INTEGER NOT NULL DEFAULT 2000;

CREATE TABLE IF NOT EXISTS "AIUsage" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "agent" TEXT,
  "model" TEXT NOT NULL,
  "feature" TEXT,
  "inputTokens" INTEGER NOT NULL DEFAULT 0,
  "outputTokens" INTEGER NOT NULL DEFAULT 0,
  "costCents" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AIUsage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AIUsage_userId_createdAt_idx" ON "AIUsage"("userId", "createdAt");

-- Integration credentials (iCloud CalDAV, Google, etc.)
CREATE TABLE IF NOT EXISTS "IntegrationCredential" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "label" TEXT,
  "username" TEXT,
  "secret" TEXT,
  "calendarUrl" TEXT,
  "remindersUrl" TEXT,
  "data" JSONB,
  "lastSyncAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IntegrationCredential_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IntegrationCredential_userId_provider_key"
  ON "IntegrationCredential"("userId", "provider");

-- ───────────────────────────────────────────────────────────────
-- Government Opportunity Intelligence Platform
-- ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Prospect" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "businessId" TEXT,
  "companyName" TEXT NOT NULL,
  "contactName" TEXT,
  "contactTitle" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "website" TEXT,
  "linkedinUrl" TEXT,
  "industry" TEXT,
  "subIndustry" TEXT,
  "city" TEXT,
  "region" TEXT,
  "country" TEXT DEFAULT 'Canada',
  "companySize" TEXT,
  "employeesEstimate" INTEGER,
  "revenueEstimateDollars" INTEGER,
  "locationsCount" INTEGER,
  "govExperience" BOOLEAN NOT NULL DEFAULT false,
  "govClientTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "procurementMaturity" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "researchNotes" TEXT,
  "researchSources" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "researchedAt" TIMESTAMP(3),
  "hasWonGov" BOOLEAN NOT NULL DEFAULT false,
  "awardCount" INTEGER NOT NULL DEFAULT 0,
  "totalWonDollars" INTEGER NOT NULL DEFAULT 0,
  "largestAwardDollars" INTEGER NOT NULL DEFAULT 0,
  "lastAwardAt" TIMESTAMP(3),
  "awardCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "awardingDepts" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "primaryPlatforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "secondaryPlatforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "score" INTEGER,
  "tier" TEXT,
  "scoreBreakdown" JSONB,
  "govExperienceScore" INTEGER,
  "awardScore" INTEGER,
  "wasteScore" INTEGER,
  "laborScarcityScore" INTEGER,
  "platformComplexityScore" INTEGER,
  "geoComplexityScore" INTEGER,
  "renewalOppScore" INTEGER,
  "revenuePotentialScore" INTEGER,
  "likelihoodToBuy" INTEGER,
  "opportunityWasteCents" INTEGER,
  "wasteBreakdown" JSONB,
  "expectedRoiPct" INTEGER,
  "estAnnualValueCents" INTEGER,
  "estLtvCents" INTEGER,
  "recommendedPricingTier" TEXT,
  "recommendedMonthlyFeeCents" INTEGER,
  "scoredAt" TIMESTAMP(3),
  "stage" TEXT NOT NULL DEFAULT 'NEW',
  "lastContactedAt" TIMESTAMP(3),
  "nextActionAt" TIMESTAMP(3),
  "notes" TEXT,
  "aiSummary" TEXT,
  "aiAccountPlan" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Prospect_userId_tier_idx" ON "Prospect"("userId", "tier");
CREATE INDEX IF NOT EXISTS "Prospect_userId_score_idx" ON "Prospect"("userId", "score");
CREATE INDEX IF NOT EXISTS "Prospect_userId_industry_idx" ON "Prospect"("userId", "industry");
CREATE INDEX IF NOT EXISTS "Prospect_userId_stage_idx" ON "Prospect"("userId", "stage");

CREATE TABLE IF NOT EXISTS "Buyer" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "department" TEXT,
  "agency" TEXT,
  "division" TEXT,
  "contactName" TEXT,
  "contactTitle" TEXT,
  "procurementContact" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "address" TEXT,
  "website" TEXT,
  "region" TEXT,
  "platform" TEXT,
  "commodityCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "currentSuppliers" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "awardCount" INTEGER NOT NULL DEFAULT 0,
  "totalAwardedDollars" INTEGER NOT NULL DEFAULT 0,
  "avgContractDollars" INTEGER NOT NULL DEFAULT 0,
  "typicalCycleMonths" INTEGER,
  "recurringPurchases" TEXT,
  "buyerRelScore" INTEGER,
  "buyerOppScore" INTEGER,
  "renewalProbScore" INTEGER,
  "aiSummary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Buyer_userId_organization_idx" ON "Buyer"("userId", "organization");
CREATE INDEX IF NOT EXISTS "Buyer_userId_region_idx" ON "Buyer"("userId", "region");

CREATE TABLE IF NOT EXISTS "GovAward" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "prospectId" TEXT,
  "buyerId" TEXT,
  "supplierName" TEXT NOT NULL,
  "supplierNorm" TEXT,
  "title" TEXT NOT NULL,
  "agency" TEXT,
  "department" TEXT,
  "category" TEXT,
  "region" TEXT,
  "location" TEXT,
  "valueDollars" INTEGER,
  "awardDate" TIMESTAMP(3),
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "contractLengthMonths" INTEGER,
  "renewalOption" BOOLEAN NOT NULL DEFAULT false,
  "platform" TEXT,
  "sourceUrl" TEXT,
  "sourceRef" TEXT,
  "raw" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GovAward_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "GovAward_userId_supplierNorm_idx" ON "GovAward"("userId", "supplierNorm");
CREATE INDEX IF NOT EXISTS "GovAward_userId_awardDate_idx" ON "GovAward"("userId", "awardDate");
CREATE INDEX IF NOT EXISTS "GovAward_userId_endDate_idx" ON "GovAward"("userId", "endDate");

CREATE TABLE IF NOT EXISTS "Renewal" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "buyerId" TEXT,
  "incumbentId" TEXT,
  "awardId" TEXT,
  "title" TEXT NOT NULL,
  "agency" TEXT,
  "department" TEXT,
  "category" TEXT,
  "region" TEXT,
  "valueDollars" INTEGER,
  "awardDate" TIMESTAMP(3),
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "contractLengthMonths" INTEGER,
  "likelyRenewalDate" TIMESTAMP(3),
  "likelyRebidStart" TIMESTAMP(3),
  "incumbentAdvantage" INTEGER,
  "likelyPlatform" TEXT,
  "expectedValueDollars" INTEGER,
  "alertWindow" TEXT,
  "status" TEXT NOT NULL DEFAULT 'WATCHING',
  "opportunityBrief" TEXT,
  "buyerProfile" TEXT,
  "incumbentProfile" TEXT,
  "contractHistory" TEXT,
  "monitoringPlan" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Renewal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Renewal_userId_status_idx" ON "Renewal"("userId", "status");
CREATE INDEX IF NOT EXISTS "Renewal_userId_likelyRebidStart_idx" ON "Renewal"("userId", "likelyRebidStart");

CREATE TABLE IF NOT EXISTS "ProspectOutreach" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "prospectId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "subject" TEXT,
  "body" TEXT NOT NULL,
  "channelMeta" JSONB,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProspectOutreach_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ProspectOutreach_userId_prospectId_idx" ON "ProspectOutreach"("userId", "prospectId");
