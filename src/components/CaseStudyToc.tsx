"use client";

import { useEffect, useRef, useState } from "react";
import type { TocEntry } from "@/lib/reading";

// Sticky on desktop (rendered as an aside beside the MDX body), a plain
// collapsible list on narrow viewports. Scroll-spy via native
// IntersectionObserver — no new dependency, SSR-safe (effect only runs
// client-side, initial render just shows the plain list with nothing active).
export default function CaseStudyToc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Case study sections" className="text-sm">
      {/* Mobile: collapsible disclosure so the TOC doesn't eat vertical space */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border border-ink/15 px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink-soft lg:hidden"
      >
        Jump to section
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <ul className={`${open ? "block" : "hidden"} mt-2 space-y-1 lg:mt-0 lg:block lg:sticky lg:top-24`}>
        {entries.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? "pl-3" : ""}>
            <a
              href={`#${entry.id}`}
              onClick={() => setOpen(false)}
              className={`block border-l-2 py-1 pl-3 transition-colors ${
                activeId === entry.id
                  ? "border-cobalt text-cobalt"
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
