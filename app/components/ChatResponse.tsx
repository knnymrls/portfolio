'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../providers/ChatProvider'

interface ChatResponseProps {
  content: string
  isLoading?: boolean
}

interface ParsedSuggestion {
  query: string
  text: string
}

export default function ChatResponse({ content, isLoading }: ChatResponseProps) {
  const { handleChatMessage } = useChat()
  const [mainContent, setMainContent] = useState('')
  const [suggestions, setSuggestions] = useState<ParsedSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    // Extract suggestions from content
    const suggestionMatches = content.matchAll(/\[suggest:(.*?)\](.*?)\[\/suggest\]/g)
    const foundSuggestions: ParsedSuggestion[] = []
    let cleanContent = content
    
    for (const match of suggestionMatches) {
      foundSuggestions.push({
        query: match[1],
        text: match[2]
      })
      cleanContent = cleanContent.replace(match[0], '')
    }
    
    setMainContent(cleanContent.trim())
    setSuggestions(foundSuggestions)
    
    // Show suggestions after a delay when content loads
    if (!isLoading && foundSuggestions.length > 0) {
      setTimeout(() => setShowSuggestions(true), 800)
    }
  }, [content, isLoading])

  const handleSuggestionClick = (query: string) => {
    handleChatMessage(query)
    setShowSuggestions(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
        </div>
        <span className="text-gray-600 text-sm">Thinking...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-sm max-w-none"
      >
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => (
              <p className="text-gray-700 leading-relaxed mb-2" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-gray-900" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-1 text-gray-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-700" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
            ),
          }}
        >
          {mainContent}
        </ReactMarkdown>
      </motion.div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-2 pt-2 border-t border-gray-100"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSuggestionClick(suggestion.query)}
              className="px-3 py-1.5 text-sm font-['Sora',_sans-serif] rounded-full bg-white hover:bg-gray-900 hover:text-white border border-gray-200 text-gray-700 transition-all duration-200 hover:shadow-md"
            >
              {suggestion.text}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}