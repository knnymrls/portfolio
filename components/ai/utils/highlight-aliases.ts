/**
 * Highlight aliases map semantic terms to specific highlight targets.
 * These allow the AI to use natural language like "findu" and have it
 * resolve to the correct data-highlight-id.
 *
 * IMPORTANT: Keep these in sync with actual data-highlight-id and
 * data-highlight-section attributes in the codebase.
 *
 * Valid targets from codebase:
 * - Hero: hero (section), hero-title, hero-image, hero-actions, cta-contact
 * - Social: social-github, social-linkedin, social-instagram, social-resume
 * - Case Studies: case-studies (section), case-studies-title, projects-grid, project-{name}
 * - Skills: skills (section), skills-title, skills-grid, skill-category-{name}, skill-{name}
 * - Contact: contact (section), contact-title, contact-form, contact-field-{name}, contact-submit
 * - Ventures: ventures (section), venture-{name}
 */
export const HIGHLIGHT_ALIASES: Record<string, string[]> = {
  // Homepage sections
  home: ['[data-highlight-section="hero"]', "case-studies-title"],
  hero: ["hero-title", "hero-image", "hero-actions"],
  "hero section": ["hero-title", "hero-image", "hero-actions"],

  // Case study projects
  findu: ["project-findu"],
  "find u": ["project-findu"],
  "findu case study": ["project-findu"],
  mkrs: ["project-mkrs"],
  "mkrs agency": ["project-mkrs"],
  "mkrs case study": ["project-mkrs"],
  flock: ["project-flock"],
  "flock case study": ["project-flock"],
  bloom: ["project-bloom"],
  "bloom case study": ["project-bloom"],

  // Ventures/startups
  ventures: ['[data-highlight-section="ventures"]'],
  startups: ['[data-highlight-section="ventures"]'],

  // Projects/case studies section
  projects: ["projects-grid", "case-studies-title"],
  "case studies": ["case-studies-title", "projects-grid"],
  work: ["projects-grid", "case-studies-title"],

  // Contact
  contact: ["contact-form", "contact-title"],
  "contact form": ["contact-form"],
  email: ["contact-field-email"],

  // Social links
  socials: ["social-github", "social-linkedin", "social-instagram"],
  social: ["social-github", "social-linkedin", "social-instagram"],
  github: ["social-github"],
  linkedin: ["social-linkedin"],
  instagram: ["social-instagram"],
  resume: ["social-resume"],

  // Skills
  skills: ["skills-grid", "skills-title"],
  "my skills": ["skills-grid", "skills-title"],

  // About - Note: about page doesn't have highlight attributes yet
  about: ['[data-highlight-section="about"]'],
};
