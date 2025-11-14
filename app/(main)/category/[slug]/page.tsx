// app/category/[slug]/page.tsx
import MobileNav from '@/components/feature/MobileNav';
import ProductCard from '@/components/feature/ProductCard';
import PaginationControls from '@/components/ui/PaginationControls';
import StickyCategoryBar from '@/components/feature/StickyCategoryBar';
import { MinimalProduct } from '@/types/product';
import { notFound } from 'next/navigation';

// Utility to get the base URL
function getAbsoluteUrl(path: string): string {
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';
    return `${baseUrl}${path}`;
}

async function getProductsForBrowsing(query: string, categoryId: string, page: number): Promise<MinimalProduct[]> {
    // Determine the API call URL based on the provided params
    let params = `page=${page}`;
    let baseUrl = '';

    if (query) {
        params += `&q=${encodeURIComponent(query)}`;
        baseUrl = `/search?q=${query}`;
    } else if (categoryId) {
        // NOTE: In a real app, you would map slug (e.g., 'electronics') to the actual RapidAPI category ID
        params += `&category_id=${categoryId}`; 
        baseUrl = `/category/${categoryId}`;
    } else {
        return [];
    }

    const url = getAbsoluteUrl(`/api/products/search?${params}`);
    
    // Low revalidation time for active browsing pages
    const res = await fetch(url, { next: { revalidate: 3600 } }); 

    if (!res.ok) {
        return [];
    }
    return res.json();
}

export default async function CategorySearchPage({
    params: paramsPromise,
    searchParams: searchParamsPromise,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ q?: string, page?: string }>;
}) {
    const { slug: categorySlug } = await paramsPromise;
    const { q: query = '', page: pageString = '1' } = await searchParamsPromise;
    const currentPage = parseInt(pageString, 10);

    // ... the rest of your component logic continues here


    // Determine the type of view and the data fetching parameters
    const isSearch = !!query;
    const currentParam = isSearch ? query : categorySlug;
    
    // Fetch products
    const products = await getProductsForBrowsing(
        isSearch ? currentParam : '', // query
        isSearch ? '' : currentParam, // categoryId
        currentPage
    );

    const title = isSearch ? `Results for "${query}"` : `${categorySlug.toUpperCase()} Products`;
    const paginationBaseUrl = isSearch ? `/search?q=${query}` : `/category/${categorySlug}?id=${categorySlug}`;

    return (
        <>
            <MobileNav />
            {/* Section 1: Sticky Category/Filter Row */}
            <StickyCategoryBar currentSlug={categorySlug} />
            
            <main className="max-w-6xl mx-auto px-4 pb-12">
                <h1 className="text-2xl font-bold mt-8 mb-6 text-brand-primary">{title}</h1>
                
                {/* Section 2: Product Grid */}
                {products.length === 0 ? (
                    <div className="text-center p-10 text-gray-500">
                        <p className="text-xl">No products found for {currentParam}.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}

                {/* Functionality: Pagination */}
                {products.length > 0 && (
                    <PaginationControls currentPage={currentPage} baseUrl={paginationBaseUrl} />
                )}
            </main>
        </>
    );
}

// NOTE: To support the /search route, you'd create app/search/page.tsx 
// and import/export this same component logic (or use a route group).