import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    ...getAllCaseStudies().map((cs) => ({
      url: `${site.url}/work/${cs.slug}`,
      lastModified: now,
      priority: 0.9,
    })),
    { url: `${site.url}/about`, lastModified: now, priority: 0.5 },
    { url: `${site.url}/contact`, lastModified: now, priority: 0.5 },
  ];
}
