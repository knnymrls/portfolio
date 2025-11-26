"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Import images
// Note: We're using strings for paths since Next.js Image component can take string paths
// if they are in the public directory.
const IMAGES = {
  findu: '/images/projects/findu/findu-mockup.png',
  mkrs: '/images/projects/mkrs-screenshot.png',
  explore: '/images/hero-img.png',
  start: '/images/hero-kenny.png',
};

interface JourneyStep {
  year: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
}

const journeySteps: JourneyStep[] = [
  {
    year: "2025",
    title: "Building the Future",
    description: "Co-founded FindU and Mkrs., focusing on solving real problems in education and AI consulting. Growing teams and shipping products.",
    image: IMAGES.findu
  },
  {
    year: "2024",
    title: "Deep Dive into Startups",
    description: "Joined the Nebraska Startup Academy and various accelerators. Built Mkrs.world and started taking my ideas seriously as businesses.",
    image: IMAGES.mkrs
  },
  {
    year: "2023",
    title: "The Spark",
    description: "Started exploring full-stack development more intensely. Realized that code wasn't just for homework—it was a tool for creation.",
    image: IMAGES.explore
  },
  {
    year: "2022",
    title: "Hello World",
    description: "Wrote my first lines of meaningful code. The infinite possibilities of the web captivated me immediately.",
    image: IMAGES.start
  }
];

export default function AboutJourney() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-8">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          MY JOURNEY
        </h2>

        <div className="relative pl-8 border-l-2 border-border space-y-12">
          {journeySteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative group cursor-default"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-surface border-2 border-surface-secondary/30 z-10 group-hover:border-project-findu transition-colors duration-300"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 300 }}
              >
                <div className="w-2 h-2 rounded-full bg-surface-secondary/50 group-hover:bg-project-findu transition-colors duration-300"></div>
              </motion.div>

              <div className="flex flex-col gap-2 relative z-10">
                <span className="text-sm font-mono text-project-findu font-medium">
                  {step.year}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-base text-surface-secondary leading-relaxed max-w-2xl transition-colors duration-300 group-hover:text-foreground">
                  {step.description}
                </p>
              </div>

              {/* Hover Image Pop-up */}
              <AnimatePresence>
                {hoveredIndex === index && step.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 2, x: 20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 2, x: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-0 right-0 lg:right-20 w-64 h-40 hidden lg:block pointer-events-none z-20 rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 transform translate-x-full"
                    style={{ top: '-20%' }}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
