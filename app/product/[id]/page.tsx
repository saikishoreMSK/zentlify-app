// app/product/[id]/page.tsx
import MobileNav from '@/components/feature/MobileNav';
import AnimatedCarousel from '@/components/feature/AnimatedCarousel';
import { DetailedProduct, MinimalProduct } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/feature/ProductCard';
import AffiliateButton from '@/components/ui/AffiliateButton';

// Utility to get the base URL for internal server-to-server calls
function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
    
  return `${baseUrl}${path}`;
}

async function getProductDetails(asin: string): Promise<DetailedProduct | null> {
    const url = getAbsoluteUrl(`/api/product/${asin}`);
    
    // Force cache miss if the page is requested with a specific revalidate time
    const res = await fetch(url, { next: { revalidate: 43200 } }); // 12 hours revalidation

    if (!res.ok) return null;
    return res.json();
}

// Next.js convention for dynamic routes
export default async function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const { id } = await paramsPromise;
    const product = await getProductDetails(id);

    if (!product) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p>The product you are looking for may have been removed or is unavailable.</p>
            </div>
        );
    }
    
    // Placeholder data for Recommendations (in a real app, this fetches related products)
    const placeholderRecommendations: MinimalProduct[] = Array(5).fill(0).map((_, i) => ({
      id: `rec-${i}`,
      title: `Recommended Item ${i + 1}`,
      price: `$${(49.99 + i).toFixed(2)}`,
      imageUrl: 'https://via.placeholder.com/600x450/f0f0f0?text=Rec+Item',
      rating: '4.8',
      numRatings: 200,
    }));

    return (
        <>
            <MobileNav />
            <main className="max-w-6xl mx-auto pb-16">
                
                {/* Product Header & Action Button (Sticky for Mobile UX) */}
                <div className="sticky top-[60px] z-30 bg-white/95 backdrop-blur-sm shadow-md p-4 mb-4">
                    <h1 className="text-xl font-bold text-brand-primary">{product.title}</h1>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl font-extrabold text-brand-accent">
                            {product.price}
                        </span>
                        {/* CRITICAL AFFILIATE ACTION BUTTON */}
                        <AffiliateButton url={product.productUrl} />
                    </div>
                </div>

                {/* Main Image Carousel (using AnimatedCarousel for images) */}
                <AnimatedCarousel 
                    title="Product Images" 
                    items={product.images.map((imgUrl, i) => (
                        <div key={i} className="relative aspect-[4/3]">
                            <Image 
                                src={imgUrl} 
                                alt={`Product image ${i + 1}`} 
                                fill 
                                sizes="100vw"
                                className="object-cover rounded-lg" 
                                priority={i === 0}
                            />
                        </div>
                    ))}
                />

                {/* Description and Details */}
                <section className="p-4 sm:p-6 mt-4">
                    <h2 className="text-2xl font-bold text-brand-primary mb-3">About This Item</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {product.aboutProduct.map((point, i) => (
                            <li key={i} className="text-base">{point}</li>
                        ))}
                    </ul>
                    <p className="mt-4 text-gray-800 whitespace-pre-line">{product.description}</p>
                </section>
                <hr className="my-8 border-gray-100" />


                {/* Section: Reviews (Minimalist View) */}
                <section className="p-4 sm:p-6">
                    <h2 className="text-2xl font-bold text-brand-primary mb-4">Top Reviews</h2>
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {product.reviews.map((review, i) => (
                                <div key={i} className="border-b pb-4 last:border-b-0">
                                    <p className="font-semibold text-lg">{review.title} ({review.rating} ★)</p>
                                    <p className="text-gray-700 text-sm italic mt-1">"{review.comment.substring(0, 150)}..."</p>
                                    <p className="text-xs text-gray-500 mt-1">Reviewed on: {review.date}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent top reviews available.</p>
                    )}
                </section>
                <hr className="my-8 border-gray-100" />


                {/* Section: Recommendations */}
                <AnimatedCarousel
                    title="You Might Also Like"
                    items={placeholderRecommendations.map((p, i) => <ProductCard key={i} product={p} />)}
                />

            </main>
        </>
    );
}