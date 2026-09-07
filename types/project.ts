export type ProjectStatus = 'draft' | 'in_planning' | 'ready_for_dev' | 'archived';

export type AnalysisSeverity = 'low' | 'medium' | 'high';
export type FeasibilityLevel = 'low' | 'medium' | 'high';
export type FeaturePriority = 'low' | 'medium' | 'high';

export interface ProjectAnalysis {
  problem: {
    summary: string;
    users: string[];
    context: string;
  };

  targetUsers: {
    primary: string[];
    secondary: string[];
    needs: string[];
  };

  valueProposition: string;

  assumptions: string[];

  risks: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];

  feasibility: {
    technical: {
      level: 'low' | 'medium' | 'high';
      reasoning: string;
    };
    product: {
      level: 'low' | 'medium' | 'high';
      reasoning: string;
    };
    complexity: {
      level: 'low' | 'medium' | 'high';
      reasoning: string;
    };
  };

  scope: {
    inScope: string[];
    outOfScope: string[];
  };

  ambiguities: string[];

  potentialFeatures: {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    reason: string;
  }[];

  generatedAt: string;
}

export interface PRDTraceabilityLink {
  userStoryId: string;
  functionalRequirementIds: string[];
  goalIndexes: number[];
  successMetricIndexes: number[];
  userNeedIndexes?: number[];
}

export interface PRDTraceability {
  links: PRDTraceabilityLink[];
}

export type PRDSyncStatus = 'CURRENT' | 'STALE' | 'LEGACY' | 'NO_ANALYSIS';

export function getPRDSyncStatus(prd?: ProjectPRD, analysis?: ProjectAnalysis): PRDSyncStatus {
  if (!prd) return 'NO_ANALYSIS';
  if (!analysis) return 'NO_ANALYSIS';
  if (!prd.sourceAnalysisGeneratedAt) return 'LEGACY';
  if (prd.sourceAnalysisGeneratedAt === analysis.generatedAt) return 'CURRENT';
  return 'STALE';
}

export interface ProjectPRD {
  overview: {
    productName: string;
    summary: string;
    problemStatement: string;
    proposedSolution: string;
  };

  goals: string[];

  nonGoals: string[];

  targetUsers: {
    primary: string[];
    secondary: string[];
  };

  userNeeds: string[];

  userStories: {
    id: string;
    title: string;
    asA: string;
    iWant: string;
    soThat: string;
  }[];

  functionalRequirements: {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[];

  nonFunctionalRequirements: {
    id: string;
    category: string;
    requirement: string;
  }[];

  constraints: string[];

  assumptions: string[];

  successMetrics: {
    metric: string;
    target: string;
    measurement: string;
  }[];

  risks: {
    title: string;
    description: string;
    mitigation: string;
  }[];

  traceability?: PRDTraceability;

  /**
   * Exact ISO timestamp of the source ProjectAnalysis from which this PRD was generated.
   * If missing, PRD is treated as LEGACY / UNKNOWN.
   */
  sourceAnalysisGeneratedAt?: string;

  generatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  idea: string;
  targetUsers?: string;
  tags?: string[];
  status: ProjectStatus;
  analysis?: ProjectAnalysis;
  prd?: ProjectPRD;
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
  analysis?: ProjectAnalysis;
  prd?: ProjectPRD;
}

export interface PlannerStage {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  phase: string;
  isImplemented: boolean;
}

export const PLANNER_STAGES: PlannerStage[] = [
  {
    id: 'idea',
    number: 1,
    title: 'Project Overview & Idea Definition',
    shortDesc: 'Core problem statement, value proposition, and user personas.',
    phase: 'Phase 1 (Active)',
    isImplemented: true,
  },
  {
    id: 'analysis',
    number: 2,
    title: 'AI Project Analysis',
    shortDesc: 'Structured problem analysis, feasibility, risks, and initial scope.',
    phase: 'Phase 2 (Active)',
    isImplemented: true,
  },
  {
    id: 'prd',
    number: 3,
    title: 'Product Requirements Document (PRD)',
    shortDesc: 'Comprehensive functional requirements, user journeys, and acceptance criteria.',
    phase: 'Phase 3 (Active)',
    isImplemented: true,
  },
  {
    id: 'features',
    number: 4,
    title: 'Feature Specifications',
    shortDesc: 'Detailed UI/UX breakdown and edge-case definitions per feature.',
    phase: 'Phase 4 (Planned)',
    isImplemented: false,
  },
  {
    id: 'tech-spec',
    number: 5,
    title: 'Technical Specification',
    shortDesc: 'Architecture diagram, database schema, and API route definitions.',
    phase: 'Phase 3 (Planned)',
    isImplemented: false,
  },
  {
    id: 'tasks',
    number: 6,
    title: 'Development Tasks & Milestones',
    shortDesc: 'Step-by-step modular tasks formatted for sprint planning or AI agents.',
    phase: 'Phase 3 (Planned)',
    isImplemented: false,
  },
  {
    id: 'prompts',
    number: 7,
    title: 'AI Coding Prompts Generator',
    shortDesc: 'Copy-pasteable context-packed prompts for Cursor, Claude Code, and Copilot.',
    phase: 'Phase 3 (Planned)',
    isImplemented: false,
  },
];
