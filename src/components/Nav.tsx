import Link from "next/link";
import { site } from "@/lib/site";

// Global nav: always present, quiet, high contrast, never inside the metaphor.
export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          {site.name}
        </Link>
        {/* py-3 keeps every nav target ≥44px tall for touch */}
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <Link href="/" className="px-2 py-3 hover:underline sm:px-3">
            Work
          </Link>
          <Link href="/about" className="px-2 py-3 hover:underline sm:px-3">
            About
          </Link>
          <Link href="/contact" className="px-2 py-3 hover:underline sm:px-3">
            Contact
          </Link>
          <a
            href={site.resumePath}
            download
            className="ml-1 whitespace-nowrap rounded-sm bg-ink px-3 py-3 text-paper transition-colors hover:bg-cobalt sm:ml-2"
          >
            <span className="sm:hidden">Resume</span>
            <span className="hidden sm:inline">Download resume</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
