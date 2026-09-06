export type ProjectStatus = 'draft' | 'in_planning' | 'ready_for_dev' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  idea: string;
  targetUsers?: string;
  tags?: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  idea: string;
  targetUsers?: string;
  tags?: string[];
  status?: ProjectStatus;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  idea?: string;
  targetUsers?: string;
  tags?: string[];
  status?: ProjectStatus;
}

export interface PlannerStage {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  phase: 'Phase 1 (Current)' | 'Phase 2 (Planned)';
  isImplemented: boolean;
}

export const PLANNER_STAGES: PlannerStage[] = [
  {
    id: 'idea',
    number: 1,
    title: 'Project Overview & Idea Definition',
    shortDesc: 'Core problem statement, value proposition, and user personas.',
    phase: 'Phase 1 (Current)',
    isImplemented: true,
  },
  {
    id: 'analysis',
    number: 2,
    title: 'Project Analysis & Scope',
    shortDesc: 'Feasibility analysis, technical constraints, and risk factors.',
    phase: 'Phase 2 (Planned)',
    isImplemented: false,
  },
  {
    id: 'prd',
    number: 3,
    title: 'Product Requirements Document (PRD)',
    shortDesc: 'Comprehensive functional requirements, user journeys, and acceptance criteria.',
    phase: 'Phase 2 (Planned)',
    isImplemented: false,
  },
  {
    id: 'features',
    number: 4,
    title: 'Feature Specifications',
    shortDesc: 'Detailed UI/UX breakdown and edge-case definitions per feature.',
    phase: 'Phase 2 (Planned)',
    isImplemented: false,
  },
  {
    id: 'tech-spec',
    number: 5,
    title: 'Technical Specification',
    shortDesc: 'Architecture diagram, database schema, and API route definitions.',
    phase: 'Phase 2 (Planned)',
    isImplemented: false,
  },
  {
    id: 'tasks',
    number: 6,
    title: 'Development Tasks & Milestones',
    shortDesc: 'Step-by-step modular tasks formatted for sprint planning or AI agents.',
    phase: 'Phase 2 (Planned)',
    isImplemented: false,
  },
  {
    id: 'prompts',
    number: 7,
    title: 'AI Coding Prompts Generator',
    shortDesc: 'Copy-pasteable context-packed prompts for Cursor, Claude Code, and Copilot.',
    phase: 'Phase 2 (Planned)',
    isImplemented: false,
  },
];
