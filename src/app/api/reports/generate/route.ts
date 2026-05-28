import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth";
import { generateReport } from "@/lib/ai/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  kind: z.enum(["daily", "weekly", "monthly", "business", "pipeline", "content", "retention", "inventory"]),
});

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const { kind } = schema.parse(await req.json());
  const report = await generateReport(user.id, kind);
  return NextResponse.json({ ok: true, report: { id: report.id, title: report.title, body: report.body, kind: report.kind, createdAt: report.createdAt } });
}
