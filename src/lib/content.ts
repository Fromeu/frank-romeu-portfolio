import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const WORK_DIR = path.join(process.cwd(), "content", "work");

export type Metric = {
  label: string;
  value: string;
};

export type CaseStudyFrontmatter = {
  title: string;
  subtitle: string;
  slug: string;
  company: string;
  role: string;
  year: string;
  duration: string;
  domain: string;
  order: number;
  heroImage: string;
  heroAlt: string;
  ogImage?: string;
  metrics?: Metric[];
  /** Defaults to "shipped" when omitted — set "in-progress" for unlaunched work so cards show honest status instead of a fabricated metric. */
  status?: "shipped" | "in-progress";
  draft?: boolean;
};

export type CaseStudy = CaseStudyFrontmatter & {
  /** Raw MDX body, rendered by next-mdx-remote on the case study page. */
  body: string;
};

const REQUIRED_FIELDS: (keyof CaseStudyFrontmatter)[] = [
  "title",
  "subtitle",
  "slug",
  "company",
  "role",
  "year",
  "domain",
  "order",
  "heroImage",
  "heroAlt",
];

function loadCaseStudy(dirName: string): CaseStudy | null {
  const filePath = path.join(WORK_DIR, dirName, "index.mdx");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as CaseStudyFrontmatter;

  const missing = REQUIRED_FIELDS.filter(
    (field) => fm[field] === undefined || fm[field] === ""
  );
  if (missing.length > 0) {
    throw new Error(
      `Case study "${dirName}" is missing required frontmatter: ${missing.join(", ")}`
    );
  }
  if (fm.slug !== dirName) {
    throw new Error(
      `Case study folder "${dirName}" must match its frontmatter slug "${fm.slug}"`
    );
  }

  return { ...fm, ogImage: fm.ogImage || fm.heroImage, body: content };
}

/** All published case studies, sorted by `order`. */
export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => loadCaseStudy(entry.name))
    .filter((cs): cs is CaseStudy => cs !== null && !cs.draft)
    .sort((a, b) => a.order - b.order);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return getAllCaseStudies().find((cs) => cs.slug === slug);
}
