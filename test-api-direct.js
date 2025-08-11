#!/usr/bin/env node
/**
 * Direct API Test - Simple and focused
 */

const testCases = [
  "Show me Nural",
  "Tell me about Flock", 
  "Highlight FindU",
  "Show me your projects",
  "Navigate to ventures",
  "Present all projects"
]

async function testAPI(message) {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationHistory: [],
        currentPath: '/'
      })
    })
    
    const data = await response.json()
    
    // Extract key fields
    const result = {
      query: message,
      highlightProject: data.highlightProject || null,
      navigationAction: data.navigationAction || null,
      navigatePage: data.navigatePage || null,
      presentProjects: data.presentProjects || false,
      hasCommands: !!(data.highlightProject || data.navigationAction || data.navigatePage || data.presentProjects),
      replyLength: data.reply ? data.reply.length : 0
    }
    
    return result
  } catch (error) {
    return { query: message, error: error.message }
  }
}

async function main() {
  console.log('🧪 DIRECT API TESTING\n')
  console.log('Testing command generation for highlighting and navigation...\n')
  
  for (const testCase of testCases) {
    const result = await testAPI(testCase)
    
    console.log(`Query: "${testCase}"`)
    
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`)
    } else {
      console.log(`  Commands Generated: ${result.hasCommands ? '✅' : '❌'}`)
      
      if (result.highlightProject) {
        console.log(`  🔦 Highlight: ${result.highlightProject}`)
      }
      if (result.navigationAction) {
        console.log(`  🧭 Navigate: ${result.navigationAction}`)
      }
      if (result.navigatePage) {
        console.log(`  📄 Navigate Page: ${result.navigatePage}`)
      }
      if (result.presentProjects) {
        console.log(`  🎬 Present Projects: Yes`)
      }
      
      console.log(`  📝 Reply Length: ${result.replyLength} chars`)
    }
    
    console.log()
  }
  
  // Test a complex query
  console.log('Complex Query Test:')
  const complexResult = await testAPI("Show me Nural and then navigate to ventures")
  console.log(`Query: "Show me Nural and then navigate to ventures"`)
  console.log(`  Result:`, JSON.stringify(complexResult, null, 2))
}

main().catch(console.error)