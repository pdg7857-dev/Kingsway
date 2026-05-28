import { NextRequest, NextResponse } from "next/server";
import { aiClient, DEFAULT_MODEL } from "@/lib/ai/client";
import { AGENTS } from "@/lib/ai/agents";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAIUsage } from "@/lib/ai/usage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { agent = "MASTER", messages = [] } = await req.json();
  const user = await requireCurrentUser();
  const spec = AGENTS[agent as keyof typeof AGENTS] ?? AGENTS.MASTER;

  // Light context: today's task count, money summary
  const [tasksOpen, overdue, latestInsight] = await Promise.all([
    prisma.task.count({ where: { userId: user.id, status: { in: ["TODO", "IN_PROGRESS", "WAITING"] } } }),
    prisma.task.count({ where: { userId: user.id, status: { in: ["TODO", "IN_PROGRESS"] }, dueAt: { lt: new Date() } } }),
    prisma.aIInsight.findFirst({ where: { userId: user.id, kind: "DAILY_BRIEFING" }, orderBy: { createdAt: "desc" } }),
  ]);
  const ctx = `Live workspace context:\n- Open tasks: ${tasksOpen}\n- Overdue tasks: ${overdue}\n- Today's briefing (excerpt): ${latestInsight?.summary?.slice(0, 600) ?? "(none)"}`;

  const client = aiClient();
  if (!client) {
    return NextResponse.json({
      content:
        "AI key not configured — set ANTHROPIC_API_KEY in your env and I'll come online. Meanwhile, here's a deterministic note: I can answer once keys are set.",
    });
  }

  const res = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 1200,
    system: `${spec.system}\n\n${ctx}`,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });
  const block = res.content.find((b) => b.type === "text");
  const content = block && "text" in block ? block.text : "(no response)";

  await logAIUsage({
    userId: user.id,
    model: DEFAULT_MODEL,
    agent: spec.kind,
    feature: "chat",
    inputTokens: res.usage?.input_tokens ?? 0,
    outputTokens: res.usage?.output_tokens ?? 0,
  });

  // Persist conversation snapshot for the AI history page
  try {
    const conversation = await prisma.aIConversation.create({
      data: { userId: user.id, agent: spec.kind, title: messages[0]?.content?.slice(0, 60) },
    });
    await prisma.aIMessage.createMany({
      data: [
        ...messages.map((m: any) => ({ conversationId: conversation.id, role: m.role, content: m.content })),
        { conversationId: conversation.id, role: "assistant", content },
      ],
    });
  } catch {}

  return NextResponse.json({ content });
}
