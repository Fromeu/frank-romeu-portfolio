"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Global nav: always present, quiet, high contrast, never inside the metaphor.
export default function Nav() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on route change: adjust state during render (React's recommended
  // pattern for resetting state when a prop changes) rather than an effect,
  // which would cause an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Escape closes the drawer and returns focus to the toggle so keyboard
  // users don't lose their place; opening moves focus to the first link.
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const linkClass = (href: string) =>
    `px-2 py-3 sm:px-3 border-b-2 transition-colors ${
      isActive(href)
        ? "border-cobalt text-cobalt"
        : "border-transparent hover:border-ink/30"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          {site.name}
        </Link>

        {/* Desktop: inline links, always visible */}
        <div className="hidden items-center gap-1 text-sm sm:flex sm:gap-2">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <a
            href={site.resumePath}
            download
            className="ml-2 whitespace-nowrap rounded-sm bg-ink px-3 py-3 text-paper transition-colors hover:bg-cobalt"
          >
            Download resume
          </a>
        </div>

        {/* Mobile: hamburger + drawer */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={drawerId}
          className="flex h-11 w-11 items-center justify-center sm:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={drawerId}
            className="overflow-hidden border-t border-ink/10 sm:hidden"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col px-4 py-2">
              {LINKS.map((link, i) => (
                <Link
                  key={link.href}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  className={`py-3 text-base ${isActive(link.href) ? "text-cobalt" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={site.resumePath}
                download
                className="my-2 rounded-sm bg-ink px-3 py-3 text-center text-paper transition-colors hover:bg-cobalt"
              >
                Download resume
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
