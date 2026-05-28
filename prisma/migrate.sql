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
