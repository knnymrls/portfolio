"use client";

import { ProjectCard, ProjectCardProps } from "@/components/ui/ProjectCard";

const imgFrame3 =
  "http://localhost:3845/assets/e4920875de0b8c66a3e07ab29682d2976dbeab06.svg";
const imgVector =
  "http://localhost:3845/assets/4c07fdb2019e63a1964a7782e4ee4f011eb1dcfb.svg";
const imgVector1 =
  "http://localhost:3845/assets/b4d9c789899891637b311b18b2b39771451b9526.svg";
const imgVector2 =
  "http://localhost:3845/assets/277dc8048462d287475705b7ab92ab5869b45d09.svg";

const projects: ProjectCardProps[] = [
  {
    name: "FindU",
    description:
      "Helping GenZ figure out their next steps after graduating high school.",
    duration: "15 min",
    href: "/projects/findu",
    backgroundColor: "bg-project-findu",
    logoUrl: imgFrame3,
    logoClassName: "w-full h-full object-contain",
  },
  {
    name: "mkrs.world",
    description: "The new way communities interact with each other",
    duration: "5 min",
    href: "/projects/mkrs",
    backgroundColor: "bg-project-mkrs",
    customLogo: (
      <img alt="mkrs logo" className="w-auto h-[43px]" src={imgVector} />
    ),
    customFont: { fontFamily: "var(--font-plus-jakarta), sans-serif" },
  },
  {
    name: "Flock",
    description: "Helping teams find an ideal time to meet using AI",
    duration: "5 min",
    href: "/projects/flock",
    backgroundColor: "bg-project-flock",
    logoUrl: imgVector1,
    logoClassName: "w-auto h-[113px]",
  },
  {
    name: "Bloom",
    description:
      "RAG-based search engine to find employees within an enterprise.",
    duration: "15 min",
    href: "/projects/bloom",
    backgroundColor: "bg-project-bloom",
    logoUrl: imgVector2,
    logoClassName: "w-auto h-[71px]",
  },
];

export default function CaseStudies() {
  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-5 w-full">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          CASE STUDIES
        </h2>

        {/* Using CSS Grid with auto-fit for responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
