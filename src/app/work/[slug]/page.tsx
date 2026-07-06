import type { Metadata } from "next";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import RecordCard from "@/components/RecordCard";
import { catalogNumber } from "@/lib/catalog";
import Sticker from "@/components/Sticker";
import { mdxComponents } from "@/components/mdx";
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

// Quieter than the crate: the metaphor recedes, the work carries the color.
export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const others = getAllCaseStudies().filter((other) => other.slug !== cs.slug);

  return (
    <article className="overflow-x-clip px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-2xl">
        {/* Persistent back affordance; becomes the reverse shared-element trigger in Phase 3 */}
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-ink-soft hover:text-cobalt"
        >
          ← Crate
        </Link>

        {/* Hero: this image is the shared element that morphs from the crate in Phase 3 */}
        <header className="mt-8">
          <div className="relative">
            {/* Same ViewTransition name as the crate card: this is the morph target */}
            <ViewTransition name={`record-${cs.slug}`} share="morph">
              <img
                src={cs.heroImage}
                alt={cs.heroAlt}
                className="aspect-square w-full border border-ink/10 object-cover shadow-[0_2px_12px_rgba(24,22,17,0.10)]"
              />
            </ViewTransition>
            <div className="absolute -top-2.5 right-3 flex flex-col items-end gap-1.5">
              <Sticker tone="hype" tilt={-4}>
                {cs.year}
              </Sticker>
              <Sticker tone="cobalt" tilt={2}>
                {cs.domain}
              </Sticker>
            </div>
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-wider text-ink-soft">
            {catalogNumber(cs.order)} · {cs.company}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight">
            {cs.title}
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-ink-soft">{cs.subtitle}</p>

          {/* Summary block */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-kraft/50 py-5 text-sm sm:grid-cols-4">
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

          {cs.metrics && cs.metrics.length > 0 && (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {cs.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="font-display text-3xl font-semibold tracking-tight">
                    {m.value}
                  </dd>
                  <dt className="mt-1 text-sm text-ink-soft">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </header>

        {/* Body */}
        <div className="mt-12">
          <MDXRemote source={cs.body} components={mdxComponents} />
        </div>
      </div>

      {/* Never dead-end a reader */}
      {others.length > 0 && (
        <footer className="mx-auto mt-20 max-w-4xl border-t border-kraft/50 pt-8">
          <h2 className="font-mono text-xs uppercase tracking-wider text-ink-soft">
            Other case studies
          </h2>
          <div className="mt-6 grid gap-10 sm:grid-cols-2">
            {others.map((other) => (
              <RecordCard key={other.slug} caseStudy={other} />
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
