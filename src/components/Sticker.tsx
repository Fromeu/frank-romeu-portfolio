import type { ReactNode } from "react";

// The signature element: hype-sticker chips for meta tags ("2025", "CRM /
// Enterprise SaaS"), like the promo stickers on a shrink-wrapped sleeve.
// Used on record art in the crate and on case study heroes — nowhere else,
// so the device stays special.
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
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider shadow-sm ${tones[tone]}`}
      style={{ rotate: `${tilt}deg` }}
    >
      {children}
    </span>
  );
}
