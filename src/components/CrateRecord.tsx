"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import {
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Sticker from "@/components/Sticker";
import { catalogNumber } from "@/lib/catalog";
import type { CaseStudy } from "@/lib/content";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeToDesktopQuery(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// One record in the crate, with the digging feel:
//
// Desktop (motion allowed): the card pins via CSS sticky (.crate-card) while
// the next record rises over it; this component adds the recede — the pinned
// sleeve scales down, drops back, and dims, like being pushed to the back of
// the bin. Scroll stays native; everything is transform/opacity.
//
// Mobile: plain stack with a one-time rise-and-settle reveal as each record
// scrolls into view (skipped for the first record — the load sequence owns it).
//
// Reduced motion / no JS: the settled static stack, handled by CSS.
export default function CrateRecord({
  caseStudy,
  index,
  priority = false,
}: {
  caseStudy: CaseStudy;
  index: number;
  priority?: boolean;
}) {
  const cs = caseStudy;
  const segmentRef = useRef<HTMLDivElement>(null);
  const nextSegmentRef = useRef<HTMLElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasNext, setHasNext] = useState(false);

  // Server snapshot is `null` → first paint is the settled static state, so
  // no-JS and pre-hydration renders are always correct.
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopQuery,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => null
  );
  const mode =
    prefersReducedMotion || isDesktop === null
      ? "static"
      : isDesktop
        ? "desktop"
        : "mobile";

  // The recede is driven by the NEXT record's approach: while this card is
  // pinned its own scroll progress stalls, so we track the next segment from
  // viewport bottom ("start end") to the pin line ("start 4.5rem" = 72px).
  useEffect(() => {
    nextSegmentRef.current =
      (segmentRef.current?.nextElementSibling as HTMLElement) ?? null;
    setHasNext(nextSegmentRef.current !== null);
  }, []);

  const { scrollYProgress: coverProgress } = useScroll({
    target: nextSegmentRef as React.RefObject<HTMLElement>,
    offset: ["start end", "start 72px"],
  });

  // The record is the protagonist of the flip. Choreography on the way out:
  // the meta text tucks away first, following the record back into the bin
  // (y + fade, done by 55% of the cover) — then the art recedes alone and
  // only dims once the incoming record is mostly over it.
  const sleeveScale = useTransform(coverProgress, [0, 1], [1, 0.94]);
  const sleeveY = useTransform(coverProgress, [0, 1], [0, -16]);
  const sleeveOpacity = useTransform(coverProgress, [0.55, 1], [1, 0.5]);
  const textFollowY = useTransform(coverProgress, [0, 0.55], [0, -36]);
  const textFollowOpacity = useTransform(coverProgress, [0.05, 0.55], [1, 0]);

  // On the way in: the art leads (it rides native scroll), and the meta text
  // trails ~64px behind, catching up to settle exactly as the record pins —
  // position-only, so the title stays readable the whole way. The first
  // record is exempt; the load sequence owns its entrance.
  const { scrollYProgress: approachProgress } = useScroll({
    target: segmentRef,
    offset: ["start end", "start 72px"],
  });
  const textLagY = useTransform(approachProgress, [0.45, 1], [64, 0]);

  const textY = useTransform(() => {
    const lag = index > 0 ? textLagY.get() : 0;
    const follow = hasNext ? textFollowY.get() : 0;
    return lag + follow;
  });

  // Mobile reveal-lite (once per record, never the first one)
  const inView = useInView(segmentRef, { once: true, margin: "-12% 0px" });
  const reveal = mode === "mobile" && index > 0;

  const desktop = mode === "desktop";

  return (
    <div ref={segmentRef} data-crate-item className="crate-segment">
      <m.div
        className="crate-card border-t border-kraft/50 bg-paper pt-5 md:flex md:flex-col md:justify-center md:pt-6"
        style={
          desktop && hasNext
            ? {
                scale: sleeveScale,
                y: sleeveY,
                opacity: sleeveOpacity,
                transformOrigin: "50% 20%",
              }
            : undefined
        }
        animate={reveal ? (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }) : undefined}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          ref={linkRef}
          href={`/work/${cs.slug}`}
          className="group block"
          data-record={cs.slug}
        >
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-10">
            <div className="relative md:max-w-[min(100%,calc(100vh-16rem))]">
              <ViewTransition name={`record-${cs.slug}`} share="morph">
                <img
                  src={cs.heroImage}
                  alt={cs.heroAlt}
                  loading={priority ? "eager" : "lazy"}
                  className="aspect-square w-full border border-ink/10 object-cover shadow-[0_2px_12px_rgba(24,22,17,0.10)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_14px_28px_rgba(24,22,17,0.16)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                />
              </ViewTransition>
              <div className="absolute -top-2.5 right-3 flex flex-col items-end gap-1.5">
                <Sticker tone="hype" tilt={-4}>
                  {cs.year}
                </Sticker>
                <Sticker tone="cobalt" tilt={2}>
                  {cs.domain}
                </Sticker>
              </div>
            </div>
            <m.div
              className="pb-6"
              style={
                desktop
                  ? {
                      y: textY,
                      opacity: hasNext ? textFollowOpacity : undefined,
                    }
                  : undefined
              }
            >
              <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">
                {catalogNumber(cs.order)} · {cs.company}
              </p>
              <h2 className="mt-2 text-[length:var(--step-h2)] font-display font-semibold tracking-tight group-hover:text-cobalt">
                {cs.title}
              </h2>
              <p className="mt-3 max-w-prose text-lg leading-relaxed text-ink-soft">
                {cs.subtitle}
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-soft">
                {cs.role} · {cs.year} · {cs.domain}
              </p>
            </m.div>
          </div>
        </Link>
      </m.div>
    </div>
  );
}
