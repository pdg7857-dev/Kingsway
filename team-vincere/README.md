# Team Vincere — Website

> *Vincere.* To conquer. An application-only coaching house for elite bodybuilding.

A hyper-exclusive, luxury dark-mood **multi-page** marketing site. Obsidian & brushed chrome, editorial serif paired with industrial uppercase sans, cinematic scroll. Built as **zero-dependency static HTML/CSS/JS**: no build step, no framework, deploys anywhere.

## Structure

The site is multi-page, sharing one stylesheet and one script. The nav, footer, and free-ebook funnel (sticky tab + popup) are injected on every page by `assets/js/site.js`, so they stay in sync.

| Page | What it is |
|---|---|
| `index.html` | Home. Hero, credibility bar, creed, testimonial, the software/app showcase, before/after proof, a "three ways in" card row, an About teaser, and the free-ebook capture. |
| `about.html` | Coach Phil Dave's full story, credentials, a photo gallery, and the creed. |
| `coaching.html` | The offer, the **two tiers** (Vincere Standard / Vincere Elite), the mindset section, how selection works, and the FAQ. |
| `programs.html` | Program cards: the free ebook, the 12-week guide, 1:1 coaching, and a coming-soon challenge. |
| `shop.html` | Product cards: the guide, the ebook, plus coming-soon apparel and supplements. |
| `articles.html` | Blog index scaffold with starter post cards (fill in real posts later). |
| `ebook.html` | The free *Vincere Training Guide* lead-magnet page (instant download). |
| `calculator.html` | The free macro calculator (the guide's exact method). |
| `welcome.html` | Post-purchase page Stripe redirects to; walks the buyer into the app. |
| `guide.html` | The paid 12-Week Guide product page. |
| `apply.html` | The multi-step application form. |
| `assets/css/vincere.css` | The entire design system + components (shared by all pages). |
| `assets/js/site.js` | Shared nav/footer/funnel injection, all behaviors, and the **CONFIG block** (see below). |

## Configure it (one place)

Open `assets/js/site.js` and set the three values at the top:

```js
var FORM_ENDPOINT = "";  // Google Apps Script /exec URL (applications + leads)
var STRIPE_LINK   = "";  // Stripe Payment Link for the 12-Week program
var MARK_VIDEO    = "https://youtube.com/shorts/ohGumv4unZo"; // testimonial
var APP_LINK      = "";  // your Vincere app URL (signup/login) for "join / track in the app" CTAs
```

**The two products (the actual books):**
- **Free lead magnet:** *The Vincere Training Guide* (coaching philosophy). Delivered as an **instant download** (`assets/the-vincere-training-guide.pdf`) the moment someone submits the email form, and the lead is recorded to the sheet.
- **Paid ($97):** *The Vincere Daily 12-Week Transformation*. Sold via Stripe. After payment, buyers land on `welcome.html` and are pushed to **join the app**, where you set up their plan personally (the paid PDF is never hosted publicly).

That's the only place these live now, and every page picks them up.

## View it

Because pages link each other, view it through a local server (opening a bare file breaks nav):
```bash
cd team-vincere
python3 -m http.server 8080
# open http://localhost:8080
```

Optional local server (nicer for testing):
```bash
cd team-vincere
python3 -m http.server 8080
# open http://localhost:8080
```

## Design system

- **Palette:** `--obsidian #0A0A0B` ground · `--carbon`/`--graphite` surfaces · `--platinum #F4F5F7` headlines · `--silver #C4C7CE` body · `--steel #7A7C84` muted · brushed-chrome gradient for accent words. Single-theme dark — a deliberate commitment to one cinematic world.
- **Type:** editorial serif (Vincere wordmark, manifesto, Latin motif) against heavy uppercase sans for headlines. Uses robust system-font stacks so it renders anywhere with no external font requests. *(To install premium faces — e.g. Canela + a condensed grotesque — self-host the `.woff2` files and add `@font-face` rules; then update `--serif` / `--sans`.)*
- **Motion:** scroll reveals, chrome shimmer, count-up stats, custom silver cursor, draggable before/after slider, multi-step form. All gated behind `prefers-reduced-motion`.
- **Voice:** elite & refined — quiet power, prestige, scarcity stated as fact. Never hype.

## Photography

Real competition and transformation photos are wired in and optimized under `assets/img/` (resized, progressive JPEG, rotation-corrected). They're deliberately treated with desaturation + contrast in CSS so colourful event backdrops read as cohesive black-and-silver — originals are untouched, all treatment is CSS `filter`, so swapping is trivial.

| File | Used in |
|---|---|
| `hero.jpg` | Hero background — coach on the spotlit stage |
| `coaching-card.jpg` | Home "Train with me directly" feature card — in the gym |
| `ebook-card.jpg` | Home "three ways in" — the free-ebook card |
| `guide-card.jpg` | Home "three ways in" — the 12-week guide card |
| `coach-bicep.jpg` | About gallery — front double-bicep on stage |
| `podium.jpg` | About — the 2025 Atlantic Championships podium win |
| `coach-front.jpg` | Mindset section — "led from the front" |
| `before.jpg` / `after.jpg` | Proof — the 161→131 lb transformation (split from the composite, burned-in labels cropped, replaced with typographic labels) |
| `client-stage.jpg` | Proof — athlete's debut stage pose |
| `client-medal.jpg` | Proof — "first show, first hardware" |
| `band-bg.jpg` | Exclusivity band — darkened back-pose backdrop |

To swap any photo: drop a replacement at the same path (keep it a similar aspect ratio) or edit the `src` in `index.html`. Tune the look via the `filter` / `object-position` on `.hero-img`, `.mind-vis img`, `.ba-pair .half img`, `.ba-stage img`, `.band-img`.

**Still a hand-built mockup (not a photo):** the software dashboard (`.dash` block) — replace with real product screenshots as the platform ships.

**Grow the wall:** the proof section features one athlete (Mark), with copy ("room reserved for the next") and structure that scale. Duplicate the stage/medal blocks as the roster grows, and update the Instagram / YouTube links in the footer.

## Mark's testimonial video

The testimonial section (on the home page) is wired for a YouTube video (a vertical Short by default). To make it play: open `assets/js/site.js`, find `var MARK_VIDEO` in the CONFIG block, and paste Mark's YouTube link or video ID between the quotes. Full URLs (`youtube.com/shorts/…`, `youtu.be/…`, `watch?v=…`) and bare 11-character IDs all work. Until a link is set, the section shows a "Video coming soon" poster. *(The video is a live YouTube embed, so it plays on the deployed site; it won't load inside the sandboxed artifact preview.)*

