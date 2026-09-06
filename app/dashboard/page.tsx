'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { projectStorage } from '@/lib/storage';
import { Project, ProjectStatus } from '@/types/project';
import {
  PlusCircle,
  Search,
  RotateCcw,
  FolderOpen,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | ProjectStatus>('all');
  const [projectToDelete, setProjectToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const loadProjects = React.useCallback(async () => {
    try {
      const data = await projectStorage.getAll();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    void projectStorage.getAll().then((data) => {
      if (isMounted) {
        setProjects(data);
        setIsLoading(false);
      }
    });

    const unsubscribe = projectStorage.subscribe(() => {
      void projectStorage.getAll().then((data) => {
        if (isMounted) {
          setProjects(data);
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete.id;
    setProjectToDelete(null);
    // Instant UI update
    setProjects((prev) => prev.filter((p) => p.id !== targetId));
    await projectStorage.delete(targetId);
  };

  const handleLoadSamples = async () => {
    setIsLoading(true);
    try {
      const updated = await projectStorage.loadSampleProjects();
      setProjects(updated);
    } catch (err) {
      console.error('Failed to load sample projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects by search query and status
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.tags && project.tags.some((t) => t.toLowerCase().includes(query)));

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Statistics
  const stats = React.useMemo(() => {
    return {
      total: projects.length,
      inPlanning: projects.filter((p) => p.status === 'in_planning').length,
      ready: projects.filter((p) => p.status === 'ready_for_dev').length,
      drafts: projects.filter((p) => p.status === 'draft').length,
    };
  }, [projects]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome and Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Projects Workspace
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your software concepts and track their progression through the specification pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {projects.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSamples}
                leftIcon={<RotateCcw className="size-3.5" />}
              >
                Load Sample Projects
              </Button>
            )}
            <Link href="/projects/new">
              <Button size="sm" leftIcon={<PlusCircle className="size-3.5" />}>
                Create Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Projects
            </span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              In Planning
            </span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.inPlanning}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Ready for Dev
            </span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.ready}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              Drafts
            </span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {stats.drafts}
            </p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="size-4" />}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { id: 'all', label: 'All Projects' },
                { id: 'in_planning', label: 'In Planning' },
                { id: 'ready_for_dev', label: 'Ready' },
                { id: 'draft', label: 'Drafts' },
                { id: 'archived', label: 'Archived' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === filter.id
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-44 rounded-xl border border-zinc-200 bg-white p-5 animate-pulse dark:border-zinc-800 dark:bg-zinc-900/40"
              />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={(id, name) => setProjectToDelete({ id, name })}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects created yet"
            description="Start by creating your first product concept. We'll help you structure it into a comprehensive development roadmap."
            actionLabel="Create First Project"
            onAction={() => router.push('/projects/new')}
            secondaryActionLabel="Load Sample Projects"
            onSecondaryAction={handleLoadSamples}
            icon={<FolderOpen className="size-6" />}
          />
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/20">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No projects match your current search query or filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setProjectToDelete(null)}
          title="Delete Project"
          description="Are you sure you want to delete this project?"
          maxWidth="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setProjectToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </>
          }
        >
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            This will permanently remove{' '}
            <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {projectToDelete.name}
            </strong>{' '}
            from your local workspace storage. This action cannot be undone.
          </p>
        </Modal>
      )}
    </AppShell>
  );
}
