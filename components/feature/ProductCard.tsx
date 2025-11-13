// components/feature/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { MinimalProduct } from '@/types/product'; 

interface ProductCardProps {
  product: MinimalProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    // Card container optimized for grid/carousel, full width on small screens
    <Link href={`/product/${product.id}`} className="block w-full group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 bg-white">
      {/* Image with Aspect Ratio Box and Next/Image optimization */}
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          priority={true} // Priority loading for visible cards
        />
      </div>
      
      {/* Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-brand-primary truncate">
          {product.title}
        </h3>
        <div className="mt-1 flex justify-between items-center">
          <span className="text-lg font-bold text-brand-accent">
            {product.price}
          </span>
          {/* Simple Rating Placeholder */}
          <span className="text-xs text-gray-500">
            {product.rating} ★
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;