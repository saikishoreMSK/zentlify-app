import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zentlify - Curated Tech & Lifestyle Finds',
  description: 'Discover the best in technology, lifestyle, and home goods. Zentlify brings you curated lists of top-rated products to simplify your shopping.',
};

/**
 * This is the ROOT layout. It applies to every page in the application.
 * It is responsible for the primary <html> and <body> tags.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (    
    <html lang="en">
      <body className="bg-brand-background font-sans text-brand-primary">
        {children}
      </body>
    </html>
  );
}
