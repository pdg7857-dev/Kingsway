# Government Opportunity Intelligence Platform (GOIP)

The operating system behind a Government Opportunity Intelligence business. It
turns a list of raw contacts into a ranked book of prospects (Tier A/B/C/D) by
**likelihood to become recurring clients**, and answers — for any company — the
13 questions that drive an outreach decision.

> Core thesis: don't optimise for *finding more opportunities*. Optimise for
> *reducing opportunity waste*. Companies already see plenty of bids; estimators
> and proposal teams are overloaded. Qualification discipline is the product.

## Where it lives

- **Navigation:** sidebar → *Opportunity Intelligence* (also in the command
  palette and mobile menu).
- **Routes:** `/oi` (CEO dashboard), `/oi/prospects`, `/oi/prospects/[id]`,
  `/oi/renewals`, `/oi/buyers`, `/oi/platforms`, `/oi/waste`.
- **Library:** `src/lib/oi/*` (pure, testable engines) and `src/lib/data/oi.ts`
  (dashboard aggregation).
- **APIs:** `src/app/api/oi/*`.

## Modules

| # | Module | Code | Output |
|---|--------|------|--------|
| 1 | Prospect Intelligence | `ai.ts` `researchProspect()` | Company intelligence profile |
| 2 | Award Intelligence | `awards.ts`, `api/oi/awards` | Award profile + rollups, supplier matching |
| 3 | Buyer Intelligence | `Buyer` model, `api/oi/buyers` | Buyer profiles, what/how-often/from-whom |
| 4 | Renewal Intelligence | `awards.ts` `predictRenewal()` | Rebid windows (12/9/6/3mo, 30d) + briefs |
| 5 | Platform Intelligence | `platforms.ts` | Primary/secondary platform relevance |
| 6 | **Opportunity Waste Engine** | `waste.ts` | $/yr wasted, cost drivers, savings, ROI |
| 7 | **GOII Index™** | `scoring.ts` | The 0-100 proprietary score → Tier A/B/C/D |
| 8 | AI Outreach | `ai.ts` `generateOutreach()` | Cold email, LinkedIn, call, Loom, follow-up |

## The GOII Index™ (Module 7)

A deterministic, explainable 0-100 score. Fixed component weights:

| Component | Weight |
|-----------|-------:|
| Government Experience | 20 |
| Award History | 20 |
| Opportunity Waste | 20 |
| Labor Scarcity | 15 |
| Platform Complexity | 10 |
| Geographic Complexity | 5 |
| Renewal Opportunity | 5 |
| Revenue Potential | 5 |

Bands → tiers: `90-100 Immediate Outreach` / `80-89 High Priority` = **A**,
`70-79 Warm` = **B**, `60-69 Nurture` = **C**, `<60 Low` = **D**.

Claude *fills the inputs* (research); the score itself is transparent and stable
so it can power the website, reports, and lead scoring without surprises.

## Opportunity Waste Engine (Module 6)

Models the funnel — opportunities reviewed → qualified → pursued → lost — and
prices the wasted labour across five cost lines (portal triage, estimator time,
lost-bid proposals, weak qualification, management overhead). Produces the
headline outreach hook:

> "Based on our analysis, your team may be spending **$42,000-$83,000** annually
> reviewing opportunities across MERX, Bonfire and bids&tenders that never
> become bids."

It is also exposed as a standalone lead magnet at `/oi/waste`
(POST `/api/oi/waste`).

## Data flow

```
Import / Add  →  Research (Claude)  →  Award match + rollup  →  GOII Index™ + Waste
      │                                                                │
      └────────────────────  Prospect (scored, tiered)  ──────────────┘
                                       │
        ┌──────────────┬──────────────┼───────────────┬───────────────┐
   Outreach        Account plan    Renewals        Buyers          Dashboard
```

Every write that changes a scoring input re-runs `enrichAndScore()`
(`src/lib/oi/pipeline.ts`) so the tier and index stay accurate.

## Provisioning

New tables (`Prospect`, `GovAward`, `Buyer`, `Renewal`, `ProspectOutreach`) are
created idempotently by `prisma/migrate.sql`, which `/api/setup` applies after
`init.sql`. Regenerate the embedded SQL after schema changes:

```bash
node scripts/gen-init-sql.js
```

The seed (`src/lib/oi/seed.ts`) loads a demonstrative book of 10 prospects,
3 buyers, 9 matched awards and predicted renewals. It self-skips once prospects
exist, so re-running setup is safe.

## AI degradation

Every Claude call (`src/lib/oi/ai.ts`) falls back to a research-driven template
when `ANTHROPIC_API_KEY` is missing, so the platform is fully usable offline and
in demos.
