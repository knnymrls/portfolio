import React from 'react';

interface CaseStudyHeroProps {
  title: string;
  description: string;
  backgroundColor: string;
  logoUrl?: string;
  customLogo?: React.ReactNode;
  duration?: string;
  role?: string;
  timeline?: string;
  tags?: string[];
}

export default function CaseStudyHero({
  title,
  description,
  backgroundColor,
  logoUrl,
  customLogo,
  duration,
  role,
  timeline,
  tags,
}: CaseStudyHeroProps) {
  return (
    <div className="mb-16">
      {/* Logo/Brand Section */}
      <div className={`${backgroundColor} rounded-2xl p-12 flex items-center justify-center mb-8`} style={{ minHeight: '300px' }}>
        {customLogo || (logoUrl && (
          <img src={logoUrl} alt={`${title} logo`} className="w-auto max-h-[200px]" />
        ))}
      </div>

      {/* Title and Description */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{title}</h1>
        <p className="text-xl text-surface-secondary">{description}</p>
      </div>

      {/* Meta Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border">
        {duration && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Read Time</div>
            <div className="text-base font-medium">{duration}</div>
          </div>
        )}
        {role && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Role</div>
            <div className="text-base font-medium">{role}</div>
          </div>
        )}
        {timeline && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Timeline</div>
            <div className="text-base font-medium">{timeline}</div>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div>
            <div className="text-sm text-surface-secondary uppercase tracking-wider mb-1">Tags</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
