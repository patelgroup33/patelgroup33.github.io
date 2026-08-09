# DEV_PATEL.OS — Operator Profile

**Live → https://patelgroup33.github.io/**

A cinematic, scroll-driven personal site — built to feel like booting the operating
system of an AI engineer. Marvel title-sequence energy, Apple precision, Linear smoothness.

> Not a portfolio. An experience.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** — custom crimson / metal design system
- **GSAP + ScrollTrigger** — every scroll-driven, handcrafted animation
- **Lenis** — smooth scroll, wired into GSAP's ticker (one loop, no jitter)
- **Framer-style micro-interactions** via GSAP + CSS
- Canvas particle field + energy lines (GPU-friendly 2D, pauses off-screen)
- Zero-asset synthesized UI sound (WebAudio, muted by default)

No external runtime assets beyond the hero video and résumé PDF — fonts are
self-hosted via `next/font`, sound is synthesized, graphics are inline SVG/canvas.

## Run it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**. Toggle **MUTED → SOUND ON** (top-right) for
the ambient/hover audio and startup chime.

Production build (static export → `out/`):

```bash
npm run build
```

## Deploy

Hosted on **GitHub Pages** at https://patelgroup33.github.io/, with **automatic
deploys**. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the static export and publishes it through GitHub Pages (Actions
source). So shipping an update is just:

```bash
git push
```

No branches to manage, no manual steps.

## The journey (scroll top → bottom)

| # | Section | What happens |
|---|---------|--------------|
| — | **Hero** | Fixed face video, rotating energy rings, floating HUD chips, scanning line. Name reveals letter-by-letter; the title glitch-flashes between *AI Engineer* and *Software Engineer*. Camera zooms in on scroll, then the whole rig collapses into the boot sequence. |
| 01 | **System Initialization** | A boot sequence. Core-load bar and five module loaders fill on scroll; each verified module reveals its detail. |
| 02 | **The Engineer** | Education, a live capability matrix, and coursework — assembled, not faded. |
| 03 | **The Creator** | Premium project cards (Matching Engine · Backtesting Engine). Parallax tilt; layers explode apart on hover. |
| 04 | **Experience** | A horizontal conveyor — company cards rotate in 3D as they cross screen-centre. |
| 05 | **Telemetry** | Animated counters that spin up as they enter range. |
| 06 | **The Pipeline** | The workflow as an AI pipeline; a spine draws itself as stages animate in. |
| 07 | **Uplink** | A Jarvis-style circular interface. Tap the core → contact channels emerge from the ring. |

## Content

All copy is pulled from `src/data/content.ts` — the single source of truth,
transcribed from the 2026 résumé. Edit that one file to update the whole site.

## Assets

- `public/hero.mp4` — the hero face video
- `public/Dev_Patel_Resume.pdf` — linked from the Uplink section

## Performance notes

- Canvas loop pauses when the tab is hidden; particle count scales to viewport.
- `prefers-reduced-motion` is respected (animations collapse to instant).
- Static-prerendered; ~152 kB First Load JS.
- No layout shift — fonts use `display: swap` with self-hosted files.
