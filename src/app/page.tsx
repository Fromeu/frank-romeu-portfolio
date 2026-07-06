import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import CrateRecord from "@/components/CrateRecord";
import { catalogNumber } from "@/lib/catalog";
import { getAllCaseStudies } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The crate.
export default function Home() {
  const caseStudies = getAllCaseStudies();

  // LCP: preload only the first record's hero (emits <link rel="preload">)
  if (caseStudies[0]) {
    preload(caseStudies[0].heroImage, { as: "image", fetchPriority: "high" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      {/* Intro: readable immediately, never gated behind animation */}
      <section className="mb-20 md:mb-28">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
          {site.title}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[1.05] tracking-tight">
          {site.name}
        </h1>
        <p className="mt-5 max-w-[36ch] text-xl leading-relaxed text-ink-soft md:text-2xl">
          {site.positioning}
        </p>
      </section>

      {/* The crate: every case study, one click away, all info visible */}
      <section aria-label="Case studies">
        <p className="mb-10 border-t border-kraft/50 pt-4 font-mono text-xs uppercase tracking-wider text-ink-soft">
          In the crate — {caseStudies.length} records
        </p>
        <div>
          {caseStudies.map((cs, i) => (
            <CrateRecord key={cs.slug} caseStudy={cs} index={i} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Compact plain-text index for anyone who just wants a list */}
      <nav
        aria-label="All work"
        className="mt-24 border-t border-kraft/50 pt-6 md:mt-32"
      >
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink-soft">
          All work
        </h2>
        <ul className="mt-4 space-y-2">
          {caseStudies.map((cs) => (
            <li key={cs.slug} className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-xs text-ink-soft">
                {catalogNumber(cs.order)}
              </span>
              <Link
                href={`/work/${cs.slug}`}
                className="underline decoration-kraft underline-offset-4 hover:text-cobalt hover:decoration-cobalt"
              >
                {cs.title}
              </Link>
              <span className="text-sm text-ink-soft">
                {cs.company}, {cs.year}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
