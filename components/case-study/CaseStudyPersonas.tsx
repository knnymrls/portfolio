import React from 'react';

interface Persona {
  name: string;
  type: string;
  quote: string;
  traits: string[];
  painPoints: string[];
}

interface CaseStudyPersonasProps {
  personas: Persona[];
}

export default function CaseStudyPersonas({ personas }: CaseStudyPersonasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      {personas.map((persona, index) => (
        <div 
          key={index} 
          className="p-6 rounded-2xl bg-surface border border-border flex flex-col h-full"
        >
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-surface-secondary mb-2">
              {persona.type}
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {persona.name}
            </h3>
          </div>

          <blockquote className="text-lg italic text-surface-secondary mb-6 relative">
            &quot;{persona.quote}&quot;
          </blockquote>

          <div className="mt-auto space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Traits</h4>
              <div className="flex flex-wrap gap-2">
                {persona.traits.map((trait, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-surface-secondary/10 rounded text-surface-secondary">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Pain Points</h4>
              <ul className="list-disc list-inside text-sm text-surface-secondary space-y-1">
                {persona.painPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

