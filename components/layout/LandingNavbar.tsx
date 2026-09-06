'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Menu, X, LayoutDashboard } from 'lucide-react';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
          <div className="size-7 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-xs">
            P
          </div>
          <span className="font-semibold text-base">AI Product Planner</span>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
            Phase 1
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#concept" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Concept
          </a>
          <a href="#workflow" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Workflow Pipeline
          </a>
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Architecture
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" leftIcon={<LayoutDashboard className="size-3.5" />}>
              Dashboard
            </Button>
          </Link>
          <Link href="/projects/new">
            <Button size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
              Start Planning
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
          <a
            href="#concept"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Concept
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Workflow Pipeline
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Features
          </a>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full" size="sm">
                Open Dashboard
              </Button>
            </Link>
            <Link href="/projects/new" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full" size="sm">
                Start New Project
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
