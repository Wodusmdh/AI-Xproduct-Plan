'use client';

import * as React from 'react';
import { Project, ProjectAnalysis, AnalysisSeverity, FeasibilityLevel, FeaturePriority } from '@/types/project';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  Users,
  Target,
  ShieldAlert,
  Gauge,
  Lightbulb,
  HelpCircle,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface ProjectAnalysisPanelProps {
  project: Project;
  onAnalysisUpdated: (updatedAnalysis: ProjectAnalysis) => void;
}

export function ProjectAnalysisPanel({ project, onAnalysisUpdated }: ProjectAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const analysis = project.analysis;

  const handleAnalyze = async () => {
    if (isAnalyzing) return; // Prevent duplicate requests

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          idea: project.idea,
          targetUsers: project.targetUsers,
          tags: project.tags,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Analysis failed with HTTP status ${response.status}`);
      }

      if (!data.analysis) {
        throw new Error('Server returned an empty analysis payload.');
      }

      // Successful analysis: notify parent to save and update state
      onAnalysisUpdated(data.analysis as ProjectAnalysis);
      setErrorMessage(null);
    } catch (err: unknown) {
      console.error('Failed to run project analysis:', err);
      const userMsg =
        err instanceof Error
          ? err.message
          : 'Failed to generate project analysis. Please check your internet connection and API key.';
      setErrorMessage(userMsg);
      // NOTE: We do NOT wipe out existing analysis on failure.
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const text = `# ${project.name} - AI Project Analysis
Generated: ${new Date(analysis.generatedAt).toLocaleString()}

## Problem Summary
${analysis.problem.summary}
Context: ${analysis.problem.context}

## Value Proposition
${analysis.valueProposition}

## Target Users
- Primary: ${analysis.targetUsers.primary.join(', ')}
- Secondary: ${analysis.targetUsers.secondary.join(', ')}
- Key Needs: ${analysis.targetUsers.needs.join(', ')}

## Feasibility
- Technical: ${analysis.feasibility.technical.level.toUpperCase()} - ${analysis.feasibility.technical.reasoning}
- Product: ${analysis.feasibility.product.level.toUpperCase()} - ${analysis.feasibility.product.reasoning}
- Complexity: ${analysis.feasibility.complexity.level.toUpperCase()} - ${analysis.feasibility.complexity.reasoning}

## In-Scope (MVP)
${analysis.scope.inScope.map((s) => `- ${s}`).join('\n')}

## Out-of-Scope
${analysis.scope.outOfScope.map((s) => `- ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getSeverityBadgeClass = (severity: AnalysisSeverity) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60';
      case 'low':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60';
    }
  };

  const getFeasibilityBadgeClass = (level: FeasibilityLevel) => {
    switch (level) {
      case 'high':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/60';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/60';
      case 'low':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/60';
    }
  };

  const getPriorityBadgeClass = (priority: FeaturePriority) => {
    switch (priority) {
      case 'high':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900/60';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/60';
      case 'low':
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Trigger Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-purple-600 dark:text-purple-400 uppercase">
                Stage 02 • Phase 2 Active
              </span>
              {analysis && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                  <CheckCircle2 className="size-3" />
                  Analyzed
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              AI Project Analysis
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Deconstruct this project idea into an objective, structured product assessment: problem framing,
              feasibility analysis, risk mitigations, scope boundaries, and prioritized features.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {analysis && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                leftIcon={copiedSection === 'all' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              >
                {copiedSection === 'all' ? 'Copied' : 'Copy Analysis'}
              </Button>
            )}

            <Button
              size="sm"
              isLoading={isAnalyzing}
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              leftIcon={
                analysis ? (
                  <RefreshCw className={`size-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                ) : (
                  <Sparkles className="size-3.5" />
                )
              }
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              {isAnalyzing
                ? 'Analyzing with Gemini...'
                : analysis
                ? 'Re-analyze Project'
                : 'Analyze Project'}
            </Button>
          </div>
        </div>

        {/* Informative loading state while generating */}
        {isAnalyzing && (
          <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="size-4 shrink-0 rounded-full border-2 border-purple-600 border-t-transparent animate-spin dark:border-purple-400" />
                <div className="text-xs sm:text-sm text-purple-900 dark:text-purple-300">
                  <span className="font-semibold">Gemini 3.8 is analyzing project architecture...</span>
                  <p className="text-xs text-purple-700/80 dark:text-purple-300/70 mt-0.5">
                    Evaluating user personas, computing feasibility scores, stress-testing risk mitigations, and organizing MVP boundaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div>
                  <span className="font-semibold">Analysis Failed:</span> {errorMessage}
                  {analysis && (
                    <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">
                      Your previous analysis has been preserved intact.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 text-xs font-semibold px-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Empty State: Prompt user to run first analysis */}
      {!analysis && !isAnalyzing && (
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="size-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Sparkles className="size-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No Analysis Generated Yet
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Run the AI analysis to validate this concept. Gemini will assess technical complexity,
              define explicit in/out scope boundaries, surface key risks with mitigations, and recommend initial features.
            </p>
          </div>

          <div className="pt-2">
            <Button
              size="sm"
              onClick={handleAnalyze}
              leftIcon={<Sparkles className="size-4" />}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Run AI Project Analysis
            </Button>
          </div>

          {/* Blueprint features preview grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-left max-w-2xl mx-auto">
            <div className="rounded-lg border border-zinc-100 p-3 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                <Target className="size-3.5 text-purple-600" />
                <span>Target Personas</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Identifies primary users, adjacent stakeholders, and critical emotional/functional needs.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-100 p-3 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                <Gauge className="size-3.5 text-purple-600" />
                <span>Feasibility Matrix</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Scores technical feasibility, product market risk, and implementation complexity.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-100 p-3 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                <ShieldAlert className="size-3.5 text-purple-600" />
                <span>Risk Mitigations</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                Maps out adoption hurdles, technical bottlenecks, and actionable mitigation plans.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Populated Structured Analysis Output */}
      {analysis && (
        <div className="space-y-6">
          {/* Section 1 & 3: Problem Statement & Value Proposition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problem Card (2 cols) */}
            <Card className="p-5 lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Target className="size-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  1. Core Problem Breakdown
                </h4>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-zinc-400 block mb-1">
                  Problem Summary
                </span>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {analysis.problem.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase text-zinc-400 block mb-1.5">
                    Affected User Segments
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.problem.users.map((u, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase text-zinc-400 block mb-1.5">
                    Environmental Context
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {analysis.problem.context}
                  </p>
                </div>
              </div>
            </Card>

            {/* Value Proposition Card (1 col) */}
            <Card className="p-5 space-y-3 bg-gradient-to-br from-purple-50/40 via-white to-white dark:from-purple-950/20 dark:via-zinc-900 dark:to-zinc-900 border-purple-200/70 dark:border-purple-900/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-purple-100 dark:border-purple-900/40">
                  <Lightbulb className="size-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                    3. Value Proposition
                  </h4>
                </div>
                <div className="mt-3">
                  <p className="text-xs sm:text-sm font-medium text-purple-950 dark:text-purple-200 leading-relaxed italic">
                    &ldquo;{analysis.valueProposition}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-100/80 dark:border-purple-900/40 text-[11px] text-purple-700/80 dark:text-purple-300/80">
                Core differentiator and competitive hook.
              </div>
            </Card>
          </div>

          {/* Section 2: Target Users Breakdown */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Users className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                2. Target Users & Stakeholders
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                  Primary Personas
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {analysis.targetUsers.primary.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="size-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                  Secondary Stakeholders
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {analysis.targetUsers.secondary.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="size-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Top User Needs
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                  {analysis.targetUsers.needs.map((n, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 6: Feasibility Assessment (3 dimensions) */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Gauge className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                6. Feasibility & Complexity Assessment
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Technical */}
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 bg-white dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Technical Feasibility
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase border ${getFeasibilityBadgeClass(
                      analysis.feasibility.technical.level
                    )}`}
                  >
                    {analysis.feasibility.technical.level}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {analysis.feasibility.technical.reasoning}
                </p>
              </div>

              {/* Product */}
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 bg-white dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Product Feasibility
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase border ${getFeasibilityBadgeClass(
                      analysis.feasibility.product.level
                    )}`}
                  >
                    {analysis.feasibility.product.level}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {analysis.feasibility.product.reasoning}
                </p>
              </div>

              {/* Complexity */}
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 bg-white dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Implementation Complexity
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase border ${getSeverityBadgeClass(
                      analysis.feasibility.complexity.level
                    )}`}
                  >
                    {analysis.feasibility.complexity.level}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {analysis.feasibility.complexity.reasoning}
                </p>
              </div>
            </div>
          </Card>

          {/* Section 5: Risk Matrix with Mitigations */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <ShieldAlert className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                5. Risk Matrix & Mitigations
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {analysis.risks.map((risk, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 bg-zinc-50/40 dark:bg-zinc-900/30 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {risk.title}
                    </h5>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase shrink-0 border ${getSeverityBadgeClass(
                        risk.severity
                      )}`}
                    >
                      {risk.severity} risk
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {risk.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-start gap-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="size-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="leading-tight">
                      <strong>Mitigation:</strong> {risk.mitigation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 7: Scope Boundaries (In-Scope vs Out-of-Scope) */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Layers className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                7. Project Scope Boundaries
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* In Scope */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/15 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>In-Scope (MVP Target)</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {analysis.scope.inScope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Out of Scope */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  <MinusCircle className="size-3.5 text-zinc-400" />
                  <span>Out-of-Scope (Explicitly Deferred)</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  {analysis.scope.outOfScope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 4 & 8: Assumptions & Ambiguities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assumptions */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Lightbulb className="size-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  4. Working Assumptions
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {analysis.assumptions.map((assump, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold shrink-0">
                      A{i + 1}.
                    </span>
                    <span className="leading-relaxed">{assump}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Ambiguities & Open Questions */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <HelpCircle className="size-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  8. Ambiguities & Open Questions
                </h4>
              </div>
              {analysis.ambiguities && analysis.ambiguities.length > 0 ? (
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {analysis.ambiguities.map((amb, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-bold shrink-0">
                        ?
                      </span>
                      <span className="leading-relaxed">{amb}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  No major ambiguities identified. Project concept is well-specified.
                </p>
              )}
            </Card>
          </div>

          {/* Section 9: Potential Recommended Features */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                9. Potential Features & Prioritization
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {analysis.potentialFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3.5 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        {feat.name}
                      </h5>
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase shrink-0 border ${getPriorityBadgeClass(
                          feat.priority
                        )}`}
                      >
                        {feat.priority}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-400">Why: </span>
                    {feat.reason}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Generation Metadata Footer */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>Analysis generated {new Date(analysis.generatedAt).toLocaleString()}</span>
            </div>
            <span className="font-mono text-[11px]">Powered by Google Gemini 3.8</span>
          </div>
        </div>
      )}
    </div>
  );
}
