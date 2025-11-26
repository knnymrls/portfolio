"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIAction } from "@/types/ai";
import { useChat } from "@ai-sdk/react";
import { usePathname } from "next/navigation";
import { generateSmartFollowUps } from "@/lib/ai-follow-ups";
import { Spinner } from "@/components/ui/spinner";

// Extracted utilities
import { formatMessageText } from "./utils/format-message";

// Extracted hooks
import {
  useHighlightSystem,
  useAutoOpenBehavior,
  useToolHandlers,
} from "./hooks";

// Extracted components
import { AIChatInput } from "./AIChatInput";
import { AIChatActionIndicator } from "./AIChatActionIndicator";
import { AIChatStarterQuestions } from "./AIChatStarterQuestions";
import { AIChatFollowUps } from "./AIChatFollowUps";

export function AIChat() {
  const [currentAction, setCurrentAction] = useState<AIAction | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Chat state from Vercel AI SDK
  const { messages, sendMessage } = useChat({
    // @ts-expect-error - body/onFinish are supported by the runtime but missing from types in this version
    body: { pathname },
    onFinish() {
      setCurrentAction(null);
      setIsStreaming(false);
    },
  });

  // Custom hooks
  const { highlightElements } = useHighlightSystem();

  const { isExpanded, setIsExpanded, handleInteraction } = useAutoOpenBehavior({
    messagesCount: messages.length,
  });

  useToolHandlers({
    messages,
    isStreaming,
    highlightElements,
    setCurrentAction,
    setAiSuggestedQuestions,
  });

  const STARTER_QUESTIONS = [
    { text: "Tell me about FindU", label: "FindU Case Study" },
    { text: "What are your skills?", label: "View Skills" },
    { text: "Show me your ventures", label: "Browse Ventures" },
    { text: "Contact information", label: "Contact Info" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close chat when clicking outside (but not if input is focused)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        !isStreaming &&
        !isInputFocused &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, isStreaming, isInputFocused, setIsExpanded]);

  // Auto-close after 5 seconds of inactivity (but not if input is focused)
  useEffect(() => {
    if (!isExpanded || isStreaming || isInputFocused) return;

    const timeoutId = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isExpanded, isStreaming, isInputFocused, setIsExpanded, messages, inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    // Expand chat if not already expanded
    if (!isExpanded) {
      setIsExpanded(true);
    }

    setIsStreaming(true);
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  // Calculate follow-up questions for the last assistant message
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "assistant");

  const lastMessageText = lastAssistantMessage?.parts
    ?.filter((part: unknown) => (part as { type: string }).type === "text")
    ?.map((part: unknown) => (part as { text: string }).text)
    ?.join(" ") || "";

  // Generate follow-up questions using smart client-side logic
  const followUpQuestions = useMemo(() => {
    // Always prefer AI-suggested questions if available
    if (aiSuggestedQuestions.length > 0) {
      return aiSuggestedQuestions;
    }

    // Use smart generation based on response content when streaming is done
    if (!isStreaming && lastAssistantMessage && lastMessageText) {
      return generateSmartFollowUps(lastMessageText, pathname);
    }

    return [];
  }, [aiSuggestedQuestions, isStreaming, lastAssistantMessage, pathname, lastMessageText]);

  return (
    <>
      {/* Always visible chat interface at bottom center */}
      <div
        ref={containerRef}
        data-ai-chatbot="true"
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "w-[726px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-300 ease-out",
          "hidden lg:block"
        )}
      >
        <AIChatActionIndicator action={currentAction} />

        {/* Expanded chat messages */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mb-2 overflow-hidden"
            >
              <div className="bg-surface/95 backdrop-blur-md border border-border rounded-[20px] p-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-surface-secondary">
                    Kenny&apos;s AI Concierge
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-xs font-medium text-surface-secondary hover:text-foreground transition-colors"
                  >
                    Close
                  </button>
                </div>
                {(() => {
                  // Find the most recent assistant message
                  const lastAssistantMessage = [...messages]
                    .reverse()
                    .find((msg) => msg.role === "assistant");

                  // Show starter questions if no messages and not streaming
                  if (messages.length === 0 && !isStreaming) {
                    return (
                      <AIChatStarterQuestions
                        questions={STARTER_QUESTIONS}
                        onSelect={(text) => {
                          handleInteraction();
                          setIsStreaming(true);
                          sendMessage({ text });
                        }}
                      />
                    );
                  }

                  // Show loading state if streaming or if we have messages but no assistant response yet
                  if (isStreaming || (messages.length > 0 && !lastAssistantMessage)) {
                    return (
                      <div className="space-y-4">
                        {/* Show any partial text content that has arrived */}
                        {lastAssistantMessage && (
                          <div className="text-base leading-relaxed text-foreground">
                            {formatMessageText(lastMessageText)}
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="inline-block w-1 h-4 bg-foreground ml-1 align-middle"
                            />
                          </div>
                        )}

                        {/* Show thinking indicator if no text yet */}
                        {!lastAssistantMessage && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-surface-secondary"
                          >
                            <Spinner className="size-4" />
                            <span className="text-sm">Thinking...</span>
                          </motion.div>
                        )}
                      </div>
                    );
                  }

                  if (!lastAssistantMessage) return null;

                  // Separate text and tool content
                  const textContent = lastAssistantMessage.parts
                    .filter(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (part: any) => part.type === "text"
                    )
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((part: any) => part.text)
                    .join(" ");

                  const toolCalls = lastAssistantMessage.parts.filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (part: any) =>
                      part.type?.startsWith("tool-") &&
                      part.type !== "tool-suggestFollowUps"
                  );

                  return (
                    <motion.div
                      key={lastAssistantMessage.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Tool calls at the top */}
                      {toolCalls.length > 0 && (
                        <div className="space-y-1">
                          {toolCalls.map(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (part: any, i: number) => (
                              <div
                                key={i}
                                className="text-xs text-surface-secondary italic"
                              >
                                {part.state === "input-streaming" &&
                                  "⚡ Preparing navigation..."}
                                {part.state === "input-available" &&
                                  "✓ Navigation ready"}
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* Text content in the middle */}
                      {isStreaming && !textContent ? (
                        <div className="flex items-center gap-2 text-surface-secondary">
                          <Spinner className="size-4" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      ) : (textContent || (!textContent && toolCalls.length === 0)) && (
                        <div className="text-base leading-relaxed text-foreground">
                          {formatMessageText(textContent || "I'm here to help you explore Kenny's portfolio!")}
                          {isStreaming && (
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="inline-block w-1 h-4 bg-foreground ml-1 align-middle"
                            />
                          )}
                        </div>
                      )}

                      {/* Follow-up questions at the bottom */}
                      {!isStreaming && (
                        <AIChatFollowUps
                          questions={followUpQuestions}
                          onSelect={(question) => {
                            if (!isExpanded) {
                              setIsExpanded(true);
                            }
                            setIsStreaming(true);
                            sendMessage({ text: question });
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })()}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AIChatInput
          value={inputValue}
          onChange={(value) => {
            setInputValue(value);
            handleInteraction();
          }}
          onSubmit={handleSubmit}
          onFocus={() => {
            setIsInputFocused(true);
            setIsExpanded(true);
            handleInteraction();
          }}
          onBlur={() => setIsInputFocused(false)}
          isStreaming={isStreaming}
        />
      </div>
    </>
  );
}
