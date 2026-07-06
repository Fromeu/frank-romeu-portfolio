import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}, ${site.title}.`,
  alternates: { canonical: "/about" },
};

// PLACEHOLDER copy throughout — Frank replaces bio, photo, and highlights.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight">About</h1>
      <p className="mt-6 leading-relaxed">
        PLACEHOLDER bio — two or three paragraphs about who Frank is, how he works,
        and what he cares about as a designer. A photo goes here too (drop it in{" "}
        <code className="font-mono text-sm">/public/about/</code> and add an{" "}
        <code className="font-mono text-sm">&lt;img&gt;</code>).
      </p>
      <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">
        Design philosophy
      </h2>
      <p className="mt-4 leading-relaxed">
        PLACEHOLDER — the short version of how Frank thinks about product design.
      </p>
      <h2 className="mt-12 font-display text-2xl font-semibold tracking-tight">
        Career highlights
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
        <li>PLACEHOLDER highlight one</li>
        <li>PLACEHOLDER highlight two</li>
        <li>PLACEHOLDER highlight three</li>
      </ul>
    </div>
  );
}
