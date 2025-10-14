import React from 'react';

interface CaseStudyCalloutProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning';
  className?: string;
}

export default function CaseStudyCallout({
  children,
  type = 'info',
  className = '',
}: CaseStudyCalloutProps) {
  const styles = {
    info: 'bg-surface border-border',
    success: 'bg-status-active/10 border-status-active',
    warning: 'bg-project-findu/10 border-project-findu',
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${styles[type]} ${className} my-6`}>
      <div className="text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}
