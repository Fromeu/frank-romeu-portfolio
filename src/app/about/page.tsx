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

      {/* DRAFT — Frank to confirm/rewrite. This is the one line that has to
          be exactly his conviction, not an AI approximation of it. */}
      <Reveal>
        <p className="font-display font-display-soft mt-8 text-[length:var(--step-lede)] italic leading-snug">
          I design for the moment someone has to trust a system enough to act on it.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-8 space-y-5 leading-relaxed">
          <p>
            I&rsquo;m a Senior Product Designer II at HubSpot, based in Orlando, Florida,
            and actively working toward Staff. I own the CRM Index — the
            highest-traffic surface in HubSpot&rsquo;s product — across table, board,
            calendar, map, gantt, and report views.
          </p>
          <p>
            I joined HubSpot as a product designer on Strategic Integrations, then
            moved to the Developer Product Group, where I founded the UI
            Extensibility project and led the App Lifecycle team, driving the app
            settings framework. That earned a promotion to Senior Product Designer
            I. From there I moved into the CRM product group and drove the research
            and vision behind the CRM Page Editor — the project that put full
            record-page and preview-panel customization on the map. That earned
            Senior Product Designer II. I&rsquo;m now building out and leading the
            Index page team, and driving CRM modernization more broadly.
          </p>
          <p>
            Before UX, I worked Apple Retail in Aventura and Boston — close to
            product and people, without the design title. My first real design job
            was at Aquent in Boston, which is where UX became the actual direction.
            I have a B.S. in Psychology from Florida State University.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <h2 className="mt-12 text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
          Design philosophy
        </h2>
        <p className="mt-4 leading-relaxed">
          My leverage is strategic framing and systems thinking. I think best by
          making things — a prototype, a doc, an interactive artifact — and then
          stress-testing it against real constraints and stakeholder pushback.
          I&rsquo;m stronger at high-level product reasoning than narrow feature
          execution.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <h2 className="mt-12 text-[length:var(--step-h2)] font-display font-semibold tracking-tight">
          Career highlights
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            Founded the UI Extensibility project and led the App Lifecycle team in
            HubSpot&rsquo;s Developer Product Group, driving the app settings
            framework.
          </li>
          <li>
            Drove the research and vision behind the CRM Page Editor, putting full
            record-page and preview-panel customization on the map.
          </li>
          <li>
            Leading the CRM Index page team — the highest-traffic surface in
            HubSpot&rsquo;s product — while driving broader CRM modernization.
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
