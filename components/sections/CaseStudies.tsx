"use client";

import { ProjectCard, ProjectCardProps } from "@/components/ui/ProjectCard";
import { motion, AnimatePresence } from "framer-motion";

const FindULogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* FindU Logo - Always visible */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/images/projects/findu/e4920875de0b8c66a3e07ab29682d2976dbeab06.svg"
          alt="FindU logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Animated phone mockups - only on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* First phone - slides in from top */}
            <motion.div
              initial={{ y: -500, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -500, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute h-[481px] left-[40px] rounded-[20px] top-[-235px] w-[222px]"
            >
              <img
                src="/images/projects/findu-mockup.png"
                alt="FindU app screen 1"
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full"
              />
            </motion.div>

            {/* Second phone - slides in from bottom */}
            <motion.div
              initial={{ y: 500, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 500, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="absolute h-[481px] left-[195px] rounded-[20px] top-[49px] w-[222px]"
            >
              <img
                src="/images/projects/findu-mockup.png"
                alt="FindU app screen 2"
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const MkrsLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* mkrs.world logo - Always visible */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/figma-assets/4c07fdb2019e63a1964a7782e4ee4f011eb1dcfb.svg"
          alt="mkrs.world logo"
          style={{ height: "43px", width: "191px" }}
        />
      </div>

      {/* Animated screenshot - only on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: 500, y: 300, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={{ x: 500, y: 300, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute h-[364px] left-[43px] rounded-[10px] top-[43px] w-[718px]"
          >
            <img
              src="/figma-assets/b71a38e92e14108bca315d23e7e957baf45f95a7.png"
              alt="mkrs.world app screen"
              className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlockLogo = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* Flock logo - Always visible */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/images/projects/flock-logo.svg"
          alt="Flock logo"
          style={{ width: "244px", height: "56px" }}
        />
      </div>

      {/* Coming soon tag */}
      <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1.5 z-20">
        <span className="text-sm font-medium" style={{ color: "#00649D" }}>
          Coming soon
        </span>
      </div>

      {/* Animated iPhone mockup - only on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ y: 500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute h-[546px] left-[99px] top-[21px] w-[252px]"
          >
            <img
              src="/figma-assets/5c8aebd99e4fec9c707a2315057a2b00ed6b1121.png"
              alt="Flock app screen"
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// We modify projects to accept a render prop for customLogo instead of a direct element
// or we can just handle the state in ProjectCard.
// Actually, let's make ProjectCard handle the hover state and pass it down.
// But ProjectCard needs to know WHAT to render.
// Let's change the type of customLogo in ProjectCardProps to accept a function or ReactNode.

const projects: (Omit<ProjectCardProps, "customLogo"> & { customLogo?: React.ReactNode | ((isHovered: boolean) => React.ReactNode) })[] = [
  {
    name: "FindU",
    description:
      "Helping GenZ figure out their next steps after graduating high school.",
    duration: "15 min",
    href: "/projects/findu",
    backgroundColor: "bg-project-findu",
    customLogo: (isHovered: boolean) => <FindULogo isHovered={isHovered} />,
  },
  {
    name: "mkrs.world",
    description: "The new way communities interact with each other",
    duration: "5 min",
    href: "/projects/mkrs",
    backgroundColor: "bg-project-mkrs",
    customLogo: (isHovered: boolean) => <MkrsLogo isHovered={isHovered} />,
    customFont: { fontFamily: "var(--font-plus-jakarta), sans-serif" },
  },
  {
    name: "Flock",
    description: "Helping teams find time to meet using AI",
    duration: "5 min",
    href: "/projects/flock",
    backgroundColor: "bg-project-flock",
    customLogo: (isHovered: boolean) => <FlockLogo isHovered={isHovered} />,
  },
  {
    name: "Bloom",
    description: "AI-powered stock portfolio with dynamic UI and AI insights",
    duration: "15 min",
    href: "/projects/bloom",
    backgroundColor: "bg-project-bloom",
    customLogo: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/projects/bloom-logo.svg"
            alt="Bloom logo"
            style={{ width: "249px", height: "64px" }}
          />
        </div>
        <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1.5">
          <span className="text-sm font-medium" style={{ color: "#007E38" }}>
            Coming soon
          </span>
        </div>
      </div>
    ),
  },
];

export default function CaseStudies() {
  return (
    <section
      className="w-full pb-[108px]"
      data-highlight-section="case-studies"
    >
      <div className="flex flex-col gap-5 w-full">
        <h2
          className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase"
          data-highlight-id="case-studies-title"
        >
          CASE STUDIES
        </h2>

        {/* Using CSS Grid with auto-fit for responsive layout */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          data-highlight-id="projects-grid"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              {...project}
              data-highlight-id={`project-${project.name.toLowerCase()}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
