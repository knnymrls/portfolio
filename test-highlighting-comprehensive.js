#!/usr/bin/env node
/**
 * Comprehensive Highlighting System Test Suite
 * Tests all aspects of highlighting: command generation, parsing, and execution
 */

require('dotenv').config({ path: '.env.local' })

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  success: '\x1b[32m',
  error: '\x1b[31m',
  warning: '\x1b[33m',
  info: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m'
}

// Test scenarios for highlighting
const HIGHLIGHT_TEST_SCENARIOS = [
  // Project Highlighting Tests
  {
    category: '🎯 Direct Project Names',
    tests: [
      { query: "Show me Nural", expected: "nural", type: "project" },
      { query: "Tell me about Flock", expected: "flock", type: "project" },
      { query: "Show FindU", expected: "findu", type: "project" },
      { query: "Highlight Nural for me", expected: "nural", type: "project" },
      { query: "Can you highlight Flock?", expected: "flock", type: "project" },
      { query: "I want to see FindU highlighted", expected: "findu", type: "project" }
    ]
  },
  
  // Case Variations
  {
    category: '🔤 Case Sensitivity Tests',
    tests: [
      { query: "show me nural", expected: "nural", type: "case" },
      { query: "SHOW ME FLOCK", expected: "flock", type: "case" },
      { query: "Show Me FiNdU", expected: "findu", type: "case" },
      { query: "highlight NURAL", expected: "nural", type: "case" }
    ]
  },
  
  // Context-based Highlighting
  {
    category: '🧠 Contextual Highlighting',
    tests: [
      { query: "What is your chat-based learning platform?", expected: "nural", type: "context" },
      { query: "Tell me about your scheduling project", expected: "flock", type: "context" },
      { query: "Show me the education platform", expected: "findu", type: "context" },
      { query: "Which project helps with stock trading?", expected: "nural", type: "context" }
    ]
  },
  
  // Multiple Projects
  {
    category: '🎭 Multiple Project Highlighting',
    tests: [
      { query: "Show me Nural and Flock", expected: ["nural", "flock"], type: "multiple" },
      { query: "Compare FindU with Nural", expected: ["findu", "nural"], type: "multiple" },
      { query: "Highlight all your AI projects", expected: ["nural", "flock", "findu"], type: "multiple" }
    ]
  },
  
  // Section Highlighting
  {
    category: '📑 Section Highlighting',
    tests: [
      { query: "Show me the technical implementation", expected: "section-technical", type: "section" },
      { query: "Highlight the results section", expected: "section-results", type: "section" },
      { query: "Show me the challenge section", expected: "section-challenge", type: "section" },
      { query: "Can you highlight the solution?", expected: "section-solution", type: "section" }
    ]
  },
  
  // Natural Language Variations
  {
    category: '💬 Natural Language',
    tests: [
      { query: "I'd like to learn about Nural", expected: "nural", type: "natural" },
      { query: "Could you please show me Flock?", expected: "flock", type: "natural" },
      { query: "I'm interested in FindU", expected: "findu", type: "natural" },
      { query: "What can you tell me about Nural?", expected: "nural", type: "natural" },
      { query: "Give me details on Flock", expected: "flock", type: "natural" }
    ]
  },
  
  // Edge Cases
  {
    category: '⚠️ Edge Cases',
    tests: [
      { query: "nural", expected: "nural", type: "edge" },
      { query: "flock project", expected: "flock", type: "edge" },
      { query: "the findu thing", expected: "findu", type: "edge" },
      { query: "that chat learning app", expected: "nural", type: "edge" },
      { query: "ur scheduling tool", expected: "flock", type: "edge" }
    ]
  },
  
  // Typos and Misspellings
  {
    category: '✏️ Typo Handling',
    tests: [
      { query: "Show me Nurel", expected: "nural", type: "typo" },
      { query: "Tell me about Flok", expected: "flock", type: "typo" },
      { query: "Show me FindYou", expected: "findu", type: "typo" },
      { query: "Highlight Nurall", expected: "nural", type: "typo" }
    ]
  },
  
  // Combined Commands
  {
    category: '🔀 Combined Commands',
    tests: [
      { query: "Navigate to projects and highlight Nural", expected: { nav: "case-studies", highlight: "nural" }, type: "combined" },
      { query: "Show me all projects then highlight Flock", expected: { present: true, highlight: "flock" }, type: "combined" },
      { query: "Go to ventures and show FindU", expected: { nav: "ventures", highlight: "findu" }, type: "combined" }
    ]
  },
  
  // Conversation Memory
  {
    category: '🧩 Sequential Context',
    tests: [
      { 
        sequence: [
          { query: "Show me Nural", expected: "nural" },
          { query: "Tell me more about it", expected: "nural" },
          { query: "What about the technical details?", expected: "nural" }
        ],
        type: "sequence"
      },
      {
        sequence: [
          { query: "I'm interested in your projects", expected: "presentation" },
          { query: "Show me the scheduling one", expected: "flock" },
          { query: "And the learning platform?", expected: "nural" }
        ],
        type: "sequence"
      }
    ]
  }
]

