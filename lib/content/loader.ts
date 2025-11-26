import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import {
  caseStudySchema,
  ventureSchema,
  projectSchema,
  pressItemSchema,
  journeyStepSchema,
  skillsSchema,
  personalSchema,
  type CaseStudy,
  type Venture,
  type Project,
  type PressItem,
  type JourneyStep,
  type Skills,
  type Personal,
  type AllContent,
} from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ===========================================
// Generic JSON Loader
// ===========================================

async function readJSON<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(path.join(CONTENT_DIR, filePath), "utf-8");
  return JSON.parse(content);
}

// ===========================================
// Case Studies Loader (MDX with frontmatter)
// ===========================================

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const caseStudiesDir = path.join(CONTENT_DIR, "case-studies");

  try {
    const files = await fs.readdir(caseStudiesDir);
    const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

    const studies = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(caseStudiesDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        // Validate and return
        return caseStudySchema.parse({
          ...data,
          content,
        });
      })
    );

    return studies.sort((a, b) => {
      // Sort by status (published first) then by slug
      if (a.status === "published" && b.status !== "published") return -1;
      if (a.status !== "published" && b.status === "published") return 1;
      return a.slug.localeCompare(b.slug);
    });
  } catch (error) {
    // If directory doesn't exist yet, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const filePath = path.join(CONTENT_DIR, "case-studies", `${slug}.mdx`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return caseStudySchema.parse({
      ...data,
      content,
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

// ===========================================
// Projects Loader
// ===========================================

export async function getProjects(): Promise<Project[]> {
  const data = await readJSON<{ projects: unknown[] }>("projects.json");
  const projects = data.projects.map((p) => projectSchema.parse(p));
  return projects.sort((a, b) => a.order - b.order);
}

// ===========================================
// Ventures Loader
// ===========================================

export async function getVentures(): Promise<Venture[]> {
  const data = await readJSON<{ ventures: unknown[] }>("ventures.json");
  const ventures = data.ventures.map((v) => ventureSchema.parse(v));
  return ventures.sort((a, b) => a.order - b.order);
}

// ===========================================
// Press Loader
// ===========================================

export async function getPress(): Promise<PressItem[]> {
  const data = await readJSON<{ items: unknown[] }>("press.json");
  const items = data.items.map((p) => pressItemSchema.parse(p));
  return items.sort((a, b) => a.order - b.order);
}

// ===========================================
// Journey Loader
// ===========================================

export async function getJourney(): Promise<JourneyStep[]> {
  const data = await readJSON<{ steps: unknown[] }>("journey.json");
  const steps = data.steps.map((s) => journeyStepSchema.parse(s));
  return steps.sort((a, b) => a.order - b.order);
}

// ===========================================
// Skills Loader
// ===========================================

export async function getSkills(): Promise<Skills> {
  const data = await readJSON<unknown>("skills.json");
  return skillsSchema.parse(data);
}

// ===========================================
// Personal Loader
// ===========================================

export async function getPersonal(): Promise<Personal> {
  const data = await readJSON<unknown>("personal.json");
  return personalSchema.parse(data);
}

// ===========================================
// Load All Content
// ===========================================

export async function getAllContent(): Promise<AllContent> {
  const [caseStudies, projects, ventures, press, journey, skills, personal] =
    await Promise.all([
      getCaseStudies(),
      getProjects(),
      getVentures(),
      getPress(),
      getJourney(),
      getSkills(),
      getPersonal(),
    ]);

  return {
    caseStudies,
    projects,
    ventures,
    press,
    journey,
    skills,
    personal,
  };
}

// ===========================================
// Export types
// ===========================================

export type {
  CaseStudy,
  Venture,
  Project,
  PressItem,
  JourneyStep,
  Skills,
  Personal,
  AllContent,
};
