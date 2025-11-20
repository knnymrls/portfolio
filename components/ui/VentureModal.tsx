"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface VentureModalProps {
  isOpen: boolean;
  onClose: () => void;
  venture: {
    name: string;
    role: string;
    dateRange: string;
    description: string;
    backgroundColor: string;
    logoUrl?: string;
    logoClassName?: string;
    customLogo?: React.ReactNode;
    // Add more fields if needed for the modal details
    longDescription?: string;
    technologies?: string[];
    websiteUrl?: string;
  } | null;
}

export default function VentureModal({ isOpen, onClose, venture }: VentureModalProps) {
  if (!venture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden rounded-[20px] sm:rounded-[20px] border-border bg-surface shadow-2xl">
        
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-full h-[200px] ${venture.backgroundColor} flex items-center justify-center relative overflow-hidden`}
        >
          {venture.customLogo ? (
            venture.customLogo
          ) : venture.logoUrl ? (
            <motion.img
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              src={venture.logoUrl}
              alt={`${venture.name} logo`}
              className={`${venture.logoClassName} object-contain transform scale-125`}
            />
          ) : null}
        </motion.div>

        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                {venture.name}
              </DialogTitle>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-wrap gap-4 text-sm text-surface-secondary"
            >
              <div className="flex items-center gap-1.5">
                <User size={16} />
                <span>{venture.role}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{venture.dateRange}</span>
              </div>
            </motion.div>
          </DialogHeader>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-secondary mb-3">
                About
              </h4>
              <p className="text-base leading-relaxed text-foreground">
                {venture.longDescription || venture.description}
              </p>
            </motion.div>

            {venture.technologies && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-secondary mb-3">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {venture.technologies.map((tech, index) => (
                    <motion.span 
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (index * 0.05), duration: 0.2 }}
                      className="px-3 py-1 bg-surface-secondary/10 rounded-full text-sm text-foreground border border-border"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {venture.websiteUrl && (
            <DialogFooter className="mt-8">
              <motion.a 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                href={venture.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-surface hover:bg-foreground/90 transition-colors px-6 py-3 rounded-xl font-medium text-base"
              >
                Visit Website
                <ArrowUpRight size={18} />
              </motion.a>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
