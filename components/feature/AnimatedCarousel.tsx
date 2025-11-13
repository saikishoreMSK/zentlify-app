// components/feature/AnimatedCarousel.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

interface CarouselProps {
  title: string;
  items: ReactNode[];
  viewAllLink?: string; // Optional link for "View All" button
}

const AnimatedCarousel: React.FC<CarouselProps> = ({ title, items, viewAllLink }) => {
  return (
    <section className="py-6">
      <div className="flex justify-between items-baseline px-4 sm:px-6 mb-3">
        <h2 className="text-xl font-bold text-brand-primary">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm font-medium text-brand-accent hover:underline">
            View All
          </Link>
        )}
      </div>

      {/* Main scrolling container: Mobile-first horizontal scroll */}
      <div className="flex space-x-4 overflow-x-scroll snap-x snap-mandatory px-4 sm:px-6 pb-4 scrollbar-hide">
        {items.map((item, index) => (
          // Fixed width and snap behavior for smooth touch scrolling
          <div key={index} className="flex-shrink-0 w-[80vw] sm:w-[250px] snap-start">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimatedCarousel;