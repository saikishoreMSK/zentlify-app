// services/rapidApi.ts
import { MinimalProduct, DetailedProduct } from '@/types/product';
// We use native fetch, not axios, for Next.js Server Component/Route Handler consistency

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = process.env.RAPID_API_HOST;
const BASE_URL = `https://${RAPID_API_HOST}`;

const API_HEADERS = {
    'X-RapidAPI-Key': RAPID_API_KEY || '',
    'X-RapidAPI-Host': RAPID_API_HOST || '',
};

// --- UTILITY MAPPERS ---

// Maps the common Amazon Product object to our clean MinimalProduct interface
const mapToMinimalProduct = (apiProduct: any): MinimalProduct => ({
    id: apiProduct.asin,
    title: apiProduct.product_title || apiProduct.title || 'Product Title Missing',
    price: apiProduct.product_price || apiProduct.current_price?.raw || 'N/A',
    imageUrl: apiProduct.product_photo || apiProduct.image || '',
    affiliateUrl: apiProduct.product_url,
    rating: apiProduct.product_star_rating || '0',
    numRatings: apiProduct.product_num_ratings || 0,
});

// --- CORE FETCH FUNCTIONS ---

/**
 * 1. Fetches products for the Home Page Carousels or Category Page Grid.
 */
export async function fetchProductsByCategory(categoryId: string, page: number = 1): Promise<MinimalProduct[]> {
    let url: string;

    // The 'bestsellers' category uses a different endpoint and parameter structure.
    if (categoryId === 'bestsellers') {
        // The API docs state this endpoint uses a 'type' parameter.
        // It also requires a category. We'll default to 'all' for a general list.
        url = `${BASE_URL}/best-sellers?category=all&type=BEST_SELLERS&page=${page}&country=US`;
    } else {
        // All other categories use the standard endpoint.
        url = `${BASE_URL}/products-by-category?category_id=${categoryId}&page=${page}&country=US`;
    }

    try {
        const response = await fetch(url, { headers: API_HEADERS, cache: 'no-store' });
        const data = await response.json();

        // The API has different response structures.
        // For /best-sellers, the list is in `data.data.best_sellers`.
        // For other category calls, it's in `data.data.products`.
        const rawProducts = 
            data.data?.best_sellers || // Check for bestsellers list first
            data.data?.products ||     // Fallback to the standard products list
            [];                        // Default to an empty array if neither exists
        return rawProducts.map(mapToMinimalProduct);

    } catch (error) {
        console.error(`API Error: fetchProductsByCategory(${categoryId})`, error);
        return [];
    }
}

/**
 * 2. Fetches products for the Search Results Page.
 */
export async function fetchProductsBySearch(query: string, page: number = 1): Promise<MinimalProduct[]> {
    const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&country=US`;
    
    try {
        const response = await fetch(url, { headers: API_HEADERS, cache: 'no-store' });
        const data = await response.json();

        // This was a bug. The search endpoint response is in `data.data.products`.
        // The logic for `best_sellers` does not belong here.
        const rawProducts = data.data?.products || [];

        return rawProducts.map(mapToMinimalProduct);

    } catch (error) {
        console.error(`API Error: fetchProductsBySearch(${query})`, error);
        return [];
    }
}

/**
 * 3. Fetches detailed data for the Product Detail Page.
 */
export async function fetchProductDetails(asin: string): Promise<DetailedProduct | null> {
    const url = `${BASE_URL}/product-details?asin=${asin}&country=US`;
    
    try {
        const response = await fetch(url, { headers: API_HEADERS, cache: 'no-store' });
        const data = await response.json();
        const rawProduct = data.data;

        if (!rawProduct) return null;

        const minimal = mapToMinimalProduct(rawProduct);
        
        // Map to DetailedProduct structure
        const detailed: DetailedProduct = {
            ...minimal,
            description: rawProduct.product_description || rawProduct.about_product?.join(' ') || '',
            aboutProduct: rawProduct.about_product || [],
            images: rawProduct.product_photos || [],
            productUrl: rawProduct.product_url,
            reviews: rawProduct.top_reviews_global?.slice(0, 3).map((review: any) => ({
                title: review.review_title,
                comment: review.review_comment,
                rating: review.review_star_rating,
                date: review.review_date,
            })) || [],
        };
        
        return detailed;

    } catch (error) {
        console.error(`API Error: fetchProductDetails(${asin})`, error);
        return null;
    }
}