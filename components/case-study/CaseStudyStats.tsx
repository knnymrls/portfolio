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
    <div className="grid grid-cols-3 gap-8 my-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <span className="text-3xl md:text-4xl font-semibold text-foreground block mb-1">
            {stat.value}
          </span>
          <span className="text-sm text-surface-secondary">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

