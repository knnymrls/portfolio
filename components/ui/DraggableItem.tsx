"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
  children: React.ReactNode;
  className?: string;
  left?: number | string;
  top?: number | string;
  rotation?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dragConstraints?: React.RefObject<any>;
}

export default function DraggableItem({ 
  children, 
  className, 
  left,
  top,
  rotation = 0,
  dragConstraints
}: DraggableItemProps) {
  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragMomentum={false} // Disabled momentum for better control
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }} // Tighter control
      whileHover={{ scale: 1.1, zIndex: 50, cursor: "grab" }}
      whileDrag={{ scale: 1.2, zIndex: 100, cursor: "grabbing", rotate: 0 }}
      initial={{ rotate: rotation }}
      style={{ 
        left: left, 
        top: top,
        position: 'absolute' 
      }}
      className={cn(
        "shadow-lg hover:shadow-xl transition-shadow touch-none select-none",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
