'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChatInputProps {
    response?: string
    isLoading?: boolean
    onSendMessage?: (message: string) => void
    onClearResponse?: () => void
}

export default function ChatInput({ response, isLoading, onSendMessage, onClearResponse }: ChatInputProps) {
    const [message, setMessage] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (response && !isLoading && onClearResponse) {
            const timer = setTimeout(() => {
                onClearResponse()
            }, 12000)

            return () => clearTimeout(timer)
        }
    }, [response, isLoading, onClearResponse])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && onSendMessage) {
            onSendMessage(message.trim())
            setMessage('')
        }
    }

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="fixed bottom-3 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-6"
        >
            <div className="flex flex-col gap-2">
                {/* Response Display */}
                <AnimatePresence>
                    {(response || isLoading) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="backdrop-blur-md bg-white/70 p-4 rounded-2xl border border-white/40"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                    <span className="text-gray-600 text-sm">Thinking...</span>
                                </div>
                            ) : (
                                <p className="text-gray-800 leading-relaxed">{response}</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    <div className={`backdrop-blur-sm bg-[#f1f1f1]/90 flex items-center gap-2 p-[6px] rounded-2xl transition-all duration-300 ${isFocused ? 'shadow-lg bg-[#f1f1f1]/95' : ''
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
                            className="flex-1 bg-transparent outline-none py-3 text-gray-900 placeholder-gray-500"
                            disabled={isLoading}
                        />

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${message.trim() && !isLoading
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