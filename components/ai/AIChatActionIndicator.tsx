"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AIAction } from "@/types/ai";

interface AIChatActionIndicatorProps {
  action: AIAction | null;
}

export function AIChatActionIndicator({ action }: AIChatActionIndicatorProps) {
  return (
    <AnimatePresence>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="mb-2 mx-auto w-fit"
        >
          <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-full px-4 py-2">
            <p className="text-sm text-surface-secondary">{action.description}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
