import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { complete } from "@/lib/ai/client";
import { AGENTS } from "@/lib/ai/agents";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const idea = await prisma.idea.findUnique({ where: { id: params.id } });
  if (!idea || idea.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const text = await complete({
    system: `${AGENTS.MASTER.system}\nExpand the idea. Return JSON: {"expansion": markdown string, "feasibility": 0-100, "nextActions": [string, ...]}`,
    prompt: `Idea: ${idea.title}\n${idea.body ?? ""}`,
    maxTokens: 800,
  });
  let expansion = text ?? "(AI offline — set ANTHROPIC_API_KEY.)";
  let feasibility: number | null = null;
  if (text) {
    try {
      const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
      if (json.expansion) expansion = json.expansion;
      if (typeof json.feasibility === "number") feasibility = json.feasibility;
    } catch {}
  }
  const updated = await prisma.idea.update({
    where: { id: idea.id },
    data: { aiExpansion: expansion, aiFeasibility: feasibility ?? undefined, status: "EXPLORING" },
  });
  return NextResponse.json({ idea: updated });
}
