import { ViewTransition } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { CaseStudy } from "@/lib/content";

// The one case-study card component, used both in the homepage grid and the
// "Other case studies" footer on each case-study page — one system, not two
// divergent card designs. Shared-element ViewTransition morph into the
// detail page hero; otherwise a single Reveal per card. Alternating cards
// get a tinted background and every card tilts slightly on hover (direction
// alternates by index) — deliberate visual rhythm instead of five identical
// tiles, after an earlier overlay-on-cover-art idea fought itself for three
// iterations trying to be clever here.
export default function CaseStudyCard({
  caseStudy,
  index = 0,
  priority = false,
}: {
  caseStudy: CaseStudy;
  index?: number;
  priority?: boolean;
}) {
  const cs = caseStudy;
  const metric = cs.metrics?.[0];
  const tinted = index % 2 === 1;
  // Tilt/scale/color are keyed off :has() so they only fire when the cursor
  // is actually over the image or title, not anywhere in the card's hit area.
  const tilt =
    index % 2 === 0 ? "has-[:is(img,h2):hover]:-rotate-1" : "has-[:is(img,h2):hover]:rotate-1";

  return (
    <Reveal delay={index * 0.08}>
      <Link
        href={`/work/${cs.slug}`}
        data-case-study={cs.slug}
        className={`block rounded-2xl transition-transform duration-300 ease-out ${tilt} motion-reduce:transition-none motion-reduce:has-[:is(img,h2):hover]:rotate-0 ${
          tinted ? "bg-paper-dim p-4" : ""
        }`}
      >
        <ViewTransition name={`case-study-${cs.slug}`} share="morph">
          <img
            src={cs.heroImage}
            alt={cs.heroAlt}
            loading={priority ? "eager" : "lazy"}
            className="aspect-square w-full rounded-2xl border border-line object-cover transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
          />
        </ViewTransition>
        <div className="mt-4 flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-line" aria-hidden="true">
            {String(cs.order).padStart(2, "0")}
          </span>
        </div>
        <h2 className="mt-3 text-[length:var(--step-h3)] font-display font-semibold tracking-tight transition-colors duration-300 hover:text-green">
          {cs.title}
        </h2>
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
      </Link>
    </Reveal>
  );
}
