import { ViewTransition } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { CaseStudy } from "@/lib/content";

// The homepage's lead story — a deliberately different, larger treatment
// from the grid below it. A uniform grid treats every case study
// identically; giving one a featured slot is what makes the page read as
// edited rather than templated. Same ViewTransition/Reveal patterns as
// CaseStudyCard, just a restrained hover (image scale only — tilting
// something this large would feel heavy rather than tactile).
export default function FeaturedCaseStudy({ caseStudy }: { caseStudy: CaseStudy }) {
  const cs = caseStudy;

  return (
    <Reveal>
      <Link
        href={`/work/${cs.slug}`}
        data-case-study={cs.slug}
        className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-10"
      >
        <ViewTransition name={`case-study-${cs.slug}`} share="morph">
          <img
            src={cs.heroImage}
            alt={cs.heroAlt}
            loading="eager"
            className="aspect-[5/4] w-full rounded-2xl border border-line object-cover transition-transform duration-300 ease-out hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        </ViewTransition>
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            Featured case study
          </p>
          <h2 className="mt-4 text-[length:var(--step-hero)] font-display font-semibold leading-[1.05] tracking-tight transition-colors duration-300 hover:text-green">
            {cs.title}
          </h2>
          <p className="mt-4 max-w-prose text-lg text-ink-soft md:text-xl">{cs.subtitle}</p>
          {cs.metrics && cs.metrics.length > 0 ? (
            <dl className="mt-6 flex flex-wrap gap-3">
              {cs.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-paper-dim px-4 py-3">
                  <dd className="font-display font-display-wonk text-[length:var(--step-h2)] italic font-semibold leading-none tracking-tight text-orange">
                    {m.value}
                  </dd>
                  <dt className="mt-1 text-xs text-ink-soft">{m.label}</dt>
                </div>
              ))}
            </dl>
          ) : cs.status === "in-progress" ? (
            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-ink-soft">
              In progress
            </p>
          ) : null}
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-green">
            Read the case study →
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
