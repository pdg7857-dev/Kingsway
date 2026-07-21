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

**Grow the wall:** the proof section features one athlete monumentally, with copy ("room reserved for the next") and structure that scale. Duplicate the `.stat` tiles and the stage/medal blocks as the roster grows. Update the athlete's real name in the `.ba-stage .name` ("The First" placeholder) and `selection@teamvincere.com` / social links in the footer.

## Wire up the application form

The form is front-end only — it validates and shows a prestige confirmation, but does **not** send anywhere yet. To capture submissions, point it at one of:

- A form service (Formspree, Basin, Getform) — set the `<form>` `action`/`method`.
- Your own endpoint / serverless function — `fetch()` the field values on submit (see the submit handler in the `<script>`).
- An email or CRM webhook.

## Deploy

Static — host on Vercel, Netlify, Cloudflare Pages, or GitHub Pages. Point the project root at `team-vincere/` (or move the two files to your web root). No environment variables, no database.

---

Built for Team Vincere. Black & silver. Champion vision. By application only.
