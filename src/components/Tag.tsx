import type { ReactNode } from "react";

// Plain metadata badge (year, domain) — a static inline element, never
// floated over artwork. Color is deliberate, not decorative: green/orange
// are reserved accents, so most tags stay neutral and only draw on an
// accent when it's actually meaningful (e.g. an in-progress status).
export default function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "orange";
}) {
  const tones = {
    neutral: "border-line text-ink-soft",
    green: "border-green/40 text-green",
    orange: "border-orange/40 text-orange",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
