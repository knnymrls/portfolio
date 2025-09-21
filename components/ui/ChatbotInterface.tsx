'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface QuickAction {
  label: string;
  action: () => void;
}

const quickActions: QuickAction[] = [
  { label: 'Tell me about your work', action: () => {} },
  { label: 'How can we collaborate?', action: () => {} },
  { label: 'What are your skills?', action: () => {} },
];

export function ChatbotInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-8 right-8 z-50",
              "w-14 h-14 rounded-full",
              "bg-foreground text-background",
              "flex items-center justify-center",
              "shadow-lg hover:shadow-xl transition-shadow"
            )}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-surface border-t border-border",
              "max-h-[60vh] sm:max-h-[400px]"
            )}
          >
            <div className="mx-auto max-w-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ask me anything</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Welcome message */}
              <div className="mb-6">
                <p className="text-surface-secondary mb-4">
                  Hi! I'm Kenny's AI assistant. I can help you learn more about his work, skills, and experience.
                </p>
                
                {/* Quick actions */}
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className={cn(
                        "px-4 py-2 rounded-full",
                        "bg-gray-100 dark:bg-gray-800",
                        "text-sm font-medium",
                        "hover:bg-gray-200 dark:hover:bg-gray-700",
                        "transition-colors"
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me any question..."
                  className={cn(
                    "flex-1 px-4 py-3 rounded-button",
                    "bg-gray-50 dark:bg-gray-900",
                    "border border-border",
                    "placeholder:text-surface-secondary",
                    "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                  )}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  aria-label="Send message"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}