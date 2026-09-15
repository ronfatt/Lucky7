import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'outline' | 'danger' | 'success' | 'wood' | 'fire' | 'earth' | 'metal' | 'water';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-obsidian-800 text-slate-300 border border-slate-700/50',
    gold: 'bg-gold-500/10 text-gold-champagne border border-gold-500/30',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
    danger: 'bg-red-950/40 text-red-400 border border-red-500/30',
    success: 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30',
    wood: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30',
    fire: 'bg-red-950/60 text-red-300 border border-red-500/30',
    earth: 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
    metal: 'bg-slate-800/60 text-slate-200 border border-slate-400/30',
    water: 'bg-sky-950/60 text-sky-300 border border-sky-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
