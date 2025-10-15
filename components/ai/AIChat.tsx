"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIAction } from "@/types/ai";
import { useChat } from "@ai-sdk/react";
import { useRouter, usePathname } from "next/navigation";
import { generateSmartFollowUps } from "@/lib/ai-follow-ups";
import { useRealtimeWebSocket, ToolCall } from "@/lib/hooks/useRealtimeWebSocket";
import { Spinner } from "@/components/ui/spinner";

export function AIChat() {
  const [currentAction, setCurrentAction] = useState<AIAction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);

  // Voice mode state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  // Enhanced function to highlight elements on the page
  const highlightElements = (targets: string[], duration = 4000) => {
    if (typeof window === "undefined") return;

    // Smart element selection based on targets
    const highlightedElements: Element[] = [];

    targets.forEach((target) => {
      let elements: Element[] = [];

      // Priority 1: Check for data-highlight-id attribute
      if (target && !target.startsWith('#') && !target.startsWith('.') && !target.startsWith('[')) {
        const byDataId = document.querySelector(`[data-highlight-id="${target}"]`);
        if (byDataId) {
          elements.push(byDataId);
          highlightedElements.push(...elements);
          return; // Found exact match, skip other strategies
        }

        // Try data-highlight-section attribute
        const byDataSection = document.querySelector(`[data-highlight-section="${target}"]`);
        if (byDataSection) {
          elements.push(byDataSection);
          highlightedElements.push(...elements);
          return; // Found exact match, skip other strategies
        }
      }

      // Priority 2: Direct CSS selectors (already starts with #, ., or [)
      if (target.startsWith("[")) {
        // Attribute selector (e.g., [data-highlight-id="hero-title"])
        elements = Array.from(document.querySelectorAll(target));
      } else if (target.startsWith("#")) {
        // Direct ID selector
        const el = document.querySelector(target);
        if (el) elements.push(el);
      } else if (target.startsWith(".")) {
        // Class selector
        elements = Array.from(document.querySelectorAll(target));
      } else {
        // Priority 3: Smart matching for common portfolio elements (fallback)
        switch (target.toLowerCase()) {
          case "hero":
          case "title":
            elements = Array.from(
              document.querySelectorAll(
                '[data-highlight-section="hero"], [data-highlight-id="hero-title"], h1, [class*="text-3xl"], [class*="text-4xl"]'
              )
            );
            break;
          case "projects":
          case "case studies":
          case "work":
            elements = Array.from(
              document.querySelectorAll('[data-highlight-section="case-studies"], [data-highlight-id="projects-grid"], [class*="group"][class*="bg-surface"]')
            );
            break;
          case "ventures":
          case "startups":
            elements = Array.from(
              document.querySelectorAll(
                '[data-highlight-section="ventures"], [href="/ventures"], section:has([class*="VENTURES"])'
              )
            );
            break;
          case "social":
          case "links":
            elements = Array.from(
              document.querySelectorAll(
                '[data-highlight-id^="social-"], [aria-label*="GitHub"], [aria-label*="LinkedIn"], [aria-label*="Instagram"]'
              )
            );
            break;
          case "contact":
          case "form":
            elements = Array.from(
              document.querySelectorAll('[data-highlight-section="contact"], [data-highlight-id="contact-form"], form, [href="/contact"]')
            );
            break;
          case "navigation":
          case "nav":
            elements = Array.from(
              document.querySelectorAll('nav, [class*="fixed"][class*="top-"]')
            );
            break;
          case "skills":
            elements = Array.from(
              document.querySelectorAll('[data-highlight-section="skills"], [data-highlight-id="skills-grid"]')
            );
            break;
          case "about":
            elements = Array.from(
              document.querySelectorAll('[data-highlight-section="about"], [data-highlight-id="about-content"]')
            );
            break;
          default:
            // Try to find by ID
            const byId = document.getElementById(target);
            if (byId) elements.push(byId);
            else {
              // Last resort: Try to find by content text
              elements = Array.from(document.querySelectorAll("*"))
                .filter(
                  (el) =>
                    el.textContent
                      ?.toLowerCase()
                      .includes(target.toLowerCase()) &&
                    el.children.length === 0 // Only leaf elements
                )
                .slice(0, 3); // Limit to first 3 matches
            }
        }
      }

      highlightedElements.push(...elements);
    });

    // Remove duplicates
    const uniqueElements = [...new Set(highlightedElements)];

    if (uniqueElements.length === 0) {
      console.warn("No elements found for highlighting:", targets);
      return;
    }

    // Scroll to center the highlighted content in the viewport
    if (uniqueElements.length > 0) {
      const firstElement = uniqueElements[0];

      // Calculate the center position more precisely
      const elementRect = firstElement.getBoundingClientRect();
      const elementTop = elementRect.top + window.pageYOffset;
      const elementHeight = elementRect.height;
      const viewportHeight = window.innerHeight;

      // Calculate scroll position to center the element
      const scrollToPosition =
        elementTop - viewportHeight / 2 + elementHeight / 2;

      // Smooth scroll to the calculated position
      window.scrollTo({
        top: Math.max(0, scrollToPosition), // Ensure we don't scroll past the top
        behavior: "smooth",
      });
    }

    // Small delay to let scroll start, then apply highlighting
    setTimeout(() => {
      // Highlight target elements
      uniqueElements.forEach((el) => {
        el.classList.add("ai-highlight");
      });

      // Dim all other major UI elements
      const allMajorElements = document.querySelectorAll(`
        section, 
        main > *, 
        nav, 
        header, 
        footer,
        [class*="grid"], 
        [class*="flex"]:not(.ai-highlight):not(.ai-highlight *),
        [class*="bg-surface"]:not(.ai-highlight):not(.ai-highlight *)
      `);

      // Get the chatbot container to exclude it from dimming
      const chatbotContainer = document.querySelector('[data-ai-chatbot="true"]');

      allMajorElements.forEach((el) => {
        // Check if this element is highlighted or contains highlighted elements
        const isHighlighted = uniqueElements.includes(el);
        const containsHighlighted = uniqueElements.some((highlighted) =>
          el.contains(highlighted)
        );
        const isContainedByHighlighted = uniqueElements.some((highlighted) =>
          highlighted.contains(el)
        );

        // Check if this element is the chatbot or is inside the chatbot
        const isChatbot = chatbotContainer && (
          el === chatbotContainer ||
          chatbotContainer.contains(el) ||
          el.contains(chatbotContainer) ||
          el.hasAttribute('data-ai-chatbot') ||
          el.closest('[data-ai-chatbot="true"]')
        );

        if (
          !isHighlighted &&
          !containsHighlighted &&
          !isContainedByHighlighted &&
          !isChatbot
        ) {
          el.classList.add("ai-dimmed");
        }
      });

      console.log(`Highlighted ${uniqueElements.length} elements:`, targets);
    }, 300); // Small delay for scroll to start

    // Auto-clear after duration
    if (duration > 0) {
      setTimeout(() => {
        document.querySelectorAll(".ai-highlight").forEach((el) => {
          el.classList.remove("ai-highlight");
        });
        document.querySelectorAll(".ai-dimmed").forEach((el) => {
          el.classList.remove("ai-dimmed");
        });
      }, duration);
    }
  };

  const [isStreaming, setIsStreaming] = useState(false);

  const { messages, sendMessage } = useChat({
    onFinish() {
      setCurrentAction(null);
      setIsStreaming(false);
    },
  });

  // Realtime connection for voice mode
  const realtime = useRealtimeWebSocket({
    onToolCall: (toolCall: ToolCall) => {
      try {
        const args = JSON.parse(toolCall.arguments);

        switch (toolCall.name) {
          case "navigateToSection":
            setCurrentAction({
              type: "navigate",
              description: `Navigating to ${args.section} section...`,
              target: args.section,
            });
            const path = args.section === "home" ? "/" : `/${args.section}`;
            router.push(path as Parameters<typeof router.push>[0]);
            realtime.sendToolResult(toolCall.call_id, {
              navigated: true,
              section: args.section,
            });
            break;

          case "highlightContent":
            setCurrentAction({
              type: "highlight",
              description: "Highlighting content...",
              target: "content",
            });
            highlightElements(args.targets, args.duration || 4000);
            setTimeout(() => setCurrentAction(null), 1000);
            realtime.sendToolResult(toolCall.call_id, {
              highlighted: true,
              targets: args.targets,
            });
            break;

          case "suggestFollowUps":
            setAiSuggestedQuestions(args.questions || []);
            realtime.sendToolResult(toolCall.call_id, {
              suggested: true,
              questions: args.questions,
            });
            break;
        }
      } catch (error) {
        console.error("Error handling tool call:", error);
      }
    },
    onError: (error: Error) => {
      console.error("Realtime connection error:", error);
      setIsVoiceMode(false);
    },
  });
  
  // Add voice transcripts to messages when they complete
  const prevUserTranscriptRef = useRef("");
  const prevAiTranscriptRef = useRef("");

  useEffect(() => {
    // Add user voice message when transcript completes
    if (realtime.userTranscript && realtime.userTranscript !== prevUserTranscriptRef.current && !realtime.isSpeaking) {
      prevUserTranscriptRef.current = realtime.userTranscript;
      setVoiceMessages(prev => [...prev, { role: 'user', content: realtime.userTranscript }]);
    }
  }, [realtime.userTranscript, realtime.isSpeaking]);

  useEffect(() => {
    // Add AI voice message when transcript completes AND audio finishes playing
    if (realtime.completedAiTranscript && realtime.completedAiTranscript !== prevAiTranscriptRef.current && !realtime.isAudioPlaying) {
      prevAiTranscriptRef.current = realtime.completedAiTranscript;
      setVoiceMessages(prev => [...prev, { role: 'assistant', content: realtime.completedAiTranscript }]);
    }
  }, [realtime.completedAiTranscript, realtime.isAudioPlaying]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, voiceMessages, realtime.aiTranscript]);

  // Auto-expand chat when voice messages are added or AI starts speaking
  useEffect(() => {
    if (isVoiceMode && (voiceMessages.length > 0 || realtime.isModelSpeaking || realtime.aiTranscript)) {
      setIsExpanded(true);
    }
  }, [voiceMessages.length, isVoiceMode, realtime.isModelSpeaking, realtime.aiTranscript]);

  // Auto-hide chat after 3 seconds of inactivity in voice mode
  useEffect(() => {
    if (!isVoiceMode) return;

    // Don't auto-hide if actively speaking, AI is speaking, or audio is playing
    if (realtime.isSpeaking || realtime.isModelSpeaking || realtime.isAudioPlaying) {
      return;
    }

    // Set timer to hide after 3 seconds
    const hideTimer = setTimeout(() => {
      if (isExpanded && !realtime.isSpeaking && !realtime.isModelSpeaking && !realtime.isAudioPlaying) {
        setIsExpanded(false);
      }
    }, 3000);

    return () => clearTimeout(hideTimer);
  }, [
    isVoiceMode,
    isExpanded,
    realtime.isSpeaking,
    realtime.isModelSpeaking,
    realtime.isAudioPlaying,
    voiceMessages.length,
  ]);

  useEffect(() => {
    // Handle tool calls from message parts
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log("Latest message:", lastMessage);

      if (lastMessage.role === "assistant" && lastMessage.parts) {
        let hasNavigation = false;
        const highlightRequests: Array<{
          type: string;
          state: string;
          input?: { targets: string[]; duration?: number };
        }> = [];

        // First pass - check for navigation and collect highlight requests
        console.log("All message parts:", lastMessage.parts);
        lastMessage.parts.forEach((part: unknown) => {
          const typedPart = part as {
            type: string;
            state?: string;
            input?: {
              section?: string;
              targets?: string[];
              duration?: number;
              questions?: string[];
            };
            result?: { questions?: string[] };
          };

          if (
            typedPart.type === "tool-navigateToSection" &&
            typedPart.state === "input-available" &&
            typedPart.input
          ) {
            hasNavigation = true;
            console.log("Navigation tool found:", typedPart);

            setCurrentAction({
              type: "navigate",
              description: `Navigating to ${typedPart.input.section} section...`,
              target: typedPart.input.section,
            });

            // Perform the navigation
            const path =
              typedPart.input.section === "home" ? "/" : `/${typedPart.input.section}`;
            router.push(path as Parameters<typeof router.push>[0]);
          } else if (
            typedPart.type === "tool-highlightContent" &&
            typedPart.state === "input-available" &&
            typedPart.input
          ) {
            highlightRequests.push(typedPart as typeof highlightRequests[0]);
          } else if (
            typedPart.type === "tool-suggestFollowUps" &&
            (typedPart.state === "input-available" || typedPart.state === "result") &&
            (typedPart.input?.questions || typedPart.result?.questions)
          ) {
            // Save AI-generated follow-up questions
            const questions = typedPart.input?.questions || typedPart.result?.questions;
            console.log("AI suggested follow-up questions:", questions);
            if (questions) {
              setAiSuggestedQuestions(questions);
            }
          }
        });

        // Handle highlighting with appropriate delay
        if (highlightRequests.length > 0) {
          const processHighlighting = () => {
            highlightRequests.forEach((part) => {
              console.log("Highlight tool found:", part);

              setCurrentAction({
                type: "highlight",
                description: "Highlighting content...",
                target: "content",
              });

              // Perform the highlighting
              if (part.input) {
                highlightElements(
                  part.input.targets,
                  part.input.duration || 4000
                );
              }
            });

            // Clear action after highlighting
            setTimeout(() => setCurrentAction(null), 1000);
          };

          if (hasNavigation) {
            // Delay highlighting if we just navigated (wait for page to load)
            setTimeout(processHighlighting, 1500);
          } else {
            // Immediate highlighting if no navigation
            processHighlighting();
          }
        } else if (!hasNavigation) {
          // Clear action if no tools were executed
          setTimeout(() => setCurrentAction(null), 1000);
        }

      }
    }
  }, [messages, router]);

  // Toggle voice mode
  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      // Disconnect from realtime
      realtime.disconnect();
      setIsVoiceMode(false);
      setVoiceMessages([]);
      prevUserTranscriptRef.current = "";
      prevAiTranscriptRef.current = "";
    } else {
      // Connect to realtime
      setIsVoiceMode(true);
      setIsExpanded(true);
      await realtime.connect();

      // Send initial greeting to get AI talking
      setTimeout(() => {
        if (realtime.isConnected) {
          realtime.sendMessage("Hi, introduce yourself and ask how you can help me explore Kenny's portfolio.");
        }
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;

    // Expand chat if not already expanded
    if (!isExpanded) {
      setIsExpanded(true);
    }

    // Send via appropriate channel
    if (isVoiceMode && realtime.isConnected) {
      realtime.sendMessage(inputValue);
    } else {
      setIsStreaming(true);
      sendMessage({ text: inputValue });
    }
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
  }, [aiSuggestedQuestions, isStreaming, lastAssistantMessage?.id, pathname, lastMessageText]);

  return (
    <>
      {/* Always visible chat interface at bottom center */}
      <div
        data-ai-chatbot="true"
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "w-[726px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-300 ease-out",
          "hidden lg:block"
        )}
      >
        {/* Current action indicator */}
        <AnimatePresence>
          {currentAction && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mb-2 mx-auto w-fit"
            >
              <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-full px-4 py-2">
                <p className="text-sm text-surface-secondary">
                  {currentAction.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded chat messages */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-2 overflow-hidden"
            >
              <div className="bg-surface/95 backdrop-blur-md border border-border rounded-[20px] p-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                {(() => {
                  // In voice mode, show voice messages
                  if (isVoiceMode) {
                    // Find the most recent assistant message for consistency
                    const lastVoiceMessage = voiceMessages.length > 0
                      ? voiceMessages[voiceMessages.length - 1]
                      : null;

                    return (
                      <div className="space-y-4">
                        {/* Show last completed message */}
                        {lastVoiceMessage && lastVoiceMessage.role === 'assistant' && !(realtime.isModelSpeaking || realtime.isAudioPlaying) && (
                          <div className="text-base leading-relaxed text-foreground">
                            {lastVoiceMessage.content}
                          </div>
                        )}

                        {/* Show current in-progress AI transcript while audio plays with streaming cursor */}
                        {(realtime.isModelSpeaking || realtime.isAudioPlaying) && realtime.aiTranscript && (
                          <div className="text-base leading-relaxed text-foreground">
                            {realtime.aiTranscript}
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                              className="inline-block w-[2px] h-[1.2em] bg-foreground ml-[1px] align-middle"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Show loading state when AI is thinking
                  if (isStreaming && messages.length === 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-surface-secondary"
                      >
                        <Spinner className="size-4" />
                        <span className="text-sm">Thinking...</span>
                      </motion.div>
                    );
                  }

                  // Find the most recent assistant message
                  const lastAssistantMessage = [...messages]
                    .reverse()
                    .find((msg) => msg.role === "assistant");

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
                          {textContent || "I'm here to help you explore Kenny's portfolio!"}
                          {isStreaming && (
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="inline-block w-1 h-4 bg-foreground ml-1 align-middle"
                            />
                          )}
                        </div>
                      )}

                      {/* Follow-up questions at the bottom - only show when not streaming and questions exist */}
                      {!isStreaming && followUpQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {followUpQuestions.map((question, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              // Expand chat if not already expanded
                              if (!isExpanded) {
                                setIsExpanded(true);
                              }

                              // Submit the question directly
                              sendMessage({ text: question });
                            }}
                            className="px-3 py-2 rounded-[8px] border border-border bg-border hover:bg-nav-inactive cursor-pointer transition-colors text-sm text-foreground"
                          >
                            {question}
                          </button>
                        ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })()}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area - Always visible */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            {/* Animated gradient border when AI is speaking */}
            {(realtime.isModelSpeaking || realtime.isAudioPlaying) && (
              <motion.div
                className="absolute -inset-[2px] rounded-[14px] opacity-75"
                style={{
                  background: "linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb, #60a5fa)",
                  backgroundSize: "300% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}

            <div className={cn(
              "relative bg-surface rounded-[12px]",
              (realtime.isModelSpeaking || realtime.isAudioPlaying) ? "border-0" : "border border-border"
            )}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isVoiceMode
                    ? "Speak or type your question..."
                    : "Ask me any question..."
                }
                className={cn(
                  "w-full h-[52px] pl-4 pr-24",
                  "bg-transparent",
                  "placeholder:text-surface-secondary",
                  "text-base",
                  "focus:outline-none"
                )}
              />

              {/* Voice toggle button */}
              <button
              type="button"
              onClick={toggleVoiceMode}
              disabled={realtime.isConnecting}
              className={cn(
                "absolute right-14 top-1/2 -translate-y-1/2",
                "w-8 h-8 rounded-[12px]",
                "flex items-center justify-center",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95",
                isVoiceMode
                  ? "bg-foreground text-background"
                  : "bg-border text-foreground hover:bg-nav-inactive"
              )}
              aria-label={isVoiceMode ? "Disable voice mode" : "Enable voice mode"}
            >
              {realtime.isConnecting ? (
                <Spinner className="size-3.5" />
              ) : isVoiceMode ? (
                <Mic size={14} strokeWidth={3} />
              ) : (
                <MicOff size={14} strokeWidth={3} />
              )}
            </button>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isStreaming}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "w-8 h-8 rounded-[12px]",
                  "bg-foreground text-background",
                  "flex items-center justify-center",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "hover:scale-105 active:scale-95"
                )}
                aria-label="Send message"
              >
                {isStreaming ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <ArrowUp size={14} strokeWidth={3} />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
