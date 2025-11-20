import React from 'react';
import Image from 'next/image';

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
  avatarUrl 
}: CaseStudyTestimonialProps) {
  return (
    <div className="my-12 bg-surface p-8 md:p-10 rounded-3xl border border-border relative overflow-hidden">
      {/* Decorative quote mark */}
      <div className="absolute top-4 right-8 text-[120px] leading-none font-serif text-border/40 pointer-events-none select-none">
        &quot;
      </div>
      
      <blockquote className="relative z-10 text-xl md:text-2xl font-medium leading-relaxed text-foreground mb-8">
        &quot;{quote}&quot;
      </blockquote>
      
      <div className="flex items-center gap-4 relative z-10">
        {avatarUrl ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-secondary/10">
            <Image 
              src={avatarUrl} 
              alt={author}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-project-findu/10 flex items-center justify-center text-project-findu font-bold text-lg">
            {author.charAt(0)}
          </div>
        )}
        
        <div>
          <div className="font-bold text-foreground">{author}</div>
          {role && (
            <div className="text-sm text-surface-secondary">{role}</div>
          )}
        </div>
      </div>
    </div>
  );
}

