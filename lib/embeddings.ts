import OpenAI from 'openai'
import { ContentNode } from './content-registry'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Cache for embeddings to avoid recomputation
const embeddingsCache = new Map<string, number[]>()

// Simple in-memory cache for development
// In production, you'd use Redis or a database
export class EmbeddingsStore {
  private cache: Map<string, { embedding: number[]; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24 * 7 // 7 days

  async get(key: string): Promise<number[] | null> {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key)
      return null
    }
    
    return cached.embedding
  }

  async set(key: string, embedding: number[]): Promise<void> {
    this.cache.set(key, {
      embedding,
      timestamp: Date.now()
    })
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }
}

const embeddingsStore = new EmbeddingsStore()

// Generate embedding for a single text
export async function generateEmbedding(text: string): Promise<number[]> {
  // Check cache first
  const cacheKey = `embed_${Buffer.from(text).toString('base64').substring(0, 50)}`
  const cached = await embeddingsStore.get(cacheKey)
  if (cached) return cached

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    
    const embedding = response.data[0].embedding
    
    // Cache the result
    await embeddingsStore.set(cacheKey, embedding)
    
    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
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
  const embeddings = await Promise.all(
    contentNodes.map(node => embedContent(node))
  )
  
  return embeddings
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