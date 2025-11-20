"use client";

import { useState } from "react";
import VentureModal from "@/components/ui/VentureModal";

// Import the image assets from the Figma design
const imgFindULogo = "/figma-assets/0d287b1ddbb976e04e2e2371d152126f4c30f8a1.svg";
const imgMkrs = "/figma-assets/c0fc9236599dbf1af7c99963111b15e84f10abce.svg";
const imgFrame170 = "/figma-assets/e271bd235a8c2c6de838d09fa90a6005a0092860.svg";
const imgVector = "/figma-assets/f793e65874fb2858a3edf45439bf525d3d71793f.svg";
const imgVector1 = "/figma-assets/7bd9f54cfd64d8c8c40026dbd7a03342ce9e1c69.svg";
const imgImage6 = "/figma-assets/098dda3e73c8bb1dc322f64412bc252d4fbca4d4.png";
const imgImage8 = "/figma-assets/841b1888d4679de4fed4eb7e59127475cbb5dcfe.png";
const imgImage9 = "/figma-assets/50625161ec76d4b80b18aa037a5576decb98163a.png";
const imgImage11 = "/figma-assets/73d089e8ff68b0f570f308fd10e13ee8aebc16f2.png";

interface Venture {
  name: string;
  role: string;
  dateRange: string;
  description: string;
  longDescription?: string;
  backgroundColor: string;
  logoUrl?: string;
  logoClassName?: string;
  customLogo?: React.ReactNode;
  technologies?: string[];
  websiteUrl?: string;
}

const ventures: Venture[] = [
  {
    name: "FindU",
    role: "Co-founder",
    dateRange: "Jan 25' - Present",
    description: "I helped build and grow our startup to a 2.5M Valuation in a year.",
    longDescription: "FindU is a platform designed to help Generation Z students navigate the critical transition from high school to their next life chapter. We leverage AI and personalized assessments to provide tailored recommendations and guidance.",
    backgroundColor: "bg-[#ff5d5d]",
    logoUrl: imgFindULogo,
    logoClassName: "w-[111px] h-[33px]",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL"],
    websiteUrl: "https://findu.app"
  },
  {
    name: "Mkrs.",
    role: "Co-founder",
    dateRange: "Jun 25' - Present",
    description: "Working on a software consulting agency with a focus on AI.",
    longDescription: "Mkrs. is a boutique software consultancy specializing in building high-performance AI applications for startups and enterprise clients.",
    backgroundColor: "bg-[#2b2b2b]",
    logoUrl: imgMkrs,
    logoClassName: "w-[94px] h-[27px]",
    technologies: ["React", "Python", "Machine Learning", "Cloud Infrastructure"],
  },
  {
    name: "Creators",
    role: "Co-founder",
    dateRange: "Oct 24' - May 25'",
    description: "Start a club to help freshman at my school learn to code.",
    longDescription: "Creators is a student organization dedicated to empowering freshmen with coding skills through workshops, hackathons, and mentorship programs.",
    backgroundColor: "bg-[#92e28a]",
    logoUrl: imgFrame170,
    logoClassName: "w-[92.716px] h-[81.519px]",
    technologies: ["Education", "Community Building", "Mentorship"],
  },
  {
    name: "Nebraska Startup Academy",
    role: "Member",
    dateRange: "Jan 24' - Present",
    description: "Joined our state startup program that offers membership.",
    backgroundColor: "bg-[#2c4437]",
    logoUrl: imgImage6,
    logoClassName: "w-[121px] h-[121px]",
    technologies: ["Entrepreneurship", "Networking", "Business Development"],
  },
  {
    name: "Undergraduate Research",
    role: "Student",
    dateRange: "Aug 24' - May 25'",
    description: "Researched loneliness and received an award for the best research.",
    backgroundColor: "bg-[#dd0000]",
    logoUrl: imgVector,
    logoClassName: "w-[77px] h-[103px]",
    technologies: ["Data Analysis", "Psychology", "Research Methods"],
  },
  {
    name: "Entrepreneurship Accelerator",
    role: "Member",
    dateRange: "Aug 25' - Present",
    description: "Joined a select group of 30 students around campus with their own business.",
    backgroundColor: "bg-neutral-100",
    logoUrl: imgImage11,
    logoClassName: "w-[146px] h-[102px]",
    technologies: ["Lean Startup", "Customer Discovery", "Product Strategy"],
  },
  {
    name: "Teacher's Assistant",
    role: "Student",
    dateRange: "Jan 24' - Present",
    description: "TA'd for a classes teaching innovation where students build a startup from start to MVP.",
    backgroundColor: "bg-[#f7f7f7]",
    logoUrl: imgImage9,
    logoClassName: "w-[93px] h-[93px]",
    technologies: ["Teaching", "Product Management", "Agile Methodology"],
  },
  {
    name: "Mkrs.world",
    role: "Founder",
    dateRange: "Jan 24' - Present",
    description: "Built a platform for students to connect and create collusions between the various colleges on campus",
    backgroundColor: "bg-[#222222]",
    logoUrl: imgVector1,
    logoClassName: "w-[133px] h-[30px]",
    technologies: ["Social Graph", "React Native", "Node.js"],
  },
  {
    name: "G.R.I.T Robotics",
    role: "Co-founder",
    dateRange: "Jan 24' - Present",
    description: "Created a robotics club for underserved middle school students that is still standing today.",
    backgroundColor: "bg-[#9d84bc]",
    logoUrl: imgImage8,
    logoClassName: "w-[78px] h-[76px]",
    technologies: ["Robotics", "STEM Education", "Grant Writing"],
  },
];

export default function VenturesGrid() {
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVentureClick = (venture: Venture) => {
    setSelectedVenture(venture);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          VENTURES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ventures.map((venture, index) => (
            <div
              key={index}
              className="bg-surface rounded-[20px] border border-border overflow-hidden h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              onClick={() => handleVentureClick(venture)}
            >
              <div className="p-5 pb-6 flex flex-col h-full">
                {/* Logo Area */}
                <div
                  className={`h-[189px] ${venture.backgroundColor} rounded-[20px] overflow-hidden relative flex items-center justify-center mb-4`}
                >
                  {venture.customLogo ? (
                    venture.customLogo
                  ) : venture.logoUrl ? (
                    <img
                      src={venture.logoUrl}
                      alt={`${venture.name} logo`}
                      className={`${venture.logoClassName} object-contain`}
                    />
                  ) : null}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  {/* Role and Date */}
                  <div className="flex items-start justify-between text-sm text-surface-secondary">
                    <span>{venture.role}</span>
                    <span className="whitespace-nowrap">
                      {venture.dateRange}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {venture.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                    {venture.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VentureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        venture={selectedVenture} 
      />
    </section>
  );
}
