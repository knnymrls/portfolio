import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VentureCardProps {
  name: string;
  description: string;
  role: string;
  year: string;
  status: 'active' | 'exited' | 'archived';
  href: string;
  logo?: string;
  className?: string;
}

const statusStyles = {
  active: 'bg-status-active/20 text-status-active',
  exited: 'bg-status-exited/20 text-status-exited',
  archived: 'bg-status-archived/20 text-status-archived',
};

const statusLabels = {
  active: 'Active',
  exited: 'Exited',
  archived: 'Archived',
};

export function VentureCard({
  name,
  description,
  role,
  year,
  status,
  href,
  logo,
  className,
}: VentureCardProps) {
  return (
    <div className={cn(
      "bg-surface rounded-[20px] border border-border overflow-hidden h-[320px] group relative",
      className
    )}>
      <Link href={href} className="absolute inset-0 z-10" aria-label={`View ${name} details`}>
        <span className="sr-only">View {name}</span>
      </Link>
      
      <div className="p-6 flex flex-col h-full">
        {/* Header with logo and status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {logo && (
              <div className="w-12 h-12 rounded-[12px] bg-surface-secondary/10 flex items-center justify-center overflow-hidden">
                <img src={logo} alt={`${name} logo`} className="w-8 h-8 object-contain" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium text-foreground mb-1">{name}</h3>
              <p className="text-sm text-surface-secondary">{year}</p>
            </div>
          </div>
          <span className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            statusStyles[status]
          )}>
            {statusLabels[status]}
          </span>
        </div>

        {/* Description */}
        <p className="text-base text-foreground leading-relaxed mb-4 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-surface-secondary">
            {role}
          </span>
          <div className="relative z-20">
            <div className="bg-surface rounded-[12px] border border-border p-2.5 flex items-center justify-center group-hover:bg-border/20 transition-colors">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}