// components/ui/ProductCardSkeleton.tsx
import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    // Skeleton structure matching ProductCard dimensions
    <div className="w-full h-full overflow-hidden rounded-lg shadow-md bg-white animate-pulse">
      {/* Placeholder for Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-200">
      </div>
      
      {/* Placeholder for Details */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div> {/* Title line */}
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-300 rounded w-1/3"></div> {/* Price line */}
          <div className="h-3 bg-gray-200 rounded w-1/5"></div> {/* Rating line */}
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;