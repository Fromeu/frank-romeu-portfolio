import type { Metadata } from "next";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
  alternates: { canonical: "/contact" },
};

// Deliberately simple: direct channels, no form (nothing to deploy or spam-proof).
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-[length:var(--step-hero)] font-display font-semibold tracking-tight">
        Contact
      </h1>
      <Reveal>
        <p className="mt-6 leading-relaxed text-ink-soft">
          The fastest way to reach me is email.
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <ul className="mt-8 space-y-4">
          <li>
            <span className="mr-3 font-mono text-xs uppercase tracking-wider text-ink-soft">
              Email
            </span>
            <a
              href={`mailto:${site.email}`}
              className="text-cobalt underline underline-offset-4"
            >
              {site.email}
            </a>
          </li>
          <li>
            <span className="mr-3 font-mono text-xs uppercase tracking-wider text-ink-soft">
              LinkedIn
            </span>
            <a
              href={site.linkedin}
              className="text-cobalt underline underline-offset-4"
              rel="me noopener"
            >
              {site.linkedin.replace("https://www.", "")}
            </a>
          </li>
          <li>
            <span className="mr-3 font-mono text-xs uppercase tracking-wider text-ink-soft">
              Resume
            </span>
            <a
              href={site.resumePath}
              download
              className="text-cobalt underline underline-offset-4"
            >
              Download (PDF)
            </a>
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
