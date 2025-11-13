// components/ui/CategoryFilterButton.tsx
import Link from 'next/link';

interface CategoryFilterButtonProps {
  name: string;
}

const CategoryFilterButton: React.FC<CategoryFilterButtonProps> = ({ name }) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link 
      href={`/category/${slug}`} 
      // Mobile-friendly size, simple aesthetic
      className="text-center p-3 border border-gray-200 rounded-lg text-sm font-medium 
                 hover:bg-brand-accent hover:text-white transition duration-200 
                 active:scale-[0.98] shadow-sm"
    >
      {name}
    </Link>
  );
};

export default CategoryFilterButton;