import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { complete } from "@/lib/ai/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM = `You are the eProcurement Consulting Agent. You help a consultant who finds
government contracts for clients in a single target industry and gives each client a
plain-English summary BEFORE they decide whether to pursue (buy) a contract.
Voice: sharp, decisive, no fluff. The client is not a procurement expert.`;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireCurrentUser();
  const contract = await prisma.govContract.findUnique({ where: { id: params.id }, include: { client: true } });
  if (!contract || contract.userId !== user.id) return NextResponse.json({ error: "not found" }, { status: 404 });

  const prompt = `Summarize this government contract opportunity for a client.

Contract:
- Title: ${contract.title}
- Agency: ${contract.agency ?? "unknown"}
- Industry: ${contract.industry ?? "unknown"}
- Solicitation #: ${contract.solicitationNumber ?? "unknown"}
- Estimated value: ${contract.valueCents ? "$" + (contract.valueCents / 100).toLocaleString() : "unknown"}
- Response due: ${contract.responseDueAt ? new Date(contract.responseDueAt).toDateString() : "unknown"}
- Notes: ${contract.notes ?? "none"}
${contract.client ? `Client: ${contract.client.company ?? contract.client.name} (industry: ${contract.client.industry ?? "unknown"})` : ""}

Produce TWO short sections in markdown:
1. **Summary** — what this contract is, in 3-4 plain bullets a non-expert can grasp.
2. **Can they do it?** — a go/maybe/pass call with the 2-3 factors that decide it (capabilities, timeline, competition, certifications/set-asides).
Keep the whole thing under 200 words.`;

  const text = await complete({ system: SYSTEM, prompt, maxTokens: 700 });
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "AI not configured. Set ANTHROPIC_API_KEY to generate contract summaries." },
      { status: 400 }
    );
  }

  // Split summary vs. fit if the model used the headings; otherwise store whole thing as summary.
  const fitIdx = text.search(/can they do it/i);
  const summary = fitIdx > -1 ? text.slice(0, fitIdx).trim() : text;
  const fit = fitIdx > -1 ? text.slice(fitIdx).trim() : null;

  const updated = await prisma.govContract.update({
    where: { id: contract.id },
    data: { summary, fitAssessment: fit, status: contract.status === "FOUND" ? "SUMMARIZED" : contract.status },
  });
  return NextResponse.json({ ok: true, contract: updated });
}
