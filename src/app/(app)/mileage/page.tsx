import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { MileageForm } from "@/components/mileage/mileage-form";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, fmtCentsPrecise, businessDotBg, cn } from "@/lib/utils";
import { Car, MapPin, Route } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MileagePage() {
  const user = await requireCurrentUser();
  const now = new Date();
  const ytdStart = new Date(now.getFullYear(), 0, 1);

  const logs = await prisma.mileageLog.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    include: { business: true },
    take: 250,
  });

  const ytd = logs.filter((l) => l.date >= ytdStart);
  const businessMiles = ytd.filter((l) => l.purpose === "BUSINESS").reduce((s, l) => s + l.miles, 0);
  const personalMiles = ytd.filter((l) => l.purpose === "PERSONAL").reduce((s, l) => s + l.miles, 0);
  const deductionCents = Math.round(
    ytd.filter((l) => l.purpose === "BUSINESS").reduce((s, l) => s + l.miles * l.ratePerMile, 0) * 100
  );

  return (
    <>
      <Topbar title="Mileage tracker" subtitle="Log trips · auto-calc IRS deduction · business vs personal" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Business miles · YTD" value={businessMiles.toFixed(1)} tone="accent" icon={<Route className="h-4 w-4" />} />
          <KpiCard label="Personal miles · YTD" value={personalMiles.toFixed(1)} icon={<Car className="h-4 w-4" />} />
          <KpiCard label="Est. deduction · YTD" value={fmtCents(deductionCents)} hint="@ business rate" tone="success" />
          <KpiCard label="Trips logged" value={logs.length} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-1">
            <PanelHeader title="Log a trip" />
            <PanelBody>
              <MileageForm />
            </PanelBody>
          </Panel>

          <Panel className="lg:col-span-2">
            <PanelHeader title="Trip history" hint={`${logs.length} trips`} />
            <PanelBody>
              {logs.length === 0 ? (
                <div className="text-sm text-fg-subtle py-2">No trips logged yet — add one on the left.</div>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {logs.map((l) => (
                    <li key={l.id} className="py-3 flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-bg-raised text-fg-muted shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-fg truncate">{l.fromLocation} → {l.toLocation}</div>
                          {l.roundTrip && <Badge tone="muted">round trip</Badge>}
                        </div>
                        <div className="text-[11px] text-fg-subtle truncate">
                          {l.reason ?? "—"} · {new Date(l.date).toLocaleDateString()}
                          {l.business ? <span className="inline-flex items-center gap-1 ml-1"><span className={cn("dot", businessDotBg[l.business.slug])} />{l.business.name}</span> : null}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm">{l.miles.toFixed(1)} mi</div>
                        <Badge tone={l.purpose === "BUSINESS" ? "accent" : "muted"}>{l.purpose.toLowerCase()}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
          </Panel>
        </div>
      </div>
    </>
  );
}
