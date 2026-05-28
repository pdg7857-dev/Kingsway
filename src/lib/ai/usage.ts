import { prisma } from "@/lib/prisma";

// Approximate USD price per 1M tokens. Update as pricing changes.
const PRICING: Record<string, { in: number; out: number }> = {
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "claude-opus-4-7": { in: 15, out: 75 },
  "claude-haiku-4-5-20251001": { in: 1, out: 5 },
  default: { in: 3, out: 15 },
};

export function estimateCostCents(model: string, inputTokens: number, outputTokens: number) {
  const p = PRICING[model] ?? PRICING.default;
  const usd = (inputTokens / 1_000_000) * p.in + (outputTokens / 1_000_000) * p.out;
  return usd * 100;
}

export async function logAIUsage(opts: {
  userId: string;
  model: string;
  agent?: string;
  feature?: string;
  inputTokens: number;
  outputTokens: number;
}) {
  const costCents = estimateCostCents(opts.model, opts.inputTokens, opts.outputTokens);
  try {
    await prisma.aIUsage.create({
      data: {
        userId: opts.userId,
        model: opts.model,
        agent: opts.agent,
        feature: opts.feature,
        inputTokens: opts.inputTokens,
        outputTokens: opts.outputTokens,
        costCents,
      },
    });
  } catch {
    // table may not exist yet (pre-migration) — fail silent
  }
  return costCents;
}
