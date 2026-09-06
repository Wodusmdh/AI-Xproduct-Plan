'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Sparkles, Calendar, Layers, CheckCircle2 } from 'lucide-react';

export interface FutureFeatureModalProps {
  featureName: string;
  isOpen: boolean;
  onClose: () => void;
  description?: string;
  plannedMilestones?: string[];
}

export function FutureFeatureModal({
  featureName,
  isOpen,
  onClose,
  description,
  plannedMilestones = [
    'Structured AI context schema generation',
    'Contextual prompting for Cursor, Claude Code, and Copilot',
    'Export to Markdown, JSON, and Jira-compatible issue formats',
    'Iterative AI refinement loops',
  ],
}: FutureFeatureModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={featureName}
      description="Scheduled for Phase 2 Implementation"
      maxWidth="md"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Got it
        </Button>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="rounded-lg border border-purple-200 bg-purple-50/70 p-3.5 dark:border-purple-900/60 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-medium">
            <Sparkles className="size-4" />
            <span>Under Active Development</span>
          </div>
          <p className="mt-1 text-xs text-purple-700/90 dark:text-purple-300/80 leading-relaxed">
            {description ||
              `The ${featureName} engine is scheduled for Phase 2. As per architectural guidelines, we do not provide mock or fake AI generation—real AI intelligence pipelines will be connected in the next phase.`}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
            <Layers className="size-3.5" />
            <span>Planned Capabilities for this Module</span>
          </h4>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
            {plannedMilestones.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-zinc-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Calendar className="size-3.5" />
          <span>Current Phase: Phase 1 (Foundation & Project Setup)</span>
        </div>
      </div>
    </Modal>
  );
}
