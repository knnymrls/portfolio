#!/usr/bin/env node
/**
 * Live AI System Test - Tests against actual running API
 * Loads environment variables and performs real API calls
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  success: '\x1b[32m',
  error: '\x1b[31m',
  warning: '\x1b[33m',
  info: '\x1b[36m',
  magenta: '\x1b[35m'
}

// Comprehensive test scenarios
const TEST_SCENARIOS = [
  {
    category: '🧭 Navigation Tests',
    tests: [
      {
        query: "Show me your projects",
        expect: {
          commands: ['NAVIGATE:case-studies', 'PRESENT_PROJECTS'],
          keywords: ['project', 'case stud'],
          description: "Navigate to projects"
        }
      },
      {
        query: "Take me to your ventures",
        expect: {
          commands: ['NAVIGATE:ventures', 'NAVIGATE_PAGE'],
          keywords: ['venture'],
          description: "Navigate to ventures"
        }
      },
      {
        query: "Show me your experiments",
        expect: {
          commands: ['NAVIGATE:experiments'],
          keywords: ['experiment'],
          description: "Navigate to experiments"
        }
      },
      {
        query: "Go to the blog",
        expect: {
          commands: ['NAVIGATE:blog', 'NAVIGATE_PAGE'],
          keywords: ['blog', 'post'],
          description: "Navigate to blog"
        }
      },
      {
        query: "Show me the about section",
        expect: {
          commands: ['NAVIGATE:about'],
          keywords: ['about', 'me'],
          description: "Navigate to about"
        }
      }
    ]
  },
  
  {
    category: '✨ Highlighting Tests',
    tests: [
      {
        query: "Show me Nural",
        expect: {
          commands: ['HIGHLIGHT:nural', 'HIGHLIGHT:project-nural'],
          keywords: ['Nural'],
          description: "Highlight Nural project"
        }
      },
      {
        query: "Tell me about Flock",
        expect: {
          commands: ['HIGHLIGHT:flock', 'HIGHLIGHT:project-flock'],
          keywords: ['Flock'],
          description: "Highlight Flock project"
        }
      },
      {
        query: "Show FindU",
        expect: {
          commands: ['HIGHLIGHT:findu'],
          keywords: ['FindU'],
          description: "Highlight FindU projects"
        }
      },
      {
        query: "Highlight the technical implementation",
        expect: {
          commands: ['HIGHLIGHT:technical', 'HIGHLIGHT:section-technical'],
          keywords: ['technical', 'implementation'],
          description: "Highlight technical section"
        }
      },
      {
        query: "Show me the results and impact section",
        expect: {
          commands: ['HIGHLIGHT:results', 'HIGHLIGHT:section-results'],
          keywords: ['results', 'impact'],
          description: "Highlight results section"
        }
      }
    ]
  },
  
  {
    category: '🎬 Presentation Tests',
    tests: [
      {
        query: "Present all your projects",
        expect: {
          commands: ['PRESENT_PROJECTS'],
          keywords: ['project', 'show', 'highlight'],
          description: "Start project presentation"
        }
      },
      {
        query: "Give me a tour of your work",
        expect: {
          commands: ['PRESENT_PROJECTS', 'NAVIGATE'],
          keywords: ['tour', 'project', 'work'],
          description: "Tour presentation mode"
        }
      },
      {
        query: "Walk me through what you've built",
        expect: {
          commands: ['PRESENT_PROJECTS', 'HIGHLIGHT'],
          keywords: ['built', 'project', 'work'],
          description: "Walkthrough presentation"
        }
      }
    ]
  },
  
  {
    category: '🔍 Semantic Search Tests',
    tests: [
      {
        query: "What AI projects have you worked on?",
        expect: {
          keywords: ['AI', 'artificial intelligence', 'machine learning', 'ML'],
          semanticMatch: true,
          description: "Search AI projects"
        }
      },
      {
        query: "Show me your latest work",
        expect: {
          keywords: ['recent', 'latest', 'new'],
          semanticMatch: true,
          description: "Search recent work"
        }
      },
      {
        query: "Tell me about education technology projects",
        expect: {
          keywords: ['education', 'learning', 'student', 'FindU'],
          semanticMatch: true,
          description: "Search EdTech projects"
        }
      },
      {
        query: "What have you built with React?",
        expect: {
          keywords: ['React', 'JavaScript', 'frontend', 'Next.js'],
          semanticMatch: true,
          description: "Search React projects"
        }
      }
    ]
  },
  
  {
    category: '💡 Suggestion Tests',
    tests: [
      {
        query: "What can you show me?",
        expect: {
          suggestions: true,
          suggestionCount: 2,
          description: "Generate navigation suggestions"
        }
      },
      {
        query: "Tell me about yourself",
        expect: {
          suggestions: true,
          suggestionCount: 2,
          description: "Generate about suggestions"
        }
      },
      {
        query: "I'm interested in startups",
        expect: {
          suggestions: true,
          keywords: ['venture', 'startup', 'business'],
          description: "Generate startup suggestions"
        }
      }
    ]
  },
  
  {
    category: '🧠 Memory & Context Tests',
    tests: [
      {
        sequence: [
          {
            query: "Show me Nural",
            expect: { commands: ['HIGHLIGHT:nural'] }
          },
          {
            query: "Tell me more about it",
            expect: { keywords: ['Nural', 'stock', 'chat'] }
          },
          {
            query: "Show me another project",
            expect: { commands: ['HIGHLIGHT'], notInclude: 'nural' }
          }
        ],
        description: "Test conversation memory"
      },
      {
        sequence: [
          {
            query: "I'm interested in AI",
            expect: { keywords: ['AI', 'machine learning'] }
          },
          {
            query: "What else do you have?",
            expect: { contextual: true }
          }
        ],
        description: "Test contextual responses"
      }
    ]
  },
  
  {
    category: '⚠️ Error Handling Tests',
    tests: [
      {
        query: "",
        expect: {
          graceful: true,
          description: "Handle empty query"
        }
      },
      {
        query: "Navigate to xyz123nonexistent",
        expect: {
          graceful: true,
          keywords: ['sorry', 'help', 'unable'],
          description: "Handle invalid navigation"
        }
      },
      {
        query: "Highlight element-that-does-not-exist-999",
        expect: {
          graceful: true,
          description: "Handle missing element"
        }
      }
    ]
  },
  
  {
    category: '🚀 Advanced Features',
    tests: [
      {
        query: "Show me projects similar to Nural",
        expect: {
          semanticMatch: true,
          keywords: ['similar', 'related', 'like'],
          description: "Find similar content"
        }
      },
      {
        query: "What's the most impactful project you've worked on?",
        expect: {
          semanticMatch: true,
          keywords: ['impact', 'results', 'success'],
          description: "Analyze project impact"
        }
      },
      {
        query: "Compare FindU and Flock",
        expect: {
          commands: ['HIGHLIGHT'],
          keywords: ['FindU', 'Flock', 'both', 'difference'],
          description: "Compare projects"
        }
      }
    ]
  }
]

class LiveAITester {
  constructor() {
    this.apiUrl = 'http://localhost:3000/api/chat'
    this.streamUrl = 'http://localhost:3000/api/chat-stream'
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
      conversationHistory: []
    }
  }

  async runAllTests() {
    console.log(`\n${colors.bright}${'='.repeat(70)}${colors.reset}`)
    console.log(`${colors.bright}${colors.magenta}   🤖 LIVE AI SYSTEM TEST SUITE${colors.reset}`)
    console.log(`${colors.bright}${'='.repeat(70)}${colors.reset}`)
    
    // Check API availability
    const apiAvailable = await this.checkAPIAvailability()
    if (!apiAvailable) {
      console.log(`\n${colors.error}❌ API is not available at ${this.apiUrl}${colors.reset}`)
      console.log(`${colors.dim}   Make sure the development server is running (npm run dev)${colors.reset}`)
      process.exit(1)
    }
    
    console.log(`${colors.success}✓ API is available${colors.reset}`)
    console.log(`${colors.info}ℹ Using OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Set ✓' : 'Not found ✗'}${colors.reset}\n`)

    // Run each test scenario
    for (const scenario of TEST_SCENARIOS) {
      await this.runScenario(scenario)
    }

    // Print final report
    this.printReport()
  }

  async checkAPIAvailability() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'test',
          conversationHistory: [],
          currentPath: '/'
        })
      })
      return response.ok
    } catch {
      return false
    }
  }

  async runScenario(scenario) {
    console.log(`\n${colors.bright}${scenario.category}${colors.reset}`)
    console.log(`${colors.dim}${'─'.repeat(50)}${colors.reset}`)

    for (const test of scenario.tests) {
      if (test.sequence) {
        // Handle sequence tests
        await this.runSequenceTest(test)
      } else {
        // Handle single tests
        await this.runSingleTest(test)
      }
    }
  }

  async runSingleTest(test) {
    this.results.total++
    const startTime = Date.now()
    
    process.stdout.write(`  • ${test.expect.description || 'Test'}... `)

    try {
      const response = await this.callAPI(test.query)
      const duration = Date.now() - startTime
      
      const passed = this.validateResponse(response, test.expect)
      
      if (passed) {
        console.log(`${colors.success}✓${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`)
        this.results.passed++
      } else {
        console.log(`${colors.error}✗${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`)
        this.results.failed++
        this.results.errors.push({
          test: test.expect.description,
          query: test.query,
          response: response.reply?.substring(0, 100)
        })
      }
    } catch (error) {
      console.log(`${colors.error}✗ Error: ${error.message}${colors.reset}`)
      this.results.failed++
      this.results.errors.push({
        test: test.expect.description,
        error: error.message
      })
    }
  }

  async runSequenceTest(test) {
    process.stdout.write(`  • ${test.description}... `)
    this.results.total++
    
    try {
      let allPassed = true
      const conversationHistory = []
      
      for (const step of test.sequence) {
        const response = await this.callAPI(step.query, conversationHistory)
        
        // Update conversation history
        conversationHistory.push(
          { role: 'user', content: step.query },
          { role: 'assistant', content: response.reply }
        )
        
        const passed = this.validateResponse(response, step.expect)
        if (!passed) {
          allPassed = false
          break
        }
      }
      
      if (allPassed) {
        console.log(`${colors.success}✓${colors.reset}`)
        this.results.passed++
      } else {
        console.log(`${colors.error}✗${colors.reset}`)
        this.results.failed++
      }
    } catch (error) {
      console.log(`${colors.error}✗ Error: ${error.message}${colors.reset}`)
      this.results.failed++
    }
  }

  async callAPI(message, conversationHistory = []) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationHistory,
        currentPath: '/'
      })
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    return await response.json()
  }

  validateResponse(response, expect) {
    const reply = response.reply || ''
    
    // Check for expected commands - NOW IN SEPARATE FIELDS
    if (expect.commands) {
      const hasCommand = expect.commands.some(cmd => {
        // Check in reply (for backward compatibility)
        if (reply.includes(cmd)) return true
        
        // Check in actual command fields
        if (cmd.includes('NAVIGATE:') && response.navigationAction) {
          return cmd.includes(response.navigationAction)
        }
        if (cmd.includes('NAVIGATE_PAGE:') && response.navigatePage) {
          return cmd.includes(response.navigatePage)
        }
        if (cmd.includes('PRESENT_PROJECTS') && response.presentProjects) {
          return true
        }
        if (cmd.includes('HIGHLIGHT:') && response.highlightProject) {
          return cmd.toLowerCase().includes(response.highlightProject.toLowerCase())
        }
        return false
      })
      if (!hasCommand) return false
    }
    
    // Check for keywords
    if (expect.keywords) {
      const hasKeyword = expect.keywords.some(keyword => 
        reply.toLowerCase().includes(keyword.toLowerCase())
      )
      if (!hasKeyword) return false
    }
    
    // Check for suggestions
    if (expect.suggestions) {
      const hasSuggestions = reply.includes('[SUGGEST:') || reply.includes('[suggest:')
      if (!hasSuggestions) return false
      
      if (expect.suggestionCount) {
        const matches = reply.match(/\[SUGGEST:/gi) || []
        if (matches.length < expect.suggestionCount) return false
      }
    }
    
    // Check for NOT including certain terms
    if (expect.notInclude) {
      if (reply.toLowerCase().includes(expect.notInclude.toLowerCase())) {
        return false
      }
    }
    
    // Check for graceful error handling
    if (expect.graceful) {
      return reply && reply.length > 0 && !reply.includes('error')
    }
    
    return true
  }

  printReport() {
    console.log(`\n${colors.bright}${'='.repeat(70)}${colors.reset}`)
    console.log(`${colors.bright}   📊 TEST RESULTS${colors.reset}`)
    console.log(`${colors.bright}${'='.repeat(70)}${colors.reset}\n`)

    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1)
    
    console.log(`  ${colors.success}✓ Passed:${colors.reset} ${this.results.passed}/${this.results.total}`)
    console.log(`  ${colors.error}✗ Failed:${colors.reset} ${this.results.failed}/${this.results.total}`)
    console.log(`  ${colors.info}📈 Pass Rate:${colors.reset} ${passRate}%`)
    
    // Performance grade
    let grade, gradeColor
    if (passRate >= 90) { grade = 'A'; gradeColor = colors.success }
    else if (passRate >= 80) { grade = 'B'; gradeColor = colors.success }
    else if (passRate >= 70) { grade = 'C'; gradeColor = colors.warning }
    else if (passRate >= 60) { grade = 'D'; gradeColor = colors.warning }
    else { grade = 'F'; gradeColor = colors.error }
    
    console.log(`  ${colors.bright}🎯 Grade:${colors.reset} ${gradeColor}${grade}${colors.reset}`)

    // Show failed tests
    if (this.results.errors.length > 0) {
      console.log(`\n${colors.error}Failed Tests:${colors.reset}`)
      this.results.errors.forEach(error => {
        console.log(`  • ${error.test}`)
        if (error.query) {
          console.log(`    ${colors.dim}Query: "${error.query}"${colors.reset}`)
        }
        if (error.response) {
          console.log(`    ${colors.dim}Response: "${error.response}..."${colors.reset}`)
        }
        if (error.error) {
          console.log(`    ${colors.dim}Error: ${error.error}${colors.reset}`)
        }
      })
    }

    // Recommendations
    console.log(`\n${colors.bright}📝 Recommendations:${colors.reset}`)
    if (passRate < 70) {
      console.log(`  • ${colors.warning}Review AI prompt configuration${colors.reset}`)
      console.log(`  • ${colors.warning}Check command parsing logic${colors.reset}`)
      console.log(`  • ${colors.warning}Verify content registry is loaded${colors.reset}`)
    } else if (passRate < 90) {
      console.log(`  • ${colors.info}Fine-tune response generation${colors.reset}`)
      console.log(`  • ${colors.info}Improve suggestion relevance${colors.reset}`)
    } else {
      console.log(`  • ${colors.success}System is performing well!${colors.reset}`)
    }

    console.log(`\n${colors.bright}${'='.repeat(70)}${colors.reset}\n`)
    
    process.exit(this.results.failed > 0 ? 1 : 0)
  }
}

// Run the tests
async function main() {
  const tester = new LiveAITester()
  await tester.runAllTests()
}

main().catch(error => {
  console.error(`${colors.error}Test suite failed: ${error.message}${colors.reset}`)
  process.exit(1)
})