"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    id: "languages",
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "React Query"],
  },
  {
    id: "backend",
    title: "Backend",
    skills: ["Node.js", "Express", "GraphQL", "REST APIs", "WebSockets"],
  },
  {
    id: "database",
    title: "Database",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase"],
  },
  {
    id: "ai-ml",
    title: "AI/ML",
    skills: ["OpenAI API", "LangChain", "RAG Systems", "Vector DBs", "Prompt Engineering"],
  },
  {
    id: "design",
    title: "Design",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "User Research"],
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

export default function SkillsPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 pt-[100px]" data-highlight-section="skills">
      {/* Header */}
      <section className="pb-12">
        <h1
          className="text-4xl md:text-5xl font-semibold text-foreground leading-[1.2] mb-4"
          data-highlight-id="skills-title"
        >
          Skills & Expertise
        </h1>
        <p className="text-xl text-surface-secondary max-w-2xl">
          Full-stack developer specializing in AI interfaces, modern web technologies, and design systems.
        </p>
      </section>

      {/* Technical Skills Grid */}
      <section className="pb-16">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase mb-6">
          TECHNICAL SKILLS
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-highlight-id="skills-grid"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface rounded-[20px] border border-border p-6 hover:border-foreground/20 transition-colors"
              data-highlight-id={`skill-category-${category.id}`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm text-surface-secondary bg-surface-secondary/10 px-3 py-1.5 rounded-full"
                    data-highlight-id={`skill-${skill.toLowerCase().replace(/[\s./]/g, '-')}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Soft Skills */}
      <section className="pb-[108px]">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase mb-6">
          SOFT SKILLS
        </h2>

        <div className="flex flex-wrap gap-3">
          {softSkills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="text-base text-foreground bg-surface border border-border px-4 py-2 rounded-full hover:border-foreground/20 transition-colors"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </section>
    </div>
  );
}
