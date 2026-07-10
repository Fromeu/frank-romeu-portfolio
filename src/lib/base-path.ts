// Mirrors the basePath logic in next.config.ts. GitHub Pages serves this
// project from a sub-path, so any raw "/public" asset reference (plain
// <img src>, preload(), MDX body images, OG image URLs) needs the prefix
// added by hand — only next/link and next/image do this automatically.
export const basePath = process.env.GITHUB_PAGES === "true" ? "/frank-romeu-portfolio" : "";

export function withBasePath(assetPath: string): string {
  return `${basePath}${assetPath}`;
}
