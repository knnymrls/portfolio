#!/usr/bin/env node
/**
 * Test GPT-5-mini with correct parameters
 */

require('dotenv').config({ path: '.env.local' })

async function testGPT5WithCorrectParams() {
  const apiKey = process.env.OPENAI_API_KEY
  
  console.log('🧪 Testing GPT-5-mini with correct parameters...\n')
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. When asked to show Nural, respond with: "HIGHLIGHT:nural Let me show you Nural, the chat-based learning platform!"'
          },
          {
            role: 'user',
            content: 'Show me Nural'
          }
        ],
        max_completion_tokens: 100,  // Changed from max_tokens
        temperature: 0.5
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ SUCCESS: GPT-5-mini is working!')
      console.log('Model:', data.model)
      console.log('Response:', data.choices?.[0]?.message?.content)
      console.log('\nUsage:', data.usage)
      
      // Test highlighting command
      const content = data.choices?.[0]?.message?.content || ''
      if (content.includes('HIGHLIGHT:nural')) {
        console.log('\n🎯 Command generation working!')
      }
    } else {
      console.log('❌ Error:', data.error?.message || JSON.stringify(data))
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message)
  }
}

// Test with OpenAI SDK using correct params
async function testSDKWithCorrectParams() {
  console.log('\n📦 Testing SDK with correct parameters...')
  
  try {
    const OpenAI = require('openai')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: 'Start every response with a command. For "Show me Flock", respond with: "HIGHLIGHT:flock"'
        },
        { 
          role: 'user', 
          content: 'Show me Flock' 
        }
      ],
      max_completion_tokens: 100  // Changed from max_tokens
    })
    
    console.log('✅ SDK Response:', completion.choices[0].message.content)
    
    // Check if it includes the command
    if (completion.choices[0].message.content.includes('HIGHLIGHT:')) {
      console.log('✅ Commands are being generated!')
    }
  } catch (error) {
    console.log('❌ SDK Error:', error.message)
  }
}

// Test all GPT-5 variants
async function testAllGPT5Models() {
  console.log('\n🔍 Testing all GPT-5 variants with correct params...\n')
  
  const models = ['gpt-5-mini', 'gpt-5-nano', 'gpt-5']
  
  for (const model of models) {
    try {
      const OpenAI = require('openai')
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
      
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'user', content: 'Say hello' }
        ],
        max_completion_tokens: 10
      })
      
      console.log(`✅ ${model}: "${completion.choices[0].message.content}"`)
    } catch (error) {
      console.log(`❌ ${model}: ${error.message}`)
    }
  }
}

async function main() {
  await testGPT5WithCorrectParams()
  await testSDKWithCorrectParams()
  await testAllGPT5Models()
  
  console.log('\n📝 IMPORTANT CHANGE NEEDED:')
  console.log('In your code, change:')
  console.log('  max_tokens: 300')
  console.log('To:')
  console.log('  max_completion_tokens: 300')
  console.log('\nThis is required for GPT-5 models!')
}

main().catch(console.error)