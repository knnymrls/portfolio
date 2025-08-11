import OpenAI from 'openai'
import { ContentNode } from './content-registry'
import { redisCache } from './redis-cache'
import { logger } from './logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Hybrid caching strategy: Redis (primary) + in-memory (fallback)
export class EmbeddingsStore {
  // In-memory fallback cache for when Redis is unavailable
  private fallbackCache: Map<string, { embedding: number[]; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24 * 7 // 7 days for fallback
  private useRedis = true

  async get(key: string): Promise<number[] | null> {
    // Try Redis first
    if (this.useRedis) {
      try {
        const cached = await redisCache.getEmbedding(key)
        if (cached) {
          logger.debug('EMBEDDINGS', `Cache hit (Redis): ${key.substring(0, 20)}...`)
          return cached.embedding
        }
      } catch (error) {
        logger.warn('EMBEDDINGS', `Redis unavailable, falling back to memory cache`)
        this.useRedis = false // Temporarily disable Redis
        setTimeout(() => { this.useRedis = true }, 60000) // Retry after 1 minute
      }
    }
    
    // Fallback to in-memory cache
    const cached = this.fallbackCache.get(key)
    if (!cached) return null
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.fallbackCache.delete(key)
      return null
    }
    
    logger.debug('EMBEDDINGS', `Cache hit (memory): ${key.substring(0, 20)}...`)
    return cached.embedding
  }

  async set(key: string, embedding: number[]): Promise<void> {
    // Save to Redis (async, don't wait)
    if (this.useRedis) {
      redisCache.setEmbedding(key, embedding).catch(error => {
        logger.warn('EMBEDDINGS', `Failed to cache to Redis: ${error}`)
      })
    }
    
    // Always save to fallback cache
    this.fallbackCache.set(key, {
      embedding,
      timestamp: Date.now()
    })
    
    // Keep fallback cache size reasonable (LRU-like behavior)
    if (this.fallbackCache.size > 1000) {
      const firstKey = this.fallbackCache.keys().next().value
      if (firstKey !== undefined) {
        this.fallbackCache.delete(firstKey)
      }
    }
  }

  async clear(): Promise<void> {
    // Clear Redis cache
    if (this.useRedis) {
      await redisCache.clear('embedding:*')
    }
    // Clear in-memory cache
    this.fallbackCache.clear()
  }
  
  async getStats(): Promise<{
    redisAvailable: boolean
    memoryCacheSize: number
    redisCacheStats?: any
  }> {
    const stats: any = {
      redisAvailable: this.useRedis,
      memoryCacheSize: this.fallbackCache.size
    }
    
    if (this.useRedis) {
      stats.redisCacheStats = await redisCache.getStats()
    }
    
    return stats
  }
}

const embeddingsStore = new EmbeddingsStore()

// Generate embedding for a single text
export async function generateEmbedding(text: string): Promise<number[]> {
  // Use the actual text as cache key (Redis cache will hash it)
  const cached = await embeddingsStore.get(text)
  if (cached) return cached

  try {
    logger.debug('EMBEDDINGS', `Generating new embedding for text: ${text.substring(0, 50)}...`)
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    
    const embedding = response.data[0].embedding
    
    // Cache the result
    await embeddingsStore.set(text, embedding)
    
    logger.success('EMBEDDINGS', `Generated and cached embedding (${embedding.length} dimensions)`)
    return embedding
  } catch (error) {
    logger.error('EMBEDDINGS', `Failed to generate embedding: ${error}`)
    // Return empty embedding on error (could implement fallback)
    return []
  }
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)
  
  if (normA === 0 || normB === 0) return 0
  
  return dotProduct / (normA * normB)
}

// Embed content nodes with caching
export async function embedContent(content: ContentNode): Promise<{
  id: string
  embedding: number[]
  content: ContentNode
}> {
  // Create text representation of the content
  const textToEmbed = `${content.title} ${content.description || ''} ${content.tags?.join(' ') || ''} ${content.content || ''}`.substring(0, 8000) // Limit to avoid token limits
  
  const embedding = await generateEmbedding(textToEmbed)
  
  return {
    id: content.id,
    embedding,
    content
  }
}

