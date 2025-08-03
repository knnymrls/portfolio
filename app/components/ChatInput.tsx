'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PRESENTATION_TIMING, Z_INDEX } from '../constants'

interface ChatInputProps {
    response?: string
    isLoading?: boolean
    onSendMessage?: (message: string) => void
    onClearResponse?: () => void
    showTimer?: boolean
    timerDuration?: number
}

export default function ChatInput({ response, isLoading, onSendMessage, onClearResponse, showTimer = false, timerDuration = PRESENTATION_TIMING.PROJECT_DURATION }: ChatInputProps) {
    const [message, setMessage] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [timeLeft, setTimeLeft] = useState(timerDuration)
    const [isTimerActive, setIsTimerActive] = useState(false)

    useEffect(() => {
        if (response && !isLoading && onClearResponse && !showTimer) {
            const timer = setTimeout(() => {
                onClearResponse()
            }, PRESENTATION_TIMING.CHAT_AUTO_CLEAR)

            return () => clearTimeout(timer)
        }
    }, [response, isLoading, onClearResponse, showTimer])

    // Timer effect for project highlighting
    useEffect(() => {
        if (showTimer && response && !isLoading) {
            setTimeLeft(timerDuration)
            setIsTimerActive(true)
            
            const interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 100) {
                        clearInterval(interval)
                        setIsTimerActive(false)
                        return 0
                    }
                    return prev - 100
                })
            }, 100)

            return () => {
                clearInterval(interval)
                setIsTimerActive(false)
            }
        } else {
            setIsTimerActive(false)
        }
    }, [showTimer, response, isLoading, timerDuration])

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
            className={`fixed bottom-3 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6`}
            style={{ zIndex: Z_INDEX.CHAT_INPUT }}
        >
            <div className="flex flex-col gap-2">
                {/* Response Display */}
                <AnimatePresence>
                    {(response || isLoading) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="chat-response backdrop-blur-md bg-white/70 p-4 rounded-2xl border border-white/40"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="loading-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="loading-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="loading-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                    <span className="text-gray-600 text-sm">Thinking...</span>
                                </div>
                            ) : (
                                <div>
                                    {isTimerActive && (
                                        <div className="mb-3 pb-3 border-b border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-600">Highlighting in progress</span>
                                                <span className="text-xs text-gray-500">{Math.ceil(timeLeft / 1000)}s remaining</span>
                                            </div>
                                            <div className="progress-bg w-full bg-gray-200 rounded-full h-1.5">
                                                <motion.div
                                                    className="progress-bar bg-blue-500 h-1.5 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${((timerDuration - timeLeft) / timerDuration) * 100}%` }}
                                                    transition={{ duration: 0.1, ease: 'linear' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-gray-800 leading-relaxed">{response}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    <div className={`chat-container backdrop-blur-sm bg-[#f1f1f1]/90 flex items-center gap-2 p-[6px] rounded-2xl transition-all duration-300 ${isFocused ? 'shadow-lg bg-[#f1f1f1]/95' : ''
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
                            className={`chat-button flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${message.trim() && !isLoading
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