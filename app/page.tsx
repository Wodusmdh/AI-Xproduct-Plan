'use client';

import * as React from 'react';
import Link from 'next/link';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { LandingFooter } from '@/components/layout/LandingFooter';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PLANNER_STAGES } from '@/types/project';
import {
  ArrowRight,
  Code2,
  FileCode2,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Compass,
  Zap,
  Terminal,
  ShieldCheck,
  FolderGit2,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 mb-6">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Phase 1 Architecture Live</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-zinc-500">Spec-Driven AI Development</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-4xl mx-auto leading-[1.15]">
            Transform raw software ideas into{' '}
            <span className="text-zinc-600 dark:text-zinc-400 font-semibold">
              structured development plans
            </span>{' '}
            for AI coding tools.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            AI coding agents like Cursor, Claude Code, and Copilot thrive on context.
            AI Product Planner bridges the gap between high-level ideas and deterministic code generation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/projects/new">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="size-4" />}>
                Create New Project
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Open Workspace Dashboard
              </Button>
            </Link>
          </div>

          {/* Minimalist Visual Preview */}
          <div className="mt-14 mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 text-left">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">pipeline.config.ts</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300">
                Phase 1 Active
              </span>
            </div>

            <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
              <p className="text-zinc-400 dark:text-zinc-500">{"// Step 1: Ingest product problem statement"}</p>
              <p>
                <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                <span className="text-blue-600 dark:text-blue-400">projectIdea</span> = {'"'}
                <span className="text-emerald-700 dark:text-emerald-400">Real-time team standup blocker resolver</span>
                {'"'};
              </p>
              <p className="text-zinc-400 dark:text-zinc-500">{"// Step 2: Deterministic specification decomposition"}</p>
              <p>
                <span className="text-purple-600 dark:text-purple-400">await</span> planner.{' '}
                <span className="text-amber-600 dark:text-amber-400">generatePipeline</span>(projectIdea, {'{'}
              </p>
              <div className="pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-1">
                <p>prd: <span className="text-zinc-500">true</span>, {"// Functional requirements & acceptance criteria"}</p>
                <p>featureSpecs: <span className="text-zinc-500">true</span>, {"// Edge cases & user flow states"}</p>
                <p>techArchitecture: <span className="text-zinc-500">true</span>, {"// Database models & API contracts"}</p>
                <p>agentPrompts: <span className="text-zinc-500">true</span> {"// Ready for Cursor & Claude Code"}</p>
              </div>
              <p>{'}'});</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Explanation Section */}
      <section id="concept" className="py-20 bg-white dark:bg-zinc-900/40 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              The Fundamental Problem
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Why AI Coding Assistants Need Structured Planning
            </h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When developers provide vague prompts to LLMs, code generation quickly diverges into hallucinated architectures, inconsistent states, and broken edge cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-rose-200/70 bg-rose-50/30 dark:border-rose-950/60 dark:bg-rose-950/10">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-sm mb-3">
                <span className="size-2 rounded-full bg-rose-500" />
                <span>The Raw Prompt Approach (Fails on Non-Trivial Apps)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Ambiguous requirements lead to hallucinated database schemas and orphan tables.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Context window waste: Agents rewrite whole files because scope wasn’t pre-divided into discrete tasks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Missed edge cases, error states, and unhandled authentication boundaries.</span>
                </li>
              </ul>
            </Card>

            <Card className="border-emerald-200/70 bg-emerald-50/30 dark:border-emerald-950/60 dark:bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm mb-3">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>The AI Product Planner Approach</span>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Decomposes vague ideas into a rigorous 6-stage specification pipeline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Generates modular, bite-sized tasks tailored for Cursor, Claude Code, and Copilot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                  <span>Keeps product decisions documented, versioned, and reviewable before a single line of code is run.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Explanation Section */}
      <section id="workflow" className="py-20 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Sequential Execution
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              The 7-Stage Product Planning Pipeline
            </h3>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every stage builds upon the previous stage, ensuring comprehensive product rigor without circular rewrites.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {PLANNER_STAGES.map((stage) => (
              <div
                key={stage.id}
                className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold font-mono">
                  0{stage.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {stage.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                        stage.isImplemented
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400'
                      }`}
                    >
                      {stage.phase}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {stage.shortDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Overview Section */}
      <section id="features" className="py-20 bg-white dark:bg-zinc-900/40 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Designed for High-Velocity Software Teams
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-4">
                <FileCode2 className="size-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                Deterministic PRD Generation
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Standardized product requirement documents outlining goals, user stories, constraints, and release acceptance criteria.
              </p>
            </Card>

            <Card>
              <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-4">
                <Terminal className="size-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                AI Coding Prompts Ready
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Copy-pasteable context blocks specifically structured for code generation engines to minimize token drift and hallucinations.
              </p>
            </Card>

            <Card>
              <div className="size-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                Clean Extensible Storage
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Client-side persistence in Phase 1 with a clean asynchronous abstraction layer, ready to scale to cloud persistence in Phase 2.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture & Phase 1 Scope Section */}
      <section id="architecture" className="py-20 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              <FolderGit2 className="size-4 text-zinc-700 dark:text-zinc-300" />
              <span>Implementation Scope Transparency</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Phase 1 Engineering Status
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              We follow a strict incremental build standard. The foundation, project models, local persistence, responsive navigation, and project workspace are complete and operational. The full generative AI engine, payments, and external integrations will be connected in Phase 2.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  <span>Phase 1 (Implemented)</span>
                </div>
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <li>• Landing Page with workflow visualization</li>
                  <li>• Dashboard with project cards & empty states</li>
                  <li>• Create Project flow with validation</li>
                  <li>• Project Overview & Stage Navigator</li>
                  <li>• Local persistence repository abstraction</li>
                  <li>• Fully responsive layout (mobile & desktop)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3.5 dark:border-purple-900/50 dark:bg-purple-950/20">
                <div className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  <span>Phase 2 (Upcoming Engine)</span>
                </div>
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <li>• Real AI PRD generation engine</li>
                  <li>• Feature Specification auto-decomposition</li>
                  <li>• Technical Architecture generator</li>
                  <li>• Task Generator for Jira / Linear</li>
                  <li>• Cursor & Claude Code prompt packager</li>
                  <li>• Cloud persistence (Firestore / Cloud SQL)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900 text-zinc-50 dark:bg-zinc-950 dark:border-t dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Ready to structure your next software product?
          </h3>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Create your first project seed now and explore the structured planning workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/projects/new">
              <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-white dark:text-zinc-900 w-full sm:w-auto">
                Create Project
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="border-zinc-700 text-zinc-100 hover:bg-zinc-800 w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
