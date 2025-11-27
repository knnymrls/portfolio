"use client";

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { springSnappy } from '@/lib/motion';

// Omit conflicting event handlers from ButtonHTMLAttributes
type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

export interface ButtonProps extends ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    children,
    ...props
  }, ref) => {
    const iconSize = {
      sm: 16,
      md: 18,
      lg: 20,
    };

    // Different hover/tap behavior for icon vs regular buttons
    const motionProps = variant === 'icon'
      ? {
          whileHover: { scale: 1.08, y: -2 },
          whileTap: { scale: 0.95 },
          transition: springSnappy,
        }
      : {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: springSnappy,
        };

    return (
      <motion.button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            // Variants
            'bg-foreground text-background hover:bg-opacity-90 rounded-button':
              variant === 'primary',
            'bg-surface text-foreground border border-border hover:bg-gray-50 dark:hover:bg-gray-900 rounded-button':
              variant === 'secondary',
            'border border-border bg-transparent hover:bg-surface rounded-button':
              variant === 'outline',
            'hover:bg-surface/50 rounded-button': variant === 'ghost',
            'bg-surface border border-border hover:bg-gray-50 dark:hover:bg-gray-900 aspect-square rounded-button p-0':
              variant === 'icon',
          },
          {
            // Sizes
            'h-9 px-4 text-sm gap-1.5': size === 'sm' && variant !== 'icon',
            'h-11 px-6 text-base gap-2': size === 'md' && variant !== 'icon',
            'h-12 px-8 text-lg gap-2.5': size === 'lg' && variant !== 'icon',
            'h-9 w-9': size === 'sm' && variant === 'icon',
            'h-11 w-11': size === 'md' && variant === 'icon',
            'h-12 w-12': size === 'lg' && variant === 'icon',
          },
          className
        )}
        ref={ref}
        {...motionProps}
        {...props}
      >
        {Icon && iconPosition === 'left' && variant !== 'icon' && (
          <Icon size={iconSize[size]} />
        )}
        {variant === 'icon' && Icon ? (
          <Icon size={iconSize[size]} />
        ) : (
          children
        )}
        {Icon && iconPosition === 'right' && variant !== 'icon' && (
          <Icon size={iconSize[size]} />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };