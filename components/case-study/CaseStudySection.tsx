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
  return (
    <section className={`mb-12 ${className}`}>
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
