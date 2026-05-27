import { relTime, cn, businessDotBg } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import type { CalendarEvent, Business } from "@prisma/client";

export function EventList({ events }: { events: (CalendarEvent & { business?: Business | null })[] }) {
  if (!events.length) return <div className="text-sm text-fg-subtle py-2">Nothing on the calendar.</div>;
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li key={e.id} className="flex gap-3 rounded-lg border border-border-subtle bg-bg-raised/30 p-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-bg-raised text-fg-muted">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {e.business ? <span className={cn("dot", businessDotBg[e.business.slug])} /> : null}
              <div className="text-sm text-fg truncate">{e.title}</div>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-subtle">
              <span>{relTime(e.startAt)}</span>
              {e.location ? (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {e.location}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
