import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
