"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIAction } from "@/types/ai";
import { useChat } from "@ai-sdk/react";
import { useRouter, usePathname } from "next/navigation";
import { generateSmartFollowUps } from "@/lib/ai-follow-ups";
import { useRealtimeWebSocket, ToolCall } from "@/lib/hooks/useRealtimeWebSocket";
import { Spinner } from "@/components/ui/spinner";
import {
  resolvePortfolioPath,
  PortfolioNavigationTarget,
} from "@/lib/ai/portfolio-routing";

const HIGHLIGHT_ALIASES: Record<string, string[]> = {
  home: ['[data-highlight-section="hero"]', "case-studies-title"],
  hero: ["hero-title", "hero-image", "hero-actions"],
  "hero section": ["hero-title", "hero-image", "hero-actions"],
  findu: ["project-findu"],
  "find u": ["project-findu"],
  "find uk study": ["project-findu"],
  "findu case study": ["project-findu"],
  mkrs: ["project-mkrs"],
  "mkrs agency": ["project-mkrs"],
  "mkrs case study": ["project-mkrs"],
  flock: ["project-flock"],
  "flock case study": ["project-flock"],
  bloom: ["project-bloom"],
  "bloom case study": ["project-bloom"],
  ventures: ['[data-highlight-section="ventures"]'],
  startups: ['[data-highlight-section="ventures"]'],
  projects: ["projects-grid", "case-studies-title"],
  "case studies": ["case-studies-title", "projects-grid"],
  "work tab": ['[data-highlight-section="hero"]', "case-studies-title"],
  contact: ["contact-form", "contact-title"],
  socials: ["social-github", "social-linkedin", "social-instagram"],
  skills: ["skills-grid", "skills-title"],
  about: ["about-content", "about-title"],
};

