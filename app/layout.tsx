import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Product Planner',
  description: 'Transform raw software and product ideas into structured development plans and specs for AI coding tools.',
  openGraph: {
    title: 'AI Product Planner',
    description: 'Transform raw software and product ideas into structured development plans and specs for AI coding tools.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Product Planner',
    description: 'Transform raw software and product ideas into structured development plans and specs for AI coding tools.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
