// Central content registry for navigation
export interface ContentItem {
  id: string
  title: string
  path: string
  type: 'case-study' | 'venture' | 'experiment' | 'blog'
  highlightId: string
  description: string
  tags: string[]
  aliases?: string[] // Alternative names for matching
}

export const contentMap: ContentItem[] = [
  // Case Studies
  {
    id: 'findu-highschool',
    title: 'FindU Highschool',
    path: '/content/case-studies/findu-highschool',
    type: 'case-study',
    highlightId: 'project-findu-highschool',
    description: 'AI-powered platform helping high school students find study partners',
    tags: ['AI', 'Education', 'Platform'],
    aliases: ['findu', 'find u', 'high school', 'study partner']
  },
  {
    id: 'findu-college',
    title: 'FindU College',
    path: '/content/case-studies/findu-college',
    type: 'case-study',
    highlightId: 'project-findu-college',
    description: 'Gamified college selection platform using AI matching',
    tags: ['Education', 'AI', 'Gamification'],
    aliases: ['findu college', 'college finder', 'university match']
  },
  {
    id: 'nural',
    title: 'Nural',
    path: '/content/case-studies/nural',
    type: 'case-study',
    highlightId: 'project-nural',
    description: 'Chat-based platform for learning and analyzing stocks',
    tags: ['FinTech', 'AI', 'Trading'],
    aliases: ['neural', 'stock chat', 'trading ai']
  },
  {
    id: 'flock',
    title: 'Flock',
    path: '/content/case-studies/flock',
    type: 'case-study',
    highlightId: 'project-flock',
    description: 'AI-powered scheduling platform for teams',
    tags: ['Productivity', 'AI', 'Scheduling'],
    aliases: ['scheduler', 'meeting ai', 'team scheduling']
  },

  // Ventures
  {
    id: 'ai-writing-assistant',
    title: 'AI Writing Assistant',
    path: '/content/ventures/ai-writing-assistant',
    type: 'venture',
    highlightId: 'venture-ai-writer',
    description: 'Next-generation writing tool powered by AI',
    tags: ['AI', 'Writing', 'Productivity'],
    aliases: ['writer', 'writing ai', 'content generator']
  },

  // Experiments
  {
    id: 'ai-code-reviewer',
    title: 'AI Code Reviewer',
    path: '/content/experiments/ai-code-reviewer',
    type: 'experiment',
    highlightId: 'experiment-ai-code-reviewer',
    description: 'Automated code review system using LLMs',
    tags: ['AI', 'DevTools', 'Automation'],
    aliases: ['code review', 'reviewer', 'code ai']
  },
  {
    id: 'voice-ui-framework',
    title: 'Voice UI Framework',
    path: '/content/experiments/voice-ui-framework',
    type: 'experiment',
    highlightId: 'experiment-voice-ui',
    description: 'Framework for building voice-first web applications',
    tags: ['Voice', 'UI', 'Framework'],
    aliases: ['voice', 'speech ui', 'voice control']
  },

  // Blog
  {
    id: 'building-with-ai-2024',
    title: 'Building with AI in 2024',
    path: '/content/blog/building-with-ai-2024',
    type: 'blog',
    highlightId: 'blog-ai-2024',
    description: 'Insights on developing AI-powered applications',
    tags: ['AI', 'Development', 'Insights'],
    aliases: ['ai blog', '2024 ai', 'ai development']
  }
]

// Helper functions for content discovery
export function findContentByQuery(query: string): ContentItem | null {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Exact ID match
  const exactMatch = contentMap.find(item => 
    item.id.toLowerCase() === normalizedQuery
  )
  if (exactMatch) return exactMatch
  
  // Title match
  const titleMatch = contentMap.find(item => 
    item.title.toLowerCase().includes(normalizedQuery)
  )
  if (titleMatch) return titleMatch
  
  // Alias match
  const aliasMatch = contentMap.find(item => 
    item.aliases?.some(alias => 
      alias.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(alias.toLowerCase())
    )
  )
  if (aliasMatch) return aliasMatch
  
  // Tag match
  const tagMatch = contentMap.find(item =>
    item.tags.some(tag => 
      tag.toLowerCase().includes(normalizedQuery)
    )
  )
  if (tagMatch) return tagMatch
  
  // Description match
  const descMatch = contentMap.find(item =>
    item.description.toLowerCase().includes(normalizedQuery)
  )
  
  return descMatch || null
}

export function getContentByType(type: ContentItem['type']): ContentItem[] {
  return contentMap.filter(item => item.type === type)
}

export function getContentByTag(tag: string): ContentItem[] {
  return contentMap.filter(item => 
    item.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllHighlightIds(): string[] {
  return contentMap.map(item => item.highlightId)
}

export function getNavigationPath(query: string): string | null {
  const content = findContentByQuery(query)
  return content?.path || null
}

export function getHighlightId(query: string): string | null {
  const content = findContentByQuery(query)
  return content?.highlightId || null
}

// Export for AI context
export function getContentSummaryForAI(): string {
  const caseStudies = getContentByType('case-study')
  const ventures = getContentByType('venture')
  const experiments = getContentByType('experiment')
  const blogs = getContentByType('blog')
  
  return `
Available Content:
- Case Studies: ${caseStudies.map(c => c.title).join(', ')}
- Ventures: ${ventures.map(v => v.title).join(', ')}
- Experiments: ${experiments.map(e => e.title).join(', ')}
- Blog Posts: ${blogs.map(b => b.title).join(', ')}

Navigation paths available:
${contentMap.map(c => `- ${c.title}: ${c.path} (highlight: ${c.highlightId})`).join('\n')}
  `.trim()
}