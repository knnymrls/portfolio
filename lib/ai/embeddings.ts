import OpenAI from "openai";
import type { AllContent } from "@/lib/content/loader";

const openai = new OpenAI();

// Content chunk for embedding
export interface ContentChunk {
  id: string;
  type: "case-study" | "project" | "venture" | "press" | "journey" | "skill" | "personal";
  title: string;
  content: string;
  route: string;
  highlightId?: string;
  section?: string;
  keywords?: string[];
  embedding?: number[];
}

// Generate embeddings for an array of chunks
export async function generateEmbeddings(
  chunks: ContentChunk[]
): Promise<ContentChunk[]> {
  if (chunks.length === 0) return [];

  // Prepare texts for embedding
  const texts = chunks.map((c) => `${c.title}\n\n${c.content}`);

  // Generate embeddings in batch (OpenAI supports up to 2048 inputs)
  const batchSize = 100;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch,
    });
    allEmbeddings.push(...response.data.map((d) => d.embedding));
  }

  // Attach embeddings to chunks
  return chunks.map((chunk, i) => ({
    ...chunk,
    embedding: allEmbeddings[i],
  }));
}

// Extract sections from MDX content
function extractMDXSections(mdxContent: string): { title: string; slug: string; content: string }[] {
  const sections: { title: string; slug: string; content: string }[] = [];

  // Match CaseStudySection components WITH titles
  const titledSectionRegex = /<CaseStudySection\s+title="([^"]+)"[^>]*>/g;

  // Find all titled sections and their positions
  const titledSections: { title: string; startIndex: number }[] = [];
  let match;
  while ((match = titledSectionRegex.exec(mdxContent)) !== null) {
    titledSections.push({
      title: match[1],
      startIndex: match.index,
    });
  }

  // For each titled section, capture ALL content until the next titled section
  for (let i = 0; i < titledSections.length; i++) {
    const currentSection = titledSections[i];
    const nextSection = titledSections[i + 1];

    // Extract content from this section start to next section (or end of file)
    const endIndex = nextSection ? nextSection.startIndex : mdxContent.length;
    const sectionContent = mdxContent.slice(currentSection.startIndex, endIndex);

    // Clean the content
    const content = sectionContent
      // Remove all JSX tags but keep text content
      .replace(/<CaseStudySection[^>]*>/g, " ")
      .replace(/<\/CaseStudySection>/g, " ")
      .replace(/<CaseStudyImage[^/]*\/>/g, " ")
      .replace(/<[A-Z][^>]*\/>/g, " ") // Self-closing components
      .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, " ") // Other components
      .replace(/<[^>]+>/g, " ") // Any remaining tags
      // Clean up whitespace
      .replace(/\s+/g, " ")
      .trim();

    if (content.length > 50) {
      sections.push({
        title: currentSection.title,
        slug: currentSection.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content,
      });
    }
  }

  return sections;
}

// Chunk all content for embedding
export function chunkContent(content: AllContent): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // Case studies - chunk by summary and sections
  for (const study of content.caseStudies) {
    // Summary chunk (high-level overview)
    chunks.push({
      id: `case-study-${study.slug}-summary`,
      type: "case-study",
      title: study.title,
      content: `${study.ai.summary} Technologies: ${study.technologies.join(", ")}. ${study.ai.achievements.join(". ")}`,
      route: study.ai.route,
      highlightId: study.ai.highlightId,
      keywords: study.ai.keywords,
    });

    // Section chunks (detailed content)
    if (study.content) {
      const sections = extractMDXSections(study.content);
      for (const section of sections) {
        // Add section-specific keywords based on content
        const sectionKeywords = [...(study.ai.keywords || [])];
        const lowerContent = section.content.toLowerCase();

        // Add keywords based on section content
        if (lowerContent.includes('user') || lowerContent.includes('student')) sectionKeywords.push('users', 'students', 'user count');
        if (lowerContent.includes('marketing')) sectionKeywords.push('marketing', 'growth', 'traction');
        if (lowerContent.includes('team')) sectionKeywords.push('team', 'hiring', 'management');
        if (lowerContent.includes('funding') || lowerContent.includes('raised')) sectionKeywords.push('funding', 'investment', 'raised');
        if (lowerContent.includes('interview')) sectionKeywords.push('interviews', 'research', 'user research');

        chunks.push({
          id: `case-study-${study.slug}-${section.slug}`,
          type: "case-study",
          title: `${study.title} - ${section.title}`,
          content: section.content,
          route: `${study.ai.route}#${section.slug}`,
          highlightId: study.ai.highlightId,
          section: section.title,
          keywords: [...new Set(sectionKeywords)], // Dedupe
        });
      }
    }
  }

  // Projects (homepage cards)
  for (const project of content.projects) {
    chunks.push({
      id: `project-${project.id}`,
      type: "project",
      title: project.name,
      content: `${project.description}. ${project.ai.summary}`,
      route: project.href,
      highlightId: project.ai.highlightId,
    });
  }

  // Ventures
  for (const venture of content.ventures) {
    chunks.push({
      id: `venture-${venture.id}`,
      type: "venture",
      title: venture.name,
      content: `${venture.ai.summary} Role: ${venture.role}. ${venture.dateRange}. Technologies: ${venture.technologies.join(", ")}`,
      route: venture.ai.route,
      highlightId: venture.ai.highlightId,
    });
  }

  // Press items
  for (const press of content.press) {
    chunks.push({
      id: `press-${press.id}`,
      type: "press",
      title: `${press.name}: ${press.title || "Press Coverage"}`,
      content: `${press.ai.summary} ${press.description || ""} ${press.date || ""}`,
      route: "/ventures",
      highlightId: `press-${press.id}`,
    });
  }

  // Journey steps
  for (const step of content.journey) {
    chunks.push({
      id: `journey-${step.id}`,
      type: "journey",
      title: `${step.year}: ${step.title}`,
      content: step.ai.summary,
      route: "/about",
      highlightId: `journey-${step.id}`,
    });
  }

  // Skills (one chunk per category + summary)
  chunks.push({
    id: "skills-summary",
    type: "skill",
    title: "Technical Skills",
    content: content.skills.ai.summary,
    route: content.skills.ai.route,
    highlightId: "skills-grid",
    keywords: content.skills.ai.highlights,
  });

  for (const category of content.skills.categories) {
    chunks.push({
      id: `skill-${category.id}`,
      type: "skill",
      title: `${category.title} Skills`,
      content: `${category.title}: ${category.skills.join(", ")}`,
      route: content.skills.ai.route,
      highlightId: `skill-category-${category.id}`,
    });
  }

  // Personal info
  chunks.push({
    id: "personal-bio",
    type: "personal",
    title: content.personal.name,
    content: `${content.personal.ai.summary} ${content.personal.ai.highlights.join(". ")}`,
    route: "/about",
    highlightId: "about-content",
  });

  chunks.push({
    id: "personal-contact",
    type: "personal",
    title: "Contact Information",
    content: `${content.personal.contact.availability} Interested in: ${content.personal.contact.interests.join(", ")}. ${content.personal.contact.responseTime}`,
    route: "/contact",
    highlightId: "contact-form",
  });

  return chunks;
}
