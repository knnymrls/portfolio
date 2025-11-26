import React from 'react';
import TableOfContents from './TableOfContents';

interface CaseStudyLayoutProps {
  children: React.ReactNode;
}

export default function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
  return (
    <>
      <TableOfContents />
      <div className="max-w-[1000px] mx-auto px-4 pb-24">
        <article className="max-w-none">
          {children}
        </article>
      </div>
    </>
  );
}
