'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Boxes,
  Code2,
  ListTodo,
  Terminal,
  History,
  Settings,
  Menu,
  X,
  Compass,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FutureFeatureModal } from '@/components/projects/FutureFeatureModal';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isImplemented: boolean;
  phase?: string;
  description?: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    isImplemented: true,
  },
  {
    label: 'Create Project',
    href: '/projects/new',
    icon: PlusCircle,
    isImplemented: true,
  },
];

const PLANNER_NAV_ITEMS: NavItem[] = [
  {
    label: 'Project Planner',
    href: '#planner',
    icon: Compass,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Interactive roadmap and product milestone architect.',
  },
  {
    label: 'PRD Generator',
    href: '#prd',
    icon: FileText,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Automated generation of detailed Product Requirement Documents.',
  },
  {
    label: 'Feature Specification',
    href: '#features',
    icon: Boxes,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Detailed user story and UI behavior breakdown for engineers.',
  },
  {
    label: 'Technical Specification',
    href: '#tech-spec',
    icon: Code2,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Architecture diagrams, data schemas, and API route design.',
  },
  {
    label: 'Task Generator',
    href: '#tasks',
    icon: ListTodo,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Actionable developer tasks ready for Jira, Linear, or GitHub Projects.',
  },
  {
    label: 'AI Coding Prompts',
    href: '#prompts',
    icon: Terminal,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Targeted prompts tailored for Cursor, Claude Code, and Copilot.',
  },
];

const SYSTEM_NAV_ITEMS: NavItem[] = [
  {
    label: 'Project History',
    href: '#history',
    icon: History,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Versioned snapshots of all generated specifications and prompts.',
  },
  {
    label: 'Settings',
    href: '#settings',
    icon: Settings,
    isImplemented: false,
    phase: 'Phase 2',
    description: 'Custom AI model preferences and export templates.',
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeFutureFeature, setActiveFutureFeature] = React.useState<{
    name: string;
    description: string;
  } | null>(null);

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (!item.isImplemented) {
      e.preventDefault();
      setActiveFutureFeature({
        name: item.label,
        description: item.description || `The ${item.label} module is scheduled for Phase 2.`,
      });
      setMobileMenuOpen(false);
    }
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <div className="px-3 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.isImplemented && pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(item, e)}
              className={cn(
                'group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100'
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={cn('size-4 shrink-0', isActive ? 'text-current' : 'text-zinc-400')} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.phase && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded border font-normal whitespace-nowrap',
                    isActive
                      ? 'border-zinc-700 text-zinc-300'
                      : 'border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500'
                  )}
                >
                  {item.phase}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 shrink-0 sticky top-0 h-screen">
        {/* Brand */}
        <div className="flex h-14 items-center justify-between px-5 border-b border-zinc-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
            <div className="size-6 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span>AI Product Planner</span>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {renderNavGroup('Workspace', MAIN_NAV_ITEMS)}
          {renderNavGroup('Planning Pipeline', PLANNER_NAV_ITEMS)}
          {renderNavGroup('System', SYSTEM_NAV_ITEMS)}
        </div>

        {/* Footer status / Phase info */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Phase 1 Active</span>
              <span className="inline-block size-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-[11px] text-zinc-500 leading-tight">
              Foundation & Local Persistence. AI generation engine unlocks in Phase 2.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden flex h-14 items-center justify-between px-4 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
          <div className="size-6 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
            P
          </div>
          <span>AI Product Planner</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-white dark:bg-zinc-900 overflow-y-auto p-4 space-y-6">
          {renderNavGroup('Workspace', MAIN_NAV_ITEMS)}
          {renderNavGroup('Planning Pipeline', PLANNER_NAV_ITEMS)}
          {renderNavGroup('System', SYSTEM_NAV_ITEMS)}

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/projects/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-md bg-zinc-900 text-zinc-50 text-sm font-medium dark:bg-zinc-100 dark:text-zinc-900"
            >
              <PlusCircle className="size-4" />
              <span>Create New Project</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex h-14 items-center justify-between px-8 border-b border-zinc-200 bg-white/80 backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">Home</Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
              {pathname.replace('/', '') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/projects/new">
              <Button size="sm" leftIcon={<PlusCircle className="size-3.5" />}>
                New Project
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Future Feature Modal */}
      {activeFutureFeature && (
        <FutureFeatureModal
          isOpen={true}
          featureName={activeFutureFeature.name}
          description={activeFutureFeature.description}
          onClose={() => setActiveFutureFeature(null)}
        />
      )}
    </div>
  );
}
