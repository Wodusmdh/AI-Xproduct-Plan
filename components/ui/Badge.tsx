import * as React from 'react';
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/types/project';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'phase1' | 'phase2';
  status?: ProjectStatus;
}

export function Badge({ className, variant = 'default', status, children, ...props }: BadgeProps) {
  if (status) {
    const statusMap: Record<ProjectStatus, { label: string; className: string }> = {
      draft: {
        label: 'Draft',
        className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
      },
      in_planning: {
        label: 'In Planning',
        className: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      },
      ready_for_dev: {
        label: 'Ready for Dev',
        className: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      },
      archived: {
        label: 'Archived',
        className: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800',
      },
    };

    const config = statusMap[status];

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight whitespace-nowrap',
          config.className,
          className
        )}
        {...props}
      >
        <span className="size-1.5 rounded-full bg-current opacity-70" />
        {children || config.label}
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border-transparent',
    secondary: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-transparent',
    outline: 'border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 bg-transparent',
    phase1: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    phase2: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight whitespace-nowrap',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
