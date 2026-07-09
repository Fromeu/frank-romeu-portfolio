import type { Metadata } from "next";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.title}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-[length:var(--step-hero)] font-display font-semibold tracking-tight">
        About
      </h1>

      <Reveal>
        <p className="font-display font-display-soft mt-8 text-[length:var(--step-lede)] italic leading-snug">
          There are two things I look for in a design problem: real complexity
          (systems where simplification would cost something) and human cost
          (places where the product&rsquo;s demands are wearing people down
          without them realizing it). Those two things overlap a lot in
          enterprise software. That&rsquo;s where most of my work lives.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="mt-12 text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
          Background
        </h2>
        <div className="mt-4 space-y-5 leading-relaxed">
          <p>
            I grew up in Aventura (just north of Miami), which is the kind of
            place that builds synthesis into how you think &mdash; multiple
            cultures, everything borrowing from everything else. I studied
            psychology at Florida State (decision-making under incomplete
            information), spent years making hip hop beats seriously enough
            to understand rhythm as a structural concept, and went deep into
            photography and film. Apple Retail in Aventura and later Boston
            brought me close to products and customers. Eventually the
            design path became obvious.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <h2 className="mt-12 text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
          Work
        </h2>
        <div className="mt-4 space-y-5 leading-relaxed">
          <p>
            My first design role was at Aquent in Boston, where I was the
            sole designer on BOOK (an ML-powered talent search platform that
            made creative portfolios searchable by visual style). It shipped
            in 2019. Within three months: $7.4M in revenue, 98.7% talent
            retention.
          </p>
          <p>
            From there I joined HubSpot, where I&rsquo;ve spent seven years
            across developer tooling and CRM. I founded the UI Extensibility
            project, led the App Settings Framework (now underlying 1,500+
            marketplace apps, +32 NPS across affected integrations), drove
            the vision for CRM Page Editor (
            <mark className="bg-orange/15 px-1 font-mono text-sm not-italic text-orange">
              [NEEDS CONFIRMATION: this says 700% increase in admin usage —
              the case study itself says +400% for &ldquo;unique
              customizations per month.&rdquo; Same metric worded two ways,
              or two different numbers? Reconcile before this ships.]
            </mark>
            ), and now own the CRM Index page &mdash; the highest-traffic
            surface in the product, used daily by hundreds of thousands of
            salespeople and operators. Promoted twice. Working toward Staff.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.18}>
        <h2 className="mt-12 text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
          How I work
        </h2>
        <div className="mt-4 space-y-5 leading-relaxed">
          <p>
            Artifact-driven. I think by making things &mdash; prototypes,
            briefs, interactive builds, research syntheses. I&rsquo;ll write
            the vision doc and push pixels. Most of my cross-functional work
            is async. I add value by absorbing ambiguity: parking open
            questions so the team can move, naming tradeoffs that would
            otherwise stay invisible.
          </p>
          <p>
            Based in Orlando. From Miami. More interested in what people
            actually do than what they say they&rsquo;ll do.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