## Applications to a Google Sheet

Each submitted application is posted to a Google Sheet you own, where you can read, filter, and download it (as CSV or Excel) any time. No server to run. The applicant still gets the "DM me on Instagram" confirmation as the human touchpoint, so a submission never falls through the cracks.

**One-time setup (about 5 minutes):**

1. Create a new **Google Sheet** (this becomes your applications database).
2. In that sheet: **Extensions to Apps Script**. Delete any starter code, paste the contents of [`google-apps-script.gs`](./google-apps-script.gs), and **Save**.
3. **Deploy to New deployment**. Choose type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, authorize when prompted, and **copy the Web app URL** (it ends in `/exec`).
4. Open `assets/js/site.js`, find `var FORM_ENDPOINT = ""` in the CONFIG block at the top, and paste the URL between the quotes. This one endpoint handles BOTH coaching applications and free-ebook leads across every page.
5. Commit and redeploy. Submit a test application and confirm a row lands in the sheet.

The script auto-creates two tabs in your sheet: **Applications** (timestamp, name, email, phone, Instagram, age, years training, competed, goal/timeline, training days, investment, why) and **Leads** (timestamp, name, email, source) for the free-ebook opt-ins. To download either: **File to Download to CSV** (or Excel).

Until `FORM_ENDPOINT` is set, both forms still work and show their confirmation, they just don't record anything.

## Free ebook + 12-week guide (the funnel)

**The free "Vincere Training Guide" (lead magnet).** Your coaching-philosophy guide, delivered as an **instant download** (`assets/the-vincere-training-guide.pdf`). Name + email sign-ups post to the **Leads** tab of the same sheet (same `FORM_ENDPOINT`), then the visitor gets a "download the guide" button. It appears in three places: a dedicated page/section (`ebook.html`), a sticky "Free Guide" bar (always visible on mobile, and slides in on scroll on desktop) that scrolls to the on-page form or opens the popup, and a one-time popup on pages without an inline form. To swap in an updated PDF, replace `assets/the-vincere-training-guide.pdf` (keep the filename) — every download link points there. *(The hosted copy is a compressed, web-optimized render of the source PDF.)*

**The paid Vincere Daily 12-Week Transformation.** Sold via a Stripe Payment Link, delivered inside your app:
1. Create the product as a **Payment Link** in your Stripe dashboard (price $97, or edit the `.guide-price` block to match).
2. Open `assets/js/site.js`, paste your Payment Link URL into `var STRIPE_LINK`. Every "Get the program" button activates automatically (until then they read "Coming soon").
3. In the Payment Link's settings, set **After payment to Redirect** to your site's `.../welcome.html`. That page confirms the purchase and walks the buyer into the app.
4. Set `var APP_LINK` to your app's signup/login URL. The `welcome.html` "Join the app" button and the calculator's "track it in the app" link point there. If `APP_LINK` is blank, `welcome.html` shows a "watch your email, I'll send your invite" message instead, so you can invite buyers manually.
5. The paid PDF is **not** hosted on the site. You deliver and assign it inside the app after they join, so it can't be downloaded without paying.

**The macro calculator (`calculator.html`).** The free tool the guide points readers to (`teamvincere.ca/calculator`). It runs the guide's exact method (Mifflin-St Jeor, protein 1 g/lb, fat 0.4 g/lb, carbs tapering across the four phases) and outputs training-day and rest-day macros plus the cardio ramp. It also captures leads (offering the free guide) and links to the paid program and the app.

## Deploy to Vercel

The site is static, so there's no build step.

1. Push this repo to GitHub (already done if you're reading this on the branch).
2. At [vercel.com](https://vercel.com), **Add New to Project**, import the repo.
3. In the import settings:
   - **Root Directory:** `team-vincere`
   - **Framework Preset:** Other
   - **Build Command:** leave empty
   - **Output Directory:** leave as default (`.`)
4. **Deploy.** Your site goes live at a `*.vercel.app` URL; add a custom domain in **Settings to Domains**.

That's it, no environment variables, no database. (Set `FORM_ENDPOINT` and `MARK_VIDEO` before deploying so the live site has the sheet and video wired in.)

**Link previews (favicon + share image):** a brushed-chrome "V" favicon (`assets/favicon.svg` + PNG fallbacks) and a branded 1200x630 share image (`assets/og-image.jpg`) are already wired in. The `og:image` uses a root-relative path, which most platforms resolve. For rock-solid unfurling everywhere (iMessage, Slack, WhatsApp), once your domain is set, change the four `og:image` / `twitter:image` tags in `index.html` to the full absolute URL, e.g. `https://yourdomain.com/assets/og-image.jpg`.

---

Built for Team Vincere. Black & silver. Champion vision. By application only.
