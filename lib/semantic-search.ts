import { contentRegistry, ContentNode } from './content-registry'
import { 
  generateEmbedding, 
  batchEmbedContent, 
  semanticSearch,
  findRelatedContent,
  clusterBySimilarity 
} from './embeddings'

export interface SearchResult {
  content: ContentNode
  similarity: number
  reason: string // Why this result was returned
}

export interface SemanticQuery {
  query: string
  filters?: {
    type?: string[]
    tags?: string[]
    dateRange?: { start?: Date; end?: Date }
  }
  limit?: number
  threshold?: number
}

class SemanticSearchEngine {
  private contentEmbeddings: Array<{ id: string; embedding: number[]; content: ContentNode }> = []
  private initialized = false
  private lastUpdate: Date | null = null

  // Initialize embeddings for all content
  async initialize(force: boolean = false) {
    if (this.initialized && !force) {
      console.log('🔍 [SEARCH] Semantic search already initialized, skipping')
      return
    }

    console.log('🚀 [SEARCH] Initializing semantic search engine...')
    
    // Get all content from registry
    console.log('📁 [SEARCH] Fetching content hierarchy from registry')
    const hierarchy = await contentRegistry.getNavigationStructure()
    if (!hierarchy) {
      console.warn('⚠️ [SEARCH] No content hierarchy found')
      return
    }

    // Collect all content nodes
    const allContent = hierarchy.allContent
    console.log(`📄 [SEARCH] Found ${allContent.length} content nodes to embed`)

    // Generate embeddings for all content
    console.log('🧬 [SEARCH] Generating embeddings for all content...')
    const startTime = Date.now()
    this.contentEmbeddings = await batchEmbedContent(allContent)
    const embeddingTime = Date.now() - startTime
    
    this.initialized = true
    this.lastUpdate = new Date()
    
    console.log(`✅ [SEARCH] Initialized ${this.contentEmbeddings.length} content embeddings in ${embeddingTime}ms`)
  }

  // Process a semantic query
  async search(query: SemanticQuery): Promise<SearchResult[]> {
    console.log(`🔍 [SEARCH] Processing semantic search query: "${query.query}"`)
    
    if (!this.initialized) {
      console.log('🔄 [SEARCH] Engine not initialized, initializing now...')
      await this.initialize()
    }

    // Apply filters if provided
    let filteredEmbeddings = this.contentEmbeddings
    
    if (query.filters) {
      console.log('🎯 [SEARCH] Applying filters:', query.filters)
      const beforeCount = this.contentEmbeddings.length
      
      filteredEmbeddings = this.contentEmbeddings.filter(item => {
        const content = item.content
        
        // Type filter
        if (query.filters?.type && !query.filters.type.includes(content.type)) {
          return false
        }
        
        // Tag filter
        if (query.filters?.tags && content.tags) {
          const hasTag = query.filters.tags.some(tag => 
            content.tags?.includes(tag)
          )
          if (!hasTag) return false
        }
        
        // Date filter
        if (query.filters?.dateRange && content.date) {
          const contentDate = new Date(content.date)
          const { start, end } = query.filters.dateRange
          
          if (start && contentDate < start) return false
          if (end && contentDate > end) return false
        }
        
        return true
      })
      
      console.log(`🗜️ [SEARCH] Filtered from ${beforeCount} to ${filteredEmbeddings.length} items`)
    }

    // Perform semantic search
    console.log(`🤖 [SEARCH] Running semantic search with threshold: ${query.threshold || 0.7}`)
    const searchStartTime = Date.now()
    
    const results = await semanticSearch(
      query.query,
      filteredEmbeddings,
      query.threshold || 0.7,
      query.limit || 10
    )
    
    const searchTime = Date.now() - searchStartTime
    console.log(`📊 [SEARCH] Found ${results.length} results in ${searchTime}ms`)
    
    if (results.length > 0) {
      console.log('🏆 [SEARCH] Top results:', results.slice(0, 3).map(r => ({
        title: r.content.title,
        similarity: `${Math.round(r.similarity * 100)}%`
      })))
    }

    // Add reasoning for each result
    return results.map(result => ({
      ...result,
      reason: this.generateReason(query.query, result.content, result.similarity)
    }))
  }

  // Find content similar to a given piece
  async findSimilar(contentId: string, limit: number = 5): Promise<SearchResult[]> {
    if (!this.initialized) {
      await this.initialize()
    }

    const content = await contentRegistry.getContentById(contentId)
    if (!content) return []

    const results = await findRelatedContent(
      content,
      this.contentEmbeddings,
      limit
    )

    return results.map(result => ({
      ...result,
      reason: `Similar to "${content.title}" (${Math.round(result.similarity * 100)}% match)`
    }))
  }

