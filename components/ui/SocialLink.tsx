import { AnchorHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: LucideIcon;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const SocialLink = forwardRef<HTMLAnchorElement, SocialLinkProps>(
  ({ icon: Icon, label, size = 'md', className, ...props }, ref) => {
    const iconSize = {
      sm: 18,
      md: 20,
      lg: 24,
    };

    const containerSize = {
      sm: 'h-9 w-9',
      md: 'h-11 w-11',
      lg: 'h-12 w-12',
    };

    return (
      <a
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-button',
          'bg-surface border border-border',
          'transition-all duration-200',
          'hover:bg-gray-50 dark:hover:bg-gray-900',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          containerSize[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        <Icon size={iconSize[size]} className="text-foreground" />
      </a>
    );
  }
);

SocialLink.displayName = 'SocialLink';

export { SocialLink };