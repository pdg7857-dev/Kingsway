# Team Vincere — Website

> *Vincere.* To conquer. An application-only coaching house for elite bodybuilding.

A hyper-exclusive, luxury dark-mood marketing site. Obsidian & brushed chrome, editorial serif paired with industrial uppercase sans, cinematic scroll. Built as **zero-dependency static HTML/CSS/JS** — no build step, no framework, opens instantly in any browser and deploys anywhere.

## Files

| File | What it is |
|---|---|
| `index.html` | The full landing page — hero, creed/manifesto, mindset team, software showcase (with live-feeling dashboard mockup), before/after proof, selection method, exclusivity band, and an inline multi-step application form. Fully self-contained. |
| `apply.html` | A dedicated, focused `/apply` page (same design system) for a standalone application route. |

## View it

Just open `index.html` in a browser. No install, no server needed.

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
| `coach-front.jpg` | Mindset section — "led from the front" |
| `before.jpg` / `after.jpg` | Proof — the 161→131 lb transformation (split from the composite, burned-in labels cropped, replaced with typographic labels) |
| `client-stage.jpg` | Proof — athlete's debut stage pose |
| `client-medal.jpg` | Proof — "first show, first hardware" |
| `band-bg.jpg` | Exclusivity band — darkened back-pose backdrop |

To swap any photo: drop a replacement at the same path (keep it a similar aspect ratio) or edit the `src` in `index.html`. Tune the look via the `filter` / `object-position` on `.hero-img`, `.mind-vis img`, `.ba-pair .half img`, `.ba-stage img`, `.band-img`.

**Still a hand-built mockup (not a photo):** the software dashboard (`.dash` block) — replace with real product screenshots as the platform ships.

**Grow the wall:** the proof section features one athlete (Mark), with copy ("room reserved for the next") and structure that scale. Duplicate the stage/medal blocks as the roster grows, and update the Instagram / YouTube links in the footer.

## Mark's testimonial video

The testimonial section (right under the creed) is wired for a YouTube video (a vertical Short by default). To make it play: open `index.html`, find `var MARK_VIDEO = ""` in the `<script>`, and paste Mark's YouTube link or video ID between the quotes. Full URLs (`youtube.com/shorts/…`, `youtu.be/…`, `watch?v=…`) and bare 11-character IDs all work. Until a link is set, the section shows a "Video coming soon" poster. *(The video is a live YouTube embed, so it plays on the deployed site; it won't load inside the sandboxed artifact preview.)*

## Applications to a Google Sheet

Each submitted application is posted to a Google Sheet you own, where you can read, filter, and download it (as CSV or Excel) any time. No server to run. The applicant still gets the "DM me on Instagram" confirmation as the human touchpoint, so a submission never falls through the cracks.

**One-time setup (about 5 minutes):**

1. Create a new **Google Sheet** (this becomes your applications database).
2. In that sheet: **Extensions to Apps Script**. Delete any starter code, paste the contents of [`google-apps-script.gs`](./google-apps-script.gs), and **Save**.
3. **Deploy to New deployment**. Choose type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, authorize when prompted, and **copy the Web app URL** (it ends in `/exec`).
4. Open `index.html`, find `var FORM_ENDPOINT = ""` near the top of the `<script>` (in the CONFIG block), and paste the URL between the quotes. (This one endpoint handles BOTH coaching applications and free-ebook leads.) Do the same in `apply.html` if you use that page.
5. Commit and redeploy. Submit a test application and confirm a row lands in the sheet.

The script auto-creates two tabs in your sheet: **Applications** (timestamp, name, email, phone, Instagram, age, years training, competed, goal/timeline, training days, investment, why) and **Leads** (timestamp, name, email, source) for the free-ebook opt-ins. To download either: **File to Download to CSV** (or Excel).

Until `FORM_ENDPOINT` is set, both forms still work and show their confirmation, they just don't record anything.

## Free ebook + 12-week guide (the funnel)

**The free "Vincere Ebook" (lead magnet).** Name + email opt-ins post to the **Leads** tab of the same sheet (same `FORM_ENDPOINT`). It appears in three places: a dedicated section, a sticky "Free Ebook" tab that slides in as visitors scroll, and a one-time popup (fires at ~22 seconds or 45% scroll, suppressed once someone grabs it). To deliver the file: **drop your PDF at `assets/vincere-ebook.pdf`** (that exact path). After opting in, the visitor gets an instant "Download the ebook" button pointing at it.

**The paid 12-Week Transformation Guide.** Sold via a Stripe Payment Link:
1. Create the product as a **Payment Link** in your Stripe dashboard.
2. Open `index.html`, find `var STRIPE_LINK = ""` in the CONFIG block, and paste your Payment Link URL. The "Buy" button activates automatically (until then it reads "Coming soon").
3. The **price** shown on the page is `$97` in the `.guide-price` block, edit that if your price differs, and set the matching amount in Stripe.
4. To deliver the PDF after purchase: in the Payment Link settings, turn on **"Don't show confirmation page"** off and set the confirmation/redirect to a download link, or enable Stripe's post-payment email with the file link.

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
