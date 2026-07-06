import Link from "next/link";

// Friendly dead-end for stale ATS/LinkedIn links.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        That record isn&apos;t in the crate.
      </h1>
      <p className="mt-4 text-ink-soft">
        The page you&apos;re after may have moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm bg-ink px-5 py-3 text-paper transition-colors hover:bg-cobalt"
      >
        Back to the crate
      </Link>
    </div>
  );
}
