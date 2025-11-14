// app/api/products/[category]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCacheData, setCacheData } from '@/cache/productCache';
import { fetchProductsByCategory } from '@/services/rapidApi';
import { MinimalProduct } from '@/types/product';

// Cache category results for 1 hour
const CACHE_TTL_SECONDS = 60 * 60; 

// A simple map to translate our friendly category names to the actual IDs the API expects.
// You can find more IDs from the API's /product-category-list endpoint.
const CATEGORY_ID_MAP: { [key: string]: string } = {
    'bestsellers': 'bestsellers', // 'bestsellers' is a special case for the /best-sellers endpoint
    'trending': '281407', // Example: 'Cell Phones & Accessories'
    'technology': '172282', // Example: 'Electronics'
};

export async function GET(
    request: NextRequest, 
    context: { params: Promise<{ category: string }> }
) {
    const { category } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const cacheKey = `products:${category}:page:${page}`;

    // 1. CHECK CACHE
    const cachedProducts = await getCacheData<MinimalProduct[]>(cacheKey);
    if (cachedProducts) {
        console.log(`[Proxy] Serving category ${category} from Redis.`);
        return NextResponse.json(cachedProducts, { status: 200 });
    }

    // 2. CACHE MISS: FETCH FROM EXTERNAL API
    const apiCategoryId = CATEGORY_ID_MAP[category];

    if (!apiCategoryId) {
        return new NextResponse(`Invalid category: '${category}'`, { status: 400 });
    }

    // Use the mapped ID to fetch from the external API
    const products = await fetchProductsByCategory(apiCategoryId, page); 

    // 3. CACHE WRITE & RETURN
    if (products && products.length > 0) {
        await setCacheData(cacheKey, products, CACHE_TTL_SECONDS);
        return NextResponse.json(products, { status: 200 });
    }

    // 4. API FAILURE/NOT FOUND
    return new NextResponse(`Products for category '${category}' not found`, { status: 404 });
}