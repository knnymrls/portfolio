import React from 'react';

interface CaseStudySectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function CaseStudySection({
  title,
  children,
  className = '',
}: CaseStudySectionProps) {
  // Generate a slug from the title for deep linking
  const id = title 
    ? title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') 
    : undefined;

  // Main sections (with title) get more top spacing to separate from previous content
  const sectionSpacing = title ? 'mt-20 mb-8' : 'mb-8';

  return (
    <section id={id} className={`${sectionSpacing} ${className} scroll-mt-24`}>
      {title && (
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase mb-8">
          {title}
        </h2>
      )}
      <div className="text-base leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}
