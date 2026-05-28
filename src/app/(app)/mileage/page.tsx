import { Topbar } from "@/components/layout/topbar";
import { Panel, PanelHeader, PanelBody } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { MileageForm } from "@/components/mileage/mileage-form";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fmtCents, businessDotBg, cn } from "@/lib/utils";
import { Car, MapPin, Route, Train, Plane } from "lucide-react";

export const dynamic = "force-dynamic";

// distance helper: prefer km; fall back to legacy miles→km
function km(l: { distanceKm: number | null; miles: number }) {
  return l.distanceKm ?? l.miles * 1.60934;
}

const MODE_LABEL: Record<string, string> = {
  CAR: "Car", TRAIN: "Train", PLANE: "Plane", UBER: "Uber", TAXI: "Taxi", RIDESHARE: "Rideshare", BUS: "Bus", OTHER: "Other",
};

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
  const businessKm = ytd.filter((l) => l.purpose === "BUSINESS").reduce((s, l) => s + km(l), 0);
  const personalKm = ytd.filter((l) => l.purpose === "PERSONAL").reduce((s, l) => s + km(l), 0);
  const carDeductionCents = Math.round(
    ytd.filter((l) => l.purpose === "BUSINESS" && (l.transportMode === "CAR")).reduce((s, l) => s + km(l) * (l.ratePerKm ?? 0.43), 0) * 100
  );
  const faresCents = ytd.filter((l) => l.purpose === "BUSINESS").reduce((s, l) => s + (l.costCents ?? 0), 0);

  // transport mode breakdown (YTD)
  const modeMap = new Map<string, { km: number; fares: number; trips: number }>();
  ytd.forEach((l) => {
    const m = modeMap.get(l.transportMode) ?? { km: 0, fares: 0, trips: 0 };
    m.km += km(l); m.fares += l.costCents ?? 0; m.trips += 1;
    modeMap.set(l.transportMode, m);
  });

  return (
    <>
      <Topbar title="Mileage & Travel" subtitle="Car km + train/plane/Uber fares · business vs personal · deduction estimate" />
      <div className="px-4 lg:px-6 py-4 space-y-4">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Business · YTD" value={`${businessKm.toFixed(0)} km`} tone="accent" icon={<Route className="h-4 w-4" />} />
          <KpiCard label="Personal · YTD" value={`${personalKm.toFixed(0)} km`} icon={<Car className="h-4 w-4" />} />
          <KpiCard label="Car deduction · YTD" value={fmtCents(carDeductionCents)} hint="business car km × rate" tone="success" />
          <KpiCard label="Fares · YTD" value={fmtCents(faresCents)} hint="train/plane/Uber/taxi" tone="violet" icon={<Plane className="h-4 w-4" />} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-1">
            <PanelHeader title="Log a trip" />
            <PanelBody>
              <MileageForm />
            </PanelBody>
          </Panel>

          <div className="lg:col-span-2 space-y-4">
            <Panel>
              <PanelHeader title="By transport mode · YTD" />
              <PanelBody>
                {modeMap.size === 0 ? (
                  <div className="text-sm text-fg-subtle py-2">No trips this year yet.</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[...modeMap.entries()].map(([m, v]) => (
                      <div key={m} className="rounded-xl border border-border-subtle bg-bg-raised/40 p-3">
                        <div className="text-xs text-fg-subtle">{MODE_LABEL[m] ?? m}</div>
                        <div className="mt-1 font-mono text-sm text-fg">{v.km.toFixed(0)} km</div>
                        <div className="text-[11px] text-fg-subtle">{v.trips} trips{v.fares ? ` · ${fmtCents(v.fares)}` : ""}</div>
                      </div>
                    ))}
                  </div>
                )}
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader title="Trip history" hint={`${logs.length} trips`} />
              <PanelBody>
                {logs.length === 0 ? (
                  <div className="text-sm text-fg-subtle py-2">No trips logged yet — add one on the left.</div>
                ) : (
                  <ul className="divide-y divide-border-subtle">
                    {logs.map((l) => (
                      <li key={l.id} className="py-3 flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-bg-raised text-fg-muted shrink-0">
                          {l.transportMode === "TRAIN" ? <Train className="h-4 w-4" /> : l.transportMode === "PLANE" ? <Plane className="h-4 w-4" /> : l.transportMode === "CAR" ? <Car className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-fg truncate">{l.fromLocation} → {l.toLocation}</div>
                            {l.roundTrip && <Badge tone="muted">×2</Badge>}
                          </div>
                          <div className="text-[11px] text-fg-subtle truncate">
                            {MODE_LABEL[l.transportMode] ?? l.transportMode} · {l.reason ?? "—"} · {new Date(l.date).toLocaleDateString()}
                            {l.business ? <span className="inline-flex items-center gap-1 ml-1"><span className={cn("dot", businessDotBg[l.business.slug])} />{l.business.name}</span> : null}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono text-sm">{km(l).toFixed(0)} km</div>
                          {l.costCents ? <div className="text-[11px] text-violet font-mono">{fmtCents(l.costCents)}</div> : null}
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
      </div>
    </>
  );
}