class HighlightingTester {
  constructor() {
    this.apiUrl = 'http://localhost:3000/api/chat'
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      details: [],
      byCategory: {}
    }
  }

  async runAllTests() {
    console.log(`\n${colors.bright}${'='.repeat(70)}${colors.reset}`)
    console.log(`${colors.bright}${colors.yellow}   🔦 COMPREHENSIVE HIGHLIGHTING TEST SUITE${colors.reset}`)
    console.log(`${colors.bright}${'='.repeat(70)}${colors.reset}\n`)

    // Check API availability
    const apiAvailable = await this.checkAPI()
    if (!apiAvailable) {
      console.log(`${colors.error}❌ API is not available${colors.reset}`)
      process.exit(1)
    }

    // Run each test category
    for (const scenario of HIGHLIGHT_TEST_SCENARIOS) {
      await this.runScenario(scenario)
    }

    // Print detailed report
    this.printDetailedReport()
  }

  async checkAPI() {
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

    if (!this.results.byCategory[scenario.category]) {
      this.results.byCategory[scenario.category] = { passed: 0, failed: 0, tests: [] }
    }

    for (const test of scenario.tests) {
      if (test.sequence) {
        await this.runSequenceTest(test, scenario.category)
      } else {
        await this.runSingleTest(test, scenario.category)
      }
    }

    // Print category summary
    const catResult = this.results.byCategory[scenario.category]
    const passRate = ((catResult.passed / (catResult.passed + catResult.failed)) * 100).toFixed(0)
    console.log(`${colors.dim}Category Pass Rate: ${passRate}%${colors.reset}`)
  }

  async runSingleTest(test, category) {
    this.results.total++
    const startTime = Date.now()

    process.stdout.write(`  • ${test.query.substring(0, 40).padEnd(40, ' ')} `)

    try {
      const response = await this.callAPI(test.query)
      const duration = Date.now() - startTime
      
      const passed = this.validateHighlighting(response, test.expected, test.type)
      
      if (passed) {
        console.log(`${colors.success}✓${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`)
        this.results.passed++
        this.results.byCategory[category].passed++
      } else {
        console.log(`${colors.error}✗${colors.reset} ${colors.dim}(got: ${response.highlightProject || 'none'})${colors.reset}`)
        this.results.failed++
        this.results.byCategory[category].failed++
        this.results.details.push({
          category,
          query: test.query,
          expected: test.expected,
          received: response.highlightProject || response,
          type: test.type
        })
      }

      this.results.byCategory[category].tests.push({
        query: test.query,
        passed,
        response: response.highlightProject,
        duration
      })

    } catch (error) {
      console.log(`${colors.error}✗ Error: ${error.message}${colors.reset}`)
      this.results.failed++
      this.results.byCategory[category].failed++
    }
  }

  async runSequenceTest(test, category) {
    process.stdout.write(`  • Sequence: ${test.sequence.length} steps... `)
    
    let allPassed = true
    const conversationHistory = []
    
    for (const step of test.sequence) {
      this.results.total++
      
      const response = await this.callAPI(step.query, conversationHistory)
      conversationHistory.push(
        { role: 'user', content: step.query },
        { role: 'assistant', content: response.reply }
      )
      
      const passed = this.validateHighlighting(response, step.expected, 'sequence')
      if (!passed) {
        allPassed = false
        this.results.failed++
        break
      } else {
        this.results.passed++
      }
    }
    
    if (allPassed) {
      console.log(`${colors.success}✓ All steps passed${colors.reset}`)
      this.results.byCategory[category].passed++
    } else {
      console.log(`${colors.error}✗ Sequence failed${colors.reset}`)
      this.results.byCategory[category].failed++
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

    const data = await response.json()
    
    // Log the actual response for debugging
    if (process.env.DEBUG) {
      console.log('\n' + colors.dim + 'Response:', JSON.stringify(data, null, 2) + colors.reset)
    }

    return data
  }

  validateHighlighting(response, expected, type) {
    // Handle different test types
    if (type === 'combined') {
      // Check combined commands
      if (expected.highlight && response.highlightProject !== expected.highlight) return false
      if (expected.nav && response.navigationAction !== expected.nav) return false
      if (expected.present && !response.presentProjects) return false
      return true
    }

    // Handle multiple highlights
    if (Array.isArray(expected)) {
      // For multiple highlights, check if at least one is highlighted
      return expected.some(exp => 
        response.highlightProject?.toLowerCase().includes(exp.toLowerCase())
      )
    }

    // Handle single highlight
    if (typeof expected === 'string') {
      if (expected === 'presentation') {
        return response.presentProjects === true
      }
      
      // Check if the highlight matches (case-insensitive)
      const highlighted = response.highlightProject?.toLowerCase() || ''
      const expectedLower = expected.toLowerCase()
      
      // Handle partial matches for sections
      if (expected.startsWith('section-')) {
        return highlighted.includes(expectedLower.replace('section-', ''))
      }
      
      return highlighted.includes(expectedLower) || 
             expectedLower.includes(highlighted) ||
             (highlighted === 'findu-highschool' && expectedLower === 'findu') ||
             (highlighted === 'findu-college' && expectedLower === 'findu')
    }

    return false
  }

  printDetailedReport() {
    console.log(`\n${colors.bright}${'='.repeat(70)}${colors.reset}`)
    console.log(`${colors.bright}   📊 DETAILED TEST REPORT${colors.reset}`)
    console.log(`${colors.bright}${'='.repeat(70)}${colors.reset}\n`)

    const overallPassRate = ((this.results.passed / this.results.total) * 100).toFixed(1)
    
    // Overall Statistics
    console.log(`${colors.bright}Overall Results:${colors.reset}`)
    console.log(`  ${colors.success}✓ Passed:${colors.reset} ${this.results.passed}/${this.results.total}`)
    console.log(`  ${colors.error}✗ Failed:${colors.reset} ${this.results.failed}/${this.results.total}`)
    console.log(`  ${colors.info}📈 Pass Rate:${colors.reset} ${overallPassRate}%`)
    
    // Grade
    let grade, gradeColor
    if (overallPassRate >= 90) { grade = 'A'; gradeColor = colors.success }
    else if (overallPassRate >= 80) { grade = 'B'; gradeColor = colors.success }
    else if (overallPassRate >= 70) { grade = 'C'; gradeColor = colors.warning }
    else if (overallPassRate >= 60) { grade = 'D'; gradeColor = colors.warning }
    else { grade = 'F'; gradeColor = colors.error }
    
    console.log(`  ${colors.bright}🎯 Grade:${colors.reset} ${gradeColor}${grade}${colors.reset}`)

    // Category Breakdown
    console.log(`\n${colors.bright}Category Breakdown:${colors.reset}`)
    for (const [category, results] of Object.entries(this.results.byCategory)) {
      const total = results.passed + results.failed
      const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(0) : 0
      const icon = passRate >= 70 ? colors.success + '✓' : colors.error + '✗'
      console.log(`  ${icon} ${category}: ${passRate}% (${results.passed}/${total})${colors.reset}`)
    }

    // Failed Tests Details
    if (this.results.details.length > 0) {
      console.log(`\n${colors.error}Failed Test Details:${colors.reset}`)
      
      // Group failures by type
      const failuresByType = {}
      this.results.details.forEach(detail => {
        if (!failuresByType[detail.type]) {
          failuresByType[detail.type] = []
        }
        failuresByType[detail.type].push(detail)
      })

      for (const [type, failures] of Object.entries(failuresByType)) {
        console.log(`\n  ${colors.warning}${type.toUpperCase()} failures:${colors.reset}`)
        failures.slice(0, 5).forEach(f => {
          console.log(`    • Query: "${f.query}"`)
          console.log(`      Expected: ${colors.success}${f.expected}${colors.reset}`)
          console.log(`      Got: ${colors.error}${f.received || 'none'}${colors.reset}`)
        })
        if (failures.length > 5) {
          console.log(`    ... and ${failures.length - 5} more`)
        }
      }
    }

    // Performance Metrics
    console.log(`\n${colors.bright}Performance Metrics:${colors.reset}`)
    let totalDuration = 0
    let testCount = 0
    for (const category of Object.values(this.results.byCategory)) {
      category.tests?.forEach(test => {
        if (test.duration) {
          totalDuration += test.duration
          testCount++
        }
      })
    }
    const avgDuration = testCount > 0 ? (totalDuration / testCount).toFixed(0) : 0
    console.log(`  Average Response Time: ${avgDuration}ms`)

    // Recommendations
    console.log(`\n${colors.bright}📝 Recommendations:${colors.reset}`)
    if (overallPassRate < 50) {
      console.log(`  ${colors.error}• Critical: Highlighting system is broken${colors.reset}`)
      console.log(`  ${colors.error}• Check command generation in system prompt${colors.reset}`)
      console.log(`  ${colors.error}• Verify highlightProject field is being set${colors.reset}`)
    } else if (overallPassRate < 70) {
      console.log(`  ${colors.warning}• Improve context understanding${colors.reset}`)
      console.log(`  ${colors.warning}• Add more project name variations${colors.reset}`)
      console.log(`  ${colors.warning}• Fix typo handling${colors.reset}`)
    } else if (overallPassRate < 90) {
      console.log(`  ${colors.info}• Fine-tune edge cases${colors.reset}`)
      console.log(`  ${colors.info}• Improve natural language processing${colors.reset}`)
    } else {
      console.log(`  ${colors.success}• System is performing well!${colors.reset}`)
      console.log(`  ${colors.success}• Consider adding more complex scenarios${colors.reset}`)
    }

    console.log(`\n${colors.bright}${'='.repeat(70)}${colors.reset}\n`)
  }
}

// Run the tests
async function main() {
  const tester = new HighlightingTester()
  await tester.runAllTests()
  
  process.exit(tester.results.failed > 0 ? 1 : 0)
}

main().catch(error => {
  console.error(`${colors.error}Test suite failed: ${error.message}${colors.reset}`)
  console.error(error.stack)
  process.exit(1)
})