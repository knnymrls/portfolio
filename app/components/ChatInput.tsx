'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PRESENTATION_TIMING, Z_INDEX } from '../constants'
import { useChat } from '../providers/ChatProvider'
import ChatResponse from './ChatResponse'

export default function ChatInput() {
    const { chatResponse: response, isLoading, handleChatMessage: onSendMessage, clearResponse: onClearResponse } = useChat()
    const [message, setMessage] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [showInitialSuggestions, setShowInitialSuggestions] = useState(true)

    useEffect(() => {
        if (response && !isLoading && onClearResponse) {
            const timer = setTimeout(() => {
                onClearResponse()
            }, PRESENTATION_TIMING.CHAT_AUTO_CLEAR)

            return () => clearTimeout(timer)
        }
    }, [response, isLoading, onClearResponse])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && onSendMessage) {
            onSendMessage(message.trim())
            setMessage('')
            setShowInitialSuggestions(false)
        }
    }

    const handleInitialSuggestion = (query: string) => {
        onSendMessage(query)
        setShowInitialSuggestions(false)
    }

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`fixed bottom-3 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6`}
            style={{ zIndex: Z_INDEX.CHAT_INPUT }}
        >
            <div className="flex flex-col gap-2">
                {/* Initial Suggestions - Show when no conversation */}
                <AnimatePresence>
                    {showInitialSuggestions && !response && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: 0.5 }}
                            className="backdrop-blur-md bg-white/90 p-4 rounded-2xl border border-gray-200 shadow-lg"
                        >
                            <p className="text-sm text-gray-600 mb-3">Hi! I'm Kenny's portfolio assistant. Get started with:</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleInitialSuggestion('Show me your projects')}
                                    className="px-3 py-1.5 text-sm font-['Sora',_sans-serif] rounded-full bg-white hover:bg-gray-900 hover:text-white border border-gray-200 text-gray-700 transition-all duration-200"
                                >
                                    Show me your projects
                                </button>
                                <button
                                    onClick={() => handleInitialSuggestion('What do you do?')}
                                    className="px-3 py-1.5 text-sm font-['Sora',_sans-serif] rounded-full bg-white hover:bg-gray-900 hover:text-white border border-gray-200 text-gray-700 transition-all duration-200"
                                >
                                    What do you do?
                                </button>
                                <button
                                    onClick={() => handleInitialSuggestion('Tell me about yourself')}
                                    className="px-3 py-1.5 text-sm font-['Sora',_sans-serif] rounded-full bg-white hover:bg-gray-900 hover:text-white border border-gray-200 text-gray-700 transition-all duration-200"
                                >
                                    About you?
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Response Display */}
                <AnimatePresence>
                    {(response || isLoading) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="chat-response backdrop-blur-md bg-white/90 p-4 rounded-2xl border border-gray-200 shadow-lg"
                        >
                            <ChatResponse content={response} isLoading={isLoading} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    <div className={`chat-container backdrop-blur-sm bg-[#f1f1f1]/90 flex items-center gap-2 p-[6px] rounded-2xl transition-all duration-300 ${
                        isFocused ? 'shadow-lg bg-[#f1f1f1]/95' : ''
                    }`}>
                        <div className="flex items-center gap-2 px-3 text-gray-500">
                            <Sparkles className="size-5" />
                        </div>

                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Ask me anything about my work..."
                            className="chat-input flex-1 bg-transparent outline-none py-3 text-gray-900 placeholder-gray-500"
                            disabled={isLoading}
                        />

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`chat-button flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                                message.trim() && !isLoading
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-white/50 text-gray-400'
                            }`}
                            disabled={!message.trim() || isLoading}
                        >
                            <Send className="size-5" />
                        </motion.button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}