// Helper to parse markdown-style bold text
const formatMessageText = (text: string) => {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export function AIChat() {
  const [currentAction, setCurrentAction] = useState<AIAction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-open and close sequence on mount
  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsExpanded((prev) => {
        if (!prev && !hasInteracted) return true;
        return prev;
      });
    }, 800);

    const closeTimer = setTimeout(() => {
      setIsExpanded((prev) => {
        // Only auto-close if no interaction and no active conversation
        if (prev && !hasInteracted && messages.length === 0) return false;
        return prev;
      });
    }, 5000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [aiSuggestedQuestions, setAiSuggestedQuestions] = useState<string[]>([]);

  // Voice mode state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  const clearHighlights = useCallback(() => {
    if (typeof window === "undefined") return;
    document.querySelectorAll(".ai-highlight").forEach((el) => {
      el.classList.remove("ai-highlight");
    });
    document.querySelectorAll(".ai-dimmed").forEach((el) => {
      el.classList.remove("ai-dimmed");
    });
  }, []);

  // Enhanced function to highlight elements on the page
  const highlightElements = useCallback((targets: string[], duration = 4000) => {
    if (typeof window === "undefined") return;
    if (!targets || !Array.isArray(targets)) return;

    const expandedTargets = targets.flatMap((rawTarget) => {
      if (!rawTarget) return [];
      const normalized = rawTarget.trim().toLowerCase();
      const aliases = HIGHLIGHT_ALIASES[normalized];
      if (aliases && aliases.length > 0) {
        return aliases;
      }
      return [rawTarget];
    });

    // Smart element selection based on targets
    const highlightedElements: Element[] = [];

    expandedTargets.forEach((target) => {
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
        clearHighlights();
      }, duration);
    }
  }, [clearHighlights]);

  const [isStreaming, setIsStreaming] = useState(false);

  const { messages, sendMessage, setMessages, stop } = useChat({
    // @ts-expect-error - body/onFinish are supported by the runtime but missing from types in this version
    body: { pathname },
    onFinish() {
      setCurrentAction(null);
      setIsStreaming(false);
    },
  });

  const STARTER_QUESTIONS = [
    { text: "Tell me about FindU", label: "FindU Case Study" },
    { text: "What are your skills?", label: "View Skills" },
    { text: "Show me your ventures", label: "Browse Ventures" },
    { text: "Contact information", label: "Contact Info" },
  ];

  // Realtime connection for voice mode
  const realtime = useRealtimeWebSocket({
    onToolCall: (toolCall: ToolCall) => {
      try {
        const args = JSON.parse(toolCall.arguments);

        switch (toolCall.name) {
          case "navigateToSection": {
            const rawSection = args.section;

            if (typeof rawSection === "string") {
              const section = rawSection as PortfolioNavigationTarget;
              const targetPath = resolvePortfolioPath(section);

              if (targetPath) {
                setCurrentAction({
                  type: "navigate",
                  description: `Navigating to ${section} section...`,
                  target: section,
                });
                router.push(targetPath as Parameters<typeof router.push>[0]);
                realtime.sendToolResult(toolCall.call_id, {
                  navigated: true,
                  section,
                });
              } else {
                console.warn("Unknown navigation target:", section);
                realtime.sendToolResult(toolCall.call_id, {
                  navigated: false,
                  section,
                });
              }
            } else {
              console.warn("Invalid navigation target payload:", rawSection);
              realtime.sendToolResult(toolCall.call_id, {
                navigated: false,
                section: rawSection,
              });
            }
            break;
          }

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

  const prevUserTranscriptRef = useRef("");
  const prevAiTranscriptRef = useRef("");

  const resetAssistant = useCallback(() => {
    stop?.();
    setMessages([]);
    setVoiceMessages([]);
    setAiSuggestedQuestions([]);
    setCurrentAction(null);
    setIsStreaming(false);
    setInputValue("");
    setIsExpanded(false);
    clearHighlights();
    prevUserTranscriptRef.current = "";
    prevAiTranscriptRef.current = "";

    if (isVoiceMode) {
      realtime.disconnect();
      setIsVoiceMode(false);
    }
  }, [
    stop,
    setMessages,
    setVoiceMessages,
    setAiSuggestedQuestions,
    setCurrentAction,
    setIsStreaming,
    setInputValue,
    setIsExpanded,
    clearHighlights,
    isVoiceMode,
    setIsVoiceMode,
    realtime,
    prevUserTranscriptRef,
    prevAiTranscriptRef,
  ]);

  // Add voice transcripts to messages when they complete

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
          state?: string;
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
            typedPart.input
          ) {
            hasNavigation = true;
            console.log("Navigation tool found:", typedPart);

            const destination = typedPart.input.section;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const targetId = (typedPart.input as any).targetId;
            
            setCurrentAction({
              type: "navigate",
              description: `Navigating to ${destination} section...`,
              target: destination,
            });

            const targetPath = destination
              ? resolvePortfolioPath(destination as PortfolioNavigationTarget)
              : null;

            if (targetPath) {
              const fullPath = targetId ? `${targetPath}#${targetId}` : targetPath;
              router.push(fullPath as Parameters<typeof router.push>[0]);

              // If there's a targetId, try to scroll to it after a delay
              if (targetId) {
                setTimeout(() => {
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    // Also highlight it
                    highlightElements([targetId], 4000);
                  }
                }, 800); // Wait for navigation
              }
            } else {
              console.warn("Unknown destination from assistant message:", destination);
            }
          } else if (
            typedPart.type === "tool-highlightContent" &&
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
  }, [messages, router, highlightElements]);

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
  }, [aiSuggestedQuestions, isStreaming, lastAssistantMessage, pathname, lastMessageText]);

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
                    onClick={resetAssistant}
                    className="text-xs font-medium text-surface-secondary hover:text-foreground transition-colors"
                  >
                    Reset
                  </button>
                </div>
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

                  // Find the most recent assistant message
                  const lastAssistantMessage = [...messages]
                    .reverse()
                    .find((msg) => msg.role === "assistant");

                  // Show starter questions if no messages and not streaming
                  if (messages.length === 0 && !isStreaming) {
                    return (
                      <div className="space-y-4">
                        <div className="text-base leading-relaxed text-foreground">
                          <p className="flex items-center gap-2">
                            <span>
                              Hi! I&apos;m Kenny&apos;s AI assistant. I can help you explore the portfolio, answer questions about my experience, or discuss my ventures.
                            </span>
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {STARTER_QUESTIONS.map((q) => (
                            <button
                              key={q.text}
                              type="button"
                              onClick={() => {
                                handleInteraction();
                                setIsStreaming(true);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                sendMessage({ text: q.text } as any);
                              }}
                              className="px-3 py-2.5 rounded-[10px] border border-border bg-surface hover:bg-nav-inactive text-left transition-all hover:scale-[1.02] cursor-pointer"
                            >
                              <span className="block text-xs font-medium text-surface-secondary mb-0.5">
                                {q.label}
                              </span>
                              <span className="block text-sm text-foreground">
                                {q.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
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
                                setIsStreaming(true);
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                sendMessage({ text: question } as any);
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
              (realtime.isModelSpeaking || realtime.isAudioPlaying)
                ? "border-0"
                : "border border-border transition-colors focus-within:border-foreground"
            )}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleInteraction();
                }}
                onFocus={() => {
                  setIsExpanded(true);
                  handleInteraction();
                }}
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
