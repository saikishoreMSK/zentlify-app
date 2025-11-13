// components/feature/MobileNav.tsx
'use client'; 
// Using client component for potential interaction (e.g., search focus)

import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
const MobileNav: React.FC = () => {
  return (
    // Fixed position and high z-index to stay above content
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 p-3 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-6xl">
        {/* Zentlify Logo - Always redirect to Home */}
        <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-primary">
          Zentlify
        </Link>

        {/* Prominent Search Bar (leads to /search) */}
        <Link 
          href="/search" 
          className="flex-1 ml-4 p-2.5 rounded-full bg-gray-100 text-gray-500 max-w-sm flex items-center shadow-inner"
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">Search the best products...</span>
        </Link>
      </div>
    </header>
  );
};

export default MobileNav;