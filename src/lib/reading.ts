// Small, pure helpers derived from a case study's raw MDX body string.
// Deliberately NOT part of CaseStudyFrontmatter/content.ts — these are
// computed at render time, not stored content, so the existing required-field
// validation in content.ts never has to change.

export type TocEntry = {
  id: string;
  text: string;
  depth: 2 | 3;
};

/** Must be the same slug function used for MDX heading `id`s in mdx.tsx,
 * so table-of-contents anchors and rendered heading ids always match. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const HEADING_RE = /^(#{2,3})\s+(.+)$/gm;

export function extractToc(mdxBody: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const match of mdxBody.matchAll(HEADING_RE)) {
    const depth = match[1].length as 2 | 3;
    const text = match[2].trim();
    entries.push({ id: slugify(text), text, depth });
  }
  return entries;
}

const WORDS_PER_MINUTE = 200;

export function estimateReadMinutes(mdxBody: string): number {
  const plain = mdxBody
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ") // strip JSX tags (Figure, PullQuote, Callout, ImageGrid…)
    .replace(/^#{1,6}\s+/gm, "") // heading markers
    .replace(/^>\s?/gm, "") // blockquote markers
    .replace(/[*_`]/g, ""); // emphasis/code markers

  const words = plain.split(/\s+/).filter(Boolean);
  return Math.max(1, Math.round(words.length / WORDS_PER_MINUTE));
}
