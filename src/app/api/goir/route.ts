import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { runGoir } from "@/lib/goir/engine";
import { generateNarrative } from "@/lib/goir/narrative";
import { goirEmail } from "@/lib/goir/email";
import { sendEmail } from "@/lib/integrations/email";
import type { GoirInput } from "@/lib/goir/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Public lead-magnet endpoint — no auth.
const schema = z.object({
  companyName: z.string().min(1, "Company name is required").max(160),
  website: z.string().max(200).optional().nullable(),
  industry: z.string().min(1, "Industry is required").max(60),
  region: z.string().min(1, "Province/State is required").max(60),
  email: z.string().email("A valid email is required").max(160),
  platformsUsed: z.array(z.string().max(60)).max(20).optional(),
  annualBidVolume: z.coerce.number().int().min(0).max(100000).optional().nullable(),
  employees: z.coerce.number().int().min(0).max(1000000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const input: GoirInput = {
    companyName: data.companyName.trim(),
    website: data.website?.trim() || null,
    industry: data.industry,
    region: data.region,
    email: data.email.trim().toLowerCase(),
    platformsUsed: data.platformsUsed ?? [],
    annualBidVolume: data.annualBidVolume ?? null,
    employees: data.employees ?? null,
  };

  // 1) Deterministic engine — always works, no external dependency.
  const result = runGoir(input);

  // 2) Optional AI prose layer (null when no API key / on error).
  const narrative = await generateNarrative(input, result).catch(() => null);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex").slice(0, 32) : null;

  try {
    const report = await prisma.goirReport.create({
      data: {
        companyName: input.companyName,
        website: input.website,
        industry: input.industry,
        region: input.region,
        email: input.email,
        platformsUsed: input.platformsUsed ?? [],
        annualBidVolume: input.annualBidVolume,
        employees: input.employees,
        index: result.index,
        tier: result.tier,
        scores: result.categories.reduce<Record<string, number>>((m, c) => ((m[c.key] = c.score), m), {}),
        result: result as unknown as object,
        narrative: (narrative as unknown as object) ?? undefined,
        ipHash,
      },
      select: { id: true },
    });

    // Email the report link to the prospect (no-op when email isn't configured).
    const origin = (() => {
      try { return new URL(req.url).origin; } catch { return process.env.NEXTAUTH_URL ?? ""; }
    })();
    const reportUrl = `${origin}/goir/${report.id}`;
    const { subject, html, text } = goirEmail(result, reportUrl);
    const mail = await sendEmail({ to: input.email, subject, html, text }).catch(() => ({ ok: false }));

    return NextResponse.json({ ok: true, id: report.id, emailed: !!(mail as any).ok });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: `Could not save report: ${e?.message ?? e}` },
      { status: 500 }
    );
  }
}
