# Deploy: Vercel + Supabase

End-to-end, ~10 minutes.

## 1. Supabase — provision the database

1. Go to https://supabase.com → **New project**.
   - Name: `ceo-command-os`
   - Pick a region close to you, generate a strong DB password (save it).
   - Free tier is fine.
2. Wait for it to provision (~1 min).
3. Open **Project Settings → Database → Connection string**:
   - Copy the **Transaction pooler** URL (port `6543`, `?pgbouncer=true`) → this becomes `DATABASE_URL`.
   - Copy the **Session pooler** or **Direct connection** URL (port `5432`) → this becomes `DIRECT_URL`.
   - Both URLs need the password substituted into them.

> Why two URLs? Serverless functions on Vercel reuse short-lived connections — the pooler handles that. Prisma migrations need a long-lived direct connection.

## 2. Vercel — import the repo

1. Go to https://vercel.com → **Add New… → Project**.
2. Import `pdg7857-dev/kingsway`.
3. On the import screen:
   - **Framework**: Next.js (auto-detected).
   - **Branch**: `claude/ceo-command-os-build-dCepC` (or merge to `main` first and use that).
   - **Build command**: leave default (`npm run build` — already runs `prisma generate && next build`).
   - **Root directory**: `.`
4. **Environment Variables** — paste these now (at least the required ones):

| Key                  | Value                                              | Required |
|----------------------|----------------------------------------------------|----------|
| `DATABASE_URL`       | Supabase pooler URL (port 6543, `?pgbouncer=true`) | ✅ |
| `DIRECT_URL`         | Supabase direct URL (port 5432)                    | ✅ |
| `NEXTAUTH_URL`       | `https://<your-vercel-domain>.vercel.app`          | ✅ |
| `NEXTAUTH_SECRET`    | Run `openssl rand -base64 32` and paste it         | ✅ |
| `ANTHROPIC_API_KEY`  | from console.anthropic.com                         | turns AI on |
| `GOOGLE_CLIENT_ID`   | from Google Cloud Console                          | for Gmail/Calendar |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console                        | for Gmail/Calendar |
| `SLACK_WEBHOOK_URL`  | incoming webhook URL                               | for alerts |
| `TWILIO_*`           | account sid / token / from number                  | for SMS |
| `WHATSAPP_*`         | Meta cloud API token / phone id / verify token     | for WhatsApp |
| `APP_TIMEZONE`       | `America/Los_Angeles`                              | optional |

5. Click **Deploy**.

The first deploy will succeed but the app will 500 because the database is empty. That's step 3.

## 3. Initialize the database

You have two clean options. Pick one.

### Option A — push schema from your laptop (recommended, one-time)

```bash
git pull origin claude/ceo-command-os-build-dCepC
npm install
# Paste your Supabase URLs (both!) into a local .env, then:
DATABASE_URL="<DIRECT_URL value>" npx prisma db push
DATABASE_URL="<DIRECT_URL value>" npx prisma db seed
```

> We point `DATABASE_URL` at the direct URL only for the push/seed because pgbouncer rejects prepared statements.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel link            # link the local folder to your Vercel project
vercel env pull .env   # pulls all the env vars you set in step 2
DATABASE_URL=$DIRECT_URL npx prisma db push
DATABASE_URL=$DIRECT_URL npx prisma db seed
```

Either way, when finished you should see:

```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema.
Seed complete for pdg7857@gmail.com
```

## 4. Redeploy / open the app

Vercel will already be deployed from step 2. Just open the URL.

- `/` — Master dashboard with the seeded data.
- `/login` — currently falls back to the seeded operator user (real Google OAuth requires step 5).
- `/ai` — AI Assistant. With `ANTHROPIC_API_KEY` set you'll get real responses; without it you get a deterministic fallback so the UI still works.

## 5. Connect Google (optional but recommended)

In Google Cloud Console:

1. Create OAuth client (Web).
2. Authorized redirect URI: `https://<your-vercel-domain>.vercel.app/api/auth/callback/google`
3. Enable the Calendar and Gmail APIs on the project.
4. Copy client id + secret into Vercel env vars; redeploy.

## 6. Daily briefing cron

Add a Vercel Cron in **Project Settings → Cron Jobs**:

| Path                                  | Schedule         |
|---------------------------------------|------------------|
| `/api/ai/briefing`                    | `30 13 * * *`    | (6:30am PT = 13:30 UTC) |

It POSTs to the briefing endpoint and persists a new `AIInsight` each morning.

## Troubleshooting

- **Build fails with "Can't reach database server"** — your `DATABASE_URL` is wrong or the pooler URL omits `?pgbouncer=true`. Pages with database calls are `force-dynamic` so they shouldn't run at build time; if you see this at request time, double-check the URL.
- **`prepared statement "s0" already exists`** — you're running `prisma db push` against the pooler URL. Use the `DIRECT_URL` for schema operations.
- **NextAuth: `[next-auth][error][NO_SECRET]`** — `NEXTAUTH_SECRET` isn't set.
- **Vercel timeout (10s on free)** — most routes return in <1s; the AI briefing can take 5–10s. Upgrade to Pro for 60s functions if you hit limits.
