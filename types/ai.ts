export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  metadata?: {
    intent?: 'navigation' | 'query' | 'highlight';
    target?: string;
    confidence?: number;
  };
}

export interface AIAction {
  type: 'navigate' | 'highlight' | 'info';
  description: string;
  target?: string;
  elements?: string[];
}

export interface AIState {
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
  currentAction?: AIAction;
  highlightedElements: string[];
  suggestedQueries: string[];
}