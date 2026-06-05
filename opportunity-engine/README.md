# Opportunity Intelligence Engine

Internal ops tool for Phil Dave, Government Opportunity Intelligence. It operationalizes the service: maintain client profiles, classification codes (UNSPSC / NIGP / GSIN / NAICS) and a keyword library; drop in a solicitation to get an AI analysis and a ranked client match; and track awarded contracts, renewal windows and performance.

> Confidential. Client profiles and solicitation documents are sensitive (PIPEDA). Scope access to the operator and keep documents private.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Prisma + Postgres · Anthropic Claude (structured tool-use). pgvector is reserved for semantic search in a later phase.

## Run locally
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
