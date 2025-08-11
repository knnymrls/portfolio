import { NextRequest, NextResponse } from 'next/server'
import { aiOrchestrator } from '@/lib/ai-orchestrator'
import { ChatResponse } from '../../types'

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [], showProgress = false } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Process query through orchestrator
    const result = await aiOrchestrator.processQuery(message, {
      includeDebug: process.env.NODE_ENV === 'development'
    })

    // Extract commands for UI
    const { commands, suggestions } = result.response
    
    // Format suggestions for response
    let reply = result.response.message
    if (suggestions && suggestions.length > 0) {
      reply += '\n\n' + suggestions.join(' ')
    }

    // Build response matching existing ChatResponse interface
    const response: ChatResponse = {
      reply,
      ...(commands.navigate && { navigationAction: commands.navigate }),
      ...(commands.navigatePage && { navigatePage: commands.navigatePage }),
      ...(commands.presentProjects && { presentProjects: commands.presentProjects }),
      ...(commands.highlight && { highlightProject: commands.highlight }),
      // Include plan info for transparency
      metadata: {
        planSummary: result.plan?.summary,
        estimatedDuration: result.plan?.estimatedDuration,
        ...(result.debug && { debug: result.debug })
      }
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

// Add streaming endpoint for progress updates
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const url = new URL(req.url)
        const message = url.searchParams.get('message')
        
        if (!message) {
          controller.enqueue(encoder.encode('data: {"error": "Message required"}\n\n'))
          controller.close()
          return
        }

        // Process with progress updates
        await aiOrchestrator.processQuery(message, {
          onProgress: (status, progress) => {
            const data = JSON.stringify({ status, progress })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }).then(result => {
          const data = JSON.stringify({ complete: true, result })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          controller.close()
        })
      } catch (error) {
        const data = JSON.stringify({ error: 'Processing failed' })
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}