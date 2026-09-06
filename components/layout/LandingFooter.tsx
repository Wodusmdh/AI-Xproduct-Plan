import * as React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2 font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
              <div className="size-6 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                P
              </div>
              <span>AI Product Planner</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Transforming software and product concepts into structured, deterministic specifications optimized for AI coding agents.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-2.5">
              <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">Product</h5>
              <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>
                  <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/projects/new" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    New Project
                  </Link>
                </li>
                <li>
                  <a href="#workflow" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                    Workflow Stages
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">Roadmap</h5>
              <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                <li className="flex items-center gap-1.5">
                  <span>Phase 1: Foundation</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Live</span>
                </li>
                <li className="flex items-center gap-1.5 text-zinc-400">
                  <span>Phase 2: AI Generation</span>
                  <span className="text-[10px] text-purple-600 font-medium">Planned</span>
                </li>
                <li className="flex items-center gap-1.5 text-zinc-400">
                  <span>Phase 3: Integrations</span>
                  <span className="text-[10px] text-zinc-400 font-medium">Upcoming</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">Environment</h5>
              <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>Client-side Storage</li>
                <li>Next.js 15 App Router</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} AI Product Planner. Open architectural foundation.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Phase 1 Stable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
