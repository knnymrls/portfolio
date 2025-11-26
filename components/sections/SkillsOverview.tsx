"use client";

import { motion } from "framer-motion";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "GraphQL",
  "OpenAI API",
  "LangChain",
  "RAG Systems",
  "Figma",
  "UI/UX Design",
  "Framer Motion",
  "Supabase",
  "REST APIs",
];

export default function SkillsOverview() {
  return (
    <section className="w-full pb-[108px]" data-highlight-section="skills">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          SKILLS
        </h2>

        {/* Marquee container */}
        <div className="relative overflow-hidden py-4">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Scrolling track */}
          <motion.div
            className="flex gap-4 whitespace-nowrap"
            animate={{ x: [0, -1500] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate skills for seamless loop */}
            {[...skills, ...skills, ...skills].map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="text-2xl md:text-3xl font-medium text-foreground/80 hover:text-foreground transition-colors cursor-default"
              >
                {skill}
                <span className="text-surface-secondary/50 mx-4">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
