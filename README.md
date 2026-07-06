# The Record Crate

Frank Romeu's portfolio. Each case study is a record; the homepage is the crate.

Built with Next.js (App Router, static export), Tailwind CSS, Framer Motion, and MDX.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

The production build is fully static — everything in `./out` can be served by any
static host.

## Adding a case study

No code changes needed. Create a folder in `content/work/` whose name is the slug:

```
content/work/my-new-project/
  index.mdx
public/work/my-new-project/
  hero.png        (the record art — square, 1:1)
  ...body images
```

`index.mdx` starts with frontmatter (all fields below are required unless noted):

```yaml
---
title: "Short, outcome-oriented title"
subtitle: "One line: what it was and why it mattered"
slug: "my-new-project"        # must match the folder name
company: "Company"
role: "Senior Product Designer"
year: "2026"
duration: "6 months"
domain: "CRM / Enterprise SaaS"
order: 4                      # position in the crate (1 = top)
heroImage: "/work/my-new-project/hero.png"
heroAlt: "Describe the hero image for screen readers"
ogImage: ""                   # optional — defaults to heroImage
metrics:                      # optional — shown in the summary block
  - label: "Activation"
    value: "+19%"
draft: false                  # true = excluded from the build
---
```

The body is MDX: normal markdown plus these components —

```mdx
<Figure src="/work/my-new-project/img.png" alt="..." caption="Optional caption" />
<Figure src="..." alt="..." fullBleed />        {/* full-bleed single */}

<ImageGrid>                                      {/* 2-up grid */}
  <Figure src="..." alt="..." caption="..." />
  <Figure src="..." alt="..." caption="..." />
</ImageGrid>

<PullQuote attribution="Who said it">The quote itself.</PullQuote>

<Callout title="Decision">A highlighted decision/constraint block.</Callout>
```

The three case studies currently in `content/work/` are **clearly-labeled
placeholders** — replace their text and the solid-color SVGs in `public/work/`
with real content and images.

### Image guidance

- **Record art (`heroImage`)**: square (1:1), ~1600×1600px, AVIF/WebP or
  high-quality JPEG. It's the crate card, the case study hero, and the morph
  shared element, so spend time on it.
- **`ogImage`**: social scrapers (LinkedIn, Slack, iMessage) generally do
  **not render SVG** — once real art exists, set `ogImage` to a PNG/JPEG
  ≥1200×630 (or reuse the hero if it's raster). The placeholders' SVG OG
  images are dev-only.
- Body images: ~1600px wide is plenty; everything below the first hero is
  lazy-loaded automatically.

## Swapping the resume

Replace `public/resume.pdf` with the real PDF (same filename). The "Download
resume" button in the nav and the contact page both point at it.

## Site-wide copy

Name, title, positioning line, email, LinkedIn, and the production URL live in
`src/lib/site.ts`. **Set `site.url` to the real domain before launch** — it
drives canonical URLs, Open Graph images, robots.txt, and the sitemap.

## Design tokens & motion

- All colors, and the type stack (Fraunces display / Archivo body / Geist Mono
  meta), are defined as tokens in `src/app/globals.css` under `@theme` — change
  them there, everything follows.
- The crate's "dig" (sticky deck + recede choreography) lives in
  `src/components/CrateRecord.tsx`; the flip rhythm is the `26vh` segment
  margin in `globals.css`.
- The record-pull morph uses React `<ViewTransition>` (Next's experimental
  `viewTransition` flag). Browsers without support get instant navigation.
  Known limitation: the browser **back button** navigates correctly but
  doesn't animate the reverse morph (the in-page "← Crate" link does).
- `prefers-reduced-motion` disables all of it: load sequence, dig, parallax,
  and morphs.

## Status (Lighthouse, static build, mobile emulation)

Performance 94 · Accessibility 100 · Best Practices 100 · SEO 100. Re-run
after real images land: `npx lighthouse http://localhost:3100 ...` against
`npx serve out -l 3100`.

## Deploying

`npm run build` emits a static site to `out/`. Deploy that directory to any static
host (Vercel, Netlify, Cloudflare Pages, GitHub Pages). On Vercel, the defaults
work — it detects Next.js and respects `output: "export"`. No server required, no
Vercel-only dependencies.
