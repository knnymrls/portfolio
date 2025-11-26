"use client";

const skills = [
  { category: "Frontend", items: "React, Next.js, TypeScript, Tailwind" },
  { category: "Backend", items: "Node.js, PostgreSQL, GraphQL, Supabase" },
  { category: "AI/ML", items: "OpenAI, LangChain, RAG, Embeddings" },
  { category: "Design", items: "Figma, UI/UX, Design Systems" },
];

export default function SkillsOverview() {
  return (
    <section className="w-full pb-[108px]" data-highlight-section="skills">
      <div className="flex flex-col gap-8">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          SKILLS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {skills.map((skill) => (
            <div key={skill.category}>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {skill.category}
              </h3>
              <p className="text-sm text-surface-secondary leading-relaxed">
                {skill.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
