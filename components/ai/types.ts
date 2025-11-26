// Re-export the base types from the global types folder
export type { AIAction, AIState, Message } from "@/types/ai";

/**
 * Starter question displayed in the initial chat state
 */
export interface StarterQuestion {
  text: string;
  label: string;
}

/**
 * Props for the chat input component
 */
export interface AIChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFocus: () => void;
  isStreaming: boolean;
  placeholder?: string;
}

/**
 * Props for the starter questions component
 */
export interface AIChatStarterQuestionsProps {
  questions: StarterQuestion[];
  onSelect: (text: string) => void;
}

/**
 * Props for the follow-up questions component
 */
export interface AIChatFollowUpsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

/**
 * Props for the action indicator component
 */
export interface AIChatActionIndicatorProps {
  action: {
    type: string;
    description: string;
    target?: string;
  } | null;
}
