# Government Opportunity Intelligence — Marketing Site

A **standalone** Next.js app (separate from Kingsway OS) for the public-facing
Government Opportunity Intelligence website. It deploys as its **own Vercel
project** with its **own URL**.

What it does:

- **Government Opportunity Intelligence Index™** + **Opportunity Waste
  Calculator** — computed locally (no database, no API keys) via a copy of the
  pure scoring/waste engine in `lib/oi/`.
- **Lead capture** — submissions are forwarded server-side to the main GOIP
  app's CRM (`POST /api/oi/leads`), landing as scored prospects.

## Deploy as a separate Vercel project

The marketing site lives in this `marketing/` subdirectory of the same repo.
Create a **second** Vercel project pointed at it:

1. Vercel → **Add New… → Project** → import the same Git repo
   (`pdg7857-dev/kingsway`).
2. **Root Directory:** set to `marketing`.
3. Framework preset: **Next.js** (auto-detected). Build command and output are
   the defaults.
4. **Environment variables:** add
   `MAIN_APP_URL = https://<your-kingsway-os-deployment>.vercel.app`
   (the main app, so lead submissions reach the CRM).
5. Deploy. You'll get a new URL, e.g. `goip-marketing.vercel.app`, fully
   independent of the Kingsway OS deployment.

> The original Kingsway OS project keeps deploying from the repo root and is
> unaffected — Vercel scopes each project to its Root Directory.

## Local dev

```bash
cd marketing
npm install
cp .env.example .env.local   # set MAIN_APP_URL (optional for local)
npm run dev                  # http://localhost:3001
```

The calculator works without `MAIN_APP_URL`; only lead submission needs it.

## Keeping the engine in sync

`lib/oi/{constants,platforms,waste,scoring}.ts` are copies of the main app's
engine so the public score matches the CRM exactly. If you change the scoring
model in the main app, re-copy these four files.
