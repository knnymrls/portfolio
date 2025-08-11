#!/usr/bin/env node
/**
 * Test script to verify Redis caching implementation
 * Checks if Redis is accessible and tests embedding caching
 */

// Since we're in a TypeScript project, we'll just test Redis connection directly
const Redis = require('ioredis')

// Test colors for output
const colors = {
  success: '\x1b[32m✓\x1b[0m',
  error: '\x1b[31m✗\x1b[0m',
  info: '\x1b[36mℹ\x1b[0m',
  warning: '\x1b[33m⚠\x1b[0m'
}

async function testRedisConnection() {
  console.log(`\n${colors.info} Testing Redis connection...`)
  
  const redis = new Redis({
    port: 6379,
    host: 'localhost',
    retryStrategy: () => null, // Don't retry, just fail
    enableOfflineQueue: false,
    lazyConnect: true
  })
  
  try {
    // Try to connect
    await redis.connect()
    
    // Test basic set/get
    const testKey = 'portfolio:test:connection'
    const testValue = JSON.stringify({ message: 'Redis is working!', timestamp: Date.now() })
    
    await redis.set(testKey, testValue, 'EX', 60) // 1 minute TTL
    const getValue = await redis.get(testKey)
    
    if (!getValue) {
      console.log(`${colors.error} Failed to retrieve value from Redis`)
      await redis.quit()
      return false
    }
    
    console.log(`${colors.success} Redis connection successful!`)
    console.log(`  Stored and retrieved:`, JSON.parse(getValue))
    
    // Cleanup
    await redis.del(testKey)
    await redis.quit()
    
    return true
  } catch (error) {
    console.log(`${colors.error} Redis connection failed: ${error.message}`)
    try { await redis.quit() } catch {} // Quietly try to quit
    return false
  }
}

async function testEmbeddingCache() {
  console.log(`\n${colors.info} Testing embedding cache...`)
  
  const redis = new Redis({
    port: 6379,
    host: 'localhost',
    retryStrategy: () => null
  })
  
  try {
    // Simulate embedding cache
    const embeddingKey = 'portfolio:embedding:test'
    const mockEmbedding = Array(1536).fill(0).map(() => Math.random()) // Mock 1536-dim embedding
    
    // Store embedding
    console.log(`${colors.info} Storing mock embedding...`)
    const startTime1 = Date.now()
    await redis.setex(embeddingKey, 30 * 24 * 60 * 60, JSON.stringify({
      data: {
        text: 'test text',
        embedding: mockEmbedding,
        createdAt: Date.now()
      },
      timestamp: Date.now(),
      version: '1.0.0'
    }))
    const time1 = Date.now() - startTime1
    console.log(`${colors.success} Stored embedding in ${time1}ms`)
    
    // Retrieve embedding
    console.log(`${colors.info} Retrieving cached embedding...`)
    const startTime2 = Date.now()
    const cached = await redis.get(embeddingKey)
    const time2 = Date.now() - startTime2
    
    if (cached) {
      const parsed = JSON.parse(cached)
      console.log(`${colors.success} Retrieved embedding in ${time2}ms`)
      console.log(`  Dimensions: ${parsed.data.embedding.length}`)
      console.log(`  Cache speedup: ${time2 < 10 ? 'Fast retrieval!' : 'Normal speed'}`)
    } else {
      console.log(`${colors.error} Failed to retrieve cached embedding`)
      await redis.quit()
      return false
    }
    
    // Cleanup
    await redis.del(embeddingKey)
    await redis.quit()
    
    return true
  } catch (error) {
    console.log(`${colors.error} Embedding cache test failed:`, error.message)
    await redis.quit()
    return false
  }
}

async function testCacheStats() {
  console.log(`\n${colors.info} Getting cache statistics...`)
  
  const redis = new Redis({
    port: 6379,
    host: 'localhost',
    retryStrategy: () => null
  })
  
  try {
    const info = await redis.info()
    
    // Parse some basic stats
    const memMatch = info.match(/used_memory_human:([^\r\n]+)/)
    const keysMatch = info.match(/keys=(\d+)/)
    const uptimeMatch = info.match(/uptime_in_seconds:(\d+)/)
    
    console.log(`${colors.success} Redis server stats:`)
    if (memMatch) {
      console.log(`  Memory usage: ${memMatch[1]}`)
    }
    if (keysMatch) {
      console.log(`  Total keys: ${keysMatch[1]}`)
    }
    if (uptimeMatch) {
      const uptime = parseInt(uptimeMatch[1])
      console.log(`  Uptime: ${Math.floor(uptime / 60)} minutes`)
    }
    
    await redis.quit()
    return true
  } catch (error) {
    console.log(`${colors.error} Failed to get stats:`, error.message)
    await redis.quit()
    return false
  }
}

async function runTests() {
  console.log('====================================')
  console.log('   Redis Cache Test Suite')
  console.log('====================================')
  
  let allPassed = true
  
  // Test 1: Redis Connection
  const redisOk = await testRedisConnection()
  allPassed = allPassed && redisOk
  
  if (!redisOk) {
    console.log(`\n${colors.warning} Redis is not available. The app will use in-memory fallback cache.`)
    console.log(`${colors.info} To enable Redis caching:`)
    console.log('  1. Install Redis: brew install redis')
    console.log('  2. Start Redis: redis-server')
    console.log('  3. Or use Docker: docker run -d -p 6379:6379 redis')
  } else {
    // Test 2: Embedding Cache (only if Redis is available)
    const embeddingOk = await testEmbeddingCache()
    allPassed = allPassed && embeddingOk
    
    // Test 3: Cache Stats
    await testCacheStats()
  }
  
  // Summary
  console.log('\n====================================')
  if (allPassed) {
    console.log(`${colors.success} All tests passed!`)
  } else {
    console.log(`${colors.warning} Some tests failed or were skipped`)
  }
  console.log('====================================\n')
  
  process.exit(allPassed ? 0 : 1)
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.error} Test suite failed:`, error)
  process.exit(1)
})