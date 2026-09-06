'use client';

import * as React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Calendar, Trash2 } from 'lucide-react';

export interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string, name: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card hoverable className="flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Badge status={project.status} />
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Calendar className="size-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors line-clamp-1">
          {project.name}
        </h4>

        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
        >
          <span>Open Workspace</span>
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(project.id, project.name);
            }}
            className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete project"
            aria-label="Delete project"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
    </Card>
  );
}
