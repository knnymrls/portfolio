/**
 * Redis Cache Utility
 * Persistent caching layer for OpenAI embeddings and other data
 * Replaces in-memory cache with Redis for 30-day persistence
 */

import Redis from 'ioredis'
import { logger } from './logger'

// Cache configuration
const CACHE_CONFIG = {
  EMBEDDING_TTL: 30 * 24 * 60 * 60, // 30 days in seconds
  CONTENT_TTL: 7 * 24 * 60 * 60,    // 7 days for content cache
  KEY_PREFIX: 'portfolio:',           // Namespace for all keys
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000 // ms
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  version: string
}

class RedisCache {
  private client: Redis | null = null
  private isConnected = false
  private connectionPromise: Promise<void> | null = null

  constructor() {
    this.initializeClient()
  }

  /**
   * Initialize Redis client with connection handling
   */
  private async initializeClient() {
    try {
      // Use Redis URL from environment or default to localhost
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
      
      this.client = new Redis(redisUrl, {
        retryStrategy: (times) => {
          if (times > CACHE_CONFIG.MAX_RETRIES) {
            logger.error('REDIS', `Failed to connect after ${times} attempts`)
            return null // Stop retrying
          }
          return Math.min(times * 100, 3000)
        },
        enableOfflineQueue: true,
        lazyConnect: true // Don't connect immediately
      })

      // Set up event handlers
      this.client.on('connect', () => {
        this.isConnected = true
        logger.success('REDIS', 'Connected to Redis cache')
      })

      this.client.on('error', (error) => {
        logger.error('REDIS', `Connection error: ${error.message}`)
        this.isConnected = false
      })

      this.client.on('close', () => {
        this.isConnected = false
        logger.warn('REDIS', 'Connection closed')
      })

      // Attempt connection
      this.connectionPromise = this.connect()
    } catch (error) {
      logger.error('REDIS', `Failed to initialize client: ${error}`)
      this.client = null
    }
  }

