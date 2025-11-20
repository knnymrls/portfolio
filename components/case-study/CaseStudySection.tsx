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

  return (
    <section id={id} className={`mb-12 ${className} scroll-mt-24`}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
          {title}
        </h2>
      )}
      <div className="text-base leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}
