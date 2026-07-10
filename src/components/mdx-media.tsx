"use client";

import { Children, isValidElement, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

/** Shared enlarged-image overlay used by both Figure and Carousel lightboxes.
 * Portaled to document.body: fullBleed/Carousel wrappers apply a CSS transform
 * for their breakout positioning, and a transformed ancestor becomes the
 * containing block for `position: fixed` descendants — without the portal the
 * overlay gets trapped inside that wrapper instead of covering the viewport. */
function LightboxOverlay({
  src,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <m.img
        key={src}
        src={src}
        alt={alt}
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="max-h-[88vh] max-w-full cursor-default rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {onPrev && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 px-3.5 py-2 text-lg leading-none text-ink hover:bg-paper sm:left-6"
        >
          ‹
        </button>
      )}
      {onNext && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 px-3.5 py-2 text-lg leading-none text-ink hover:bg-paper sm:right-6"
        >
          ›
        </button>
      )}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full bg-paper/90 px-3 py-1.5 text-sm leading-none text-ink hover:bg-paper sm:right-6 sm:top-6"
      >
        ✕
      </button>
    </m.div>,
    document.body
  );
}

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  /** Full-bleed singles break out of the text column to the viewport edge. */
  fullBleed?: boolean;
};

export function Figure({ src, alt, caption, fullBleed }: FigureProps) {
  const [open, setOpen] = useState(false);
  return (
    <figure
      className={
        fullBleed
          ? "relative left-1/2 my-12 w-screen max-w-none -translate-x-1/2 lg:static lg:left-auto lg:w-full lg:max-w-full lg:translate-x-0"
          : "my-10"
      }
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge: ${alt}`}
        className="block w-full cursor-zoom-in"
      >
        {/* Plain <img>: static export has no image optimizer; srcset variants come in Phase 4 */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full border border-ink/10 ${fullBleed ? "" : "rounded-2xl"}`}
        />
      </button>
      {caption && (
        <figcaption
          className={`mt-3 font-mono text-xs uppercase tracking-wider text-ink-soft ${
            fullBleed ? "mx-auto max-w-2xl px-4 lg:mx-0 lg:max-w-none lg:px-0" : ""
          }`}
        >
          {caption}
        </figcaption>
      )}
      <AnimatePresence>
        {open && (
          <LightboxOverlay src={src} alt={alt} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </figure>
  );
}

type CarouselSlide = {
  src: string;
  alt: string;
};

const AUTO_SCROLL_SPEED = 34; // px/sec — slow, ambient drift
const IDLE_RESUME_DELAY = 2200; // ms of no interaction before drift resumes

/** Slides are plain <img> children (mirrors ImageGrid/Figure) rather than a
 * `slides` array prop — next-mdx-remote/rsc's compileMDX only evaluates
 * primitive JSX attribute values, silently dropping array/object literals. */
export function Carousel({ children, caption }: { children: ReactNode; caption?: string }) {
  const slides: CarouselSlide[] = Children.toArray(children)
    .filter(isValidElement)
    .map((el) => {
      const props = el.props as { src?: string; alt?: string };
      return { src: props.src ?? "", alt: props.alt ?? "" };
    });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const lightboxOpen = openIndex !== null;

  // Auto-scroll bookkeeping lives in refs, not state, so per-frame position
  // updates don't trigger a re-render every ~16ms.
  const directionRef = useRef<1 | -1>(1);
  const scrollPosRef = useRef<number | null>(null);
  const lastInteractionAtRef = useRef(0);
  const hoverRef = useRef(false);
  const focusWithinRef = useRef(false);
  const pointerDownRef = useRef(false);
  const isAutoWriteRef = useRef(false);
  // Defaults to true (fail open): the IntersectionObserver below only ever
  // downgrades this once it positively confirms the strip is off-screen. If
  // its callback is ever delayed or never fires in some browser, the drift
  // still runs rather than silently never starting at all.
  const inViewRef = useRef(true);
  // Whether we've turned off the container's CSS scroll-snap to let the
  // drift move freely between slides (see the auto-scroll effect below).
  const snapDisabledRef = useRef(false);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  // Native snap should only take over for a gesture the reader actually
  // made — restoring it just because the drift paused on hover would cause
  // a visible backward jump to the nearest slide with no real scroll behind
  // it, which reads as a glitch rather than "settling."
  function restoreSnap() {
    if (!snapDisabledRef.current) return;
    const el = scrollRef.current;
    if (el) el.style.scrollSnapType = "";
    snapDisabledRef.current = false;
  }

  // Distinguishes our own auto-scroll writes from genuine user scrolling
  // (wheel, trackpad, scrollbar drag) so only real interaction resets the
  // idle timer that gates when drift is allowed to resume.
  function handleScroll() {
    updateScrollState();
    if (isAutoWriteRef.current) {
      isAutoWriteRef.current = false;
      return;
    }
    lastInteractionAtRef.current = Date.now();
    restoreSnap();
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // A drag frequently ends with the pointer outside the element, so the
  // release listener has to live on window rather than the scroll container.
  useEffect(() => {
    function onPointerUp() {
      if (pointerDownRef.current) {
        pointerDownRef.current = false;
        lastInteractionAtRef.current = Date.now();
      }
    }
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  // Only drift while the strip is actually on screen — otherwise every
  // carousel on a long case-study page would silently drift from mount,
  // off-screen, and land on a "random" position by the time a reader
  // actually scrolls to it.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || prefersReducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // The auto-scroll loop itself: a slow ping-pong drift (bounce at each end,
  // not an infinite loop — cloning slides for a seamless wrap isn't worth it
  // for a subtle ambient effect) that pauses for hover, keyboard focus,
  // touch/mouse drag, real scroll input, or the lightbox being open, and
  // resumes on its own after a short idle delay. Hard-disabled for
  // prefers-reduced-motion and while the lightbox is open — manual scroll
  // and the arrow buttons keep working regardless.
  useEffect(() => {
    if (prefersReducedMotion || lightboxOpen) return;
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;
    let lastTs: number | null = null;
    let wasPaused = true;

    function isPaused() {
      if (hoverRef.current || focusWithinRef.current || pointerDownRef.current) return true;
      if (Date.now() - lastInteractionAtRef.current < IDLE_RESUME_DELAY) return true;
      if (!inViewRef.current) return true;
      return false;
    }

    function tick(ts: number) {
      rafId = requestAnimationFrame(tick);
      const el = scrollRef.current;
      if (!el) return;
      if (lastTs === null) {
        lastTs = ts;
        return;
      }
      // Clamp dt so a backgrounded/throttled tab regaining focus can't
      // produce a single-frame teleport across the whole strip.
      const dt = Math.min((ts - lastTs) / 1000, 0.1);
      lastTs = ts;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const shouldPause = maxScroll <= 0 || isPaused();

      if (shouldPause) {
        wasPaused = true;
        return;
      }
      // CSS scroll-snap re-corrects the position on every write here (not
      // just once a scroll gesture "settles"), so it has to stay off for as
      // long as the drift is actively moving the strip — restoreSnap() only
      // turns it back on in response to a genuine user gesture.
      if (!snapDisabledRef.current) {
        el.style.scrollSnapType = "none";
        snapDisabledRef.current = true;
      }
      if (wasPaused) {
        // Just resumed (or first run) — resync from the live DOM rather than
        // a possibly-stale accumulator, since the user or a scroll-snap
        // correction may have moved the real position while paused.
        scrollPosRef.current = el.scrollLeft;
        wasPaused = false;
      }

      let pos = (scrollPosRef.current ?? el.scrollLeft) + directionRef.current * AUTO_SCROLL_SPEED * dt;
      if (pos >= maxScroll) {
        pos = maxScroll;
        directionRef.current = -1;
      } else if (pos <= 0) {
        pos = 0;
        directionRef.current = 1;
      }

      scrollPosRef.current = pos;
      isAutoWriteRef.current = true;
      el.scrollLeft = pos;
    }

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (snapDisabledRef.current) {
        el.style.scrollSnapType = "";
        snapDisabledRef.current = false;
      }
    };
  }, [prefersReducedMotion, lightboxOpen]);

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    lastInteractionAtRef.current = Date.now();
    restoreSnap();
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative left-1/2 my-12 w-screen max-w-none -translate-x-1/2 lg:static lg:left-auto lg:w-full lg:max-w-full lg:translate-x-0">
      <div
        className="group relative"
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
          lastInteractionAtRef.current = Date.now();
        }}
        onFocus={() => {
          focusWithinRef.current = true;
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            focusWithinRef.current = false;
            lastInteractionAtRef.current = Date.now();
          }
        }}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={() => {
            pointerDownRef.current = true;
            restoreSnap();
          }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-[max(1.5rem,calc((100vw-52rem)/2))] lg:px-0"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Enlarge: ${slide.alt}`}
              className="shrink-0 snap-start cursor-zoom-in"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                onLoad={updateScrollState}
                className="h-64 w-auto rounded-2xl border border-ink/10 object-cover sm:h-80"
              />
            </button>
          ))}
        </div>

        {/* Edge fades hint that the strip scrolls; fade out once you've reached that edge. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-paper to-transparent transition-opacity duration-200 sm:w-16 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-transparent transition-opacity duration-200 sm:w-16 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-1)}
          className={`absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-paper/90 p-2 text-ink shadow-md transition-opacity duration-200 hover:bg-paper sm:flex ${
            canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByAmount(1)}
          className={`absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-paper/90 p-2 text-ink shadow-md transition-opacity duration-200 hover:bg-paper sm:flex ${
            canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          ›
        </button>
      </div>
      {caption && (
        <p className="mt-3 px-4 font-mono text-xs uppercase tracking-wider text-ink-soft sm:px-[max(1.5rem,calc((100vw-52rem)/2))] lg:px-0">
          {caption}
        </p>
      )}
      <AnimatePresence>
        {openIndex !== null && (
          <LightboxOverlay
            src={slides[openIndex].src}
            alt={slides[openIndex].alt}
            onClose={() => setOpenIndex(null)}
            onPrev={() => setOpenIndex((i) => (i === null ? i : (i - 1 + slides.length) % slides.length))}
            onNext={() => setOpenIndex((i) => (i === null ? i : (i + 1) % slides.length))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
