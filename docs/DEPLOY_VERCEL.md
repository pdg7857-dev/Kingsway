# Deploy from your phone — Vercel + Supabase

End-to-end, ~15 minutes, no laptop needed. Every step is a tap-and-paste in a mobile browser.

> **Tip:** keep this guide open in one tab. Open Supabase, Vercel, and GitHub in their own tabs (or use the mobile apps).

---

## Step 1 · Supabase (the database)

1. Open **supabase.com** and sign in (use Google).
2. Tap **New project**.
   - Name: `ceo-command-os`
   - Database password: tap the generate button → **copy the password somewhere safe**.
   - Region: pick one near you.
   - Plan: Free.
3. Wait ~60 seconds for provisioning.
4. Tap **Project Settings** (gear icon) → **Database** → scroll to **Connection string**.
5. You need to copy **two** different strings:
   - **Transaction pooler** (port `6543`) → this is your `DATABASE_URL`.
     - Toggle "Display connection pooler" if needed.
     - Make sure the URL ends with `?pgbouncer=true` (Supabase usually adds it; if not, append it).
   - **Session pooler or Direct connection** (port `5432`) → this is your `DIRECT_URL`.
6. In each string, replace `[YOUR-PASSWORD]` with the password you saved.

Paste both URLs into a note for the next step.

---

## Step 2 · Vercel (the app)

1. Open **vercel.com** and sign in with GitHub.
2. Tap **Add New… → Project**.
3. Find `pdg7857-dev/kingsway` in the list → tap **Import**.
4. On the configure screen:
   - Framework: Next.js (auto).
   - Root directory: leave default.
   - Branch (top-right): switch to **`claude/ceo-command-os-build-dCepC`** if it's not on `main` yet.
5. Expand **Environment Variables** and add these. Paste the value for each:

| Name                | Value                                                              |
|---------------------|--------------------------------------------------------------------|
| `DATABASE_URL`      | Supabase **pooler** URL (port 6543, ends with `?pgbouncer=true`)   |
| `DIRECT_URL`        | Supabase **direct/session** URL (port 5432)                        |
| `NEXTAUTH_URL`      | leave blank for now; come back after deploy                        |
| `NEXTAUTH_SECRET`   | any long random string — use a password generator app, 32+ chars   |
| `SETUP_TOKEN`       | another long random string — you'll use this once in Step 4        |
| `ANTHROPIC_API_KEY` | optional, but turns the AI on (console.anthropic.com → API keys)   |

6. Tap **Deploy**. Wait ~2 minutes.

The app will deploy successfully. The pages will 500 until Step 4 (database has no tables yet).

---

## Step 3 · Set NEXTAUTH_URL

1. When the deploy finishes, Vercel shows your production URL (something like `kingsway-abc123.vercel.app`).
2. Tap your **Project → Settings → Environment Variables**.
3. Find `NEXTAUTH_URL` → tap **Edit** → set it to your full URL **with `https://`**, e.g. `https://kingsway-abc123.vercel.app`.
4. Tap **Save**.
5. Go to **Deployments** → tap the latest → tap **⋯ → Redeploy** (no need to rebuild — toggle "Use existing build cache" on).

---

## Step 4 · Run the one-time setup

In any browser tab, visit:

```
https://<your-vercel-domain>/api/setup?token=<your SETUP_TOKEN value>
```

Replace `<your-vercel-domain>` and `<your SETUP_TOKEN value>` with the actual values you set.

You should see a JSON response like:

```json
{
  "ok": true,
  "steps": [
    { "name": "schema", "ok": true, "detail": "init.sql applied" },
    { "name": "seed", "ok": true, "detail": "user + businesses + sample data" }
  ],
  "next": "Open the root URL and start using the dashboard."
}
```

What this did, in one tap:
- Created every table, enum, and index in your Supabase database (1077-line `prisma/init.sql`).
- Seeded your operator user, six businesses, sample tasks, deals, expenses, fitness clients, content items, repair tickets, inventory, ideas, automations, and a starter AI daily briefing.

**If you see "Invalid token"** — the `SETUP_TOKEN` you put in Vercel doesn't match what you put in the URL. Recheck both, no spaces.

**If you see a DB error** — your `DIRECT_URL` is wrong. Most common cause: password not substituted into the URL. Edit it in Vercel → Settings → Environment Variables, then redeploy and visit `/api/setup` again. Re-running is safe; the schema apply skips "already exists" and the seed is idempotent.

---

## Step 5 · Open the dashboard

Go to `https://<your-vercel-domain>/`. You'll land on the **Master Command** dashboard with all six businesses pre-populated.

Try these:
- `/` — master dashboard with every panel
- `/ai` — AI Assistant (set `ANTHROPIC_API_KEY` for real responses)
- `/business/lexus`, `/business/fitness`, etc.
- `/tasks`, `/finance`, `/pipeline`, `/inventory`, `/ideas`

---

## Step 6 (optional) · Daily briefing cron

In Vercel: **Project → Settings → Cron Jobs → Add**.

| Path                | Schedule (UTC) | Equivalent |
|---------------------|----------------|------------|
| `/api/ai/briefing`  | `30 13 * * *`  | 6:30 am PT |

Vercel will hit that endpoint every morning and persist a fresh briefing.

---

## Step 7 (optional) · Google sign-in

If you want real Google auth (and Gmail/Calendar later):

1. In Google Cloud Console → **OAuth consent screen** → set up External app.
2. **Credentials → Create OAuth client → Web**.
3. Authorized redirect URI: `https://<your-vercel-domain>/api/auth/callback/google`
4. Enable **Google Calendar API** and **Gmail API** for the project.
5. Copy Client ID + Secret into Vercel env (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
6. Redeploy.

You can do all of this from your phone too — the Google Cloud Console mobile site works.

---

## Common gotchas

| Symptom                                            | Fix |
|----------------------------------------------------|-----|
| `Invalid token` on `/api/setup`                    | `SETUP_TOKEN` env var doesn't match the `?token=` you sent. |
| `Can't reach database server`                      | Wrong `DIRECT_URL` (or password not substituted). |
| `prepared statement "s0" already exists`           | You set `DATABASE_URL` to a non-pooler URL, or omitted `?pgbouncer=true`. |
| Dashboard loads but everything is empty            | Seed didn't run. Re-hit `/api/setup` — it's safe to re-run. |
| AI panel says "AI key not configured"              | Add `ANTHROPIC_API_KEY` in Vercel env and redeploy. |
| `/login` only shows "Continue with Google" disabled| Add `GOOGLE_CLIENT_ID/SECRET` (Step 7) or just tap "Enter dashboard" — dev fallback uses the seeded operator. |

---

## After it works

- Want to **disable the setup endpoint?** Delete `SETUP_TOKEN` from Vercel env and redeploy.
- Want to **re-seed** (e.g., after schema changes)? Set a new `SETUP_TOKEN`, redeploy, hit the endpoint.
- Want to **add an integration** (Slack/SMS/WhatsApp)? Add the env vars from `.env.example`, redeploy. Adapters in `src/lib/integrations/*.ts` light up automatically.
