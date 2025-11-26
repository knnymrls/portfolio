"use client";

interface AIChatFollowUpsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function AIChatFollowUps({ questions, onSelect }: AIChatFollowUpsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(question)}
          className="px-3 py-2 rounded-[10px] border border-border bg-surface hover:bg-nav-inactive cursor-pointer transition-colors text-sm text-foreground"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
