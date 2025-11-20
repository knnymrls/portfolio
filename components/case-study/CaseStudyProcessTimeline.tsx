import React from 'react';

interface Step {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface CaseStudyProcessTimelineProps {
  steps: Step[];
}

export default function CaseStudyProcessTimeline({ steps }: CaseStudyProcessTimelineProps) {
  return (
    <div className="relative my-12 pl-8 border-l-2 border-border space-y-12">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          {/* Timeline dot */}
          <div className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-surface border-2 border-surface-secondary/30 z-10">
            <div className="w-2 h-2 rounded-full bg-project-findu"></div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-foreground">
              {step.title}
            </h3>
            <p className="text-base text-surface-secondary leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