  // Smart query understanding
  async understandQuery(query: string): Promise<{
    intent: 'search' | 'navigate' | 'explain' | 'compare'
    entities: string[]
    filters: any
  }> {
    console.log(`🧠 [SEARCH] Understanding query intent: "${query}"`)
    const lowerQuery = query.toLowerCase()
    
    // Detect intent
    let intent: 'search' | 'navigate' | 'explain' | 'compare' = 'search'
    
    if (lowerQuery.includes('show') || lowerQuery.includes('go to') || lowerQuery.includes('open')) {
      intent = 'navigate'
    } else if (lowerQuery.includes('what is') || lowerQuery.includes('explain') || lowerQuery.includes('tell me about')) {
      intent = 'explain'
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('difference') || lowerQuery.includes('vs')) {
      intent = 'compare'
    }
    
    console.log(`🎯 [SEARCH] Detected intent: ${intent}`)

    // Extract entities (simplified - in production, use NER)
    const entities: string[] = []
    
    // Look for known content titles
    const hierarchy = await contentRegistry.getNavigationStructure()
    if (hierarchy) {
      hierarchy.allContent.forEach(content => {
        if (lowerQuery.includes(content.title.toLowerCase())) {
          entities.push(content.id)
        }
      })
    }
    
    if (entities.length > 0) {
      console.log(`🏷️ [SEARCH] Extracted entities:`, entities)
    }

    // Extract filters
    const filters: any = {}
    
    // Time-based filters
    if (lowerQuery.includes('latest') || lowerQuery.includes('recent')) {
      filters.dateRange = {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
      }
    }
    
    // Type filters
    if (lowerQuery.includes('venture')) filters.type = ['venture']
    if (lowerQuery.includes('blog') || lowerQuery.includes('post')) filters.type = ['blog']
    if (lowerQuery.includes('case stud')) filters.type = ['case-study']
    
    // Tag filters
    if (lowerQuery.includes('ai') || lowerQuery.includes('machine learning') || lowerQuery.includes('ml')) {
      filters.tags = ['AI', 'Machine Learning', 'ML']
    }
    
    if (Object.keys(filters).length > 0) {
      console.log('🎯 [SEARCH] Extracted filters:', filters)
    }
    
    return { intent, entities, filters }
  }

  // Generate human-readable reason for result
  private generateReason(query: string, content: ContentNode, similarity: number): string {
    const percentage = Math.round(similarity * 100)
    
    // Check for exact title match
    if (content.title.toLowerCase().includes(query.toLowerCase())) {
      return `Title matches "${query}" (${percentage}% similarity)`
    }
    
    // Check for tag match
    if (content.tags) {
      const matchingTags = content.tags.filter(tag => 
        query.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(query.toLowerCase())
      )
      if (matchingTags.length > 0) {
        return `Tagged with ${matchingTags.join(', ')} (${percentage}% similarity)`
      }
    }
    
    // Check for description match
    if (content.description && content.description.toLowerCase().includes(query.toLowerCase())) {
      return `Description mentions "${query}" (${percentage}% similarity)`
    }
    
    // Default semantic similarity
    if (similarity > 0.9) {
      return `Highly relevant to "${query}" (${percentage}% match)`
    } else if (similarity > 0.8) {
      return `Strongly related to "${query}" (${percentage}% match)`
    } else {
      return `Related to "${query}" (${percentage}% match)`
    }
  }

  // Group similar content together
  async findClusters(threshold: number = 0.8): Promise<Array<{
    theme: string
    content: ContentNode[]
  }>> {
    if (!this.initialized) {
      await this.initialize()
    }

    const clusters = clusterBySimilarity(this.contentEmbeddings, threshold)
    
    // Generate theme for each cluster
    return clusters.map((cluster, index) => {
      // Find common tags
      const allTags = cluster.flatMap(c => c.tags || [])
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const commonTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag)
      
      const theme = commonTags.length > 0 
        ? commonTags.join(', ')
        : `Group ${index + 1}`
      
      return { theme, content: cluster }
    })
  }

  // Update embeddings for new content
  async updateContent(content: ContentNode) {
    const embedded = await batchEmbedContent([content])
    
    // Remove old embedding if exists
    this.contentEmbeddings = this.contentEmbeddings.filter(e => e.id !== content.id)
    
    // Add new embedding
    this.contentEmbeddings.push(embedded[0])
    
    this.lastUpdate = new Date()
  }

  // Get engine status
  getStatus() {
    return {
      initialized: this.initialized,
      contentCount: this.contentEmbeddings.length,
      lastUpdate: this.lastUpdate
    }
  }
}

// Export singleton instance
export const semanticSearchEngine = new SemanticSearchEngine()

// Export convenience functions
export async function searchContent(query: string, options?: Partial<SemanticQuery>): Promise<SearchResult[]> {
  return semanticSearchEngine.search({
    query,
    ...options
  })
}

export async function findSimilarContent(contentId: string, limit?: number): Promise<SearchResult[]> {
  return semanticSearchEngine.findSimilar(contentId, limit)
}

export async function understandUserQuery(query: string) {
  return semanticSearchEngine.understandQuery(query)
}