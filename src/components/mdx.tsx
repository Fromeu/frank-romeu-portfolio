import type { ReactNode } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { slugify } from "@/lib/reading";

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

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  /** Full-bleed singles break out of the text column to the viewport edge. */
  fullBleed?: boolean;
};

export function Figure({ src, alt, caption, fullBleed }: FigureProps) {
  return (
    <figure
      className={
        fullBleed
          ? "relative left-1/2 my-12 w-screen max-w-none -translate-x-1/2"
          : "my-10"
      }
    >
      {/* Plain <img>: static export has no image optimizer; srcset variants come in Phase 4 */}
      <img src={src} alt={alt} loading="lazy" className="w-full border border-ink/10" />
      {caption && (
        <figcaption
          className={`mt-3 font-mono text-xs uppercase tracking-wider text-ink-soft ${
            fullBleed ? "mx-auto max-w-2xl px-4" : ""
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

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
    <blockquote className="my-12 border-l-2 border-cobalt pl-6">
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

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-10 border border-ink/15 border-l-2 border-l-cobalt p-5">
      {title && (
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-cobalt">
          {title}
        </p>
      )}
      <div className="leading-relaxed [&>p]:m-0">{children}</div>
    </aside>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  Figure,
  ImageGrid,
  PullQuote,
  Callout,
  h2: (props) => (
    <h2
      id={slugify(textContent(props.children))}
      className="mt-14 text-[length:var(--step-h2)] font-display font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      id={slugify(textContent(props.children))}
      className="mt-10 text-[length:var(--step-h3)] font-display font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="mt-5 leading-relaxed" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-5" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-5" {...props} />,
  a: (props) => (
    <a className="text-cobalt underline underline-offset-4" {...props} />
  ),
  // Plain markdown `>` quotes (e.g. the placeholder notices)
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-l-2 border-kraft pl-4 text-ink-soft [&_p]:mt-2 first:[&_p]:mt-0"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-12 border-kraft/50" {...props} />,
};
