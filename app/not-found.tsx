import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <AppShell>
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="size-12 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 flex items-center justify-center mx-auto">
          <AlertCircle className="size-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Page Not Found</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          The page or stage you requested does not exist or has been moved.
        </p>
        <div>
          <Link href="/dashboard">
            <Button size="sm">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
