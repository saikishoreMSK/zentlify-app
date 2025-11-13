// app/api/products/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCacheData, setCacheData } from '@/cache/productCache';
import { fetchProductsBySearch, fetchProductsByCategory } from '@/services/rapidApi';
import { MinimalProduct } from '@/types/product';
const CACHE_TTL_SECONDS = 60 * 60 * 3; // 3 hours for general search results

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category_id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    let products: MinimalProduct[] = [];
    let cacheKey: string;
    let apiCall: Promise<MinimalProduct[]>;

    // 1. Determine Cache Key and API Call
    if (query) {
        cacheKey = `search:${query}:page:${page}`;
        apiCall = fetchProductsBySearch(query, page);
        console.log(`Handling Search: ${query}`);
    } else if (categoryId) {
        cacheKey = `category:${categoryId}:page:${page}`;
        apiCall = fetchProductsByCategory(categoryId, page);
        console.log(`Handling Category: ${categoryId}`);
    } else {
        return NextResponse.json({ message: 'Missing query or category_id' }, { status: 400 });
    }

    // 2. CHECK CACHE
    const cachedProducts = await getCacheData<MinimalProduct[]>(cacheKey);
    if (cachedProducts) {
        return NextResponse.json(cachedProducts, { status: 200 });
    }

    // 3. CACHE MISS: EXECUTE API CALL
    products = await apiCall;

    // 4. CACHE WRITE & RETURN
    if (products.length > 0) {
        await setCacheData(cacheKey, products, CACHE_TTL_SECONDS);
        return NextResponse.json(products, { status: 200 });
    }

    return NextResponse.json([], { status: 200 }); // Return empty array on no results/failure
}