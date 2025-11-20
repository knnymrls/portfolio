"use client";

import React from "react";
import { motion } from "framer-motion";

interface FindUHeroProps {
  title: string;
  description: string;
  role: string;
  timeline: string;
  tags: string[];
}

export default function FindUHero({
  description,
  role,
  timeline,
  tags,
}: FindUHeroProps) {
  return (
    <div className="w-full mb-16">
      {/* Hero Card */}
      <div className="bg-project-findu rounded-[32px] p-8 md:p-12 overflow-hidden relative min-h-[500px] flex flex-col justify-between text-white mb-12 group">
        
        {/* Content Z-Index wrapper */}
        <div className="relative z-10 max-w-xl">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <img 
              src="/images/projects/findu/e4920875de0b8c66a3e07ab29682d2976dbeab06.svg" 
              alt="FindU Logo" 
              className="h-12 w-auto brightness-0 invert" // Make logo white for contrast
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {description}
            </h1>
          </motion.div>

          {/* Tags */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/10"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Animated Phones */}
        <div className="absolute right-[-50px] top-0 h-full w-1/2 hidden lg:block pointer-events-none">
            {/* Phone 1 - Front */}
            <motion.div
              initial={{ y: 100, opacity: 0, rotate: -10 }}
              animate={{ y: 0, opacity: 1, rotate: -10 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="absolute right-[180px] top-[50px] w-[280px] z-20"
            >
               <img
                src="/images/projects/findu-mockup.png"
                alt="FindU App Interface"
                className="w-full h-auto rounded-[32px] shadow-2xl"
              />
            </motion.div>

            {/* Phone 2 - Back */}
            <motion.div
              initial={{ y: 200, opacity: 0, rotate: -5 }}
              animate={{ y: 80, opacity: 0.6, rotate: -5 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="absolute right-[40px] top-[50px] w-[280px] z-10"
            >
              <img
                src="/images/projects/findu-mockup.png"
                alt="FindU App Interface"
                className="w-full h-auto rounded-[32px] shadow-xl grayscale-[0.3]"
              />
            </motion.div>
        </div>
      </div>

      {/* Meta Data Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
        <div>
          <h3 className="text-sm text-surface-secondary uppercase tracking-wider mb-1 font-semibold">Role</h3>
          <p className="text-lg font-medium text-foreground">{role}</p>
        </div>
        <div>
          <h3 className="text-sm text-surface-secondary uppercase tracking-wider mb-1 font-semibold">Timeline</h3>
          <p className="text-lg font-medium text-foreground">{timeline}</p>
        </div>
        <div className="col-span-2 md:col-span-2">
          <h3 className="text-sm text-surface-secondary uppercase tracking-wider mb-1 font-semibold">Team</h3>
          <p className="text-lg font-medium text-foreground">
            Self-directed with user feedback group
          </p>
        </div>
      </div>
    </div>
  );
}

