// app/api/product/[asin]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCacheData, setCacheData } from '@/cache/productCache';
import { fetchProductDetails } from '@/services/rapidApi';
import { DetailedProduct } from '@/types/product';

// Cache detail pages longer since they change less frequently (e.g., 12 hours)
const CACHE_TTL_SECONDS = 60 * 60 * 12; 

export async function GET(
    request: NextRequest, 
    { params }: { params: { asin: string } }
) {
    const asin = params.asin;
    const cacheKey = `product:detail:${asin}`;

    // 1. CHECK CACHE
    const cachedDetail = await getCacheData<DetailedProduct>(cacheKey);
    if (cachedDetail) {
        console.log(`[Proxy] Serving detail page for ${asin} from Redis.`);
        return NextResponse.json(cachedDetail, { status: 200 });
    }

    // 2. CACHE MISS: FETCH FROM EXTERNAL API
    const product = await fetchProductDetails(asin); 

    // 3. CACHE WRITE & RETURN
    if (product) {
        await setCacheData(cacheKey, product, CACHE_TTL_SECONDS);
        return NextResponse.json(product, { status: 200 });
    }

    // 4. API FAILURE/NOT FOUND
    return new NextResponse('Product not found', { status: 404 });
}