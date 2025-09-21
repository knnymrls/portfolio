const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React Query"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "NestJS", "GraphQL", "REST APIs", "WebSockets"],
  },
  {
    title: "Database",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "TypeORM", "SQL"],
  },
  {
    title: "DevOps & Tools",
    skills: ["Docker", "AWS", "CI/CD", "Git", "Vercel", "Linux"],
  },
];

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white mb-8">
        Skills
      </h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {skillCategories.map((category) => (
          <div key={category.title} className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}