"use client";

// Import the image assets from the Figma design
const imgFindULogo =
  "http://localhost:3845/assets/0d287b1ddbb976e04e2e2371d152126f4c30f8a1.svg";
const imgFrame170 =
  "http://localhost:3845/assets/e271bd235a8c2c6de838d09fa90a6005a0092860.svg";
const imgVector =
  "http://localhost:3845/assets/f793e65874fb2858a3edf45439bf525d3d71793f.svg";
const imgVector1 =
  "http://localhost:3845/assets/7bd9f54cfd64d8c8c40026dbd7a03342ce9e1c69.svg";
const imgImage6 =
  "http://localhost:3845/assets/098dda3e73c8bb1dc322f64412bc252d4fbca4d4.png";
const imgImage8 =
  "http://localhost:3845/assets/841b1888d4679de4fed4eb7e59127475cbb5dcfe.png";
const imgImage9 =
  "http://localhost:3845/assets/50625161ec76d4b80b18aa037a5576decb98163a.png";
const imgImage11 =
  "http://localhost:3845/assets/73d089e8ff68b0f570f308fd10e13ee8aebc16f2.png";

const ventures = [
  {
    name: "FindU",
    role: "Co-founder",
    dateRange: "Jan 25' - Present",
    description:
      "I helped build and grow our startup to a 2.5M Valuation in a year.",
    backgroundColor: "bg-[#ff5d5d]",
    logoUrl: imgFindULogo,
    logoClassName: "w-[111px] h-[33px]",
  },
  {
    name: "Mkrs.",
    role: "Co-founder",
    dateRange: "Jun 25' - Present",
    description: "Working on a software consulting agency with a focus on AI.",
    backgroundColor: "bg-[#2b2b2b]",
    customLogo: (
      <div className="font-['P22_Mackinac_Pro:Medium',_sans-serif] text-[36px] text-center text-white">
        mkrs.
      </div>
    ),
  },
  {
    name: "Creators",
    role: "Co-founder",
    dateRange: "Oct 24' - May 25'",
    description: "Start a club to help freshman at my school learn to code.",
    backgroundColor: "bg-[#92e28a]",
    logoUrl: imgFrame170,
    logoClassName: "w-[92.716px] h-[81.519px]",
  },
  {
    name: "Nebraska Startup Academy",
    role: "Member",
    dateRange: "Jan 24' - Present",
    description: "Joined our state startup program that offers membership.",
    backgroundColor: "bg-[#2c4437]",
    logoUrl: imgImage6,
    logoClassName: "w-[121px] h-[121px]",
  },
  {
    name: "Undergraduate Research",
    role: "Student",
    dateRange: "Aug 24' - May 25'",
    description:
      "Researched loneliness and received an award for the best research.",
    backgroundColor: "bg-[#dd0000]",
    logoUrl: imgVector,
    logoClassName: "w-[77px] h-[103px]",
  },
  {
    name: "Entrepreneurship Accelerator",
    role: "Member",
    dateRange: "Aug 25' - Present",
    description:
      "Joined a select group of 30 students around campus with their own business.",
    backgroundColor: "bg-neutral-100",
    logoUrl: imgImage11,
    logoClassName: "w-[146px] h-[102px]",
  },
  {
    name: "Teacher's Assistant",
    role: "Student",
    dateRange: "Jan 24' - Present",
    description:
      "TA'd for a classes teaching innovation where students build a startup from start to MVP.",
    backgroundColor: "bg-[#f7f7f7]",
    logoUrl: imgImage9,
    logoClassName: "w-[93px] h-[93px]",
  },
  {
    name: "Mkrs.world",
    role: "Founder",
    dateRange: "Jan 24' - Present",
    description:
      "Built a platform for students to connect and create collusions between the various colleges on campus",
    backgroundColor: "bg-[#222222]",
    logoUrl: imgVector1,
    logoClassName: "w-[133px] h-[30px]",
  },
  {
    name: "G.R.I.T Robotics",
    role: "Co-founder",
    dateRange: "Jan 24' - Present",
    description:
      "Created a robotics club for underserved middle school students that is still standing today.",
    backgroundColor: "bg-[#9d84bc]",
    logoUrl: imgImage8,
    logoClassName: "w-[78px] h-[76px]",
  },
];

export default function VenturesGrid() {
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
              className="bg-surface rounded-[20px] border border-border overflow-hidden h-full"
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
                  <h3 className="text-base font-medium text-foreground">
                    {venture.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed">
                    {venture.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
