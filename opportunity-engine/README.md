# Opportunity Intelligence Engine

Internal ops tool for Phil Dave, Government Opportunity Intelligence. It operationalizes the service: maintain client profiles, classification codes (UNSPSC / NIGP / GSIN / NAICS) and a keyword library; drop in a solicitation to get an AI analysis and a ranked client match; and track awarded contracts, renewal windows and performance.

> Confidential. Client profiles and solicitation documents are sensitive (PIPEDA). Scope access to the operator and keep documents private.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Prisma + Postgres · Anthropic Claude (structured tool-use). pgvector is reserved for semantic search in a later phase.

## Authentication (required before deploy)

Every route is gated by middleware. Sign-in needs two factors: a password and a
TOTP code from an authenticator app (Google Authenticator, Authy, 1Password).
Generate the secrets once:

```bash
npm run auth:setup "your-strong-password"
```

Set the printed `OPERATOR_PASSWORD`, `TOTP_SECRET` and `SESSION_SECRET` in your
environment (local `.env` or Vercel project settings) and add the TOTP secret to
your authenticator app. Auth fails closed: if these are not set, no one can sign
in. Sessions are signed HMAC cookies (12h), verified in Edge middleware.

## Run locally

### Fastest: Docker (one command)
With Docker Desktop running, from `opportunity-engine/`:
```bash
docker compose up        # builds the app + Postgres, creates tables, seeds, serves
```
Open http://localhost:3000 (opens straight in; auth is skipped locally). For the
document analyzer, create a `.env` next to `docker-compose.yml` with
`ANTHROPIC_API_KEY=sk-ant-...` before running.

### Without Docker
```bash
npm install
cp .env.example .env        # set DATABASE_URL, DIRECT_URL, ANTHROPIC_API_KEY
npm run db:push             # create tables
npm run db:seed             # sample codes, keywords, one client
npm run dev                 # http://localhost:3000
```

## What works now (phases 1-2 + the core of 3-5)
- **Clients** with coverage, value range, clearances, attached codes and keywords.
- **Code registry** (UNSPSC/NIGP/GSIN/NAICS) with CSV import and search.
- **Keyword library** with synonyms and weights.
- **Analyze**: paste a solicitation, Claude returns a structured `DocumentAnalysis`
  (summary, scope, mandatory qualifications, evaluation, dates, codes, estimated
  value, red flags, page-cited sources), then the **matching engine** ranks clients
  with a reason and any blockers.
- **Awards & renewals**: add or CSV-import awarded contracts; projected re-bid
  window is computed (`endDate - RENEWAL_LEAD_MONTHS`, estimated from term when the
  end date is missing) and surfaced in an "Upcoming renewals" queue.
- **Performance**: log per-client outcomes (bid / win / incumbent displaced) and
  see surfaced→bid→win rates and value won.

## Importing CanadaBuys awards (large files)

The in-app **CanadaBuys import** page handles small CSVs. For full exports
(the award/contract-history files are ~90 MB and hundreds of thousands of
physical lines), use the streaming CLI importer, which has no upload limit:

```bash
# Preview the mapping and counts without writing anything (no DB needed):
npx tsx scripts/import-awards.ts ./awards2023.csv --dry-run

# Import contracts worth >= $25k that have dates, into the database:
npx tsx scripts/import-awards.ts ./awards2023.csv --min-value=25000 --require-dates
```

Options: `--dry-run`, `--min-value=N`, `--require-dates`, `--no-dedupe`
(default keeps the latest amendment per contract number), `--limit=N`.

The column mapper (`src/lib/canadabuys.ts`) is validated against the real
CanadaBuys award schema (compound bilingual headers like
`title-titre-eng`, `supplierLegalName-nomLegalFournisseur-eng`,
`contractAwardDate-dateAttributionContrat`). Contract value is taken as the
larger of `contractAmount` and `totalContractValue` (entities populate one or
the other). csv-parse handles the embedded newlines in address/description
fields, so record counts are correct.

## Semantic search (#8, optional)

Finds similar past contracts by meaning (pgvector + Voyage AI embeddings). It's
opt-in and non-destructive: nothing changes until you enable it.

1. **Give Postgres pgvector.** To keep existing data, install it into the running
   db container (no data loss):
   ```bash
   docker compose exec db sh -c "apt-get update && apt-get install -y postgresql-16-pgvector"
   ```
   (For a fresh setup you can instead change the db image to `pgvector/pgvector:pg16`.)
2. **Add a key** to `.env`: `VOYAGE_API_KEY=...` (or `EMBEDDINGS_PROVIDER=openai` + `OPENAI_API_KEY`).
3. **Build the vectors** (self-creates the extension, columns and index):
   ```bash
   docker compose exec app npx tsx scripts/embed.ts
   ```
Re-run `embed.ts` after importing new awards/opportunities. The "Similar past
contracts (semantic)" panel then appears on each analyzed tender.

## Architecture
- `src/lib/analysis-schema.ts` — Zod schema for the AI output.
- `src/lib/analysis-prompt.ts` — system instructions + Claude tool definition.
- `src/lib/anthropic.ts` — runs the analysis and re-validates the result.
- `src/lib/matching.ts` — pure scoring engine (codes 35, keywords 35, value 20, geography 10; hard geography filter; blockers).
- `src/lib/renewals.ts` — renewal forecasting.
- `prisma/schema.prisma` — full data model.

## Next phases (not yet built)
1. PDF/DOCX upload + text extraction + OCR fallback (today: paste text).
2. pgvector embeddings for semantic keyword/scope matching.
3. CanadaBuys open-data importer (tender + award feeds); pluggable per-source importers for MERX and others.
4. File vault storage (Supabase Storage / S3) for original documents.
5. Notifications (renewal window, new high-confidence match, closing soon).
6. NextAuth + a read-only client portal (the `Client`/role model is reserved for it).
