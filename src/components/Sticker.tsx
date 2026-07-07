"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";

// The signature element: hype-sticker chips for meta tags ("2025", "CRM /
// Enterprise SaaS"), like the promo stickers on a shrink-wrapped sleeve.
// Used on record art in the crate and on case study heroes — nowhere else,
// so the device stays special. Entrance (scale-in, as if just pressed onto
// the sleeve) is the one animated moment; the tilt itself is plain CSS driven
// by --tilt/--tilt-hover so it composes with the entrance scale rather than
// fighting over the `rotate` property.
export default function Sticker({
  children,
  tone = "hype",
  tilt = -3,
}: {
  children: ReactNode;
  tone?: "hype" | "cobalt" | "paper";
  tilt?: number;
}) {
  const tones = {
    hype: "bg-hype text-ink",
    cobalt: "bg-cobalt text-paper",
    paper: "bg-paper text-ink border border-ink/20",
  };
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  const style = {
    "--tilt": `${tilt}deg`,
    "--tilt-hover": `${tilt * 1.4}deg`,
  } as CSSProperties;

  const className = `inline-block [rotate:var(--tilt)] rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider shadow-sm transition-[rotate] duration-200 ease-out group-hover:[rotate:var(--tilt-hover)] motion-reduce:transition-none motion-reduce:group-hover:[rotate:var(--tilt)] ${tones[tone]}`;

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className} style={style}>
        {children}
      </span>
    );
  }

  return (
    <m.span
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.span>
  );
}
