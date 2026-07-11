// Mirrors the basePath logic in next.config.ts. GitHub Pages serves this
// project from a sub-path, so any raw "/public" asset reference (plain
// <img src>, preload(), MDX body images, OG image URLs) needs the prefix
// added by hand — only next/link and next/image do this automatically.
// Must be NEXT_PUBLIC_-prefixed: Figure/Carousel (mdx-media.tsx) are client
// components that call withBasePath() again on every client-side route
// transition, and only NEXT_PUBLIC_ vars get inlined into the browser bundle
// — a plain GITHUB_PAGES read would silently resolve to "" there, dropping
// the prefix on every in-body image after the first full page load.
export const basePath = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ? "/frank-romeu-portfolio" : "";

export function withBasePath(assetPath: string): string {
  return `${basePath}${assetPath}`;
}
