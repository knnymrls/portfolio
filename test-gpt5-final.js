#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const OpenAI = require('openai')

async function testHighlightCommand() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  console.log('Testing GPT-5-mini highlighting...\n')

  const testCases = [
    { query: "Show me Nural", expected: "nural" },
    { query: "Tell me about Flock", expected: "flock" },
    { query: "Highlight FindU", expected: "findu" }
  ]

  for (const test of testCases) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: `You MUST start your response with a command.
For "${test.query}", start with: HIGHLIGHT:${test.expected}
Then describe the project.` 
          },
          { role: 'user', content: test.query }
        ],
        max_completion_tokens: 150
      })

      const response = completion.choices[0].message.content
      console.log(`Query: "${test.query}"`)
      console.log(`Response: "${response}"`)
      
      if (response.includes(`HIGHLIGHT:${test.expected}`)) {
        console.log(`✅ Command generated correctly!\n`)
      } else {
        console.log(`❌ Command not found\n`)
      }
    } catch (error) {
      console.error(`Error: ${error.message}\n`)
    }
  }
}

testHighlightCommand()