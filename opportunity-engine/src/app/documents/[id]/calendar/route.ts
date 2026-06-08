import { prisma } from "@/lib/db";
import { analysisSchema } from "@/lib/analysis-schema";

export const dynamic = "force-dynamic";

function icsDate(s: string | null): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const opp = await prisma.opportunity.findUnique({ where: { id: params.id } });
  if (!opp) return new Response("Not found", { status: 404 });

  const parsed = analysisSchema.safeParse(opp.analysis);
  const a = parsed.success ? parsed.data : null;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events: { date: string; summary: string }[] = [];
  const add = (raw: string | null | undefined, label: string) => {
    const d = icsDate(raw ?? null);
    if (d) events.push({ date: d, summary: `${label}: ${opp.title}` });
  };
  if (a) {
    add(a.key_dates.closing, "Bid closes");
    add(a.key_dates.site_visit, "Site visit");
    add(a.key_dates.questions_due, "Questions due");
  } else {
    add(opp.closingDate ? opp.closingDate.toISOString() : null, "Bid closes");
  }

  if (events.length === 0) return new Response("No dates to export", { status: 404 });

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Opportunity Intelligence Engine//EN",
    ...events.flatMap((e, i) => [
      "BEGIN:VEVENT",
      `UID:${opp.id}-${i}@oie`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${e.date}`,
      `SUMMARY:${esc(e.summary)}`,
      "BEGIN:VALARM",
      "TRIGGER:-P2D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(e.summary)}`,
      "END:VALARM",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="opportunity-${opp.id}.ics"`,
    },
  });
}
