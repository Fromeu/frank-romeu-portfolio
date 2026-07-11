import type { Metadata } from "next";
import { preload } from "react-dom";
import CaseStudyCount from "@/components/CaseStudyCount";
import CaseStudyRow from "@/components/CaseStudyRow";
import FeaturedCaseStudy from "@/components/FeaturedCaseStudy";
import { getAllCaseStudies } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const HEADLINE = "I design the human side of complex systems.";

// Computed at build time from a fixed start year, so the stat advances on
// its own with each redeploy rather than needing a manual yearly edit.
const UX_FIELD_START_YEAR = 2017;
const yearsInUxField = new Date().getFullYear() - UX_FIELD_START_YEAR;

const STATS = [
  { value: String(yearsInUxField), label: "Years in UX field" },
  { value: "2×", label: "Promoted" },
] as const;

export default function Home() {
  const caseStudies = getAllCaseStudies();
  const [featured, ...rest] = caseStudies;
  const words = HEADLINE.split(" ");

  // LCP: preload only the first card's hero (emits <link rel="preload">)
  if (featured) {
    preload(featured.heroImage, { as: "image", fetchPriority: "high" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      {/* Intro: text is always fully in the DOM and readable immediately —
          the word-by-word cascade below is a pure-CSS, pre-hydration load
          flourish (same html.entering gate CaseStudyCount uses), never a
          gate. No-JS / reduced-motion renders the settled state instantly. */}
      <section className="relative z-0 mb-20 md:mb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-green/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 -z-10 h-64 w-64 rounded-full bg-orange/10 blur-3xl"
        />
        {/* Margin kicker — a magazine spine label, sitting outside the main
            column in the gutter. Only shown where there's real gutter room. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-14 top-0 hidden h-full items-center xl:flex"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-soft/60">
            Selected work — Vol. 2026
          </span>
        </div>
        <p className="inline-block rounded-full bg-ink px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-paper">
          {site.title}
        </p>
        <h1 className="font-display mt-5 max-w-[18ch] text-[length:var(--step-display)] font-semibold leading-[1.05] tracking-tight">
          {words.map((word, i) => (
            <span key={i}>
              <span
                data-reveal-word
                style={{ animationDelay: `${i * 45}ms` }}
                className="inline-block"
              >
                {word}
              </span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        {/* Asymmetric split: prose on the left, an editorial stat sidebar on
            the right — a real structural break from "centered hero text
            block," which is the single most common portfolio-template
            formula there is. */}
        <div className="mt-6 lg:grid lg:grid-cols-[1fr_16rem] lg:items-start lg:gap-14">
          <p className="max-w-[62ch] text-xl leading-relaxed text-ink-soft md:text-2xl">
            Most enterprise software has a timing problem. It asks for effort
            at the wrong moment, gives feedback too late, or moves so fast
            there&rsquo;s no room to actually think. That&rsquo;s the problem
            I work on &mdash; designing the rhythm of complex systems so they
            feel more human. Seven years at HubSpot, currently owning the
            CRM Index page. Before that, an ML-powered talent search
            platform at Aquent. The background that shapes how I work: a
            psychology degree, years of making hip hop beats, visual art and
            film, and growing up in Miami &mdash; a city that builds remix
            into your worldview.
          </p>
          <dl className="mt-8 flex gap-8 lg:mt-12 lg:flex-col lg:gap-0 lg:divide-y lg:divide-line">
            {STATS.map((stat) => (
              <div key={stat.label} className="lg:py-4 lg:first:pt-0 lg:last:pb-0">
                <dd className="text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
                  {stat.value}
                </dd>
                <dt className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-soft">
                  {stat.label}
                </dt>
              </div>
            ))}
            <div className="lg:py-4 lg:first:pt-0 lg:last:pb-0">
              <dd className="text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
                <CaseStudyCount count={caseStudies.length} />
              </dd>
              <dt className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-soft">
                Case studies below
              </dt>
            </div>
          </dl>
        </div>
      </section>

      {/* Lead story + supporting grid, not one uniform grid — a grid treats
          every case study identically; a featured slot is what makes the
          page read as edited rather than templated. */}
      <section aria-label="Case studies">
        {featured && <FeaturedCaseStudy caseStudy={featured} />}

        {rest.length > 0 && (
          <div className="mt-20 md:mt-28">
            <p className="mb-10 border-t border-line pt-4 font-mono text-xs uppercase tracking-wider text-ink-soft">
              More work
            </p>
            {/* Same asymmetric side-by-side family as the featured story
                above, just smaller — each entry alternates which side the
                image sits on, so the rhythm mirrors down the page instead
                of repeating one shape. */}
            <div className="divide-y divide-line">
              {rest.map((cs, i) => (
                <div key={cs.slug} className="py-10 first:pt-0">
                  <CaseStudyRow caseStudy={cs} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
