"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { TocEntry } from "@/lib/reading";

// Matches the `scroll-margin-top: 5.5rem` set globally on headings in
// globals.css, so the animated jump lands exactly where a native anchor
// jump would.
const SCROLL_OFFSET = 88;

// Sticky on desktop (rendered as an aside beside the MDX body), a plain
// collapsible list on narrow viewports. Scroll-spy via native
// IntersectionObserver — no new dependency, SSR-safe (effect only runs
// client-side, initial render just shows the plain list with nothing active).
export default function CaseStudyToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (entries.length === 0) return;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (observedEntries) => {
        const visible = observedEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px" }
    );
    observerRef.current = observer;

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [entries]);

  // A jump, not a glide: a barely-underdamped spring gives the faintest
  // settle at the end rather than the flat, linear feel of
  // `scroll-behavior: smooth` — unhurried and understated, not a snap or a
  // visible bounce.
  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const targetY = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
    } else {
      animate(window.scrollY, targetY, {
        type: "spring",
        duration: 1,
        bounce: 0.05,
        onUpdate: (v) => window.scrollTo(0, v),
      });
    }
    history.pushState(null, "", `#${id}`);
  }

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Case study sections" className="text-sm lg:h-full">
      {/* Mobile: collapsible disclosure so the TOC doesn't eat vertical space */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-ink/15 px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink-soft lg:hidden"
      >
        Jump to section
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <ul className={`${open ? "block" : "hidden"} mt-2 space-y-1 lg:mt-0 lg:block lg:sticky lg:top-24`}>
        {entries.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? "pl-3" : ""}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                jumpTo(entry.id);
              }}
              className={`block border-l-2 py-1 pl-3 transition-colors ${
                activeId === entry.id
                  ? "border-green text-green"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
