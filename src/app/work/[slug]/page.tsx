import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import CaseStudyCard from "@/components/CaseStudyCard";
import HeroParallax from "@/components/HeroParallax";
import { mdxComponents } from "@/components/mdx";
import CaseStudyToc from "@/components/CaseStudyToc";
import { extractToc, estimateReadMinutes } from "@/lib/reading";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.subtitle,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      title: cs.title,
      description: cs.subtitle,
      images: [{ url: cs.ogImage ?? cs.heroImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: cs.title,
      description: cs.subtitle,
      images: [cs.ogImage ?? cs.heroImage],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const others = getAllCaseStudies().filter((other) => other.slug !== cs.slug);
  const toc = extractToc(cs.body);
  const readMinutes = estimateReadMinutes(cs.body);

  return (
    <article className="overflow-x-clip px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-green"
        >
          ← Work
        </Link>

        <header className="mt-8">
          {/* Full-bleed: only the hero image breaks out to the viewport edge —
              everything else in the header stays within the max-w-2xl column. */}
          <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2">
            {/* Shared-element morph target — same ViewTransition name as the card's cover art */}
            <HeroParallax>
              <ViewTransition name={`case-study-${cs.slug}`} share="morph">
                <img
                  src={cs.heroImage}
                  alt={cs.heroAlt}
                  className="aspect-square w-full border border-line object-cover"
                />
              </ViewTransition>
            </HeroParallax>
          </div>

          <p className="mt-14 font-mono text-xs uppercase tracking-wider text-ink-soft">
            {cs.company} · {readMinutes} min read
          </p>
          <h1 className="mt-3 text-[length:var(--step-hero)] font-display font-semibold leading-[1.08] tracking-tight">
            {cs.title}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-ink-soft">{cs.subtitle}</p>

          {/* Summary block */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 text-sm sm:grid-cols-4">
            {(
              [
                ["Company", cs.company],
                ["Role", cs.role],
                ["Timeline", `${cs.year} · ${cs.duration}`],
                ["Domain", cs.domain],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                  {label}
                </dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>

          {cs.metrics && cs.metrics.length > 0 ? (
            <dl className="mt-6 flex flex-wrap gap-4">
              {cs.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-paper-dim px-5 py-4">
                  <dd className="font-display font-display-wonk text-[length:var(--step-hero)] font-semibold leading-none tracking-tight text-orange">
                    {m.value}
                  </dd>
                  <dt className="mt-2 text-sm text-ink-soft">{m.label}</dt>
                </div>
              ))}
            </dl>
          ) : cs.status === "in-progress" ? (
            <p className="mt-6 font-mono text-xs uppercase tracking-wider text-ink-soft">
              In progress — not yet shipped
            </p>
          ) : null}
        </header>
      </div>

      {/* Body + table of contents: wider than the header column so the TOC
          has room to sit alongside on desktop, without widening the prose
          column itself past a comfortable reading measure. */}
      <div className="mx-auto mt-12 max-w-[52rem] lg:grid lg:grid-cols-[14rem_1fr] lg:gap-12">
        <div className="mb-8 lg:mb-0 lg:mt-1">
          <CaseStudyToc entries={toc} />
        </div>
        <div className="max-w-2xl">
          <MDXRemote source={cs.body} components={mdxComponents} />
        </div>
      </div>

      {/* Never dead-end a reader */}
      {others.length > 0 && (
        <footer className="mx-auto mt-20 max-w-4xl border-t border-line pt-8">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            Other case studies
          </h2>
          <div className="mt-6 grid gap-10 sm:grid-cols-2">
            {others.map((other, i) => (
              <CaseStudyCard key={other.slug} caseStudy={other} index={i} />
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
