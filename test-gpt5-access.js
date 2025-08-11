#!/usr/bin/env node
/**
 * Test GPT-5-mini Model Access
 */

require('dotenv').config({ path: '.env.local' })

async function testGPT5Mini() {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in .env.local')
    return
  }

  console.log('🧪 Testing GPT-5-mini access...\n')
  
  // Test direct OpenAI API call
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
            content: 'You are a helpful assistant. Respond with: "GPT-5-mini is working!"'
          },
          {
            role: 'user',
            content: 'Test message'
          }
        ],
        max_tokens: 50,
        temperature: 0.5
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ SUCCESS: GPT-5-mini is accessible!')
      console.log('Model:', data.model)
      console.log('Response:', data.choices?.[0]?.message?.content)
      console.log('\n📊 Usage:', data.usage)
    } else {
      console.log('❌ FAILED: GPT-5-mini not accessible')
      console.log('Error:', data.error?.message || JSON.stringify(data))
      
      console.log('\n🔄 Trying fallback models...')
      await testFallbackModels(apiKey)
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message)
  }
}

async function testFallbackModels(apiKey) {
  const models = ['gpt-5-nano', 'gpt-5-chat', 'gpt-4o-mini', 'gpt-4-turbo-preview', 'gpt-3.5-turbo']
  
  for (const model of models) {
    console.log(`\nTesting ${model}...`)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'user', content: 'Say "Hello"' }
          ],
          max_tokens: 10
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ ${model} works!`)
        return model
      } else {
        console.log(`❌ ${model} failed: ${data.error?.message}`)
      }
    } catch (error) {
      console.log(`❌ ${model} error: ${error.message}`)
    }
  }
}

// Also test with the OpenAI SDK
async function testWithSDK() {
  console.log('\n📦 Testing with OpenAI SDK...')
  
  try {
    const OpenAI = require('openai')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'user', content: 'Say "SDK test successful"' }
      ],
      max_tokens: 20
    })
    
    console.log('✅ SDK Response:', completion.choices[0].message.content)
  } catch (error) {
    console.log('❌ SDK Error:', error.message)
    if (error.response) {
      console.log('Error details:', error.response.data)
    }
  }
}

// Run all tests
async function main() {
  await testGPT5Mini()
  await testWithSDK()
  
  console.log('\n💡 Recommendations:')
  console.log('1. If gpt-5-mini fails, check your API key tier')
  console.log('2. Try gpt-5-nano or gpt-5-chat as alternatives')
  console.log('3. Use gpt-4o-mini as a reliable fallback')
  console.log('4. Check OpenAI dashboard for your API access level')
}

main().catch(console.error)