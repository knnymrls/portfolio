"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoOpenBehaviorOptions {
  messagesCount: number;
}

/**
 * Hook that manages the auto-open/close behavior of the chat panel.
 * Opens the chat briefly on mount to draw attention, then closes if no interaction.
 */
export function useAutoOpenBehavior({ messagesCount }: UseAutoOpenBehaviorOptions) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Use refs to access current values in timer callbacks (avoids stale closures)
  const hasInteractedRef = useRef(hasInteracted);
  const messagesCountRef = useRef(messagesCount);

  // Keep refs updated
  useEffect(() => {
    hasInteractedRef.current = hasInteracted;
  }, [hasInteracted]);

  useEffect(() => {
    messagesCountRef.current = messagesCount;
  }, [messagesCount]);

  // Auto-open and close sequence on mount
  useEffect(() => {
    const openTimer = setTimeout(() => {
      if (!hasInteractedRef.current) {
        setIsExpanded(true);
      }
    }, 800);

    const closeTimer = setTimeout(() => {
      // Only auto-close if no interaction and no active conversation
      if (!hasInteractedRef.current && messagesCountRef.current === 0) {
        setIsExpanded(false);
      }
    }, 5000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []); // Run once on mount

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  return {
    isExpanded,
    setIsExpanded,
    hasInteracted,
    handleInteraction,
  };
}
