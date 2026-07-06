// Single source of truth for site-wide copy and links.
// Frank: edit this file to update your name, positioning line, and contact info.

export const site = {
  name: "Frank Romeu",
  title: "Senior Product Designer II",
  // The one-sentence positioning line shown on the crate. PLACEHOLDER — confirm before Phase 2.
  positioning:
    "I design enterprise software that feels less like enterprise software — currently at HubSpot.",
  url: "https://frankromeu.com", // PLACEHOLDER — used for canonical URLs and OG images
  email: "hello@frankromeu.com", // PLACEHOLDER
  linkedin: "https://www.linkedin.com/in/frankromeu", // PLACEHOLDER
  resumePath: `${process.env.GITHUB_PAGES === "true" ? "/Crates-portfolio" : ""}/resume.pdf`,
} as const;
