'use client';

import { Project, ProjectStatus, ProjectAnalysis, ProjectPRD, CreateProjectInput, UpdateProjectInput } from '@/types/project';
import { validateProjectAnalysis } from '@/lib/analysis-validator';
import { validateProjectPRD } from '@/lib/prd-validator';

const STORAGE_KEY = 'ai_product_planner_projects_v1';
const EVENT_NAME = 'ai_product_planner_projects_updated';

// Default starter templates so users can explore when explicitly requested
export const INITIAL_SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sample-1',
    name: 'DevSync AI',
    description: 'Automated developer daily standup analyzer and blocker resolution assistant.',
    idea: 'Engineers spend too much time in synchronous standup meetings. DevSync AI connects to Git commits, pull requests, and Jira tickets to automatically formulate morning briefing notes and flag dependency blockers before they stall sprints.',
    targetUsers: 'Remote software engineering teams, Engineering Managers, Tech Leads',
    tags: ['Developer Tool', 'AI Agent', 'Productivity'],
    status: 'in_planning',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'sample-2',
    name: 'PulseFlow API',
    description: 'Lightweight latency & uptime monitor with automated anomaly alerts.',
    idea: 'A developer-first monitoring utility providing sub-second webhook notifications when API endpoints degrade or fail health checks.',
    targetUsers: 'Backend Engineers, DevOps Practitioners, Indie Hackers',
    tags: ['DevOps', 'Monitoring', 'Infrastructure'],
    status: 'draft',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function notifySubscribers() {
  if (isBrowser()) {
    try {
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (err) {
      console.error('Failed to notify storage subscribers:', err);
    }
  }
}

const VALID_STATUSES: ProjectStatus[] = ['draft', 'in_planning', 'ready_for_dev', 'archived'];

function sanitizeProject(item: unknown): Project | null {
  if (!item || typeof item !== 'object') return null;
  const raw = item as Record<string, unknown>;

  if (
    typeof raw.id !== 'string' ||
    typeof raw.name !== 'string' ||
    typeof raw.description !== 'string' ||
    typeof raw.idea !== 'string'
  ) {
    return null;
  }

  const status: ProjectStatus =
    typeof raw.status === 'string' && VALID_STATUSES.includes(raw.status as ProjectStatus)
      ? (raw.status as ProjectStatus)
      : 'draft';

  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === 'string')
    : [];

  const createdAt =
    typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString();
  const updatedAt =
    typeof raw.updatedAt === 'string' ? raw.updatedAt : createdAt;

  let analysis: ProjectAnalysis | undefined = undefined;
  if (raw.analysis) {
    const valResult = validateProjectAnalysis(raw.analysis);
    if (valResult.success) {
      analysis = valResult.data;
    }
  }

  let prd: ProjectPRD | undefined = undefined;
  if (raw.prd) {
    const valPRD = validateProjectPRD(raw.prd);
    if (valPRD.success) {
      prd = valPRD.data;
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    idea: raw.idea,
    targetUsers: typeof raw.targetUsers === 'string' ? raw.targetUsers : undefined,
    tags,
    status,
    analysis,
    prd,
    createdAt,
    updatedAt,
  };
}

/**
 * Storage Layer Abstraction.
 * In Phase 1, persists to LocalStorage with event synchronization.
 * Designed with Promise-based signatures so it can be swapped for a cloud DB in Phase 2.
 */
export const projectStorage = {
  async getAll(): Promise<Project[]> {
    if (!isBrowser()) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Starts empty for a brand-new user; no automatic sample injection
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      const validProjects: Project[] = [];
      for (const item of parsed) {
        const sanitized = sanitizeProject(item);
        if (sanitized) {
          validProjects.push(sanitized);
        }
      }
      return validProjects;
    } catch (err) {
      console.error('Failed to read projects from storage:', err);
      return [];
    }
  },

  async getById(id: string): Promise<Project | null> {
    const list = await this.getAll();
    return list.find((p) => p.id === id) || null;
  },

  async create(input: CreateProjectInput): Promise<Project> {
    const list = await this.getAll();
    const now = new Date().toISOString();
    const uniqueId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `proj_${crypto.randomUUID()}`
        : `proj_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;

    const newProject: Project = {
      id: uniqueId,
      name: input.name.trim(),
      description: input.description.trim(),
      idea: input.idea.trim(),
      targetUsers: input.targetUsers?.trim() || undefined,
      tags: input.tags ? input.tags.map((t) => t.trim()).filter(Boolean) : [],
      status: input.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newProject, ...list];
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to save new project to storage:', err);
      }
    }
    return newProject;
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const list = await this.getAll();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = list[index];

    let newAnalysis = existing.analysis;
    if (input.analysis !== undefined) {
      const val = validateProjectAnalysis(input.analysis);
      if (val.success) {
        newAnalysis = val.data;
      }
    }

    let newPRD = existing.prd;
    if (input.prd !== undefined) {
      const valPRD = validateProjectPRD(input.prd);
      if (valPRD.success) {
        newPRD = valPRD.data;
      }
    }

    const updatedProject: Project = {
      ...existing,
      name: input.name !== undefined ? input.name.trim() : existing.name,
      description: input.description !== undefined ? input.description.trim() : existing.description,
      idea: input.idea !== undefined ? input.idea.trim() : existing.idea,
      targetUsers: input.targetUsers !== undefined ? input.targetUsers.trim() || undefined : existing.targetUsers,
      tags: input.tags !== undefined ? input.tags.map((t) => t.trim()).filter(Boolean) : existing.tags,
      status: input.status !== undefined ? input.status : existing.status,
      analysis: newAnalysis,
      prd: newPRD,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedProject;
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to update project in storage:', err);
      }
    }
    return updatedProject;
  },

  async saveAnalysis(id: string, analysis: ProjectAnalysis): Promise<Project | null> {
    const valResult = validateProjectAnalysis(analysis);
    if (!valResult.success) {
      console.error('Invalid analysis data rejected by storage:', valResult.error);
      return null;
    }

    const list = await this.getAll();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedProject: Project = {
      ...existing,
      analysis: valResult.data,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedProject;
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to save project analysis to storage:', err);
      }
    }
    return updatedProject;
  },

  async savePRD(id: string, prd: ProjectPRD): Promise<Project | null> {
    const valResult = validateProjectPRD(prd);
    if (!valResult.success) {
      console.error('Invalid PRD data rejected by storage:', valResult.error);
      return null;
    }

    const list = await this.getAll();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedProject: Project = {
      ...existing,
      prd: valResult.data,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedProject;
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to save project PRD to storage:', err);
      }
    }
    return updatedProject;
  },

  async delete(id: string): Promise<boolean> {
    const list = await this.getAll();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;

    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to delete project from storage:', err);
      }
    }
    return true;
  },

  async clearAll(): Promise<void> {
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to clear storage:', err);
      }
    }
  },

  /**
   * Loads sample starter projects without creating duplicate entries.
   * If sample projects already exist, they are not re-added.
   */
  async loadSampleProjects(): Promise<Project[]> {
    const list = await this.getAll();
    const existingIds = new Set(list.map((p) => p.id));
    const existingNames = new Set(list.map((p) => p.name.toLowerCase()));

    const toAdd = INITIAL_SAMPLE_PROJECTS.filter(
      (sample) => !existingIds.has(sample.id) && !existingNames.has(sample.name.toLowerCase())
    );

    if (toAdd.length === 0) {
      return list;
    }

    const updated = [...list, ...toAdd];
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to load sample projects into storage:', err);
      }
    }
    return updated;
  },

  /**
   * Resets workspace strictly to the default sample projects.
   */
  async resetToSamples(): Promise<Project[]> {
    if (isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_PROJECTS));
        notifySubscribers();
      } catch (err) {
        console.error('Failed to reset samples in storage:', err);
      }
    }
    return INITIAL_SAMPLE_PROJECTS;
  },

  subscribe(callback: () => void): () => void {
    if (!isBrowser()) return () => {};
    window.addEventListener(EVENT_NAME, callback);
    return () => {
      window.removeEventListener(EVENT_NAME, callback);
    };
  },
};
