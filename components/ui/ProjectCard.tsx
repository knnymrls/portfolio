import Link from "next/link";
import React, { useState } from "react";

export interface ProjectCardProps {
  name: string;
  description: string;
  duration: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  href: any;
  backgroundColor: string;
  logoUrl?: string;
  logoAlt?: string;
  logoClassName?: string;
  customLogo?: React.ReactNode | ((isHovered: boolean) => React.ReactNode);
  customFont?: React.CSSProperties;
  status?: "active" | "coming-soon";
  'data-highlight-id'?: string;
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
  status = "active",
  'data-highlight-id': dataHighlightId,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isComingSoon = status === "coming-soon";

  return (
    <div
      className={`group bg-surface rounded-[20px] border border-border overflow-hidden h-full transition-all duration-300 relative ${
        isComingSoon
          ? "cursor-default opacity-80"
          : "hover:scale-[1.02] hover:shadow-lg hover:border-foreground/20 cursor-pointer"
      }`}
      data-highlight-id={dataHighlightId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isComingSoon && (
        <Link
          href={href}
          className="absolute inset-0 z-30"
          aria-label={`View ${name} project`}
        >
          <span className="sr-only">View {name}</span>
        </Link>
      )}

      <div className="p-5 pb-6 flex flex-col h-full pointer-events-none"> {/* Disable pointer events on content so Link receives them, but check if this affects hover state tracking on parent */}
        {/* Logo Area - Fixed height */}
        <div
          className={`h-[280px] ${backgroundColor} rounded-[20px] overflow-hidden relative z-20 flex items-center justify-center mb-4`}
        >
          {customLogo ? (
            typeof customLogo === 'function' ? customLogo(isHovered) : customLogo
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
              {isComingSoon ? (
                <span className="text-xs font-medium text-surface-secondary bg-surface-secondary/10 px-2 py-1 rounded-full whitespace-nowrap">
                  Coming Soon
                </span>
              ) : (
                <span className="text-base text-surface-secondary font-normal tracking-[0.32px] whitespace-nowrap">
                  {duration}
                </span>
              )}
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
