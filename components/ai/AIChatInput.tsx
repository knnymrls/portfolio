"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface AIChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  isStreaming: boolean;
  isChatExpanded: boolean; // Whether the chat panel is open
  placeholder?: string;
}

export function AIChatInput({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  isStreaming,
  isChatExpanded,
  placeholder = "Ask me any question...",
}: AIChatInputProps) {
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep input expanded when chat is expanded or streaming
  const shouldBeExpanded = isInputExpanded || isChatExpanded || isStreaming;

  // Focus input when expanded
  useEffect(() => {
    if (shouldBeExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldBeExpanded]);

  // Collapse input when chat closes (and no value)
  useEffect(() => {
    if (!isChatExpanded && !value.trim() && !isStreaming) {
      setIsInputExpanded(false);
    }
  }, [isChatExpanded, value, isStreaming]);

  const handleExpand = () => {
    setIsInputExpanded(true);
    onFocus();
  };

  const handleCollapse = () => {
    // Only collapse if chat is also closed, no value, and not streaming
    if (!isChatExpanded && !value.trim() && !isStreaming) {
      setIsInputExpanded(false);
    }
    onBlur();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <motion.div
          className={cn(
            "relative bg-surface rounded-[14px]",
            "transition-all duration-200",
            shouldBeExpanded
              ? "border border-border focus-within:border-foreground w-full"
              : "border border-foreground/30 w-[280px] mx-auto"
          )}
          initial={false}
          animate={{
            height: shouldBeExpanded ? 52 : 44,
            opacity: shouldBeExpanded ? 1 : 0.8,
          }}
          whileHover={!shouldBeExpanded ? { opacity: 1 } : undefined}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {!shouldBeExpanded ? (
            // Collapsed state - clickable area
            <button
              type="button"
              onClick={handleExpand}
              className={cn(
                "w-full h-full px-4",
                "flex items-center justify-between",
                "text-surface-secondary",
                "cursor-text"
              )}
            >
              <span className="text-sm">Ask a question</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-foreground/10 rounded border border-foreground/20">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>
          ) : (
            // Expanded state - full input
            <>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                onBlur={handleCollapse}
                placeholder={placeholder}
                className={cn(
                  "w-full h-full pl-4 pr-14",
                  "bg-transparent",
                  "placeholder:text-surface-secondary",
                  "text-base",
                  "focus:outline-none"
                )}
              />

              <button
                type="submit"
                disabled={!value.trim() || isStreaming}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "w-8 h-8 rounded-[10px]",
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
            </>
          )}
        </motion.div>
      </div>
    </form>
  );
}
