import { getAllContent, MDXContent, ContentMap } from './mdx-loader'

export interface ContentNode {
  id: string
  type: 'section' | 'page' | 'item' | 'category'
  title: string
  path: string
  description?: string
  parent?: string
  children?: string[]
  tags?: string[]
  date?: string
  metadata?: Record<string, any>
  highlightId: string
  content?: string
}

export interface ContentHierarchy {
  sections: {
    work: ContentNode
    ventures: ContentNode
    about: ContentNode
    blog: ContentNode
  }
  pages: Record<string, ContentNode>
  allContent: ContentNode[]
  tagMap: Record<string, string[]> // tag -> content IDs
}

class ContentRegistry {
  private hierarchy: ContentHierarchy | null = null
  private contentById: Map<string, ContentNode> = new Map()
  private initialized = false

  async initialize() {
    if (this.initialized) return this.hierarchy
    
    const allContent = await getAllContent()
    this.hierarchy = this.buildHierarchy(allContent)
    this.initialized = true
    
    return this.hierarchy
  }

  private buildHierarchy(content: ContentMap): ContentHierarchy {
    const hierarchy: ContentHierarchy = {
      sections: {
        work: {
          id: 'work-section',
          type: 'section',
          title: 'Work',
          path: '/',
          description: 'Professional case studies and client work',
          children: ['case-studies-category', 'experiments-category'],
          highlightId: 'section-work',
        },
        ventures: {
          id: 'ventures-section',
          type: 'section',
          title: 'Ventures',
          path: '/content/ventures',
          description: 'Side projects and businesses Kenny is building',
          children: [],
          highlightId: 'section-ventures',
        },
        about: {
          id: 'about-section',
          type: 'section',
          title: 'About',
          path: '/',
          description: 'Background, skills, and experience',
          children: [],
          highlightId: 'section-about',
        },
        blog: {
          id: 'blog-section',
          type: 'section',
          title: 'Blog',
          path: '/content/blog',
          description: 'Thoughts and insights on development and AI',
          children: [],
          highlightId: 'section-blog',
        },
      },
      pages: {},
      allContent: [],
      tagMap: {},
    }

    // Process case studies
    if (content['case-studies']) {
      const categoryNode: ContentNode = {
        id: 'case-studies-category',
        type: 'category',
        title: 'Case Studies',
        path: '/content/case-studies',
        parent: 'work-section',
        children: [],
        highlightId: 'category-case-studies',
      }
      
      content['case-studies'].forEach((study) => {
        const node = this.createContentNode(study, 'case-studies', categoryNode.id)
        hierarchy.pages[node.id] = node
        categoryNode.children?.push(node.id)
        this.contentById.set(node.id, node)
        this.addToTagMap(hierarchy.tagMap, node)
      })
      
      hierarchy.pages[categoryNode.id] = categoryNode
      this.contentById.set(categoryNode.id, categoryNode)
    }

    // Process ventures
    if (content.ventures) {
      content.ventures.forEach((venture) => {
        const node = this.createContentNode(venture, 'ventures', 'ventures-section')
        hierarchy.pages[node.id] = node
        hierarchy.sections.ventures.children?.push(node.id)
        this.contentById.set(node.id, node)
        this.addToTagMap(hierarchy.tagMap, node)
      })
    }

    // Process blog posts
    if (content.blog) {
      content.blog.forEach((post) => {
        const node = this.createContentNode(post, 'blog', 'blog-section')
        hierarchy.pages[node.id] = node
        hierarchy.sections.blog.children?.push(node.id)
        this.contentById.set(node.id, node)
        this.addToTagMap(hierarchy.tagMap, node)
      })
    }

    // Process experiments
    if (content.experiments) {
      const categoryNode: ContentNode = {
        id: 'experiments-category',
        type: 'category',
        title: 'Experiments',
        path: '/',
        parent: 'work-section',
        children: [],
        highlightId: 'category-experiments',
      }
      
      content.experiments.forEach((experiment) => {
        const node = this.createContentNode(experiment, 'experiments', categoryNode.id)
        hierarchy.pages[node.id] = node
        categoryNode.children?.push(node.id)
        this.contentById.set(node.id, node)
        this.addToTagMap(hierarchy.tagMap, node)
      })
      
      hierarchy.pages[categoryNode.id] = categoryNode
      this.contentById.set(categoryNode.id, categoryNode)
    }

    // Collect all content nodes
    hierarchy.allContent = [
      ...Object.values(hierarchy.sections),
      ...Object.values(hierarchy.pages),
    ]

    return hierarchy
  }

