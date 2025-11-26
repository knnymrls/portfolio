"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowUpRight, Calendar, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PressItem } from "@/lib/content/loader";

interface PressModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PressItem | null;
}

export default function PressModal({ isOpen, onClose, item }: PressModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden rounded-[20px] sm:rounded-[20px] border-border bg-surface shadow-2xl">
        
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-full h-[200px] ${item.backgroundColor} flex items-center justify-center relative overflow-hidden`}
        >
          <motion.img
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            src={item.logoUrl}
            alt={`${item.name} logo`}
            className={`${item.logoClassName} object-contain transform scale-125`}
          />
        </motion.div>

        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {item.title || item.name}
              </DialogTitle>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-wrap gap-4 text-sm text-surface-secondary"
            >
              <div className="flex items-center gap-1.5">
                <Newspaper size={16} />
                <span>{item.name}</span>
              </div>
              {item.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
              )}
            </motion.div>
          </DialogHeader>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-secondary mb-3">
                About the Article
              </h4>
              <p className="text-base leading-relaxed text-foreground">
                {item.description || "Featured coverage in " + item.name}
              </p>
            </motion.div>
          </div>

          {item.articleUrl && (
            <DialogFooter className="mt-8">
              <motion.a 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                href={item.articleUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-surface hover:bg-foreground/90 transition-colors px-6 py-3 rounded-xl font-medium text-base"
              >
                Read Article
                <ArrowUpRight size={18} />
              </motion.a>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

