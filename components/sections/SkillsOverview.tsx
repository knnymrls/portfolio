"use client";

const skills = {
  "Languages": ["TypeScript", "JavaScript", "Python", "SQL"],
  "Frontend": ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  "Backend": ["Node.js", "PostgreSQL", "GraphQL", "REST APIs"],
  "AI/ML": ["OpenAI API", "LangChain", "RAG Systems", "Prompt Engineering"],
  "Design": ["Figma", "UI/UX", "Design Systems", "Prototyping"],
};

export default function SkillsOverview() {
  return (
    <section className="w-full pb-[108px]" data-highlight-section="skills">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          SKILLS
        </h2>

        <div className="space-y-6">
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category} data-highlight-id={`skill-${category.toLowerCase()}`}>
              <h3 className="text-sm text-surface-secondary mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm text-foreground bg-surface border border-border px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
