import type { ReactNode } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { slugify } from "@/lib/reading";
import { Figure, Carousel } from "@/components/mdx-media";

// Components available inside case study MDX bodies, plus element mappings
// that give the body its editorial typography.

/** Flattens heading children to plain text so the rendered `id` matches the
 * id CaseStudyToc/extractToc derive from the same raw heading line. */
function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textContent((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export { Figure, Carousel };

export function ImageGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-10 grid gap-5 sm:grid-cols-2 [&>figure]:my-0">{children}</div>
  );
}

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="my-12 border-l-2 border-green pl-6">
      {/* no <p> wrapper: MDX already paragraph-wraps the quote text */}
      <div className="font-display font-display-soft text-2xl italic font-medium leading-snug tracking-tight md:text-3xl">
        {children}
      </div>
      {attribution && (
        <cite className="mt-3 block font-mono text-xs uppercase not-italic tracking-wider text-ink-soft">
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}

/** Compact companion to `PullQuote` for a cluster of short quotes that need
 * equal visual weight (e.g. 2 pieces of customer-voice feedback side by
 * side) rather than one dominant editorial blockquote. `Quote` also stands
 * alone outside a grid — same compact card, full paragraph width. */
export function QuoteGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2 [&>blockquote]:my-0">
      {children}
    </div>
  );
}

export function Quote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="my-8 flex flex-col rounded-2xl bg-paper-dim px-6 py-6">
      <span aria-hidden="true" className="font-display text-5xl leading-none text-green">
        &ldquo;
      </span>
      <div className="-mt-3 flex-1 font-display text-lg leading-relaxed tracking-tight text-ink">
        {children}
      </div>
      {attribution && (
        <cite className="mt-3 block font-mono text-xs uppercase not-italic tracking-wider text-ink-soft">
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-10 rounded-xl border border-ink/15 border-l-2 border-l-green p-5">
      {title && (
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-green">
          {title}
        </p>
      )}
      <div className="leading-relaxed [&>p]:m-0">{children}</div>
    </aside>
  );
}

/** `Stat` is also reused directly by the case-study header (see
 * src/app/work/[slug]/page.tsx) for its lede metrics, so a number pulled out
 * of body prose reads as the same "headline number" treatment a reader has
 * already seen.
 *
 * `wideCols` sets the widest-breakpoint column count so a grid never lands
 * on a lopsided last row — e.g. 6 stats want a 3-column ceiling (3+3), not 4
 * (4+2). It's a string, not a number: this Next/MDX version doesn't
 * evaluate numeric `{3}` JSX expressions passed to custom components, only
 * string attributes. Tailwind also needs the full class name statically
 * present, hence the lookup instead of a template string. */
const wideColsClass: Record<"3" | "4", string> = {
  "3": "lg:grid-cols-3",
  "4": "lg:grid-cols-4",
};

export function StatGrid({
  children,
  wideCols = "4",
}: {
  children: ReactNode;
  wideCols?: "3" | "4";
}) {
  return (
    <dl className={`my-8 grid grid-cols-2 gap-4 ${wideColsClass[wideCols]}`}>
      {children}
    </dl>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-paper-dim px-5 py-4">
      <dd className="font-display font-display-wonk text-[length:var(--step-h2)] font-semibold leading-none tracking-tight text-orange">
        {value}
      </dd>
      <dt className="mt-2 text-sm text-ink-soft">{label}</dt>
    </div>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  Figure,
  ImageGrid,
  Carousel,
  PullQuote,
  QuoteGrid,
  Quote,
  Callout,
  StatGrid,
  Stat,
  h2: (props) => (
    <h2
      id={slugify(textContent(props.children))}
      className="clear-both mt-14 text-[length:var(--step-h2)] font-display font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      id={slugify(textContent(props.children))}
      className="clear-both mt-10 text-[length:var(--step-h3)] font-display font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="mt-5 leading-relaxed" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-5" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-5" {...props} />,
  a: (props) => (
    <a className="text-green underline underline-offset-4" {...props} />
  ),
  // Plain markdown `>` quotes (e.g. the placeholder notices)
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-l-2 border-line pl-4 text-ink-soft [&_p]:mt-2 first:[&_p]:mt-0"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-12 border-line/50" {...props} />,
};
