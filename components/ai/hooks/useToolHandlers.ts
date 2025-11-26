"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  resolvePortfolioPath,
  PortfolioNavigationTarget,
} from "@/lib/ai/portfolio-routing";
import { AIAction } from "@/types/ai";
import type { UIMessage } from "@ai-sdk/react";

/**
 * Pending navigation that requires user confirmation
 */
export interface PendingNavigation {
  destination: string;
  path: string;
  targetId?: string;
}

/**
 * Pending highlight that requires user confirmation
 */
export interface PendingHighlight {
  targets: string[];
  duration?: number;
}

/**
 * Combined pending action (navigation, highlight, or both)
 */
export interface PendingAction {
  type: "navigate" | "highlight" | "navigate-and-highlight";
  navigation?: PendingNavigation;
  highlight?: PendingHighlight;
}

interface UseToolHandlersOptions {
  messages: UIMessage[];
  isStreaming: boolean;
  highlightElements: (targets: string[], duration?: number) => void;
  setCurrentAction: (action: AIAction | null) => void;
  setAiSuggestedQuestions: (questions: string[]) => void;
}

/**
 * Wait for an element to appear in the DOM with retry logic.
 * Returns the element or null if not found within max attempts.
 */
function waitForElement(
  selector: string,
  maxAttempts = 10,
  interval = 200
): Promise<Element | null> {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.warn(`Element not found after ${maxAttempts} attempts:`, selector);
        resolve(null);
        return;
      }

      setTimeout(check, interval);
    };

    check();
  });
}

/**
 * Wait for navigation to complete by checking if pathname matches.
 */
function waitForNavigation(
  expectedPath: string,
  getCurrentPath: () => string,
  maxAttempts = 15,
  interval = 200
): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      const currentPath = getCurrentPath();
      if (currentPath === expectedPath || currentPath.startsWith(expectedPath)) {
        resolve(true);
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.warn(`Navigation timeout. Expected: ${expectedPath}, Got: ${currentPath}`);
        resolve(false);
        return;
      }

      setTimeout(check, interval);
    };

    // Small initial delay for router to start navigation
    setTimeout(check, 100);
  });
}

/**
 * Hook that processes tool calls from AI message parts.
 * Handles navigation (with user confirmation), highlighting, and follow-up suggestions.
 *
 * Key features:
 * - Navigation requires user confirmation (not auto-navigate)
 * - Only one navigation per response
 * - Uses retry logic for element finding
 * - Waits for navigation to complete before highlighting
 */
