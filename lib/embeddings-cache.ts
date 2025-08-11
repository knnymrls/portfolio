// Client-side embeddings cache using localStorage
// This optimizes performance by caching embeddings in the browser

interface CachedEmbedding {
  embedding: number[]
  timestamp: number
  contentHash: string
}

export class ClientEmbeddingsCache {
  private readonly CACHE_KEY_PREFIX = 'portfolio_embedding_'
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
  private readonly MAX_CACHE_SIZE = 100 // Maximum number of cached embeddings

  // Generate a hash for content to detect changes
  private hashContent(content: string): string {
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36)
  }

  // Get cached embedding if valid
  get(key: string, content: string): number[] | null {
    if (typeof window === 'undefined') return null // Server-side rendering check
    
    try {
      const cached = localStorage.getItem(this.CACHE_KEY_PREFIX + key)
      if (!cached) return null
      
      const data: CachedEmbedding = JSON.parse(cached)
      
      // Check if cache is expired
      if (Date.now() - data.timestamp > this.CACHE_DURATION) {
        this.remove(key)
        return null
      }
      
      // Check if content has changed
      const currentHash = this.hashContent(content)
      if (data.contentHash !== currentHash) {
        this.remove(key)
        return null
      }
      
      return data.embedding
    } catch (error) {
      console.error('Error reading from cache:', error)
      return null
    }
  }

  // Store embedding in cache
  set(key: string, content: string, embedding: number[]): void {
    if (typeof window === 'undefined') return // Server-side rendering check
    
    try {
      // Clean up old cache entries if needed
      this.cleanupIfNeeded()
      
      const data: CachedEmbedding = {
        embedding,
        timestamp: Date.now(),
        contentHash: this.hashContent(content)
      }
      
      localStorage.setItem(this.CACHE_KEY_PREFIX + key, JSON.stringify(data))
    } catch (error) {
      console.error('Error writing to cache:', error)
      // If localStorage is full, clear some space
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearOldest()
        // Try again
        try {
          const data: CachedEmbedding = {
            embedding,
            timestamp: Date.now(),
            contentHash: this.hashContent(content)
          }
          localStorage.setItem(this.CACHE_KEY_PREFIX + key, JSON.stringify(data))
        } catch (retryError) {
          console.error('Failed to cache after cleanup:', retryError)
        }
      }
    }
  }

  // Remove specific cache entry
  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.CACHE_KEY_PREFIX + key)
  }

  // Clear all embeddings cache
  clearAll(): void {
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }

  // Get cache statistics
  getStats(): { count: number; totalSize: number; oldestTimestamp: number | null } {
    if (typeof window === 'undefined') {
      return { count: 0, totalSize: 0, oldestTimestamp: null }
    }
    
    const keys = Object.keys(localStorage)
    let count = 0
    let totalSize = 0
    let oldestTimestamp: number | null = null
    
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY_PREFIX)) {
        count++
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length
          try {
            const data: CachedEmbedding = JSON.parse(value)
            if (!oldestTimestamp || data.timestamp < oldestTimestamp) {
              oldestTimestamp = data.timestamp
            }
          } catch (error) {
            // Invalid cache entry, ignore
          }
        }
      }
    })
    
    return { count, totalSize, oldestTimestamp }
  }

  // Clean up if cache is getting too large
  private cleanupIfNeeded(): void {
    const stats = this.getStats()
    
    if (stats.count > this.MAX_CACHE_SIZE) {
      // Remove oldest entries
      const toRemove = stats.count - this.MAX_CACHE_SIZE + 10 // Remove 10 extra for buffer
      this.clearOldest(toRemove)
    }
  }

  // Clear oldest cache entries
  private clearOldest(count: number = 1): void {
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage)
    const cacheEntries: Array<{ key: string; timestamp: number }> = []
    
    keys.forEach(key => {
      if (key.startsWith(this.CACHE_KEY_PREFIX)) {
        try {
          const value = localStorage.getItem(key)
          if (value) {
            const data: CachedEmbedding = JSON.parse(value)
            cacheEntries.push({ key, timestamp: data.timestamp })
          }
        } catch (error) {
          // Invalid entry, remove it
          localStorage.removeItem(key)
        }
      }
    })
    
    // Sort by timestamp (oldest first)
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp)
    
    // Remove oldest entries
    for (let i = 0; i < Math.min(count, cacheEntries.length); i++) {
      localStorage.removeItem(cacheEntries[i].key)
    }
  }

  // Preload embeddings for better performance
  async preloadEmbeddings(contentIds: string[]): Promise<void> {
    // This would typically fetch embeddings from the server
    // and cache them for later use
    console.log(`Preloading ${contentIds.length} embeddings...`)
    
    // In a real implementation, you'd batch fetch from the server:
    // const embeddings = await fetch('/api/embeddings', { 
    //   method: 'POST',
    //   body: JSON.stringify({ ids: contentIds })
    // })
  }
}

// Export singleton instance for client-side use
export const clientEmbeddingsCache = new ClientEmbeddingsCache()