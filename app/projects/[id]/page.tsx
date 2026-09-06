'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FutureFeatureModal } from '@/components/projects/FutureFeatureModal';
import { projectStorage } from '@/lib/storage';
import { Project, ProjectStatus, PLANNER_STAGES, PlannerStage } from '@/types/project';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileText,
  Boxes,
  Code2,
  ListTodo,
  Terminal,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeStageId, setActiveStageId] = React.useState<string>('idea');
  const [activeFutureStage, setActiveFutureStage] = React.useState<PlannerStage | null>(null);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editDesc, setEditDesc] = React.useState('');
  const [editIdea, setEditIdea] = React.useState('');
  const [editTargetUsers, setEditTargetUsers] = React.useState('');
  const [editStatus, setEditStatus] = React.useState<ProjectStatus>('draft');
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  // Copy notification
  const [isCopied, setIsCopied] = React.useState(false);

  const loadProject = React.useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await projectStorage.getById(projectId);
      if (data) {
        setProject(data);
        setEditName(data.name);
        setEditDesc(data.description);
        setEditIdea(data.idea);
        setEditTargetUsers(data.targetUsers || '');
        setEditStatus(data.status);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  React.useEffect(() => {
    let isMounted = true;
    if (projectId) {
      void projectStorage.getById(projectId).then((data) => {
        if (isMounted) {
          if (data) {
            setProject(data);
            setEditName(data.name);
            setEditDesc(data.description);
            setEditIdea(data.idea);
            setEditTargetUsers(data.targetUsers || '');
            setEditStatus(data.status);
          }
          setIsLoading(false);
        }
      });
    }

    const unsubscribe = projectStorage.subscribe(() => {
      if (projectId) {
        void projectStorage.getById(projectId).then((data) => {
          if (isMounted && data) {
            setProject(data);
          }
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [projectId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setIsSaving(true);
    try {
      await projectStorage.update(project.id, {
        name: editName,
        description: editDesc,
        idea: editIdea,
        targetUsers: editTargetUsers,
        status: editStatus,
      });
      setIsEditOpen(false);
      loadProject();
    } catch (err) {
      console.error('Failed to update project:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    await projectStorage.delete(project.id);
    router.push('/dashboard');
  };

  const handleExportJSON = () => {
    if (!project) return;
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySpec = () => {
    if (!project) return;
    const formatted = `# ${project.name}
**Tagline:** ${project.description}
**Status:** ${project.status}
**Target Users:** ${project.targetUsers || 'Not specified'}

## Core Problem & Concept
${project.idea}
`;
    navigator.clipboard.writeText(formatted);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-4 animate-pulse max-w-5xl mx-auto">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <div className="size-12 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Project Not Found</h2>
          <p className="text-xs text-zinc-500">
            The requested project does not exist in your local storage or may have been deleted.
          </p>
          <Link href="/dashboard">
            <Button size="sm">Return to Dashboard</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top bar breadcrumb & quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySpec}
              leftIcon={isCopied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            >
              {isCopied ? 'Copied' : 'Copy Summary'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              leftIcon={<Download className="size-3.5" />}
            >
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              leftIcon={<Edit3 className="size-3.5" />}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              leftIcon={<Trash2 className="size-3.5" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Project Header Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge status={project.status} />
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {project.name}
              </h1>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-zinc-400 space-y-1 shrink-0 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pipeline Stages Navigation Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Specification & Planning Pipeline
            </h2>
            <span className="text-xs text-zinc-400">Phase 1 Active • Stage 1 of 7 Available</span>
          </div>

          {/* Horizontal stage strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {PLANNER_STAGES.map((stage) => {
              const isActive = activeStageId === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    if (stage.isImplemented) {
                      setActiveStageId(stage.id);
                    } else {
                      setActiveFutureStage(stage);
                    }
                  }}
                  className={`flex flex-col justify-between p-3 rounded-lg border text-left transition-all ${
                    isActive
                      ? 'border-zinc-900 bg-white dark:border-zinc-100 dark:bg-zinc-900 shadow-xs'
                      : stage.isImplemented
                      ? 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50'
                      : 'border-zinc-200/60 bg-zinc-100/50 text-zinc-400 hover:border-zinc-300 dark:border-zinc-800/60 dark:bg-zinc-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={isActive ? 'font-bold text-zinc-900 dark:text-zinc-100' : ''}>
                      0{stage.number}
                    </span>
                    {stage.isImplemented ? (
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                    ) : (
                      <span className="text-[9px] text-zinc-400 uppercase">P2</span>
                    )}
                  </div>

                  <span className={`mt-2 text-xs font-medium line-clamp-2 leading-tight ${
                    isActive ? 'text-zinc-900 dark:text-zinc-100' : stage.isImplemented ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'
                  }`}>
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Content Area */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                  Stage 01 • Active In Phase 1
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  Project Overview & Problem Statement
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                leftIcon={<Edit3 className="size-3.5" />}
              >
                Edit Details
              </Button>
            </div>

            {/* Problem & Solution Breakdown */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                  Core Problem & Solution Concept
                </h4>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50/70 p-4 text-xs sm:text-sm text-zinc-700 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {project.idea}
                </div>
              </div>

              {project.targetUsers && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Target Users / Audience
                  </h4>
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/70 p-3 text-xs sm:text-sm text-zinc-700 dark:border-zinc-800/60 dark:bg-zinc-900/40 dark:text-zinc-300">
                    {project.targetUsers}
                  </div>
                </div>
              )}
            </div>

            {/* Next Stage Teaser */}
            <div className="rounded-xl border border-purple-200/80 bg-purple-50/60 p-5 dark:border-purple-900/60 dark:bg-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-semibold text-xs sm:text-sm">
                  <Sparkles className="size-4" />
                  <span>Next Milestone: Stage 02 (PRD Generation Engine)</span>
                </div>
                <p className="text-xs text-purple-800/80 dark:text-purple-300/80 leading-relaxed max-w-xl">
                  In Phase 2, this project definition will feed directly into the Gemini-powered PRD generator to build full functional specs, user stories, and acceptance tests.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="border-purple-300 text-purple-900 hover:bg-purple-100 dark:border-purple-800 dark:text-purple-200 dark:hover:bg-purple-900/50 shrink-0"
                onClick={() =>
                  setActiveFutureStage(
                    PLANNER_STAGES.find((s) => s.id === 'prd') || null
                  )
                }
              >
                Preview Stage 2 Scope
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Project Details"
        description="Update the fundamental parameters of this project."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              isLoading={isSaving}
              onClick={handleUpdate}
              leftIcon={<Check className="size-4" />}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Project Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <Input
            label="Tagline / Short Summary"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            required
          />

          <Textarea
            label="Core Problem & Solution"
            rows={5}
            value={editIdea}
            onChange={(e) => setEditIdea(e.target.value)}
            required
          />

          <Input
            label="Target Users"
            value={editTargetUsers}
            onChange={(e) => setEditTargetUsers(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Project Status
            </label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="draft">Draft</option>
              <option value="in_planning">In Planning</option>
              <option value="ready_for_dev">Ready for Dev</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Project"
        description="Are you sure you want to delete this project?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete Project
            </Button>
          </>
        }
      >
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          This will permanently remove <strong>{project.name}</strong> from your local storage.
        </p>
      </Modal>

      {/* Future Feature Modal */}
      {activeFutureStage && (
        <FutureFeatureModal
          isOpen={true}
          featureName={activeFutureStage.title}
          description={activeFutureStage.shortDesc}
          onClose={() => setActiveFutureStage(null)}
        />
      )}
    </AppShell>
  );
}
