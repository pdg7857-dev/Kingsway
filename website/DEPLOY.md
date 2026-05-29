# Deploying the site

This is a standalone Next.js 14 (App Router) app that lives in the `website/`
subdirectory of the repo. It renders as static pages but uses `redirects()`
(the old `/platforms/*` and `/industries/*` URLs 301 to the new flat URLs), so
it needs a Node-capable host. Vercel is the natural fit and needs zero config
changes.

The single most important setting: **Root Directory = `website`**, because the
app is not at the repo root.

## Option A: Connect the GitHub repo in the Vercel dashboard (recommended, no secrets)

1. Go to https://vercel.com/new and import the GitHub repo `pdg7857-dev/Kingsway`.
2. When prompted, set **Root Directory** to `website`.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`,
   install command `npm install`, output handled automatically.
4. Set the production branch to `claude/gov-opportunity-intelligence-site-4mTJ7`
   (Project Settings, Git), or merge that branch to your default branch first.
5. Deploy. Every push to the branch then redeploys automatically.

After the first deploy, update `SITE.domain` in
`src/lib/site/config.ts` to the real domain so canonical URLs, the sitemap and
JSON-LD point at production, then redeploy.

## Option B: Deploy from the CLI with a token

From the repo root:

```bash
cd website
npm install
npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

Run from inside `website/` so the app directory is treated as the project root
(Root Directory is handled automatically). The first run links/creates the
Vercel project; subsequent runs redeploy.

## Pre-launch checklist

- [ ] Set `SITE.domain` in `src/lib/site/config.ts` to the production URL.
- [ ] Verify statistics: fill `source`/`year`/`url` and flip `verified` in
      `src/lib/site/citations.ts` so "source pending" markers resolve.
- [ ] Wire the lead forms (`src/components/site/lead-form.tsx`) to a real
      email/CRM endpoint; today they confirm client-side only.
- [ ] Point `SITE.bookingUrl` at a real calendar (Calendly/SavvyCal) or keep
      `/book`.
- [ ] Add a real domain in Vercel and confirm the 301 redirects resolve.
