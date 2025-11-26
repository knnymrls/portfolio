"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Featured skills with accent colors
const featuredSkills = [
  {
    name: "React & Next.js",
    description: "Building performant, SEO-friendly web applications",
    color: "bg-[#61DAFB]/10 border-[#61DAFB]/30 hover:border-[#61DAFB]",
    icon: "⚛️",
  },
  {
    name: "AI Integration",
    description: "OpenAI, LangChain, RAG systems, and prompt engineering",
    color: "bg-[#10A37F]/10 border-[#10A37F]/30 hover:border-[#10A37F]",
    icon: "🤖",
  },
  {
    name: "TypeScript",
    description: "Type-safe code that scales with your team",
    color: "bg-[#3178C6]/10 border-[#3178C6]/30 hover:border-[#3178C6]",
    icon: "📘",
  },
  {
    name: "UI/UX Design",
    description: "From Figma wireframes to polished interfaces",
    color: "bg-[#F24E1E]/10 border-[#F24E1E]/30 hover:border-[#F24E1E]",
    icon: "🎨",
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
  { name: "Product Strategy", emoji: "🎯" },
  { name: "Team Leadership", emoji: "👥" },
  { name: "Startup Operations", emoji: "🚀" },
  { name: "Client Communication", emoji: "💬" },
  { name: "Mentoring", emoji: "🌱" },
  { name: "Public Speaking", emoji: "🎤" },
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
              className={`${skill.color} rounded-[20px] border p-6 transition-all duration-300 cursor-default`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{skill.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-surface-secondary">
                    {skill.description}
                  </p>
                </div>
              </div>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {softSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-surface border border-border rounded-[16px] p-4 flex items-center gap-3 hover:border-foreground/20 transition-colors cursor-default"
            >
              <span className="text-2xl">{skill.emoji}</span>
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
