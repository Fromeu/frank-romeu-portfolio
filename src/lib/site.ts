// Single source of truth for site-wide copy and links.
// Frank: edit this file to update your name, positioning line, and contact info.

export const site = {
  name: "Frank Romeu",
  title: "Senior Product Designer II",
  positioning:
    "I design the reasoning surfaces of HubSpot's CRM — the records, views, and visualizations millions of go-to-market teams use to see and act on their business.",
  url: "https://fromeu.github.io/Crates-portfolio/",
  email: "frank.j.romeu@gmail.com",
  linkedin: "https://www.linkedin.com/in/frankromeu",
  resumePath: `${process.env.GITHUB_PAGES === "true" ? "/Crates-portfolio" : ""}/resume.pdf`,
} as const;
