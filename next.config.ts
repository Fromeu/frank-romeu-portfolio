import type { NextConfig } from "next";

// GitHub Pages serves project repos from /<repo-name>/, so the export needs
// to know its own base path. Empty when running locally (npm run dev/build).
const basePath = process.env.GITHUB_PAGES === "true" ? "/frank-romeu-portfolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  experimental: {
    // React <ViewTransition>: powers the shared-element morph between a case
    // study's cover art and its detail-page hero.
    viewTransition: true,
  },
  // Static export has no image optimization server. Responsive sizing is
  // handled at build time in Phase 4 (pre-generated srcset variants), which
  // hasn't been built yet — until then, pre-size real cover photos yourself
  // (roughly 1200–1600px square, compressed JPG/WebP) before adding them to
  // public/work/<slug>/, since nothing here will compress or resize for you.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
