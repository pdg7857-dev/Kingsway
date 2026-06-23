# Replaceable assets

Every file here is a **placeholder**. Swap in your own / dealer-authorized
assets before publishing. Do **not** drop in official Lexus logos or scraped
Lexus press photography — emulate the design language, supply your own images.

| File | Used by | Notes |
|------|---------|-------|
| `hero-poster.jpg` | Hero (§7.2) | 1920×1080+, muted/cinematic. Becomes the `next/image` priority LCP image and the video poster. |
| `hero.mp4` | Hero (§7.2) | Optional. Muted, `playsinline`, short loop, low bitrate for mobile. |
| `model-sedan.jpg`, `model-suv.jpg`, `model-hybrid.jpg`, `model-fsport.jpg` | Showcase (§7.5) | Full-bleed category panels, ~1600px wide. |
| `headshot.jpg` | Contact card (§7.8) | Square, ≥800px. |
| `og.jpg` | Social sharing (§14) | 1200×630 branded card. |
| `qr.svg` | Contact card (§7.8) | Auto-generated — run `npm run qr` (added in a later phase). |

## Phase 1 status

The hero currently renders a CSS gradient stand-in (no image files needed yet)
so the *feel* can be judged. Real `next/image` + video wiring lands in a later
phase once `hero-poster.jpg` is supplied.