  /**
   * Connect to Redis
   */
  private async connect(): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }

    try {
      await this.client.connect()
      this.isConnected = true
    } catch (error) {
      logger.error('REDIS', `Connection failed: ${error}`)
      this.isConnected = false
      throw error
    }
  }

  /**
   * Ensure connection is established
   */
  private async ensureConnected(): Promise<boolean> {
    if (this.isConnected && this.client) {
      return true
    }

    if (this.connectionPromise) {
      try {
        await this.connectionPromise
        return this.isConnected
      } catch {
        return false
      }
    }

    return false
  }

  /**
   * Generate cache key with namespace
   */
  private getCacheKey(key: string): string {
    return `${CACHE_CONFIG.KEY_PREFIX}${key}`
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(
    key: string, 
    value: T, 
    ttl: number = CACHE_CONFIG.CONTENT_TTL
  ): Promise<boolean> {
    if (!await this.ensureConnected() || !this.client) {
      logger.warn('REDIS', 'Skipping cache set - not connected')
      return false
    }

    try {
      const cacheKey = this.getCacheKey(key)
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        version: process.env.npm_package_version || '1.0.0'
      }

      await this.client.setex(
        cacheKey,
        ttl,
        JSON.stringify(entry)
      )

      logger.debug('REDIS', `Cached key: ${key} (TTL: ${ttl}s)`)
      return true
    } catch (error) {
      logger.error('REDIS', `Failed to set cache: ${error}`)
      return false
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!await this.ensureConnected() || !this.client) {
      logger.warn('REDIS', 'Skipping cache get - not connected')
      return null
    }

    try {
      const cacheKey = this.getCacheKey(key)
      const data = await this.client.get(cacheKey)
      
      if (!data) {
        return null
      }

      const entry: CacheEntry<T> = JSON.parse(data)
      logger.debug('REDIS', `Cache hit: ${key}`)
      return entry.data
    } catch (error) {
      logger.error('REDIS', `Failed to get cache: ${error}`)
      return null
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    if (!await this.ensureConnected() || !this.client) {
      return false
    }

    try {
      const cacheKey = this.getCacheKey(key)
      const exists = await this.client.exists(cacheKey)
      return exists === 1
    } catch (error) {
      logger.error('REDIS', `Failed to check key existence: ${error}`)
      return false
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!await this.ensureConnected() || !this.client) {
      return false
    }

    try {
      const cacheKey = this.getCacheKey(key)
      const result = await this.client.del(cacheKey)
      logger.debug('REDIS', `Deleted key: ${key}`)
      return result === 1
    } catch (error) {
      logger.error('REDIS', `Failed to delete key: ${error}`)
      return false
    }
  }

  /**
   * Clear all cache with pattern
   */
  async clear(pattern: string = '*'): Promise<number> {
    if (!await this.ensureConnected() || !this.client) {
      return 0
    }

    try {
      const searchPattern = this.getCacheKey(pattern)
      const keys = await this.client.keys(searchPattern)
      
      if (keys.length === 0) {
        return 0
      }

      const result = await this.client.del(...keys)
      logger.info('REDIS', `Cleared ${result} cache entries`)
      return result
    } catch (error) {
      logger.error('REDIS', `Failed to clear cache: ${error}`)
      return 0
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean
    memoryUsage?: number
    keyCount?: number
    uptime?: number
  }> {
    const stats: any = {
      connected: this.isConnected
    }

    if (!await this.ensureConnected() || !this.client) {
      return stats
    }

    try {
      const info = await this.client.info('memory')
      const memMatch = info.match(/used_memory:(\d+)/)
      if (memMatch) {
        stats.memoryUsage = parseInt(memMatch[1])
      }

      const dbInfo = await this.client.info('keyspace')
      const keysMatch = dbInfo.match(/keys=(\d+)/)
      if (keysMatch) {
        stats.keyCount = parseInt(keysMatch[1])
      }

      const serverInfo = await this.client.info('server')
      const uptimeMatch = serverInfo.match(/uptime_in_seconds:(\d+)/)
      if (uptimeMatch) {
        stats.uptime = parseInt(uptimeMatch[1])
      }
    } catch (error) {
      logger.error('REDIS', `Failed to get stats: ${error}`)
    }

    return stats
  }

  /**
   * Set embedding with specific TTL
   */
  async setEmbedding(
    text: string, 
    embedding: number[],
    metadata?: any
  ): Promise<boolean> {
    const key = `embedding:${this.hashText(text)}`
    const value = {
      text,
      embedding,
      metadata,
      createdAt: Date.now()
    }
    
    return this.set(key, value, CACHE_CONFIG.EMBEDDING_TTL)
  }

  /**
   * Get embedding from cache
   */
  async getEmbedding(text: string): Promise<{
    text: string
    embedding: number[]
    metadata?: any
    createdAt: number
  } | null> {
    const key = `embedding:${this.hashText(text)}`
    return this.get(key)
  }

  /**
   * Batch set embeddings
   */
  async setEmbeddings(
    embeddings: Array<{
      text: string
      embedding: number[]
      metadata?: any
    }>
  ): Promise<number> {
    if (!await this.ensureConnected() || !this.client) {
      return 0
    }

    let successCount = 0
    const pipeline = this.client.pipeline()

    for (const item of embeddings) {
      const key = this.getCacheKey(`embedding:${this.hashText(item.text)}`)
      const entry: CacheEntry<any> = {
        data: {
          text: item.text,
          embedding: item.embedding,
          metadata: item.metadata,
          createdAt: Date.now()
        },
        timestamp: Date.now(),
        version: process.env.npm_package_version || '1.0.0'
      }

      pipeline.setex(
        key,
        CACHE_CONFIG.EMBEDDING_TTL,
        JSON.stringify(entry)
      )
    }

    try {
      const results = await pipeline.exec()
      successCount = results?.filter(r => r[0] === null).length || 0
      logger.info('REDIS', `Batch cached ${successCount} embeddings`)
    } catch (error) {
      logger.error('REDIS', `Batch cache failed: ${error}`)
    }

    return successCount
  }

  /**
   * Simple hash function for text keys
   */
  private hashText(text: string): string {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Clean up and close connection
   */
  async cleanup(): Promise<void> {
    if (this.client) {
      logger.info('REDIS', 'Closing connection...')
      await this.client.quit()
      this.client = null
      this.isConnected = false
    }
  }
}

// Export singleton instance
export const redisCache = new RedisCache()

// Export types
export type { CacheEntry }