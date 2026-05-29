# Government Opportunity Intelligence Report™ (GOIR)

A public, no-auth **lead magnet** that scores a company's government-contracting
maturity and returns a full intelligence report. It doubles as the primary data
collection engine and sales tool — captured prospects flow into the eProcurement
CRM pipeline.

## Flow

1. Prospect visits **`/goir`** and fills the intake form (company, website,
   industry, province/state, email — plus optional platforms, bid volume, headcount).
2. `POST /api/goir` validates input, runs the deterministic engine, optionally
   layers AI prose, persists a `GoirReport` row, and returns its id.
3. Prospect lands on **`/goir/[id]`** — the full 10-section report with the
   headline **Government Opportunity Intelligence Index™** (0–100).
4. The closing CTA (`POST /api/goir/[id]/consult`) marks the report and drops a
   `LEAD` into the operator's eProcurement pipeline.
5. The operator reviews captured demand at **`/goir-leads`** (in-app).

## Scoring engine — `src/lib/goir/`

Fully **deterministic**: identical input → identical report (only `generatedAt`
varies). A stable per-company seed (`mulberry32` over company+website+industry+region)
adds defensible variation so each report feels unique. No external dependency is
required — the engine produces every section on its own; AI is an optional layer.

| File | Responsibility |
|------|----------------|
| `types.ts` | All report/section types. |
| `regions.ts` | Province/state resolution (CA vs US), market multipliers. |
| `platforms.ts` | Platform catalog (MERX, CanadaBuys, SAM.gov, Bonfire, …) + region scope. |
| `industries.ts` | Per-sector profiles: funnel rates, effort, value ranges, buyers, platforms, peer benchmarks. |
| `engine.ts` | `runGoir(input)` → full `GoirResult` (Index + 8 categories + 10 sections). |
| `narrative.ts` | Optional Claude-written prose; returns `null` without an API key. |

### The Index (0–100)

Weighted blend of eight categories: Government Experience (.18), Award History
(.16), Opportunity Waste (.14), Platform Coverage (.14), Bid Qualification
Discipline (.12), Renewal Readiness (.10), Labor Capacity (.08), Geographic Reach
(.08). Tiers: Elite ≥95 · Advanced ≥90 · Strong ≥80 · Developing ≥70 ·
Emerging ≥60 · At Risk <60.

### Money model

Opportunity **waste** is modeled as recoverable **labor/process inefficiency**
(lands in the tens of thousands). Contract-value upside lives separately in the
**Revenue Opportunity** section so the "waste" figure stays believable.

## Schema

`GoirReport` (see `prisma/schema.prisma`) is standalone — no required FK, since
it's filled by anonymous prospects. The table is created idempotently by
`prisma/migrate.sql` (run automatically by `/api/setup`).

## Extending

- Add a sector: append to `INDUSTRIES` in `industries.ts` and (optionally)
  `BENCHMARK_INDUSTRIES`.
- Add a platform: append to `PLATFORMS` in `platforms.ts`.
- Add a region's cities: extend `CITIES` in `engine.ts`.
