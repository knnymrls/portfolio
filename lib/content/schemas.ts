import { z } from "zod";

// ===========================================
// Case Study Schema (for frontmatter in MDX)
// ===========================================

export const caseStudyHeroSchema = z.object({
  backgroundColor: z.string(),
  logoUrl: z.string().optional(),
  // For custom animated logos, we'll use a component name that maps to the actual component
  customLogoComponent: z.string().optional(),
});

export const caseStudyMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export const caseStudyAISchema = z.object({
  route: z.string(),
  highlightId: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
  achievements: z.array(z.string()).default([]),
});

export const caseStudySchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["published", "draft", "coming-soon"]).default("published"),

  // Display
  hero: caseStudyHeroSchema,
  role: z.string(),
  timeline: z.string(),
  duration: z.string(),
  tags: z.array(z.string()),

  // Custom font for the card
  customFont: z.object({
    fontFamily: z.string(),
  }).optional(),

  // Metrics (optional)
  metrics: z.array(caseStudyMetricSchema).optional(),

  // Technologies
  technologies: z.array(z.string()),

  // AI Navigation metadata
  ai: caseStudyAISchema,

  // Content (populated from MDX body)
  content: z.string().optional(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

// ===========================================
// Project Card Schema (for homepage display)
// ===========================================

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  href: z.string(),
  backgroundColor: z.string(),
  logoUrl: z.string().optional(),
  customLogoComponent: z.string().optional(),
  customFont: z.object({
    fontFamily: z.string(),
  }).optional(),
  status: z.enum(["active", "coming-soon"]).default("active"),
  order: z.number(),
  ai: z.object({
    highlightId: z.string(),
    summary: z.string(),
  }),
});

export type Project = z.infer<typeof projectSchema>;

// ===========================================
// Venture Schema
// ===========================================

export const ventureSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  dateRange: z.string(),
  description: z.string(),
  longDescription: z.string().optional(),
  backgroundColor: z.string(),
  logoUrl: z.string().optional(),
  logoClassName: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  websiteUrl: z.string().optional(),
  order: z.number(),
  ai: z.object({
    route: z.string(),
    highlightId: z.string(),
    summary: z.string(),
  }),
});

export type Venture = z.infer<typeof ventureSchema>;

// ===========================================
// Press Schema
// ===========================================

export const pressItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  backgroundColor: z.string(),
  logoUrl: z.string(),
  logoClassName: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  articleUrl: z.string().optional(),
  order: z.number(),
  ai: z.object({
    summary: z.string(),
  }),
});

export type PressItem = z.infer<typeof pressItemSchema>;

// ===========================================
// Journey/Timeline Schema
// ===========================================

export const journeyStepSchema = z.object({
  id: z.string(),
  year: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  order: z.number(),
  ai: z.object({
    summary: z.string(),
  }),
});

export type JourneyStep = z.infer<typeof journeyStepSchema>;

// ===========================================
// Skills Schema
// ===========================================

export const skillCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  skills: z.array(z.string()),
  order: z.number(),
});

export const skillsSchema = z.object({
  categories: z.array(skillCategorySchema),
  soft: z.array(z.string()).default([]),
  ai: z.object({
    route: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
  }),
});

export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Skills = z.infer<typeof skillsSchema>;

// ===========================================
// Personal/Bio Schema
// ===========================================

export const personalSchema = z.object({
  name: z.string(),
  username: z.string(),
  role: z.string(),
  focus: z.string(),
  status: z.string(),
  location: z.string(),
  bio: z.string(),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }),
  contact: z.object({
    availability: z.string(),
    interests: z.array(z.string()),
    responseTime: z.string(),
    preferredContact: z.string(),
  }),
  ai: z.object({
    summary: z.string(),
    highlights: z.array(z.string()),
  }),
});

export type Personal = z.infer<typeof personalSchema>;

// ===========================================
// All Content Schema
// ===========================================

export const allContentSchema = z.object({
  caseStudies: z.array(caseStudySchema),
  projects: z.array(projectSchema),
  ventures: z.array(ventureSchema),
  press: z.array(pressItemSchema),
  journey: z.array(journeyStepSchema),
  skills: skillsSchema,
  personal: personalSchema,
});

export type AllContent = z.infer<typeof allContentSchema>;
