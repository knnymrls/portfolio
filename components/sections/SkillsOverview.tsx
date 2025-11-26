"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const skillCategories = [
  {
    id: "frontend",
    title: "Frontend",
    color: "bg-project-flock",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "backend",
    title: "Backend & Data",
    color: "bg-project-findu",
    skills: ["Node.js", "PostgreSQL", "GraphQL", "REST APIs", "Supabase"],
  },
  {
    id: "ai",
    title: "AI/ML",
    color: "bg-project-bloom",
    skills: ["OpenAI API", "LangChain", "RAG Systems", "Prompt Engineering"],
  },
  {
    id: "design",
    title: "Design",
    color: "bg-project-mkrs",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
  },
];

function SkillCard({
  category,
}: {
  category: (typeof skillCategories)[number];
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-surface rounded-[20px] border border-border overflow-hidden transition-all duration-300 hover:border-foreground/20 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Colored header area */}
      <div
        className={`${category.color} h-[140px] relative overflow-hidden flex items-center justify-center`}
      >
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-bold text-white/90 select-none"
        >
          {category.title.charAt(0)}
        </motion.span>

        {/* Animated skill pills on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
            >
              <div className="flex flex-wrap gap-2 justify-center px-4 max-w-full">
                {category.skills.slice(0, 3).map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-xs font-medium text-white bg-white/20 px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </motion.span>
                ))}
                {category.skills.length > 3 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-xs font-medium text-white/70 px-2 py-1.5"
                  >
                    +{category.skills.length - 3}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-medium text-foreground mb-2">
          {category.title}
        </h3>
        <p className="text-sm text-surface-secondary">
          {category.skills.join(" · ")}
        </p>
      </div>
    </div>
  );
}

export default function SkillsOverview() {
  return (
    <section className="w-full pb-[108px]" data-highlight-section="skills">
      <div className="flex flex-col gap-5 w-full">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          SKILLS
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories.map((category) => (
            <SkillCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
