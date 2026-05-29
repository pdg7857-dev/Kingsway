import { WasteCalculator } from "@/components/oi/waste-calculator";

export const dynamic = "force-dynamic";

export default function WastePage() {
  return (
    <div className="px-4 lg:px-6 py-4 space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Opportunity Waste Calculator™</h1>
        <p className="text-xs text-fg-subtle mt-0.5">Estimate how much a company burns reviewing opportunities that never become bids — the hook for every conversation.</p>
      </div>
      <WasteCalculator />
    </div>
  );
}
