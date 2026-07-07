import type { Metadata } from "next";
import { Archivo, Fraunces, Geist_Mono } from "next/font/google";
import { LazyMotion, domAnimation } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

// Type pairing: Fraunces (characterful display serif, used with restraint)
// + Archivo (grotesque body sans) + Geist Mono (catalog numbers, meta, captions).
// Only Archivo (the LCP-critical body face) is preloaded; the display serif
// and mono swap in when ready so they don't contend for first-paint bandwidth.
// SOFT/WONK/italic are exposed for the handful of reserved expressive
// moments (homepage name, pull-quotes, About lede) — see globals.css.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  preload: false,
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  // Body text is the mobile LCP element. `optional` means a slow first visit
  // paints immediately with the metrics-adjusted fallback instead of
  // repainting when the font lands (which is what blows the LCP budget).
  display: "optional",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Load sequence gate: runs before paint. Adds .entering only on a
            fresh-session homepage landing, without reduced motion. The class
            is removed after the animation so client-side returns to the crate
            don't replay it. No JS at all = no class = settled state. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(location.pathname==="/"&&!sessionStorage.getItem("crate-entered")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("entering");setTimeout(function(){document.documentElement.classList.remove("entering")},1100)}sessionStorage.setItem("crate-entered","1")}catch(e){}`,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <LazyMotion features={domAnimation} strict>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </LazyMotion>
      </body>
    </html>
  );
}
