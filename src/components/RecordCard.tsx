import { ViewTransition } from "react";
import Link from "next/link";
import Sticker from "@/components/Sticker";
import { catalogNumber } from "@/lib/catalog";
import type { CaseStudy } from "@/lib/content";

// Compact record card for "Other case studies". The art shares its
// ViewTransition name with the crate and the case study hero, so case→case
// navigation morphs too. (The crate itself uses CrateRecord.)
export default function RecordCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const cs = caseStudy;
  return (
    <Link href={`/work/${cs.slug}`} className="group block" data-record={cs.slug}>
      <div className="relative">
        <ViewTransition name={`record-${cs.slug}`} share="morph">
          <img
            src={cs.heroImage}
            alt={cs.heroAlt}
            loading="lazy"
            className="aspect-square w-full border border-ink/10 object-cover shadow-[0_2px_12px_rgba(24,22,17,0.10)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_14px_28px_rgba(24,22,17,0.16)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          />
        </ViewTransition>
        <div className="absolute -top-2.5 right-3">
          <Sticker tone="hype" tilt={-4}>
            {cs.year}
          </Sticker>
        </div>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        {catalogNumber(cs.order)}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
        {cs.title}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{cs.subtitle}</p>
    </Link>
  );
}
