"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ease, staggerContainer, staggerItem, duration } from '@/lib/motion';

interface CaseStudyHeroProps {
  title: string;
  description: string;
  backgroundColor: string;
  logoUrl?: string;
  customLogo?: React.ReactNode;
  duration?: string;
  role?: string;
  timeline?: string;
  tags?: string[];
}

const heroContainer = staggerContainer(0.12);

const logoVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease },
  },
};

export default function CaseStudyHero({
  title,
  description,
  backgroundColor,
  logoUrl,
  customLogo,
  duration: readDuration,
  role,
  timeline,
  tags,
}: CaseStudyHeroProps) {
  return (
    <motion.div
      className="mb-16"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Logo/Brand Section */}
      <motion.div
        className={`${backgroundColor} rounded-2xl p-12 flex items-center justify-center mb-8`}
        style={{ minHeight: '300px' }}
        variants={logoVariant}
      >
        {customLogo || (logoUrl && (
          <img src={logoUrl} alt={`${title} logo`} className="w-auto max-h-[200px]" />
        ))}
      </motion.div>

      {/* Title and Description */}
      <motion.div className="mb-8" variants={staggerItem}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{title}</h1>
        <p className="text-xl text-surface-secondary">{description}</p>
      </motion.div>

      {/* Meta Information */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border"
        variants={staggerItem}
      >
        {readDuration && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Read Time</div>
            <div className="text-base font-medium">{readDuration}</div>
          </div>
        )}
        {role && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Role</div>
            <div className="text-base font-medium">{role}</div>
          </div>
        )}
        {timeline && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Timeline</div>
            <div className="text-base font-medium">{timeline}</div>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Tags</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
