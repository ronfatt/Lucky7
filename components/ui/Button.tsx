import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    gold: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-champagne text-obsidian-950 font-semibold shadow-gold-glow hover:brightness-110 active:scale-[0.98]',
    default: 'bg-obsidian-800 text-slate-200 border border-slate-700/60 hover:bg-obsidian-700 active:scale-[0.98]',
    outline: 'bg-transparent text-slate-300 border border-slate-700 hover:border-gold-500/40 hover:text-gold-300 active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5',
    danger: 'bg-red-900/60 text-red-200 border border-red-700/50 hover:bg-red-800/80',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
