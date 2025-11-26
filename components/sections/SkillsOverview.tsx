"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "React", featured: true },
  { name: "Next.js", featured: true },
  { name: "TypeScript", featured: true },
  { name: "Node.js", featured: false },
  { name: "OpenAI API", featured: true },
  { name: "LangChain", featured: false },
  { name: "RAG Systems", featured: true },
  { name: "Tailwind CSS", featured: false },
  { name: "PostgreSQL", featured: false },
  { name: "Figma", featured: true },
  { name: "UI/UX Design", featured: false },
  { name: "Framer Motion", featured: false },
  { name: "Supabase", featured: false },
  { name: "GraphQL", featured: false },
];

export default function SkillsOverview() {
  return (
    <section className="w-full pb-[108px]" data-highlight-section="skills">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          SKILLS
        </h2>

        {/* Flowing skill tags */}
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255,255,255,0.1)",
              }}
              className={`
                px-4 py-2 rounded-full border border-border
                bg-surface hover:bg-surface/80
                cursor-default transition-all duration-200
                ${skill.featured ? "text-lg md:text-xl" : "text-base"}
              `}
            >
              <span className="text-foreground/90 hover:text-foreground transition-colors">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
