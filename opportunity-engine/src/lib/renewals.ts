// Renewal forecasting for awarded contracts.
//
// projected re-bid window = endDate - RENEWAL_LEAD_MONTHS.
// When the end date is not stated, estimate it from the award/start date plus
// the contract term (or a category default), and flag it as estimated.

export const RENEWAL_LEAD_MONTHS = Number(process.env.RENEWAL_LEAD_MONTHS ?? 5);

// Reasonable default contract lengths in months when a term is not stated.
export const DEFAULT_TERM_MONTHS = 36;

function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

export type RenewalForecast = {
  endDate: Date | null;
  endEstimated: boolean;
  rebidWindow: Date | null;
  status: "active" | "expiring" | "rebid_open" | "closed";
};

export function forecastRenewal(input: {
  awardDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  initialTermMonths?: number | null;
  optionYears?: number | null;
  now?: Date;
}): RenewalForecast {
  const now = input.now ?? new Date();

  let endDate = input.endDate ?? null;
  let endEstimated = false;

  if (!endDate) {
    const anchor = input.startDate ?? input.awardDate ?? null;
    if (anchor) {
      const term =
        (input.initialTermMonths ?? DEFAULT_TERM_MONTHS) +
        (input.optionYears ?? 0) * 12;
      endDate = addMonths(anchor, term);
      endEstimated = true;
    }
  }

  if (!endDate) {
    return { endDate: null, endEstimated: false, rebidWindow: null, status: "active" };
  }

  const rebidWindow = addMonths(endDate, -RENEWAL_LEAD_MONTHS);

  let status: RenewalForecast["status"] = "active";
  if (now >= endDate) status = "closed";
  else if (now >= rebidWindow) status = "rebid_open";
  else if (addMonths(now, RENEWAL_LEAD_MONTHS + 3) >= endDate) status = "expiring";

  return { endDate, endEstimated, rebidWindow, status };
}