  private createContentNode(
    mdxContent: MDXContent,
    category: string,
    parentId: string
  ): ContentNode {
    return {
      id: `${category}-${mdxContent.slug}`,
      type: 'page',
      title: mdxContent.title,
      path: `/content/${category}/${mdxContent.slug}`,
      description: mdxContent.description,
      parent: parentId,
      tags: mdxContent.tags,
      date: mdxContent.date,
      metadata: {
        readTime: mdxContent.readTime,
        ...mdxContent.frontMatter,
      },
      highlightId: mdxContent.highlightId || `${category}-${mdxContent.slug}`,
      content: mdxContent.content,
    }
  }

  private addToTagMap(tagMap: Record<string, string[]>, node: ContentNode) {
    if (node.tags) {
      node.tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = []
        }
        tagMap[tag].push(node.id)
      })
    }
  }

  // Public methods for querying content
  async getContentById(id: string): Promise<ContentNode | undefined> {
    if (!this.initialized) await this.initialize()
    return this.contentById.get(id)
  }

  async getContentByTag(tag: string): Promise<ContentNode[]> {
    if (!this.initialized) await this.initialize()
    const ids = this.hierarchy?.tagMap[tag] || []
    return ids.map(id => this.contentById.get(id)).filter(Boolean) as ContentNode[]
  }

  async searchContent(query: string): Promise<ContentNode[]> {
    if (!this.initialized) await this.initialize()
    const lowerQuery = query.toLowerCase()
    
    return this.hierarchy?.allContent.filter(node => {
      const searchableText = `${node.title} ${node.description || ''} ${node.tags?.join(' ') || ''}`.toLowerCase()
      return searchableText.includes(lowerQuery)
    }) || []
  }

  async getNavigationStructure() {
    if (!this.initialized) await this.initialize()
    return this.hierarchy
  }

  // Generate a summary for AI consumption
  async getAISummary(): Promise<string> {
    if (!this.initialized) await this.initialize()
    
    const summary: string[] = [
      'AVAILABLE CONTENT:',
      '',
      '## SECTIONS:',
    ]

    // Add sections
    Object.values(this.hierarchy!.sections).forEach(section => {
      summary.push(`- ${section.title} (${section.id}): ${section.description}`)
      if (section.children && section.children.length > 0) {
        summary.push(`  Contains: ${section.children.length} items`)
      }
    })

    summary.push('', '## CASE STUDIES:')
    const caseStudies = Object.values(this.hierarchy!.pages).filter(p => p.id.startsWith('case-studies-'))
    caseStudies.forEach(study => {
      if (study.type === 'page') {
        summary.push(`- ${study.title} (${study.id}): ${study.description || 'No description'}`)
        if (study.tags && study.tags.length > 0) {
          summary.push(`  Tags: ${study.tags.join(', ')}`)
        }
      }
    })

    summary.push('', '## VENTURES:')
    const ventures = Object.values(this.hierarchy!.pages).filter(p => p.id.startsWith('ventures-'))
    ventures.forEach(venture => {
      summary.push(`- ${venture.title} (${venture.id}): ${venture.description || 'No description'}`)
      if (venture.tags && venture.tags.length > 0) {
        summary.push(`  Tags: ${venture.tags.join(', ')}`)
      }
    })

    summary.push('', '## BLOG POSTS:')
    const blogs = Object.values(this.hierarchy!.pages).filter(p => p.id.startsWith('blog-'))
    blogs.forEach(post => {
      summary.push(`- ${post.title} (${post.id}): ${post.description || 'No description'}`)
      if (post.tags && post.tags.length > 0) {
        summary.push(`  Tags: ${post.tags.join(', ')}`)
      }
    })

    summary.push('', '## NAVIGATION COMMANDS:')
    summary.push('- Use NAVIGATE:[section-id] to go to a section')
    summary.push('- Use SHOW:[content-id] to display specific content')
    summary.push('- Use HIGHLIGHT:[highlight-id] to highlight an element')
    summary.push('- Use TAG:[tag-name] to show all content with that tag')

    return summary.join('\n')
  }
}

// Export singleton instance
export const contentRegistry = new ContentRegistry()

// Export convenience functions
export async function getContentHierarchy() {
  return contentRegistry.getNavigationStructure()
}

export async function getAIContentSummary() {
  return contentRegistry.getAISummary()
}