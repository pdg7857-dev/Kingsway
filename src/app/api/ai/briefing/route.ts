import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { generateDailyBriefing } from "@/lib/ai/briefing";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  const user = await requireCurrentUser();
  const summary = await generateDailyBriefing(user.id);
  const insight = await prisma.aIInsight.create({
    data: {
      userId: user.id,
      agent: "MASTER",
      kind: "DAILY_BRIEFING",
      title: "Daily CEO Briefing",
      summary,
    },
  });
  return NextResponse.json({ summary, createdAt: insight.createdAt });
}
