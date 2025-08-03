import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { navigationFunction } from '../../utils/navigation'
import { ChatResponse } from '../../types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for a portfolio website. You help visitors learn about the portfolio owner's work, projects, and experience. Be friendly, professional, and concise. Keep responses brief and engaging.

IMPORTANT: When users ask to see projects or want a project breakdown/walkthrough, ALWAYS include "PRESENT_PROJECTS NAVIGATE:case-studies" in your response.

Use these keywords:
- "NAVIGATE:case-studies" + "PRESENT_PROJECTS" for project requests
- "NAVIGATE:experiments" for experiments  
- "NAVIGATE:hero" for about/bio
- "NAVIGATE:top" for top/beginning

Examples: 
- User: "Show me your projects" → Response: "I'd love to show you my projects! PRESENT_PROJECTS NAVIGATE:case-studies Let me walk you through each one..."
- User: "What work have you done?" → Response: "Here are my recent projects! PRESENT_PROJECTS NAVIGATE:case-studies I'll highlight each one for you..."
- User: "Tell me about your case studies" → Response: "Let me present my case studies! PRESENT_PROJECTS NAVIGATE:case-studies Starting with my most recent work..."`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const responseMessage = completion.choices[0]?.message
    let reply = responseMessage?.content || 'Sorry, I could not generate a response.'
    
    // Parse navigation keywords from response
    let navigationAction = null
    let presentProjects = false
    let highlightProject = null

    const navMatch = reply.match(/NAVIGATE:(\w+(?:-\w+)*)/i)
    if (navMatch) {
      navigationAction = navMatch[1]
      reply = reply.replace(/NAVIGATE:\w+(?:-\w+)*/gi, '').trim()
    }

    if (reply.includes('PRESENT_PROJECTS')) {
      presentProjects = true
      reply = reply.replace(/PRESENT_PROJECTS/gi, '').trim()
    }

    const highlightMatch = reply.match(/HIGHLIGHT:(\w+(?:-\w+)*)/i)
    if (highlightMatch) {
      highlightProject = highlightMatch[1]
      reply = reply.replace(/HIGHLIGHT:\w+(?:-\w+)*/gi, '').trim()
    }

    const response: ChatResponse = {
      reply,
      navigationAction,
      presentProjects,
      highlightProject
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}