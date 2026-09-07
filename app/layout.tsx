import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Product Planner',
  description: 'Transform raw software and product ideas into structured project analyses, engineering PRDs, and development specifications.',
  openGraph: {
    title: 'AI Product Planner',
    description: 'Transform raw software and product ideas into structured project analyses, engineering PRDs, and development specifications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Product Planner',
    description: 'Transform raw software and product ideas into structured project analyses, engineering PRDs, and development specifications.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