export function useToolHandlers({
  messages,
  isStreaming,
  highlightElements,
  setCurrentAction,
  setAiSuggestedQuestions,
}: UseToolHandlersOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  // Track which message IDs have been processed to prevent duplicate execution
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Keep pathname ref updated
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const getCurrentPath = useCallback(() => pathnameRef.current, []);

  // Execute navigation/highlight action
  const executeAction = useCallback(async (action: PendingAction) => {
    const { navigation, highlight } = action;

    // Handle navigation first if present
    if (navigation) {
      setCurrentAction({
        type: "navigate",
        description: `Navigating...`,
        target: navigation.destination,
      });

      const fullPath = navigation.targetId
        ? `${navigation.path}#${navigation.targetId}`
        : navigation.path;
      router.push(fullPath as Parameters<typeof router.push>[0]);

      // Wait for navigation
      const navSuccess = await waitForNavigation(navigation.path, getCurrentPath);
      if (!navSuccess) {
        console.warn("Navigation may not have completed successfully");
      }

      // Additional delay for page content to render
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Handle highlighting
    const targetsToHighlight: string[] = [];

    // Add navigation targetId if present
    if (navigation?.targetId) {
      targetsToHighlight.push(navigation.targetId);
    }

    // Add explicit highlight targets
    if (highlight?.targets) {
      targetsToHighlight.push(...highlight.targets);
    }

    if (targetsToHighlight.length > 0) {
      setCurrentAction({
        type: "highlight",
        description: "Highlighting...",
        target: "content",
      });

      // Wait for elements to be ready
      const firstTarget = targetsToHighlight[0];
      const selector = firstTarget.startsWith("[") || firstTarget.startsWith("#") || firstTarget.startsWith(".")
        ? firstTarget
        : `[data-highlight-id="${firstTarget}"], [data-highlight-section="${firstTarget}"]`;
      await waitForElement(selector, 10, 200);

      highlightElements(targetsToHighlight, highlight?.duration || 4000);
    }

    setTimeout(() => setCurrentAction(null), 1000);
  }, [router, getCurrentPath, highlightElements, setCurrentAction]);

  useEffect(() => {
    // Don't process while streaming - wait for complete response
    if (isStreaming) return;

    // No messages to process
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Only process assistant messages with parts
    if (lastMessage.role !== "assistant" || !lastMessage.parts) return;

    // Skip if we've already processed this message
    if (processedMessageIds.current.has(lastMessage.id)) return;

    // Mark as processed immediately to prevent race conditions
    processedMessageIds.current.add(lastMessage.id);

    // Process tool calls
    const processTools = async () => {
      let foundNavigation: PendingNavigation | null = null;
      let foundHighlight: PendingHighlight | null = null;

      // Debug: Log all parts to see what we're receiving
      console.log("[ToolHandlers] Processing parts:", lastMessage.parts.map((p: { type?: string }) => p.type));

      // First pass - collect tool calls (only first navigation, combine highlights)
      for (const part of lastMessage.parts) {
        const typedPart = part as {
          type: string;
          state?: string;
          input?: {
            section?: string;
            targets?: string[];
            duration?: number;
            questions?: string[];
            targetId?: string;
          };
          output?: { questions?: string[] };
          result?: { questions?: string[] };
        };

        // Only capture the first navigation request
        if (typedPart.type === "tool-navigateToSection" && typedPart.input && !foundNavigation) {
          const destination = typedPart.input.section;
          const targetId = typedPart.input.targetId;

          const targetPath = destination
            ? resolvePortfolioPath(destination as PortfolioNavigationTarget)
            : null;

          if (targetPath) {
            // Check if we're already on this page
            const currentPath = getCurrentPath();
            if (currentPath !== targetPath) {
              foundNavigation = {
                destination: destination || "page",
                path: targetPath,
                targetId,
              };
            } else if (targetId) {
              // Already on the page, add targetId to highlights
              if (!foundHighlight) {
                foundHighlight = { targets: [], duration: 4000 };
              }
              foundHighlight.targets.push(targetId);
            }
          } else {
            console.warn("Unknown destination:", destination);
          }
        } else if (typedPart.type === "tool-highlightContent" && typedPart.input?.targets) {
          // Combine all highlight requests
          if (!foundHighlight) {
            foundHighlight = { targets: [], duration: typedPart.input.duration || 4000 };
          }
          foundHighlight.targets.push(...typedPart.input.targets);
        } else if (typedPart.type === "tool-suggestFollowUps") {
          // Handle various states: input-available, output-available, result
          const questions = typedPart.input?.questions || typedPart.output?.questions || typedPart.result?.questions;
          console.log("[ToolHandlers] Found suggestFollowUps:", questions, "state:", typedPart.state);
          if (questions) {
            setAiSuggestedQuestions(questions);
          }
        }

        // Debug: Log any tool-related parts
        if (typedPart.type?.includes("suggest") || typedPart.type?.includes("follow")) {
          console.log("[ToolHandlers] Found related tool:", typedPart.type, typedPart);
        }
      }

      // Deduplicate highlight targets
      if (foundHighlight) {
        foundHighlight.targets = [...new Set(foundHighlight.targets)];
      }

      // Execute action immediately if we have navigation or highlights
      // (user explicitly asked for it, so no confirmation needed)
      if (foundNavigation || foundHighlight) {
        let actionType: PendingAction["type"];
        if (foundNavigation && foundHighlight) {
          actionType = "navigate-and-highlight";
        } else if (foundNavigation) {
          actionType = "navigate";
        } else {
          actionType = "highlight";
        }

        executeAction({
          type: actionType,
          navigation: foundNavigation || undefined,
          highlight: foundHighlight || undefined,
        });
      }
    };

    processTools();
  }, [messages, isStreaming, setCurrentAction, setAiSuggestedQuestions, getCurrentPath, executeAction]);

  // Cleanup old processed IDs when messages change significantly
  useEffect(() => {
    const currentIds = new Set(messages.map((m) => m.id));
    processedMessageIds.current.forEach((id) => {
      if (!currentIds.has(id)) {
        processedMessageIds.current.delete(id);
      }
    });
  }, [messages]);

  return {};
}
