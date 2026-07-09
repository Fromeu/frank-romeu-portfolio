"use client";

import { useEffect, useState } from "react";

// Tied to the existing load-sequence gate (html.entering, set by the inline
// script in layout.tsx) rather than inventing a new animation trigger — only
// counts up on a fresh-session homepage landing. That script already skips
// adding "entering" under prefers-reduced-motion, so checking for the class
// is sufficient here.
export default function CaseStudyCount({ count }: { count: number }) {
  const [display, setDisplay] = useState(count);

  useEffect(() => {
    if (count === 0) return;
    if (!document.documentElement.classList.contains("entering")) return;

    const duration = 560;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * count));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  return <>{display}</>;
}
