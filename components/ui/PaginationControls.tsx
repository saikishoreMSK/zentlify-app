// components/ui/PaginationControls.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  baseUrl: string; // The base URL (e.g., /search?q=phone or /category/tech)
}

const PaginationControls: React.FC<PaginationProps> = ({ currentPage, baseUrl }) => {
  const isFirstPage = currentPage <= 1;
  const nextPageRoute = `${baseUrl}&page=${currentPage + 1}`;
  const prevPageRoute = `${baseUrl}&page=${currentPage - 1}`;
  
  return (
    <div className="flex justify-center items-center space-x-4 p-4 mt-6">
      <Link
        href={prevPageRoute}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          isFirstPage 
            ? 'bg-gray-100 text-gray-400 pointer-events-none' 
            : 'bg-brand-accent text-white hover:bg-brand-primary'
        }`}
      >
        Previous
      </Link>
      
      <span className="text-lg font-bold text-brand-primary">
        Page {currentPage}
      </span>
      
      <Link
        // NOTE: We assume there's always a 'next' page for simplicity in MVP. 
        // In reality, this needs a total product count check.
        href={nextPageRoute}
        className="bg-brand-accent text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-primary transition"
      >
        Next
      </Link>
    </div>
  );
};

export default PaginationControls;