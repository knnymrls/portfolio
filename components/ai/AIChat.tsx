"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIAction } from "@/types/ai";
import { useChat } from "@ai-sdk/react";
import { useRouter, usePathname } from "next/navigation";
import { generateSmartFollowUps } from "@/lib/ai-follow-ups";

export function AIChat() {
  const [currentAction, setCurrentAction] = useState<AIAction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);

  // Enhanced function to highlight elements on the page
  const highlightElements = (targets: string[], duration = 4000) => {
    if (typeof window === "undefined") return;

    // Smart element selection based on targets
    const highlightedElements: Element[] = [];

    targets.forEach((target) => {
      let elements: Element[] = [];

      // Try different selection strategies
      if (target.startsWith("#")) {
        // Direct ID selector
        const el = document.querySelector(target);
        if (el) elements.push(el);
      } else if (target.startsWith(".")) {
        // Class selector
        elements = Array.from(document.querySelectorAll(target));
      } else {
        // Smart matching for common portfolio elements
        switch (target.toLowerCase()) {
          case "hero":
          case "title":
            elements = Array.from(
              document.querySelectorAll(
                'h1, [class*="text-3xl"], [class*="text-4xl"]'
              )
            );
            break;
          case "projects":
          case "case studies":
          case "work":
            elements = Array.from(
              document.querySelectorAll('[class*="group"][class*="bg-surface"]')
            );
            break;
          case "ventures":
          case "startups":
            elements = Array.from(
              document.querySelectorAll(
                '[href="/ventures"], section:has([class*="VENTURES"])'
              )
            );
            break;
          case "social":
          case "links":
            elements = Array.from(
              document.querySelectorAll(
                '[aria-label*="GitHub"], [aria-label*="LinkedIn"], [aria-label*="Instagram"]'
              )
            );
            break;
          case "contact":
          case "form":
            elements = Array.from(
              document.querySelectorAll('form, [href="/contact"]')
            );
            break;
          case "navigation":
          case "nav":
            elements = Array.from(
              document.querySelectorAll('nav, [class*="fixed"][class*="top-"]')
            );
            break;
          default:
            // Try to find by ID or data attribute
            const byId = document.getElementById(target);
            if (byId) elements.push(byId);
            else {
              // Try to find by content text
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

      allMajorElements.forEach((el) => {
        // Check if this element is highlighted or contains highlighted elements
        const isHighlighted = uniqueElements.includes(el);
        const containsHighlighted = uniqueElements.some((highlighted) =>
          el.contains(highlighted)
        );
        const isContainedByHighlighted = uniqueElements.some((highlighted) =>
          highlighted.contains(el)
        );

        if (
          !isHighlighted &&
          !containsHighlighted &&
          !isContainedByHighlighted
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
  
  const { messages, sendMessage, isLoading } = useChat({
    onFinish() {
      setCurrentAction(null);
      setIsStreaming(false);
    },
  });
  
  // Set streaming state based on loading
  useEffect(() => {
    if (isLoading) {
      setIsStreaming(true);
      setAiSuggestedQuestions([]); // Clear previous AI suggestions
    }
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Handle tool calls from message parts
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log("Latest message:", lastMessage);

      if (lastMessage.role === "assistant" && lastMessage.parts) {
        let hasNavigation = false;
        let highlightRequests: any[] = [];

        // First pass - check for navigation and collect highlight requests
        console.log("All message parts:", lastMessage.parts);
        lastMessage.parts.forEach((part: any) => {
          if (
            part.type === "tool-navigateToSection" &&
            part.state === "input-available" &&
            part.input
          ) {
            hasNavigation = true;
            console.log("Navigation tool found:", part);

            setCurrentAction({
              type: "navigate",
              description: `Navigating to ${part.input.section} section...`,
              target: part.input.section,
            });

            // Perform the navigation
            const path =
              part.input.section === "home" ? "/" : `/${part.input.section}`;
            router.push(path as any);
          } else if (
            part.type === "tool-highlightContent" &&
            part.state === "input-available" &&
            part.input
          ) {
            highlightRequests.push(part);
          } else if (
            part.type === "tool-suggestFollowUps" &&
            (part.state === "input-available" || part.state === "result") &&
            (part.input?.questions || part.result?.questions)
          ) {
            // Save AI-generated follow-up questions
            const questions = part.input?.questions || part.result?.questions;
            console.log("AI suggested follow-up questions:", questions);
            setAiSuggestedQuestions(questions);
          }
        });

        // Handle highlighting with appropriate delay
        if (highlightRequests.length > 0) {
          const processHighlighting = () => {
            highlightRequests.forEach((part: any) => {
              console.log("Highlight tool found:", part);

              setCurrentAction({
                type: "highlight",
                description: "Highlighting content...",
                target: "content",
              });

              // Perform the highlighting
              highlightElements(
                part.input.targets,
                part.input.duration || 4000
              );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Expand chat if not already expanded
    if (!isExpanded) {
      setIsExpanded(true);
    }

    // Submit the message
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  // Calculate follow-up questions for the last assistant message
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "assistant");
    
  const lastMessageText = lastAssistantMessage?.parts
    ?.filter((part: any) => part.type === "text")
    ?.map((part: any) => part.text)
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
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "w-[726px] max-w-[calc(100vw-2rem)]",
          "transition-all duration-300 ease-out"
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
                  // Find the most recent assistant message
                  const lastAssistantMessage = [...messages]
                    .reverse()
                    .find((msg) => msg.role === "assistant");

                  if (!lastAssistantMessage) return null;

                  // Separate text and tool content
                  const textContent = lastAssistantMessage.parts
                    .filter((part: any) => part.type === "text")
                    .map((part: any) => part.text)
                    .join(" ");

                  const toolCalls = lastAssistantMessage.parts.filter(
                    (part: any) => part.type?.startsWith("tool-") && part.type !== "tool-suggestFollowUps"
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
                          {toolCalls.map((part: any, i: number) => (
                            <div
                              key={i}
                              className="text-xs text-surface-secondary italic"
                            >
                              {part.state === "input-streaming" &&
                                "⚡ Preparing navigation..."}
                              {part.state === "input-available" &&
                                "✓ Navigation ready"}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Text content in the middle */}
                      {(textContent || (!textContent && toolCalls.length === 0)) && (
                        <div className="text-base leading-relaxed text-foreground">
                          {textContent || "I'm here to help you explore Kenny's portfolio!"}
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
          <div className="relative bg-surface rounded-[12px] border border-border">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me any question..."
              className={cn(
                "w-full h-[52px] pl-4 pr-14",
                "bg-transparent",
                "placeholder:text-surface-secondary",
                "text-base",
                "focus:outline-none"
              )}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
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
              <ArrowUp size={14} strokeWidth={3} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
