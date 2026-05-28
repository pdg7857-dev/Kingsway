import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { complete } from "@/lib/ai/client";
import { AGENTS } from "@/lib/ai/agents";

const schema = z.object({ text: z.string().min(1), businessSlug: z.string().nullable().optional() });

export async function POST(req: NextRequest) {
  const user = await requireCurrentUser();
  const { text, businessSlug } = schema.parse(await req.json());

  let businessId: string | undefined;
  if (businessSlug) {
    const biz = await prisma.business.findUnique({ where: { userId_slug: { userId: user.id, slug: businessSlug as any } } });
    businessId = biz?.id;
  }

  // Try AI parse for priority + due date + cleaner title
  let parsed = { title: text, priority: "MEDIUM" as const, dueAt: undefined as Date | undefined };
  const ai = await complete({
    system: `${AGENTS.MASTER.system}\nReturn ONLY a JSON object: {"title": string, "priority": "LOW"|"MEDIUM"|"HIGH"|"URGENT", "dueAt": ISO-8601 or null}. Today is ${new Date().toISOString()}.`,
    prompt: `Convert this freeform note into a task. Note: "${text}"`,
    maxTokens: 200,
    track: { userId: user.id, agent: "MASTER", feature: "quickadd" },
  });
  if (ai) {
    try {
      const json = JSON.parse(ai.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
      if (json.title) parsed.title = json.title;
      if (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(json.priority)) parsed.priority = json.priority;
      if (json.dueAt) parsed.dueAt = new Date(json.dueAt);
    } catch {}
  }

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      businessId,
      title: parsed.title,
      priority: parsed.priority,
      dueAt: parsed.dueAt,
      source: ai ? "ai" : "manual",
    },
  });

  return NextResponse.json({ task });
}
