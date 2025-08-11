#!/usr/bin/env node

/**
 * AI System Test CLI
 * Run with: node test-ai.js
 * 
 * This tool tests the AI system directly without the UI
 * Shows all navigation commands, highlights, and suggestions
 */

const readline = require('readline');
// Use console colors instead of chalk for simplicity
const colors = {
  input: (text) => `\x1b[36m${text}\x1b[0m`, // cyan
  response: (text) => `\x1b[37m${text}\x1b[0m`, // white
  navigation: (text) => `\x1b[33m${text}\x1b[0m`, // yellow
  highlight: (text) => `\x1b[35m${text}\x1b[0m`, // magenta
  suggestion: (text) => `\x1b[32m${text}\x1b[0m`, // green
  error: (text) => `\x1b[31m${text}\x1b[0m`, // red
  debug: (text) => `\x1b[90m${text}\x1b[0m`, // gray
  success: (text) => `\x1b[32;1m${text}\x1b[0m`, // green bold
  header: (text) => `\x1b[34;1m${text}\x1b[0m` // blue bold
};

// Mock the OpenAI API if not available
const MOCK_MODE = !process.env.OPENAI_API_KEY;

// Test queries to validate AI behavior
const TEST_QUERIES = [
  "Show me your projects",
  "Tell me about Nural",
  "What about Flock?",
  "Show me FindU",
  "What's the challenge?",
  "Tell me about the solution",
  "Show me another project",
  "What ventures are you working on?",
  "Navigate to experiments",
  "What technologies do you use?"
];

