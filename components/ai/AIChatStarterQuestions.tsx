"use client";

import { StarterQuestion } from "./types";

interface AIChatStarterQuestionsProps {
  questions: StarterQuestion[];
  onSelect: (text: string) => void;
}

export function AIChatStarterQuestions({
  questions,
  onSelect,
}: AIChatStarterQuestionsProps) {
  return (
    <div className="space-y-4">
      <div className="text-base leading-relaxed text-foreground">
        <p className="flex items-center gap-2">
          <span>
            Hi! I&apos;m Kenny&apos;s AI assistant. I can help you explore the
            portfolio, answer questions about my experience, or discuss my
            ventures.
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {questions.map((q) => (
          <button
            key={q.text}
            type="button"
            onClick={() => onSelect(q.text)}
            className="px-3 py-2.5 rounded-[10px] border border-border bg-surface hover:bg-nav-inactive text-left transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span className="block text-xs font-medium text-surface-secondary mb-0.5">
              {q.label}
            </span>
            <span className="block text-sm text-foreground">{q.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
