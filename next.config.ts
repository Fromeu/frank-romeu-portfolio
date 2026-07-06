import type { NextConfig } from "next";

// GitHub Pages serves project repos from /<repo-name>/, so the export needs
// to know its own base path. Empty when running locally (npm run dev/build).
const basePath = process.env.GITHUB_PAGES === "true" ? "/Crates-portfolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  experimental: {
    // React <ViewTransition>: powers the record-pull shared-element morph
    viewTransition: true,
  },
  // Static export has no image optimization server. Responsive sizing is
  // handled at build time in Phase 4 (pre-generated srcset variants).
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
