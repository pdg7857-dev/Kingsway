# Government Opportunity Intelligence Report™ (GOIR)

A public, no-auth **lead magnet** that scores a company's government-contracting
maturity and returns a full intelligence report. It doubles as the primary data
collection engine and sales tool — captured prospects flow into the eProcurement
CRM pipeline.

## Two deployments, one database

The public presence is the **marketing site + report combined** in the
**`website/`** folder, deployed as its **own Vercel project** (Root Directory =
`website`). The interactive report lives on that same site at **`/report`** — a
dark "tool" surface inside the light marketing shell — so there is one domain and
no cross-site hops. It shares the Kingsway OS database, so captured reports and
leads land in the CRM. Kingsway OS keeps only the internal admin view.

| | App | Key routes |
|---|---|---|
| **Public site** (`website/`) | marketing SEO site + report, own Vercel project | `/` + ~177 SEO pages, `/report` (intake), `/report/[id]` (report), `POST /api/goir`, `POST /api/goir/[id]/consult` |
| **Kingsway OS** (root) | the main app | `/goir-leads` (admin view of captured reports/leads) |

See [`website/README.md`](../website/README.md) for Vercel setup. Link the OS to
the public site with `NEXT_PUBLIC_GOIR_URL` (the in-app leads view opens
`<that>/report/<id>`).

## Flow (manual delivery with an access code)

1. SEO/money pages funnel to the GOIR landing page, whose CTA opens **`/report`**
   — the intake form (company, website, industry, province/state, email, name,
   phone, plus optional platforms, bid volume, headcount).
2. `POST /api/goir` validates input, runs the deterministic engine, optionally
   layers AI prose, persists a `GoirReport` (status `SUBMITTED`) with a unique
   **access code**, and emails the prospect a *receipt* (not the report). The
   prospect sees a "delivered within 24 hours" confirmation — no instant access.
3. The operator reviews each request at **`/goir-leads`** in Kingsway OS, preps
   the research, then calls / emails / texts the prospect their access code (the
   leads view shows the code and a ready-to-send `…/report/<id>?code=<code>` link).
4. The prospect enters the code at **`/access`** (or opens the link) → the report
   is shown at **`/report/[id]?code=<code>`**. Wrong/missing code → a locked gate.
   First view flips status to `VIEWED`. No account is ever created.
5. The closing CTA (`POST /api/goir/[id]/consult`) drops a `LEAD` into the
   operator's eProcurement pipeline.

The `GoirReport` table is provisioned by the public site's own token-gated
`GET /api/setup?token=<SETUP_TOKEN>` (or Kingsway OS's `/api/setup`).

## Scoring engine — `website/src/lib/goir/`

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

`GoirReport` lives in the shared schema (`prisma/schema.prisma` in Kingsway OS;
mirrored in `website/prisma/schema.prisma`). It's standalone — no required FK,
since it's filled by anonymous prospects. The table is created idempotently by
Kingsway OS's `prisma/migrate.sql` (run automatically by `/api/setup`); the public
site never runs migrations.

## Extending (edit in `website/src/lib/goir/`)

- Add a sector: append to `INDUSTRIES` in `industries.ts` and (optionally)
  `BENCHMARK_INDUSTRIES`.
- Add a platform: append to `PLATFORMS` in `platforms.ts`.
- Add a region's cities: extend `CITIES` in `engine.ts`.

> Note: the OS keeps a copy of `industries.ts` only for the `/goir-leads` label
> lookup. All other GOIR logic lives in the `website/` app.
