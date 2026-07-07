import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

// Site-wide close, extending the established meta-text/hairline language
// (catalog numbers, kraft dividers) rather than inventing a new device.
export default function Footer() {
  return (
    <footer className="border-t border-kraft/50">
      <Reveal className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              {site.name}
            </p>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-ink-soft">
              {site.positioning}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-cobalt underline underline-offset-4"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                className="text-cobalt underline underline-offset-4"
                rel="me noopener"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={site.resumePath}
                download
                className="text-cobalt underline underline-offset-4"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-8 font-mono text-[length:var(--step-meta)] uppercase tracking-wider text-ink-soft/70">
          FRA · Orlando, FL
        </p>
      </Reveal>
    </footer>
  );
}
