import Link from "next/link";

export interface ProjectCardProps {
  name: string;
  description: string;
  duration: string;
  href: string;
  backgroundColor: string;
  logoUrl?: string;
  logoAlt?: string;
  logoClassName?: string;
  customLogo?: React.ReactNode;
  customFont?: React.CSSProperties;
}

export function ProjectCard({
  name,
  description,
  duration,
  href,
  backgroundColor,
  logoUrl,
  logoAlt,
  logoClassName,
  customLogo,
  customFont,
}: ProjectCardProps) {
  return (
    <div className="group bg-surface rounded-[20px] border border-border overflow-hidden h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-foreground/20 cursor-pointer relative">
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`View ${name} project`}
      >
        <span className="sr-only">View {name}</span>
      </Link>

      <div className="p-5 pb-6 flex flex-col h-full">
        {/* Logo Area - Fixed height */}
        <div
          className={`h-[280px] ${backgroundColor} rounded-[20px] overflow-hidden relative flex items-center justify-center mb-4`}
        >
          {customLogo ? (
            customLogo
          ) : logoUrl ? (
            <img
              alt={logoAlt || `${name} logo`}
              className={
                logoClassName ||
                "w-auto h-auto max-h-full max-w-full object-contain"
              }
              src={logoUrl}
            />
          ) : null}
        </div>

        {/* Content Area - Flexible height */}
        <div className="flex flex-col flex-1">
          {/* Header with time and link button */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3
              className="text-base text-foreground font-normal tracking-[0.32px]"
              style={customFont}
            >
              {name}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-base text-surface-secondary font-normal tracking-[0.32px] whitespace-nowrap">
                {duration}
              </span>
            </div>
          </div>

          {/* Description - Takes remaining space */}
          <p className="text-xl text-foreground font-medium tracking-[0.4px] leading-[1.4] flex-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
