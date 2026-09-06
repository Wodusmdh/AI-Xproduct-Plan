'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { projectStorage } from '@/lib/storage';
import { ProjectStatus } from '@/types/project';
import {
  ArrowLeft,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const POPULAR_TAGS = [
  'SaaS',
  'Developer Tool',
  'AI Agent',
  'Web App',
  'Mobile App',
  'API & Backend',
  'Indie Hacker',
  'Internal Tool',
];

export default function CreateProjectPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [idea, setIdea] = React.useState('');
  const [targetUsers, setTargetUsers] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>(['SaaS']);
  const [customTag, setCustomTag] = React.useState('');
  const [status, setStatus] = React.useState<ProjectStatus>('in_planning');

  // Validation & UI states
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      const cleaned = customTag.trim();
      if (!selectedTags.includes(cleaned)) {
        setSelectedTags([...selectedTags, cleaned]);
      }
      setCustomTag('');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Short description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Provide a slightly more descriptive summary (min 10 chars)';
    }

    if (!idea.trim()) {
      newErrors.idea = 'Please outline the core problem and idea';
    } else if (idea.trim().length < 25) {
      newErrors.idea = 'Explain the core idea with enough detail for AI planning (min 25 chars)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newProject = await projectStorage.create({
        name,
        description,
        idea,
        targetUsers: targetUsers.trim() || undefined,
        tags: selectedTags,
        status,
      });

      // Redirect directly to the project view
      router.push(`/projects/${newProject.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setErrors({ form: 'An unexpected error occurred while saving. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create New Product Plan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Define the initial premise of your software application. This acts as the root seed for all subsequent specification stages.
          </p>
        </div>

        {errors.form && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <Card>
              <div className="space-y-4">
                <Input
                  id="project-name"
                  label="Project Name"
                  required
                  placeholder="e.g., PulseFlow, DevSync AI, CodeRefactor CLI"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  error={errors.name}
                  helperText="A distinctive, memorable working title for your product or tool."
                />

                <Input
                  id="project-description"
                  label="Short Tagline / Summary"
                  required
                  placeholder="e.g., Automated developer daily standup analyzer and blocker resolver"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  error={errors.description}
                  helperText="One concise sentence explaining what it does."
                />

                <Textarea
                  id="project-idea"
                  label="Core Problem & Solution Concept"
                  required
                  rows={5}
                  showCount
                  maxLength={1500}
                  placeholder="Describe the problem users face and how your software solves it. What is the core user workflow? What are the key constraints or technical requirements?"
                  value={idea}
                  onChange={(e) => {
                    setIdea(e.target.value);
                    if (errors.idea) setErrors({ ...errors, idea: '' });
                  }}
                  error={errors.idea}
                  helperText="Be explicit about pain points. The richer this description, the better the future PRD generation."
                />

                <Input
                  id="target-users"
                  label="Target Users / Persona (Optional)"
                  placeholder="e.g., Full-stack engineers, solo founders, DevOps engineers"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  helperText="Who is the primary operator or customer?"
                />

                {/* Tags selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Category Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                            isSelected
                              ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                <Link href="/dashboard">
                  <Button type="button" variant="outline" size="md">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="md"
                  isLoading={isSubmitting}
                  leftIcon={<CheckCircle2 className="size-4" />}
                >
                  Create Project
                </Button>
              </div>
            </Card>
          </form>

          {/* Helper Guidance Panel (1 col) */}
          <div className="space-y-4">
            <Card className="bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-xs uppercase tracking-wider mb-2">
                <Lightbulb className="size-4 text-amber-500" />
                <span>Tips for Great Seeds</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-zinc-400">•</span>
                  <span><strong>Define the pain point:</strong> Why can{"'"}t users solve this with existing tools?</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-zinc-400">•</span>
                  <span><strong>Mention integrations:</strong> Does it connect to GitHub, Stripe, Discord, or specific APIs?</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-zinc-400">•</span>
                  <span><strong>Keep it focused:</strong> A tight MVP specification yields far better AI agent code generation.</span>
                </li>
              </ul>
            </Card>

            <Card className="border-blue-200/60 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-medium text-xs mb-1.5">
                <Sparkles className="size-3.5" />
                <span>Storage & Privacy Notice</span>
              </div>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                In Phase 1, project data is saved to your browser{"'"}s local storage via a clean repository interface. In Phase 2, this will seamlessly connect to cloud persistence.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