class AITester {
  constructor() {
    this.conversationHistory = [];
    this.currentPath = '/';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: colors.input('AI> ')
    });
  }

  async start() {
    console.clear();
    console.log(colors.header('='.repeat(60)));
    console.log(colors.header('       Portfolio AI System Test Environment'));
    console.log(colors.header('='.repeat(60)));
    console.log(colors.debug('\nMode: ' + (MOCK_MODE ? 'MOCK (No API Key)' : 'LIVE')));
    console.log(colors.debug('Type "help" for commands, "test" to run all tests\n'));

    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const input = line.trim();
      
      if (input === 'help') {
        this.showHelp();
      } else if (input === 'test') {
        await this.runAllTests();
      } else if (input === 'clear') {
        console.clear();
        this.conversationHistory = [];
        console.log(colors.success('✓ Cleared conversation history'));
      } else if (input === 'history') {
        this.showHistory();
      } else if (input === 'exit' || input === 'quit') {
        this.rl.close();
        process.exit(0);
      } else if (input) {
        await this.testQuery(input);
      }
      
      this.rl.prompt();
    });
  }

  showHelp() {
    console.log(colors.header('\n📚 Available Commands:'));
    console.log('  help     - Show this help message');
    console.log('  test     - Run all test queries');
    console.log('  clear    - Clear conversation history');
    console.log('  history  - Show conversation history');
    console.log('  exit     - Exit the test environment');
    console.log('\n💡 Or type any query to test the AI response\n');
  }

  showHistory() {
    console.log(colors.header('\n📝 Conversation History:'));
    if (this.conversationHistory.length === 0) {
      console.log(colors.debug('  (empty)'));
    } else {
      this.conversationHistory.forEach((msg, i) => {
        const color = msg.role === 'user' ? colors.input : colors.response;
        console.log(`  ${i + 1}. [${msg.role}]: ${color(msg.content.substring(0, 50))}...`);
      });
    }
    console.log();
  }

  async runAllTests() {
    console.log(colors.header('\n🧪 Running All Test Queries...\n'));
    
    for (const query of TEST_QUERIES) {
      await this.testQuery(query, true);
      await this.sleep(500); // Brief pause between tests
    }
    
    console.log(colors.header('\n✅ All Tests Complete!\n'));
    this.showTestSummary();
  }

  async testQuery(query, isTest = false) {
    console.log(colors.input(`\n👤 USER: ${query}`));
    console.log(colors.debug('─'.repeat(50)));

    try {
      const response = await this.callAI(query);
      this.parseAndDisplayResponse(response, isTest);
      
      // Add to history
      this.conversationHistory.push(
        { role: 'user', content: query },
        { role: 'assistant', content: response.reply }
      );
      
      // Keep history limited
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }
    } catch (error) {
      console.log(colors.error(`\n❌ ERROR: ${error.message}\n`));
    }
  }

  async callAI(message) {
    if (MOCK_MODE) {
      return this.mockAIResponse(message);
    }

    // Call the actual API
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: this.conversationHistory.slice(-5),
          currentPath: this.currentPath
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock if API fails
      console.log(colors.debug('API call failed, using mock response'));
      return this.mockAIResponse(message);
    }
  }

  mockAIResponse(message) {
    const lower = message.toLowerCase();
    let response = {
      reply: '',
      navigationAction: null,
      navigatePage: null,
      presentProjects: false,
      highlightProject: null
    };

    // Simulate AI behavior
    if (lower.includes('show') && lower.includes('projects')) {
      response.presentProjects = true;
      response.navigationAction = 'case-studies';
      response.reply = "PRESENT_PROJECTS NAVIGATE:case-studies I'd love to show you my projects! Let me walk you through each one.";
    } else if (lower.includes('nural')) {
      response.highlightProject = 'nural';
      response.reply = "HIGHLIGHT:nural Let me highlight Nural for you! It's a chat-based learning platform for stock trading with 10,000+ users.";
    } else if (lower.includes('flock')) {
      response.highlightProject = 'flock';
      response.reply = "HIGHLIGHT:flock Here's Flock! It's an AI scheduling platform that helps teams find meeting times.";
    } else if (lower.includes('findu')) {
      response.highlightProject = 'findu-highschool';
      response.reply = "HIGHLIGHT:findu-highschool Let me show you FindU! It helped 5,000+ students across 25 schools.";
    } else if (lower.includes('ventures')) {
      response.navigatePage = '/content/ventures';
      response.reply = "NAVIGATE_PAGE:/content/ventures I'm working on several ventures! Let me show you what I'm building.";
    } else if (lower.includes('challenge')) {
      response.highlightProject = 'section-the-challenge';
      response.reply = "HIGHLIGHT:section-the-challenge The main challenge was scalability.";
    } else {
      response.reply = "I'm a portfolio AI assistant. I can show you projects, ventures, and more!";
    }

    // Add mock suggestions
    response.reply += "\n\n[SUGGEST:Show me Nural]Show Nural[/SUGGEST] ";
    response.reply += "[SUGGEST:Tell me about Flock]Tell about Flock[/SUGGEST] ";
    response.reply += "[SUGGEST:Show ventures]Show ventures[/SUGGEST]";

    return response;
  }

  parseAndDisplayResponse(response, isTest = false) {
    // Extract actual text (remove commands)
    let cleanReply = response.reply
      .replace(/PRESENT_PROJECTS/g, '')
      .replace(/NAVIGATE:[^\s]+/g, '')
      .replace(/NAVIGATE_PAGE:[^\s]+/g, '')
      .replace(/HIGHLIGHT:[^\s]+/g, '')
      .replace(/\[SUGGEST:.*?\].*?\[\/SUGGEST\]/gi, '')
      .trim();

    console.log(colors.response(`\n🤖 AI: ${cleanReply}`));

    // Display parsed commands
    console.log(colors.debug('\n📊 Parsed Commands:'));
    
    if (response.presentProjects) {
      console.log(colors.success('  ✓ PRESENT_PROJECTS: true'));
    }
    
    if (response.navigationAction) {
      console.log(colors.navigation(`  ✓ NAVIGATE: ${response.navigationAction}`));
    }
    
    if (response.navigatePage) {
      console.log(colors.navigation(`  ✓ NAVIGATE_PAGE: ${response.navigatePage}`));
    }
    
    if (response.highlightProject) {
      if (Array.isArray(response.highlightProject)) {
        response.highlightProject.forEach(h => {
          console.log(colors.highlight(`  ✓ HIGHLIGHT: ${h}`));
        });
      } else {
        console.log(colors.highlight(`  ✓ HIGHLIGHT: ${response.highlightProject}`));
      }
    }

    // Extract and display suggestions
    const suggestions = response.reply.match(/\[SUGGEST:(.*?)\](.*?)\[\/SUGGEST\]/gi);
    if (suggestions && suggestions.length > 0) {
      console.log(colors.debug('\n💡 Suggestions:'));
      suggestions.forEach((s, i) => {
        const match = s.match(/\[SUGGEST:(.*?)\](.*?)\[\/SUGGEST\]/i);
        if (match) {
          console.log(colors.suggestion(`  ${i + 1}. "${match[2]}" → "${match[1]}"`));
        }
      });
    }

    // Test validation
    if (isTest) {
      const hasNavigation = response.navigationAction || response.navigatePage || 
                           response.presentProjects || response.highlightProject;
      
      if (!hasNavigation) {
        console.log(colors.error('\n  ⚠️  WARNING: No navigation/highlight commands found!'));
      } else {
        console.log(colors.success('\n  ✅ Test passed - Commands detected'));
      }
    }

    console.log(colors.debug('─'.repeat(50)));
  }

  showTestSummary() {
    console.log(colors.header('📈 Test Summary:'));
    console.log('  • Navigation commands should appear for navigation queries');
    console.log('  • Highlight commands should appear for project queries');
    console.log('  • Suggestions should be contextual and actionable');
    console.log('  • Every response about content should have highlights');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the tester
const tester = new AITester();
tester.start();