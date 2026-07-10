// Single source of truth for site-wide copy and links.
// Frank: edit this file to update your name, positioning line, and contact info.

import { withBasePath } from "@/lib/base-path";

export const site = {
  name: "Frank Romeu",
  title: "Senior Product Designer II",
  positioning: "I design the human side of complex systems.",
  url: "https://fromeu.github.io/frank-romeu-portfolio/",
  email: "frank.j.romeu@gmail.com",
  linkedin: "https://www.linkedin.com/in/frankromeu",
  resumePath: withBasePath("/resume.pdf"),
} as const;
