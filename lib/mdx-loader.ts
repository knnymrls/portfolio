import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MDXContent {
  slug: string;
  title: string;
  date?: string;
  tags?: string[];
  category: string;
  description?: string;
  content: string;
  frontMatter: Record<string, any>;
  readTime?: number;
  highlightId?: string;
}

export interface ContentMap {
  'case-studies': MDXContent[];
  ventures: MDXContent[];
  blog: MDXContent[];
  experiments: MDXContent[];
}

const contentDirectory = path.join(process.cwd(), 'content');

// Calculate read time based on word count
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Get all MDX files from a specific category
export async function getMDXByCategory(category: keyof ContentMap): Promise<MDXContent[]> {
  const categoryPath = path.join(contentDirectory, category);
  
  // Check if directory exists
  if (!fs.existsSync(categoryPath)) {
    return [];
  }
  
  const files = fs.readdirSync(categoryPath);
  const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'));
  
  const content = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(categoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const slug = file.replace(/\.mdx?$/, '');
      
      return {
        slug,
        title: data.title || slug,
        date: data.date,
        tags: data.tags || [],
        category,
        description: data.description,
        content,
        frontMatter: data,
        readTime: calculateReadTime(content),
        highlightId: data.highlightId || `${category}-${slug}`,
      };
    })
  );
  
  // Sort by date (newest first)
  return content.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get a single MDX file by slug and category
export async function getMDXBySlug(
  category: keyof ContentMap,
  slug: string
): Promise<MDXContent | null> {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`);
  const fallbackPath = path.join(contentDirectory, category, `${slug}.md`);
  
  let finalPath = filePath;
  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(fallbackPath)) {
      return null;
    }
    finalPath = fallbackPath;
  }
  
  const fileContent = fs.readFileSync(finalPath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  return {
    slug,
    title: data.title || slug,
    date: data.date,
    tags: data.tags || [],
    category,
    description: data.description,
    content,
    frontMatter: data,
    readTime: calculateReadTime(content),
    highlightId: data.highlightId || `${category}-${slug}`,
  };
}

// Get all content across all categories
export async function getAllContent(): Promise<ContentMap> {
  const [caseStudies, ventures, blog, experiments] = await Promise.all([
    getMDXByCategory('case-studies'),
    getMDXByCategory('ventures'),
    getMDXByCategory('blog'),
    getMDXByCategory('experiments'),
  ]);
  
  return {
    'case-studies': caseStudies,
    ventures,
    blog,
    experiments,
  };
}

// Search content by tags
export async function searchContentByTags(tags: string[]): Promise<MDXContent[]> {
  const allContent = await getAllContent();
  const flatContent = Object.values(allContent).flat();
  
  return flatContent.filter(item =>
    item.tags?.some((tag: string) => tags.includes(tag))
  );
}

// Get related content based on tags
export async function getRelatedContent(
  currentSlug: string,
  currentCategory: keyof ContentMap,
  limit: number = 3
): Promise<MDXContent[]> {
  const current = await getMDXBySlug(currentCategory, currentSlug);
  if (!current || !current.tags || current.tags.length === 0) {
    return [];
  }
  
  const allContent = await getAllContent();
  const flatContent = Object.values(allContent).flat();
  
  // Find content with matching tags
  const related = flatContent
    .filter(item => item.slug !== currentSlug || item.category !== currentCategory)
    .map(item => ({
      ...item,
      relevance: item.tags?.filter((tag: string) => current.tags?.includes(tag)).length || 0,
    }))
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
  
  return related;
}

// Extract sections from MDX content for navigation
export function extractSections(content: string): Array<{ id: string; title: string; level: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const sections: Array<{ id: string; title: string; level: number }> = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2];
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    sections.push({ id, title, level });
  }
  
  return sections;
}