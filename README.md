# Frank Romeu — Portfolio

Frank Romeu's portfolio site: case studies, About, and Contact.

Built with Next.js (App Router, static export), Tailwind CSS v4, Framer
Motion, and MDX. Design language is editorial — white/near-black base with
two deliberate accents (green, orange), an expressive serif (Fraunces) paired
with a modern grotesque (Archivo) and monospace meta text (Geist Mono) — no
illustrated concept to maintain, personality comes from type, color, and
motion.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

The production build is fully static — everything in `./out` can be served by
any static host.

## Adding a case study

No code changes needed. Create a folder in `content/work/` whose name is the
slug:

```
content/work/my-new-project/
  index.mdx
public/work/my-new-project/
  hero.svg        (cover art — square, 1:1)
  ...body images
```

`index.mdx` starts with frontmatter (all fields below are required unless
noted):

```yaml
---
title: "Short, outcome-oriented title"
subtitle: "One line: what it was and why it mattered"
slug: "my-new-project"        # must match the folder name
company: "Company"
role: "Senior Product Designer"
year: "2026"
duration: "6 months"          # optional
domain: "CRM / Enterprise SaaS"
order: 6                      # sort position on the homepage (lower = first)
heroImage: "/work/my-new-project/hero.svg"
heroAlt: "Describe the hero image for screen readers"
ogImage: ""                   # optional — defaults to heroImage
metrics:                      # optional — shown as chips on the card + detail page
  - label: "Activation"
    value: "+19%"
status: "shipped"             # optional — "in-progress" skips the metrics row and shows a status label instead
draft: false                  # true = excluded from the build entirely (zero route generated)
---
```

The body is MDX: normal markdown, following a consistent case-study anatomy
(My role → The problem → Context and constraints → Process → Key decisions →
The solution → Outcomes → Reflection — see any existing case study for the
exact pattern), plus these components:

```mdx
<Figure src="/work/my-new-project/img.svg" alt="..." caption="Optional caption" />
<Figure src="..." alt="..." fullBleed />        {/* full-bleed single, breaks out to viewport edge */}

<ImageGrid>                                      {/* 2-up grid */}
  <Figure src="..." alt="..." caption="..." />
  <Figure src="..." alt="..." caption="..." />
</ImageGrid>

<PullQuote attribution="Who said it">The quote itself.</PullQuote>

<Callout title="Decision">A highlighted decision/constraint block.</Callout>
```

`## ` and `### ` headings automatically get slugified anchor `id`s and feed
the sticky, scroll-spy table of contents on desktop (`CaseStudyToc.tsx`) —
no manual wiring needed. Read time is estimated from the MDX body's word
count (`src/lib/reading.ts`).

### Image guidance

- **Cover art (`heroImage`)**: square (1:1), ~1600×1600px. It's the homepage
  card, the case-study hero, and the shared-element morph target between
  them, so spend time on it.
- **`ogImage`**: social scrapers (LinkedIn, Slack, iMessage) generally do
  **not render SVG** — once real art exists, set `ogImage` to a PNG/JPEG
  ≥1200×630 (or reuse the hero if it's raster).
- Body images: ~1600px wide is plenty; everything below the first hero is
  lazy-loaded automatically.
- Static export has no image optimizer (`next.config.ts` sets
  `images.unoptimized: true`) — pre-size and compress real photos yourself
  before adding them.

## Swapping the resume

Replace `public/resume.pdf` with the real PDF (same filename). The "Download
resume" button in the nav and the contact page both point at it.

## Site-wide copy

Name, title, positioning line, email, LinkedIn, production URL, and the
resume path live in `src/lib/site.ts` — a single source of truth referenced
everywhere (nav, footer, contact page, metadata, canonical URLs, OG tags).

## Design tokens & motion

- Colors and the type stack (Fraunces display / Archivo body / Geist Mono
  meta) are defined as tokens in `src/app/globals.css` under `@theme inline`
  — change them there, everything follows. A fluid `clamp()`-based type scale
  (`--step-display` through `--step-meta`) covers every heading site-wide.
- `CaseStudyCard.tsx` is the one card component, reused on the homepage grid
  and each case study's "Other case studies" footer.
- `Reveal.tsx` is the shared scroll-entrance primitive (fade + rise, once,
  reduced-motion safe) used across the site instead of a pattern invented
  per component.
- The shared-element morph between a case-study card's cover art and its
  detail-page hero uses React's `<ViewTransition>` (Next's experimental
  `viewTransition` flag). Browsers without support get instant navigation.
- `prefers-reduced-motion` disables all motion this site defines: reveals,
  hover transforms, the nav drawer, the case-study hero's scroll parallax,
  and view-transition morphs.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`GITHUB_PAGES=true` (so `next.config.ts` sets the correct GitHub Pages
`basePath`) and deploys `out/` to GitHub Pages. To deploy elsewhere (Vercel,
Netlify, Cloudflare Pages), just run `npm run build` and serve `out/` — no
server required, no platform-specific dependencies.
