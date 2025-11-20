import React from 'react';

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

interface CaseStudyStatsProps {
  stats: StatItem[];
}

export default function CaseStudyStats({ stats }: CaseStudyStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="p-6 rounded-2xl bg-surface border border-border flex flex-col items-center text-center hover:border-surface-secondary/50 transition-colors"
        >
          <span className="text-4xl md:text-5xl font-bold text-foreground mb-2 block">
            {stat.value}
          </span>
          <span className="text-lg font-medium text-foreground mb-2 block">
            {stat.label}
          </span>
          {stat.description && (
            <span className="text-sm text-surface-secondary">
              {stat.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

