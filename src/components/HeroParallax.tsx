"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";

// A small, scoped reintroduction of scroll-driven motion — the case-study
// hero drifts a few pixels as the reader begins the article, instead of
// sitting completely inert. Deliberately subtle (24px max) and scoped to one
// element, not a whole-page scroll choreography.
export default function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 24]);

  if (prefersReducedMotion) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <m.div ref={ref} style={{ y }}>
      {children}
    </m.div>
  );
}
