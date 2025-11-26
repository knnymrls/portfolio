import React from 'react';

interface CaseStudyTestimonialProps {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

export default function CaseStudyTestimonial({
  quote,
  author,
  role,
}: CaseStudyTestimonialProps) {
  return (
    <div className="my-10 p-8 md:p-10 bg-surface rounded-2xl border border-border">
      <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-foreground mb-6">
        &quot;{quote}&quot;
      </blockquote>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-project-findu/20 flex items-center justify-center text-project-findu font-semibold">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-medium text-foreground">{author}</div>
          {role && <div className="text-sm text-surface-secondary">{role}</div>}
        </div>
      </div>
    </div>
  );
}

