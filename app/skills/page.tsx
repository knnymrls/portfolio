"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Featured skills
const featuredSkills = [
  {
    name: "React & Next.js",
    description: "Building performant, SEO-friendly web applications",
  },
  {
    name: "AI Integration",
    description: "OpenAI, LangChain, RAG systems, and prompt engineering",
  },
  {
    name: "TypeScript",
    description: "Type-safe code that scales with your team",
  },
  {
    name: "UI/UX Design",
    description: "From Figma wireframes to polished interfaces",
  },
];

// Skill categories with proficiency
const skillCategories = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 85 },
      { name: "GraphQL", level: 75 },
      { name: "REST APIs", level: 90 },
      { name: "PostgreSQL", level: 80 },
    ],
  },
  {
    id: "ai-ml",
    title: "AI/ML",
    skills: [
      { name: "OpenAI API", level: 90 },
      { name: "LangChain", level: 75 },
      { name: "RAG Systems", level: 80 },
      { name: "Prompt Engineering", level: 85 },
      { name: "Vector DBs", level: 70 },
    ],
  },
  {
    id: "tools",
    title: "Tools & Design",
    skills: [
      { name: "Figma", level: 90 },
      { name: "Git", level: 90 },
      { name: "Docker", level: 70 },
      { name: "Vercel", level: 90 },
      { name: "AWS", level: 65 },
    ],
  },
];

const softSkills = [
  "Product Strategy",
  "Team Leadership",
  "Startup Operations",
  "Client Communication",
  "Mentoring",
  "Public Speaking",
];

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-foreground">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="text-xs text-surface-secondary"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-1.5 bg-surface-secondary/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full bg-foreground/80 rounded-full group-hover:bg-foreground transition-colors"
        />
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 pt-[100px]" data-highlight-section="skills">
      {/* Header */}
      <section className="pb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-semibold text-foreground leading-[1.2] mb-4"
          data-highlight-id="skills-title"
        >
          Skills & Expertise
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-surface-secondary max-w-2xl"
        >
          Full-stack developer with a passion for building AI-powered interfaces and delightful user experiences.
        </motion.p>
      </section>

      {/* Featured Skills - Bento Grid */}
      <section className="pb-16">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase mb-6">
          WHAT I DO BEST
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface rounded-[20px] border border-border p-6 hover:border-foreground/20 transition-colors cursor-default"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {skill.name}
              </h3>
              <p className="text-sm text-surface-secondary">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Skills with Progress Bars */}
      <section className="pb-16">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase mb-6">
          TECHNICAL PROFICIENCY
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + catIndex * 0.1 }}
              className="bg-surface rounded-[20px] border border-border p-6"
              data-highlight-id={`skill-category-${category.id}`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-5">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={0.5 + catIndex * 0.1 + skillIndex * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Soft Skills */}
      <section className="pb-[108px]">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase mb-6">
          BEYOND THE CODE
        </h2>

        <div className="flex flex-wrap gap-3">
          {softSkills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="text-sm text-foreground bg-surface border border-border px-4 py-2 rounded-full hover:border-foreground/20 transition-colors cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>
    </div>
  );
}
