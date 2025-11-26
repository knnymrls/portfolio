"use client";

import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface AIChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  isStreaming: boolean;
  placeholder?: string;
}

export function AIChatInput({
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  isStreaming,
  placeholder = "Ask me any question...",
}: AIChatInputProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <div className="relative bg-surface rounded-[12px] border border-border transition-colors focus-within:border-foreground">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
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
            disabled={!value.trim() || isStreaming}
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
  );
}
