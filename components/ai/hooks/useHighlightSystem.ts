"use client";

import { useCallback } from "react";
import { HIGHLIGHT_ALIASES } from "../utils/highlight-aliases";

/**
 * Hook that provides DOM highlighting functionality for the AI chat.
 * Handles finding elements, scrolling, highlighting, and dimming.
 */
export function useHighlightSystem() {
  const clearHighlights = useCallback(() => {
    if (typeof window === "undefined") return;
    document.querySelectorAll(".ai-highlight").forEach((el) => {
      el.classList.remove("ai-highlight");
    });
    document.querySelectorAll(".ai-dimmed").forEach((el) => {
      el.classList.remove("ai-dimmed");
    });
  }, []);

  const highlightElements = useCallback(
    (targets: string[], duration = 4000) => {
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
        if (
          target &&
          !target.startsWith("#") &&
          !target.startsWith(".") &&
          !target.startsWith("[")
        ) {
          const byDataId = document.querySelector(
            `[data-highlight-id="${target}"]`
          );
          if (byDataId) {
            elements.push(byDataId);
            highlightedElements.push(...elements);
            return; // Found exact match, skip other strategies
          }

          // Try data-highlight-section attribute
          const byDataSection = document.querySelector(
            `[data-highlight-section="${target}"]`
          );
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
                document.querySelectorAll(
                  '[data-highlight-section="case-studies"], [data-highlight-id="projects-grid"], [class*="group"][class*="bg-surface"]'
                )
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
                document.querySelectorAll(
                  '[data-highlight-section="contact"], [data-highlight-id="contact-form"], form, [href="/contact"]'
                )
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
                document.querySelectorAll(
                  '[data-highlight-section="skills"], [data-highlight-id="skills-grid"]'
                )
              );
              break;
            case "about":
              elements = Array.from(
                document.querySelectorAll(
                  '[data-highlight-section="about"], [data-highlight-id="about-content"]'
                )
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
        const chatbotContainer = document.querySelector(
          '[data-ai-chatbot="true"]'
        );

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
          const isChatbot =
            chatbotContainer &&
            (el === chatbotContainer ||
              chatbotContainer.contains(el) ||
              el.contains(chatbotContainer) ||
              el.hasAttribute("data-ai-chatbot") ||
              el.closest('[data-ai-chatbot="true"]'));

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
    },
    [clearHighlights]
  );

  return { clearHighlights, highlightElements };
}
