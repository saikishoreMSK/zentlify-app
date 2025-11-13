// components/feature/StickyCategoryBar.tsx
import CategoryFilterButton from '@/components/ui/CategoryFilterButton';
import Link from 'next/link';

interface StickyCategoryBarProps {
    currentSlug?: string;
}

const CATEGORIES = [
    { name: 'All Products', slug: 'all' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Kitchen & Home', slug: 'home-kitchen' },
    { name: 'Fitness', slug: 'fitness' },
    { name: 'Books', slug: 'books' },
];

const StickyCategoryBar: React.FC<StickyCategoryBarProps> = ({ currentSlug }) => {
    return (
        <nav 
            className="sticky top-[60px] z-30 bg-white border-b border-gray-200 
                       overflow-x-scroll whitespace-nowrap scrollbar-hide p-3 shadow-sm"
        >
            <div className="flex space-x-3 max-w-6xl mx-auto">
                {CATEGORIES.map(cat => (
                    <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className={`inline-block px-4 py-2 text-sm rounded-full font-medium transition duration-200 
                            ${
                                currentSlug === cat.slug
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`
                        }
                    >
                        {cat.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

// NOTE: We need to redefine CategoryFilterButton to handle the active state logic for the Link class.
// For simplicity here, we'll embed the link logic directly in the StickyCategoryBar.

export default StickyCategoryBar;