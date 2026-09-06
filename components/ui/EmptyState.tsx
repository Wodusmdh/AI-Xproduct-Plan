import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { FolderPlus } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 sm:p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/30',
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
        {icon || <FolderPlus className="size-6" />}
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
      <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction} size="md">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="outline" size="md">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
