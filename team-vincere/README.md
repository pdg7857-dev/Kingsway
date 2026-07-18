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

## Swap in real assets (marked placeholders)

Everything faked is clearly labelled in the markup so it's easy to find and replace:

- **Hero visual** — `.hero-fig` (right side). Drop in a rim-lit athlete image or a muted background `<video>`.
- **Mindset portrait** — `.mind-vis` block.
- **Software dashboard** — the `.dash` block is a hand-built mockup. Replace with real product screenshots as the platform ships.
- **Proof** — `.ba-before` / `.ba-after` (before/after photos) and `.ba-stage` (on-stage shot + athlete name/division/quote). Currently features one athlete monumentally, with copy that leaves room for the next. Duplicate the `.stat` and stage block to grow the wall as the roster grows.
- **Contact / socials** — footer links and `selection@teamvincere.com`.

## Wire up the application form

The form is front-end only — it validates and shows a prestige confirmation, but does **not** send anywhere yet. To capture submissions, point it at one of:

- A form service (Formspree, Basin, Getform) — set the `<form>` `action`/`method`.
- Your own endpoint / serverless function — `fetch()` the field values on submit (see the submit handler in the `<script>`).
- An email or CRM webhook.

## Deploy

Static — host on Vercel, Netlify, Cloudflare Pages, or GitHub Pages. Point the project root at `team-vincere/` (or move the two files to your web root). No environment variables, no database.

---

Built for Team Vincere. Black & silver. Champion vision. By application only.
