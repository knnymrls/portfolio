import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
// Streaming temporarily disabled - package exports changed
// import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getAIContentSummary } from '../../../lib/content-registry'
import { searchContent, understandUserQuery } from '../../../lib/semantic-search'
import { conversationMemory } from '../../../lib/conversation-memory'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  // Temporarily return non-streaming response until streaming is fixed
  return NextResponse.json({ 
    error: 'Streaming temporarily disabled. Use /api/chat instead.' 
  }, { status: 503 })
}