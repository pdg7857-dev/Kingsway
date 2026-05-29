# Government Opportunity Intelligence Report™ — standalone site

This is the **public lead-magnet site**, deployed as its own Vercel project,
separate from Kingsway OS. It shares the same database, so every report and
consultation request flows straight into the Kingsway OS eProcurement pipeline
(visible in the OS at `/goir-leads`).

| Route | Purpose |
|-------|---------|
| `/` | Landing page + intake form |
| `/r/[id]` | The generated report |
| `POST /api/goir` | Score, persist, email the report link |
| `POST /api/goir/[id]/consult` | Capture a consultation request as a CRM lead |

The scoring engine and report UI live in `src/lib/goir` and `src/components/goir`.
See `../docs/GOIR.md` for the engine design.

## Deploy as a separate Vercel project

1. In Vercel, **New Project → import this same GitHub repo**.
2. Set **Root Directory** to `goir`.
3. Framework preset: **Next.js** (auto-detected). Build command is
   `prisma generate && next build` (from this folder's `package.json`).
4. Add environment variables (see `.env.example`):
   - `DATABASE_URL` / `DIRECT_URL` — **the same values as the Kingsway OS project**
     so leads share one database.
   - `NEXT_PUBLIC_SITE_URL` — this site's public URL.
   - `ANTHROPIC_API_KEY` — optional (AI narrative layer).
   - `RESEND_API_KEY` + `EMAIL_FROM` — optional (emails the report link).
5. Deploy. The `GoirReport` table is created by the Kingsway OS `/api/setup`
   endpoint — this app only reads/writes it and never runs migrations.

## Local dev

```bash
cd goir
npm install
cp .env.example .env   # point DATABASE_URL at your dev DB
npm run dev            # http://localhost:3000
```
