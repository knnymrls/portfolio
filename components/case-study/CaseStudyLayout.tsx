import React from 'react';

interface CaseStudyLayoutProps {
  children: React.ReactNode;
}

export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-12">
      <article className="prose prose-lg max-w-none">
        {children}
      </article>
    </div>
  );
}
