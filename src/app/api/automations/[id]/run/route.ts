import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDailyBriefing } from "@/lib/ai/briefing";
import { postToSlack } from "@/lib/integrations/slack";
import { sendSMS } from "@/lib/integrations/sms";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const automation = await prisma.automation.findUnique({ where: { id: params.id } });
  if (!automation || automation.userId !== user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const results: any[] = [];
  for (const action of (automation.actions as any[]) ?? []) {
    switch (action.kind) {
      case "ai.run": {
        if (action.agent === "MASTER") {
          const summary = await generateDailyBriefing(user.id);
          await prisma.aIInsight.create({
            data: { userId: user.id, agent: "MASTER", kind: action.mode === "weekly" ? "WEEKLY_REVIEW" : "DAILY_BRIEFING", title: "Briefing", summary },
          });
          results.push({ kind: "ai.run", ok: true });
        }
        break;
      }
      case "notification.send": {
        const text = `[CEO OS] ${automation.name}`;
        if (action.channels?.includes("SLACK")) await postToSlack(text);
        if (action.channels?.includes("SMS") && process.env.ALERT_TO_NUMBER)
          await sendSMS(process.env.ALERT_TO_NUMBER, text);
        await prisma.notification.create({
          data: { userId: user.id, kind: "GENERIC", title: automation.name, channels: action.channels ?? ["IN_APP"] },
        });
        results.push({ kind: "notification.send", ok: true });
        break;
      }
      default:
        results.push({ kind: action.kind, ok: false, reason: "unsupported in MVP" });
    }
  }

  await prisma.automation.update({
    where: { id: automation.id },
    data: { lastRunAt: new Date(), lastResult: JSON.stringify(results) },
  });

  return NextResponse.json({ ok: true, results });
}
