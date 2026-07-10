---
name: case-study-import
description: Use when porting or refreshing a case study in this portfolio site from source material outside the repo — a Google-Docs-exported MD + PDF pair, plus a "Visual Assets" folder of real screenshots/mockups. Maps content and images into the site's existing Figure/ImageGrid/Carousel/PullQuote MDX pattern and updates frontmatter (which doubles as the homepage excerpt). Trigger phrases: "import case study", "port case study", "add real images to case study", "replace placeholder case study", "do what we did with [case study] to [other case study]".
---

# Case study import

Ports a case study's real content and images from external source material into `content/work/<slug>/index.mdx`, replacing placeholder prose/assets with the real thing. This is a content + asset mapping task, not a feature-build task — never invent new MDX components or change `src/components/mdx*.tsx`; the pattern below already covers every layout this site needs. Established and validated twice: `book-talent-search` (original) and `crm-accounting-integration` (second port, which this skill generalizes from).

## Inputs to expect from the user

- A source MD file (usually a Google Docs export — has embedded base64 images inline, which you IGNORE; treat the MD purely as the source of truth for prose/facts/numbers and for image *ordering*, not image files themselves).
- A matching PDF (same content, useful as a visual fallback if the MD's image ordering is ambiguous).
- A "Visual Assets" folder: some flat single images, and possibly nested subfolders of sequentially-numbered mockups (e.g. `Mockups-<Name>/`). Nested folders with 3+ images are carousel candidates.
- The target `content/work/<slug>/index.mdx` — usually already has well-written placeholder-illustrated prose from an earlier drafting pass; the prose itself may only need number/fact corrections, not a full rewrite.

## Step 1: Read the MD without blowing up your context

These exports embed images as inline base64, making the file multi-megabyte with some individual lines running to hundreds of KB. Never `Read` it directly. Instead:

```bash
awk '{ if (length($0) > 500) print "[LINE " NR ", " length($0) " chars - TRUNCATED/LIKELY IMAGE DATA]"; else print NR": "$0 }' "source.md" > /tmp/clean.txt
```

Then read `/tmp/clean.txt`. This preserves every heading and paragraph, and the `![][imageN]` placeholder positions (their *sequence*, not content) — which tells you how many consecutive images sit at each point in the narrative, and in what order. Cross-reference those counts against real folder file counts to validate your image-to-section mapping (they should match closely; small ±1 discrepancies from lossy doc export are fine).

## Step 2: Map images to sections

For each image group (a placeholder run of N consecutive `![][imageN]` in the MD, or a nested `Mockups-*` folder):

1. Visually confirm content, don't guess from filenames alone. Use `Read` on 1-2 sample images per group — this tool renders images directly. Confirm the image content actually matches the adjacent prose (e.g. a "Challenges" folder should show the tax/currency/edge-case UI the challenges paragraph describes).
2. Apply the carousel rule: **3 or more consecutive/related images → `<Carousel>`. 2 images → `<ImageGrid>` with two `<Figure>` children. 1 image → standalone `<Figure>`.** This is a hard rule from the site's design language, not a judgment call.
3. Place the block at the paragraph landmark in the MDX that corresponds to where the MD shows the same image run — usually right after the paragraph that describes it, except a "before any prose" case (like a solution/results section opener) where source material shows images before the section's text — match that instead of always defaulting to "after."

## Step 3: Prepare and copy images

Destination: `public/work/<slug>/`, replacing any existing placeholder assets (typically generic `.svg` files — delete them once real replacements are confirmed rendering).

Naming convention (matches both prior ports):
- Flat singles/pairs: descriptive kebab-case, e.g. `interviews.png`, `discovery-diagram.png`, `install-trends-graph.png`.
- Each carousel's images: `<prefix>-mockup-N.jpg`, sequential from 1, e.g. `side-panel-mockup-1.jpg` … `side-panel-mockup-11.jpg`. If excluding a source file (e.g. an oversized SVG), renumber to close the gap — don't leave a hole in the sequence.

Tooling: this is a macOS environment with only `sips`/`qlmanage` available (no ImageMagick) unless proven otherwise for the current machine — check with `command -v magick convert` first. Compression is only *needed* for outliers — check `book-talent-search`'s own asset sizes as your bar (`ls -la public/work/book-talent-search/`); some of its images are 2-4MB uncompressed, so aggressive optimization isn't the site's norm. Only re-encode files that are drastically oversized relative to their dimensions (a >1MB PNG for a modest-resolution screenshot is inefficient encoding, not necessarily a big image — re-save as JPEG q85-90 to fix it):

```bash
sips -s format jpeg -s formatOptions 85 "source.png" --out "dest.jpg"
# add --resampleHeightWidthMax 1600 too if the source is also oversized in pixel dimensions
```

For carousels, converting everything to `.jpg` at quality ~85 is a reasonable default (matches the site's existing `mockup-N.jpg` convention) even when sources are mixed `.png`/`.jpg`.

## Step 4: Update frontmatter

Schema (`CaseStudyFrontmatter` in `src/lib/content.ts`): `title, subtitle, slug, company, role, year, duration, domain, order, heroImage, heroAlt, metrics[] ({label, value}), draft`, optional `ogImage`, `status`.

**There is no separate homepage excerpt file.** `CaseStudyRow`/`FeaturedCaseStudy`/`CaseStudyCard` all read directly off this frontmatter (title, subtitle, heroImage, heroAlt, `metrics[0]`, year). Editing frontmatter *is* editing the homepage excerpt — don't go looking for a second place to update it.

- `order` controls homepage position — never change another case study's `order` value while doing this.
- Resolve any `NEEDS CONFIRMATION`-style comments in the current MDX using facts from the new source material if it settles them; remove the comment once resolved.
- Update `subtitle` and `metrics` to the source material's current numbers — drop any old metric that's no longer supported by the new source rather than leaving stale figures alongside new ones.
- `metrics[0]` is what renders as the homepage pill — keep it short and punchy (a count or percentage, not a long label).

## Step 5: Update MDX body

- Insert `Figure`/`ImageGrid`/`Carousel` blocks at the landmarks identified in Step 2, using real `alt` text (describe what's actually in the image) and a `caption` in the site's established editorial-caption voice (short, declarative, often starts with what the image demonstrates — see existing captions in `book-talent-search/index.mdx` or `crm-accounting-integration/index.mdx` for tone).
- `Carousel` children are plain `<img src alt />` tags, NOT a `slides` array prop — `next-mdx-remote/rsc`'s `compileMDX` silently drops array/object literal JSX prop values, so this isn't optional.
- Reconcile prose with the new source material's facts (role description, team composition, dates, outcome numbers) — fix word-for-word factual mismatches (e.g. "sole" vs "lead" product designer) even if they seem minor, since they're usually resolved/clarified by the newer source.
- Frontmatter's `heroImage` is rendered by the page template itself (`src/app/work/[slug]/page.tsx`) — do not also add a duplicate `<Figure>` for it in the body.

## Step 6: Clean up

- Delete replaced placeholder assets from `public/work/<slug>/`.
- Remove any now-resolved MDX comments flagging open questions.
- Sanity-check the copied asset folder is flat (no leftover nested nested `Mockups-*/` subfolder structure) and the file count matches what you expect (singles + pairs + sum of carousel counts).

## Step 7: Verify

1. `npm run lint` and `npm run build` — the build is the real gate (static export; validates required frontmatter fields and that every image path resolves). Check `out/work/<slug>/` for the copied images afterward.
2. Start the dev server and drive it with a headless browser (no `chromium-cli` on this machine as of the last run — fall back to a throwaway Playwright script; see this repo's `run` skill guidance for the general pattern). Don't trust the DOM's `naturalWidth`/`complete` check alone for "is this image broken" — every image here uses `loading="lazy"`, so anything below the fold reports as unloaded/broken even when fine. Instead verify assets directly:
   ```bash
   for f in public/work/<slug>/*; do
     curl -s -o /dev/null -w "%{http_code} $f\n" "http://localhost:3000/work/<slug>/$(basename "$f")"
   done
   ```
   All should be 200.
3. Screenshot the case study page and the homepage row for this case study (scroll incrementally first — `fullPage` instant screenshots can catch scroll-triggered fade-in animations mid-transition and look broken when they aren't; a natural scroll-then-screenshot avoids false alarms).
4. Confirm carousel slide counts match expectations — count `img` tags inside `div[class*="overflow-x-auto"]` elements in DOM order, and click through one lightbox (open, next, escape) to confirm interaction works.
5. A hydration console warning that also reproduces on pages you didn't touch is a pre-existing dev-server quirk, not something this task introduced — don't chase it; rely on the production `build` passing as the real correctness signal.
