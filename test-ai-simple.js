#!/usr/bin/env node

/**
 * Simple AI Test Script
 * Tests the AI endpoint directly and shows what commands are generated
 */

const TEST_QUERIES = [
  "Show me your projects",
  "Tell me about Nural",
  "What about Flock?",
  "Show me FindU",
  "Navigate to experiments"
];

async function testAI(query) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`QUERY: "${query}"`);
  console.log('─'.repeat(60));
  
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: query,
        conversationHistory: [],
        currentPath: '/'
      }),
    });

    if (!response.ok) {
      console.log(`❌ API Error: ${response.status}`);
      return;
    }

    const data = await response.json();
    
    // Clean reply text
    const cleanReply = data.reply
      .replace(/PRESENT_PROJECTS/g, '')
      .replace(/NAVIGATE:[^\s]+/g, '')
      .replace(/NAVIGATE_PAGE:[^\s]+/g, '')
      .replace(/HIGHLIGHT:[^\s]+/g, '')
      .replace(/\[SUGGEST:.*?\].*?\[\/SUGGEST\]/gi, '')
      .trim();
    
    console.log(`\n📝 RESPONSE: ${cleanReply.substring(0, 100)}...`);
    
    // Show parsed commands
    console.log('\n🎯 COMMANDS DETECTED:');
    
    if (data.presentProjects) {
      console.log(`  ✅ PRESENT_PROJECTS = true`);
    }
    
    if (data.navigationAction) {
      console.log(`  ✅ NAVIGATE = ${data.navigationAction}`);
    }
    
    if (data.navigatePage) {
      console.log(`  ✅ NAVIGATE_PAGE = ${data.navigatePage}`);
    }
    
    if (data.highlightProject) {
      if (Array.isArray(data.highlightProject)) {
        data.highlightProject.forEach(h => {
          console.log(`  ✅ HIGHLIGHT = ${h}`);
        });
      } else {
        console.log(`  ✅ HIGHLIGHT = ${data.highlightProject}`);
      }
    }
    
    if (!data.presentProjects && !data.navigationAction && 
        !data.navigatePage && !data.highlightProject) {
      console.log(`  ⚠️  WARNING: No commands found!`);
    }
    
    // Extract suggestions
    const suggestions = data.reply.match(/\[SUGGEST:(.*?)\](.*?)\[\/SUGGEST\]/gi);
    if (suggestions) {
      console.log(`\n💡 SUGGESTIONS: ${suggestions.length} found`);
      suggestions.forEach((s, i) => {
        const match = s.match(/\[SUGGEST:(.*?)\](.*?)\[\/SUGGEST\]/i);
        if (match) {
          console.log(`  ${i + 1}. "${match[2]}"`);
        }
      });
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 TESTING AI SYSTEM RESPONSES');
  console.log('━'.repeat(60));
  
  for (const query of TEST_QUERIES) {
    await testAI(query);
    await new Promise(r => setTimeout(r, 1000)); // 1 second delay
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ TESTING COMPLETE');
  console.log('━'.repeat(60));
}

// Run tests
runTests().catch(console.error);