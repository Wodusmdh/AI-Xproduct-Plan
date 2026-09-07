'use client';

import * as React from 'react';
import { Project, ProjectPRD } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  MinusCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  Target,
  FileText,
  Workflow,
  Zap,
  ShieldAlert,
  Gauge,
  Calendar,
  Layers,
  HelpCircle,
  ChevronRight,
  Flame,
} from 'lucide-react';

export interface ProjectPRDPanelProps {
  project: Project;
  onPRDUpdated: (updatedPRD: ProjectPRD) => void;
  onNavigateToAnalysis?: () => void;
}

export function ProjectPRDPanel({
  project,
  onPRDUpdated,
  onNavigateToAnalysis,
}: ProjectPRDPanelProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const prd = project.prd;
  const analysis = project.analysis;

  const handleGenerate = async () => {
    if (isGenerating) return; // Prevent duplicate requests
    if (!analysis) {
      setErrorMessage('Project Analysis is required before generating the PRD.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/prd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            name: project.name,
            description: project.description,
            idea: project.idea,
            targetUsers: project.targetUsers,
            tags: project.tags,
          },
          analysis: analysis,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `PRD generation failed with HTTP status ${response.status}`);
      }

      if (!data.prd) {
        throw new Error('Server returned an empty PRD payload.');
      }

      onPRDUpdated(data.prd as ProjectPRD);
      setErrorMessage(null);
    } catch (err: unknown) {
      console.error('Failed to generate PRD:', err);
      const userMsg =
        err instanceof Error
          ? err.message
          : 'Failed to generate PRD. Please check your internet connection and API key.';
      setErrorMessage(userMsg);
      // Preserves existing PRD intact on failure
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPRD = () => {
    if (!prd) return;

    const markdown = `# ${prd.overview.productName} - Product Requirements Document (PRD)
Generated: ${new Date(prd.generatedAt).toLocaleString()}

## 1. Overview
- **Product Name**: ${prd.overview.productName}
- **Executive Summary**: ${prd.overview.summary}
- **Problem Statement**: ${prd.overview.problemStatement}
- **Proposed Solution**: ${prd.overview.proposedSolution}

## 2. Strategic Goals & Non-Goals
### Goals
${prd.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

### Non-Goals
${prd.nonGoals.map((ng, i) => `${i + 1}. ${ng}`).join('\n')}

## 3. Target Users & Needs
### Primary Users
${prd.targetUsers.primary.map((u) => `- ${u}`).join('\n')}

### Secondary Users
${prd.targetUsers.secondary.map((u) => `- ${u}`).join('\n')}

### Core User Needs
${prd.userNeeds.map((n, i) => `${i + 1}. ${n}`).join('\n')}

## 4. User Stories
${prd.userStories
  .map(
    (us) => `### ${us.id}: ${us.title}
- **As a**: ${us.asA}
- **I want to**: ${us.iWant}
- **So that**: ${us.soThat}`
  )
  .join('\n\n')}

## 5. Functional Requirements
${prd.functionalRequirements
  .map(
    (fr) => `### [${fr.priority.toUpperCase()}] ${fr.id}: ${fr.title}
${fr.description}`
  )
  .join('\n\n')}

## 6. Non-Functional Requirements
${prd.nonFunctionalRequirements
  .map((nfr) => `- **${nfr.id} (${nfr.category})**: ${nfr.requirement}`)
  .join('\n')}

## 7. Constraints & Assumptions
### Constraints
${prd.constraints.map((c) => `- ${c}`).join('\n')}

### Assumptions
${prd.assumptions.map((a) => `- ${a}`).join('\n')}

## 8. Success Metrics
${prd.successMetrics
  .map(
    (sm) => `### ${sm.metric}
- **Target**: ${sm.target}
- **Measurement**: ${sm.measurement}`
  )
  .join('\n\n')}

## 9. Risks & Mitigations
${prd.risks
  .map(
    (r, i) => `### ${i + 1}. ${r.title}
- **Impact**: ${r.description}
- **Mitigation**: ${r.mitigation}`
  )
  .join('\n\n')}
`;

    navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50">
            <Flame className="size-3" />
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-800 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50">
            Medium Priority
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
            Low Priority
          </span>
        );
    }
  };

  // State 1: Project Analysis is missing
  if (!analysis) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="mx-auto size-12 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Project Analysis Required
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Project Analysis is required before generating the PRD. Stage 02 decomposes your problem,
            verifies feasibility, and establishes the MVP boundaries needed to produce engineering-grade requirements.
          </p>
        </div>
        <div>
          <Button
            size="sm"
            onClick={onNavigateToAnalysis}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            leftIcon={<Sparkles className="size-3.5" />}
          >
            Go to Stage 02 Analysis
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Action Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-purple-600 dark:text-purple-400 uppercase">
                Stage 03 • Phase 3 Active
              </span>
              {prd && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                  <CheckCircle2 className="size-3" />
                  PRD Generated
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              AI Product Requirements
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Transform verified project analysis into engineering-ready specifications: user journeys,
              functional & non-functional requirements, acceptance metrics, and workflow traceability.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {prd && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPRD}
                leftIcon={isCopied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              >
                {isCopied ? 'Copied Full PRD' : 'Copy PRD'}
              </Button>
            )}

            <Button
              size="sm"
              isLoading={isGenerating}
              disabled={isGenerating}
              onClick={handleGenerate}
              leftIcon={
                prd ? (
                  <RefreshCw className={`size-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                ) : (
                  <Sparkles className="size-3.5" />
                )
              }
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              {isGenerating ? 'Generating PRD...' : prd ? 'Regenerate PRD' : 'Generate PRD'}
            </Button>
          </div>
        </div>

        {/* Loading state indicator */}
        {isGenerating && (
          <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="size-4 shrink-0 rounded-full border-2 border-purple-600 border-t-transparent animate-spin dark:border-purple-400" />
                <div className="text-xs sm:text-sm text-purple-900 dark:text-purple-300">
                  <span className="font-semibold">Gemini 3.8 Flash is authoring engineering PRD...</span>
                  <p className="text-xs text-purple-700/80 dark:text-purple-300/70 mt-0.5">
                    Structuring user stories, formalizing functional requirements, defining performance non-functionals, and mapping end-to-end outcome workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 text-xs sm:text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <span className="font-semibold">PRD Generation Failed: </span>
                  <span>{errorMessage}</span>
                  {prd && (
                    <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1">
                      Your previous PRD has been preserved intact.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* State 2: No PRD generated yet */}
      {!prd && !isGenerating && (
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="mx-auto size-12 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <FileText className="size-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Ready to Generate PRD
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stage 02 Analysis is complete. Click below to generate the structured Product Requirements Document,
              including user stories, functional requirements, and outcome workflow.
            </p>
          </div>
          <div>
            <Button
              size="sm"
              onClick={handleGenerate}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              leftIcon={<Sparkles className="size-3.5" />}
            >
              Generate PRD
            </Button>
          </div>
        </Card>
      )}

      {/* State 3: Display PRD Content & Workflow */}
      {prd && (
        <div className="space-y-8">
          {/* ========================================================= */}
          {/* PRD WORKFLOW VISUALIZATION (REQUIRED SECTION)             */}
          {/* ========================================================= */}
          <Card className="p-6 overflow-hidden">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                    <Workflow className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      PRD Workflow Traceability
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Visual progression mapping user personas and core needs into functional requirements and target outcomes.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-zinc-400 self-start sm:self-auto">
                  Live PRD Data Mapping
                </span>
              </div>

              {/* Horizontal Scrollable Stage Pipeline */}
              <div className="overflow-x-auto pb-2 -mx-2 px-2">
                <div className="min-w-[780px] grid grid-cols-5 gap-3 items-stretch">
                  {/* Step 1: WHO (Target Users) */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3.5 flex flex-col justify-between dark:border-blue-900/50 dark:bg-blue-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                          1. Target Users
                        </span>
                        <span className="text-[10px] font-mono text-blue-600/70 dark:text-blue-400/70">WHO</span>
                      </div>
                      <div className="space-y-1.5">
                        {prd.targetUsers.primary.slice(0, 2).map((user, idx) => (
                          <div
                            key={idx}
                            className="rounded border border-blue-200/70 bg-white p-2 text-xs font-medium text-zinc-800 dark:border-blue-900/40 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs leading-snug"
                          >
                            {user}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center text-blue-400">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Step 2: WHY (User Needs) */}
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-3.5 flex flex-col justify-between dark:border-indigo-900/50 dark:bg-indigo-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          2. User Needs
                        </span>
                        <span className="text-[10px] font-mono text-indigo-600/70 dark:text-indigo-400/70">WHY</span>
                      </div>
                      <div className="space-y-1.5">
                        {prd.userNeeds.slice(0, 2).map((need, idx) => (
                          <div
                            key={idx}
                            className="rounded border border-indigo-200/70 bg-white p-2 text-xs text-zinc-800 dark:border-indigo-900/40 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs leading-snug"
                          >
                            {need}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center text-indigo-400">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Step 3: WHAT USER WANTS (User Stories) */}
                  <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-3.5 flex flex-col justify-between dark:border-purple-900/50 dark:bg-purple-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                          3. User Stories
                        </span>
                        <span className="text-[10px] font-mono text-purple-600/70 dark:text-purple-400/70">DESIRE</span>
                      </div>
                      <div className="space-y-1.5">
                        {prd.userStories.slice(0, 2).map((story, idx) => (
                          <div
                            key={idx}
                            className="rounded border border-purple-200/70 bg-white p-2 text-xs text-zinc-800 dark:border-purple-900/40 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs space-y-1"
                          >
                            <div className="font-semibold text-purple-900 dark:text-purple-300 text-[11px]">
                              {story.id}: {story.title}
                            </div>
                            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-tight">
                              {story.iWant}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center text-purple-400">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Step 4: WHAT PRODUCT DOES (Functional Requirements) */}
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5 flex flex-col justify-between dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                          4. Requirements
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600/70 dark:text-emerald-400/70">SYSTEM</span>
                      </div>
                      <div className="space-y-1.5">
                        {prd.functionalRequirements.slice(0, 2).map((fr, idx) => (
                          <div
                            key={idx}
                            className="rounded border border-emerald-200/70 bg-white p-2 text-xs text-zinc-800 dark:border-emerald-900/40 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-emerald-900 dark:text-emerald-300 text-[11px]">
                                {fr.id}
                              </span>
                              <span className="text-[9px] uppercase font-bold text-emerald-600">
                                {fr.priority}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-tight">
                              {fr.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center text-emerald-400">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Step 5: OUTCOME (Goals & Metrics) */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3.5 flex flex-col justify-between dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          5. Outcomes
                        </span>
                        <span className="text-[10px] font-mono text-amber-600/70 dark:text-amber-400/70">SUCCESS</span>
                      </div>
                      <div className="space-y-1.5">
                        {prd.successMetrics.slice(0, 1).map((m, idx) => (
                          <div
                            key={idx}
                            className="rounded border border-amber-200/70 bg-white p-2 text-xs text-zinc-800 dark:border-amber-900/40 dark:bg-zinc-900 dark:text-zinc-200 shadow-2xs space-y-1"
                          >
                            <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                              {m.metric}
                            </div>
                            <div className="font-bold text-amber-800 dark:text-amber-300 text-xs">
                              {m.target}
                            </div>
                          </div>
                        ))}
                        {prd.goals.slice(0, 1).map((goal, idx) => (
                          <div
                            key={`g-${idx}`}
                            className="rounded border border-amber-200/70 bg-white p-2 text-[11px] text-zinc-700 dark:border-amber-900/40 dark:bg-zinc-900 dark:text-zinc-300 shadow-2xs line-clamp-2 leading-tight"
                          >
                            🎯 {goal}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-center text-amber-600 font-semibold text-[11px]">
                      Validated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 1: OVERVIEW                                       */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-4">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  1. Executive Overview
                </h4>
              </div>
              <span className="text-xs font-mono font-medium text-zinc-500">
                {prd.overview.productName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Product Summary
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed rounded-lg bg-zinc-50/70 border border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800 p-3.5">
                  {prd.overview.summary}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Problem Statement
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed rounded-lg bg-zinc-50/70 border border-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800 p-3.5">
                  {prd.overview.problemStatement}
                </p>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Proposed Solution
                </span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed rounded-lg bg-purple-50/50 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/40 p-3.5">
                  {prd.overview.proposedSolution}
                </p>
              </div>
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 2: GOALS & NON-GOALS                              */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goals */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <Target className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  2.1 Product Goals
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {prd.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Non-Goals */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <MinusCircle className="size-4 text-zinc-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  2.2 Non-Goals (Scope Boundaries)
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {prd.nonGoals.map((nonGoal, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-400">
                    <span className="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0 mt-2" />
                    <span>{nonGoal}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* ========================================================= */}
          {/* SECTION 3: TARGET USERS & USER NEEDS                      */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Users className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                3. Target Audience & Core User Needs
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Primary */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-purple-500" />
                  Primary Users
                </span>
                <div className="space-y-1.5">
                  {prd.targetUsers.primary.map((user, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border border-zinc-200/80 bg-zinc-50/70 p-2.5 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200"
                    >
                      {user}
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-zinc-400" />
                  Secondary Users
                </span>
                <div className="space-y-1.5">
                  {prd.targetUsers.secondary.length > 0 ? (
                    prd.targetUsers.secondary.map((user, idx) => (
                      <div
                        key={idx}
                        className="rounded-md border border-zinc-200/80 bg-zinc-50/70 p-2.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300"
                      >
                        {user}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-zinc-400 italic p-2">None specified</div>
                  )}
                </div>
              </div>

              {/* Needs */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Zap className="size-3 text-amber-500" />
                  Key User Needs
                </span>
                <div className="space-y-1.5">
                  {prd.userNeeds.map((need, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border border-amber-200/60 bg-amber-50/30 p-2.5 text-xs text-zinc-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-zinc-200"
                    >
                      {need}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 4: USER STORIES                                   */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  4. Agile User Stories
                </h4>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {prd.userStories.length} Stories Formulated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prd.userStories.map((story) => (
                <div
                  key={story.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-900/50">
                      {story.id}
                    </span>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {story.title}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300 pl-2 border-l-2 border-purple-200 dark:border-purple-800">
                    <p>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">As a:</strong> {story.asA}
                    </p>
                    <p>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">I want:</strong> {story.iWant}
                    </p>
                    <p>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">So that:</strong> {story.soThat}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 5: FUNCTIONAL REQUIREMENTS                       */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  5. Functional Requirements
                </h4>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {prd.functionalRequirements.length} Concrete Specs
              </span>
            </div>

            <div className="space-y-3">
              {prd.functionalRequirements.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 space-y-2 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50">
                        {req.id}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {req.title}
                      </h5>
                    </div>
                    {getPriorityBadge(req.priority)}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-1">
                    {req.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 6: NON-FUNCTIONAL REQUIREMENTS                   */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Gauge className="size-4 text-sky-600 dark:text-sky-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                6. Non-Functional Requirements
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {prd.nonFunctionalRequirements.map((nfr) => (
                <div
                  key={nfr.id}
                  className="rounded-lg border border-zinc-200 bg-white p-3.5 space-y-1.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-900/50">
                      {nfr.id}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                      {nfr.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {nfr.requirement}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 7: CONSTRAINTS & ASSUMPTIONS                      */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Constraints */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <HelpCircle className="size-4 text-zinc-500" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  7.1 Constraints
                </h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {prd.constraints.map((constraint, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="text-zinc-400 font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Assumptions */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <HelpCircle className="size-4 text-purple-500" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  7.2 Critical Assumptions
                </h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                {prd.assumptions.map((assumption, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="text-purple-400 font-mono text-[11px] mt-0.5">{idx + 1}.</span>
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* ========================================================= */}
          {/* SECTION 8: SUCCESS METRICS                                */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Target className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                8. Quantifiable Success Metrics
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prd.successMetrics.map((sm, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs"
                >
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {sm.metric}
                  </div>
                  <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      Target
                    </span>
                    <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      {sm.target}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    <strong className="text-zinc-700 dark:text-zinc-300">Measurement: </strong>
                    {sm.measurement}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* ========================================================= */}
          {/* SECTION 9: RISKS & MITIGATIONS                            */}
          {/* ========================================================= */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                9. Strategic Risks & Mitigations
              </h4>
            </div>

            <div className="space-y-3">
              {prd.risks.map((risk, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 space-y-2 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <h5 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {risk.title}
                  </h5>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                    {risk.description}
                  </p>
                  <div className="rounded border border-emerald-200/80 bg-emerald-50/40 p-2.5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                    <strong className="font-semibold">Mitigation Strategy: </strong>
                    {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 px-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>Generated on {new Date(prd.generatedAt).toLocaleString()}</span>
            </div>
            <span>Model: Gemini 3.8 Flash • Phase 3 Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
