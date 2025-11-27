"use client";

import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiOpenai,
  SiLangchain,
  SiTailwindcss,
  SiPostgresql,
  SiFigma,
  SiFramer,
  SiSupabase,
  SiGraphql,
} from "react-icons/si";
import { Brain, Palette } from "lucide-react";
import { ComponentType } from "react";

type IconProps = { className?: string; style?: React.CSSProperties };

const skills: { name: string; icon: ComponentType<IconProps>; color: string }[] = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "currentColor" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "OpenAI", icon: SiOpenai, color: "#10A37F" },
  { name: "LangChain", icon: SiLangchain, color: "#65D9A5" },
  { name: "RAG Systems", icon: Brain, color: "#A855F7" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "UI/UX Design", icon: Palette, color: "#EC4899" },
  { name: "Framer Motion", icon: SiFramer, color: "#0055FF" },
  { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
];

export default function SkillsOverview() {
  return (
    <section className="w-full pb-[108px]" data-highlight-section="skills">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          SKILLS
        </h2>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill, idx) => {
            const Icon = skill.icon;
            return (
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
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface hover:bg-surface/80 cursor-default transition-all duration-200"
              >
                <Icon className="w-4 h-4" style={{ color: skill.color }} />
                <span className="text-base text-foreground/90 hover:text-foreground transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