// Search for similar content using embeddings
export async function semanticSearch(
  query: string,
  contentEmbeddings: Array<{ id: string; embedding: number[]; content: ContentNode }>,
  threshold: number = 0.7,
  limit: number = 10
): Promise<Array<{ content: ContentNode; similarity: number }>> {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query)
  
  if (queryEmbedding.length === 0) {
    // Fallback to keyword search if embedding fails
    return keywordFallback(query, contentEmbeddings.map(e => e.content), limit)
  }
  
  // Calculate similarities
  const results = contentEmbeddings
    .map(item => ({
      content: item.content,
      similarity: cosineSimilarity(queryEmbedding, item.embedding)
    }))
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
  
  return results
}

// Fallback keyword search when embeddings fail
function keywordFallback(
  query: string,
  content: ContentNode[],
  limit: number
): Array<{ content: ContentNode; similarity: number }> {
  const queryLower = query.toLowerCase()
  const keywords = queryLower.split(/\s+/)
  
  return content
    .map(node => {
      const searchText = `${node.title} ${node.description || ''} ${node.tags?.join(' ') || ''}`.toLowerCase()
      const matchCount = keywords.filter(keyword => searchText.includes(keyword)).length
      
      return {
        content: node,
        similarity: matchCount / keywords.length
      }
    })
    .filter(item => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}

// Find related content based on a given content node
export async function findRelatedContent(
  sourceContent: ContentNode,
  contentEmbeddings: Array<{ id: string; embedding: number[]; content: ContentNode }>,
  limit: number = 5
): Promise<Array<{ content: ContentNode; similarity: number }>> {
  // Find the source embedding
  const sourceEmbedding = contentEmbeddings.find(e => e.id === sourceContent.id)?.embedding
  
  if (!sourceEmbedding) {
    // Generate embedding if not found
    const embedded = await embedContent(sourceContent)
    return semanticSearch(sourceContent.title, contentEmbeddings, 0.6, limit)
  }
  
  // Calculate similarities to all other content
  const results = contentEmbeddings
    .filter(item => item.id !== sourceContent.id) // Exclude self
    .map(item => ({
      content: item.content,
      similarity: cosineSimilarity(sourceEmbedding, item.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
  
  return results
}

// Batch embed multiple content nodes
export async function batchEmbedContent(
  contentNodes: ContentNode[]
): Promise<Array<{ id: string; embedding: number[]; content: ContentNode }>> {
  logger.info('EMBEDDINGS', `Batch embedding ${contentNodes.length} content nodes...`)
  const startTime = Date.now()
  
  // Process in batches to avoid rate limits
  const BATCH_SIZE = 10
  const results: Array<{ id: string; embedding: number[]; content: ContentNode }> = []
  
  for (let i = 0; i < contentNodes.length; i += BATCH_SIZE) {
    const batch = contentNodes.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(node => embedContent(node))
    )
    results.push(...batchResults)
    
    // Small delay between batches to avoid rate limits
    if (i + BATCH_SIZE < contentNodes.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  const duration = Date.now() - startTime
  logger.success('EMBEDDINGS', `Batch embedding complete in ${duration}ms`)
  
  // Try to save all embeddings to Redis in batch (non-blocking)
  if (results.length > 0) {
    redisCache.setEmbeddings(
      results.map(r => ({
        text: `${r.content.title} ${r.content.description || ''} ${r.content.tags?.join(' ') || ''}`,
        embedding: r.embedding,
        metadata: { contentId: r.id }
      }))
    ).catch(error => {
      logger.warn('EMBEDDINGS', `Failed to batch save to Redis: ${error}`)
    })
  }
  
  return results
}

// Group content by similarity
export function clusterBySimilarity(
  embeddings: Array<{ id: string; embedding: number[]; content: ContentNode }>,
  threshold: number = 0.8
): Array<Array<ContentNode>> {
  const clusters: Array<Array<ContentNode>> = []
  const visited = new Set<string>()
  
  for (const item of embeddings) {
    if (visited.has(item.id)) continue
    
    const cluster: ContentNode[] = [item.content]
    visited.add(item.id)
    
    // Find all similar items
    for (const other of embeddings) {
      if (visited.has(other.id)) continue
      
      const similarity = cosineSimilarity(item.embedding, other.embedding)
      if (similarity >= threshold) {
        cluster.push(other.content)
        visited.add(other.id)
      }
    }
    
    clusters.push(cluster)
  }
  
  return clusters
}