'use client';

import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';

const STORAGE_KEY = 'ai_product_planner_projects_v1';
const EVENT_NAME = 'ai_product_planner_projects_updated';

// Default starter templates so new users can explore immediately
const INITIAL_SAMPLE_PROJECTS: Project[] = [
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
  return typeof window !== 'undefined';
}

function notifySubscribers() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
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
        // Initialize with default sample projects
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_PROJECTS));
        return INITIAL_SAMPLE_PROJECTS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
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
    const newProject: Project = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
      name: input.name.trim(),
      description: input.description.trim(),
      idea: input.idea.trim(),
      targetUsers: input.targetUsers?.trim() || undefined,
      tags: input.tags || [],
      status: input.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newProject, ...list];
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notifySubscribers();
    }
    return newProject;
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const list = await this.getAll();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedProject: Project = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedProject;
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      notifySubscribers();
    }
    return updatedProject;
  },

  async delete(id: string): Promise<boolean> {
    const list = await this.getAll();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;

    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      notifySubscribers();
    }
    return true;
  },

  async clearAll(): Promise<void> {
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      notifySubscribers();
    }
  },

  async resetToSamples(): Promise<void> {
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_PROJECTS));
      notifySubscribers();
    }
  },

  subscribe(callback: () => void): () => void {
    if (!isBrowser()) return () => {};
    window.addEventListener(EVENT_NAME, callback);
    return () => {
      window.removeEventListener(EVENT_NAME, callback);
    };
  },
};
