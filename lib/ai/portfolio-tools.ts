import { tool } from "ai";
import { z } from "zod";
import {
  PORTFOLIO_DESTINATIONS,
  PortfolioNavigationTarget,
} from "./portfolio-routing";

export const HIGHLIGHT_TARGETS = [
  "hero-title",
  "hero-image",
  "hero-actions",
  "cta-contact",
  "social-github",
  "social-linkedin",
  "social-instagram",
  "case-studies-title",
  "projects-grid",
  "project-findu",
  "project-mkrs",
  "project-flock",
  "project-bloom",
  "skills-title",
  "skills-grid",
  "skill-category-frontend",
  "skill-react",
  "about-title",
  "about-content",
  "about-intro",
  "contact-title",
  "contact-form",
  "contact-field-name",
  "contact-field-email",
  "contact-submit",
] as const;

const highlightTargetsDescription =
  `Array of page elements to highlight. Prefer using data-highlight-id values for precision: ${HIGHLIGHT_TARGETS.join(
    ", ",
  )}. You can also pass section shorthands (` +
  '"hero", "case-studies", "projects", "ventures", "skills", "about", "contact") or CSS selectors that start with "#", ".", or "[" when needed. ' +
  "Always highlight every piece of content you reference in your response.";

export const navigateToSectionToolDescription =
  "Navigate to a specific section of Kenny's portfolio. Always align the section with the content you discuss.";

export const highlightContentToolDescription =
  "Highlight specific content elements on the page to draw attention to them. Use this whenever you mention concrete pieces of the UI.";

export const suggestFollowUpsToolDescription =
  "Provide three contextual follow-up questions that keep the portfolio conversation moving.";

export const navigateToSectionTool = tool({
  description: navigateToSectionToolDescription,
  inputSchema: z.object({
    section: z
      .enum(PORTFOLIO_DESTINATIONS)
      .describe(
        [
          'Choose from: "home", "skills", "ventures", "about", "contact"',
          'or case study pages: "project-findu", "project-mkrs", "project-flock", "project-bloom".',
          'Use "project-*" values when focusing on a specific case study.',
        ].join(" "),
      ),
  }),
  execute: async ({ section }) => ({
    navigated: true,
    section: section as PortfolioNavigationTarget,
  }),
});

export const highlightContentTool = tool({
  description: highlightContentToolDescription,
  inputSchema: z.object({
    targets: z
      .array(z.string())
      .min(1)
      .describe(highlightTargetsDescription),
    duration: z
      .number()
      .positive()
      .optional()
      .describe("How long to keep the highlight active in milliseconds."),
  }),
  execute: async ({ targets, duration = 4000 }) => ({
    highlighted: true,
    targets,
    duration,
  }),
});

export const suggestFollowUpsTool = tool({
  description: suggestFollowUpsToolDescription,
  inputSchema: z.object({
    questions: z
      .array(z.string())
      .min(3)
      .max(3)
      .describe("Exactly three short follow-up questions."),
  }),
  execute: async ({ questions }) => ({
    suggested: true,
    questions,
  }),
});

export const portfolioTools = {
  navigateToSection: navigateToSectionTool,
  highlightContent: highlightContentTool,
  suggestFollowUps: suggestFollowUpsTool,
} as const;

export const portfolioRealtimeTools = [
  {
    type: "function",
    name: "navigateToSection",
    description: navigateToSectionToolDescription,
    parameters: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: [...PORTFOLIO_DESTINATIONS],
          description:
            'Use "home", "skills", "ventures", "about", "contact", or a case-study slug such as "project-findu".',
        },
      },
      required: ["section"],
    },
  },
  {
    type: "function",
    name: "highlightContent",
    description: highlightContentToolDescription,
    parameters: {
      type: "object",
      properties: {
        targets: {
          type: "array",
          description: highlightTargetsDescription,
          items: { type: "string" },
          minItems: 1,
        },
        duration: {
          type: "number",
          description:
            "How long to keep the highlight active in milliseconds (defaults to 4000).",
        },
      },
      required: ["targets"],
    },
  },
  {
    type: "function",
    name: "suggestFollowUps",
    description: suggestFollowUpsToolDescription,
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          description: "Exactly three short follow-up questions.",
          items: { type: "string" },
          minItems: 3,
          maxItems: 3,
        },
      },
      required: ["questions"],
    },
  },
] as const;
