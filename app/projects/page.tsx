const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform built with Next.js and Stripe integration.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Prisma"],
    link: "#",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Real-time collaborative task management application with drag-and-drop functionality.",
    technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
    link: "#",
  },
  {
    id: 3,
    title: "AI Content Generator",
    description: "An AI-powered content generation tool using OpenAI's GPT API.",
    technologies: ["Next.js", "OpenAI API", "Vercel AI SDK", "MongoDB"],
    link: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white mb-8">
        Projects
      </h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={project.link}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View Project →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}