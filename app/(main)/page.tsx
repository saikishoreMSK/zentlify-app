// app/page.tsx (Updated with URL Fix)
import MobileNav from '@/components/feature/MobileNav';
import AnimatedCarousel from '@/components/feature/AnimatedCarousel';
import ProductCard from '@/components/feature/ProductCard';
import CategoryFilterButton from '@/components/ui/CategoryFilterButton';
import { MinimalProduct } from '@/types/product';
import Footer from '@/components/ui/Footer';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import { Suspense, use } from 'react';

// Utility function to get the base URL dynamically
// This is required for server components to make internal fetch requests.
function getAbsoluteUrl(path: string): string {
  // Use VERCEL_URL in production, or localhost:3000 in development
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
    
  return `${baseUrl}${path}`;
}


// Function to fetch data from our internal, cached API Proxy
async function getProducts(category: string): Promise<MinimalProduct[]> {
    // ⬇️ FIX: Using the absolute URL utility instead of the relative path 
    const url = getAbsoluteUrl(`/api/products/${category}`);

    const res = await fetch(url, {
        // Force server component to re-fetch occasionally (SSG/ISR concept)
        next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
        // Log the error more verbosely for debugging
        console.error(`Failed to fetch products for category: ${category}. Status: ${res.status}`);
        return [];
    }
    return res.json();
}

function ProductCarouselWrapper({ category, title, viewAllLink }: { category: string, title: string, viewAllLink: string }) {
    const products = use(getProducts(category)); // Use `use` hook in RSC
    const renderItems = products.map((p, i) => <ProductCard key={p.id} product={p} />);
    
    return (
        <AnimatedCarousel
            title={title}
            items={renderItems}
            viewAllLink={viewAllLink}
        />
    );
}

const CarouselSkeleton = () => (
    <AnimatedCarousel
        title="Loading..."
        items={Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
    />
);

export default async function HomePage() {
    // Concurrent data fetching for performance
    const [bestSellers, trending, techGadgets] = await Promise.all([
        getProducts('bestsellers'), // Map to Section 1
        getProducts('trending'),    // Map to Section 3
        getProducts('technology'),  // Map to Section 4
    ]);

    // Helper to map product array to carousel items
    const renderCarouselItems = (products: MinimalProduct[]) => 
        products.map((p, i) => <ProductCard key={p.id} product={p} />);

    // --- UI Structure (Same as Stage 2, but now with live data) ---
    return (
        <>
            <MobileNav />
            <main className="min-h-screen pt-4 pb-12">
                
                {/* Section 1: Best Products */}
                <Suspense fallback={<CarouselSkeleton />}>
                    <ProductCarouselWrapper 
                        category="bestsellers" 
                        title="🔥 Best Sellers Right Now" 
                        viewAllLink="/category/bestsellers" 
                    />
                </Suspense>
                <hr className="my-6 border-gray-100" />
                
                {/* ... Section 2: Categories (Static) ... */}

                {/* Section 3: Trending Products */}
                <Suspense fallback={<CarouselSkeleton />}>
                    <ProductCarouselWrapper 
                        category="trending" 
                        title="📈 Trending Must-Haves" 
                        viewAllLink="/category/trending" 
                    />
                </Suspense>
                
                {/* ... rest of the page ... */}
            </main>
            <Footer />
        </>
    );
}

