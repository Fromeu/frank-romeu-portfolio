import { ViewTransition } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { CaseStudy } from "@/lib/content";

// A smaller sibling of FeaturedCaseStudy for the "more work" list — same
// side-by-side asymmetric family (restrained scale-only hover, no tilt),
// but alternating which side the image sits on so consecutive entries
// mirror each other instead of repeating the same shape down the page.
// Deliberately a separate component from CaseStudyCard, which stays
// untouched here since it's still used, unchanged, on the case-study
// detail pages' "Other case studies" footer.
export default function CaseStudyRow({
  caseStudy,
  index = 0,
}: {
  caseStudy: CaseStudy;
  index?: number;
}) {
  const cs = caseStudy;
  const metric = cs.metrics?.[0];
  const imageFirst = index % 2 === 0;

  return (
    <Reveal delay={index * 0.06}>
      <Link
        href={`/work/${cs.slug}`}
        data-case-study={cs.slug}
        className="grid items-center gap-6 sm:grid-cols-2 sm:gap-10"
      >
        <div className={imageFirst ? "sm:order-1" : "sm:order-2"}>
          <ViewTransition name={`case-study-${cs.slug}`} share="morph">
            <img
              src={cs.heroImage}
              alt={cs.heroAlt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl border border-line object-cover transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
          </ViewTransition>
        </div>
        <div className={imageFirst ? "sm:order-2" : "sm:order-1"}>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            {cs.year}
          </p>
          <h3 className="mt-2 text-[length:var(--step-h2)] font-display font-semibold tracking-tight transition-colors duration-300 hover:text-green">
            {cs.title}
          </h3>
          <p className="mt-2 max-w-prose text-ink-soft">{cs.subtitle}</p>
          {metric ? (
            <p className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-orange px-3 py-1 font-mono text-sm font-semibold text-paper">
                {metric.value}
              </span>
              <span className="font-mono text-sm text-ink-soft">{metric.label}</span>
            </p>
          ) : cs.status === "in-progress" ? (
            <p className="mt-3 font-mono text-sm uppercase tracking-wider text-ink-soft">
              In progress
            </p>
          ) : null}
        </div>
      </Link>
    </Reveal>
  );
}
